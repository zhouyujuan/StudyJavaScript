function MyPromise(excutor) {
    const self = this;
    self.status = 'pending';
    self.value = null;
    self.reason = null;
    self.onFulfilledCallbacks = [];
    self.onRejectedCallbacks = [];

    function resolve(value) {
        if (self.status === 'pending') {
            self.status = 'fulfilled';
            self.value = value;
            self.onFulfilledCallbacks.forEach(callback => callback(self.value));
        }
    }

    function reject(reason) {
        if (self.status === 'pending') {
            self.status = 'rejected';
            self.reason = reason;
            self.onRejectedCallbacks.forEach(callback => callback(self.reason));
        }
    }

    try {
        excutor(resolve, reject);
    } catch (err) {
        reject(err);
    }
}

MyPromise.prototype.then = function(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : function(value) { return value; };
    onRejected = typeof onRejected === 'function' ? onRejected : function(reason) { return new Error(reason); };

    const self = this;
    if (self.status === 'fulfilled') {
        return new MyPromise((resolve, reject) => {
            try {
                const result = onFulfilled(self.value);

                if (result instanceof MyPromise) {
                    result.then(resolve, reject);
                } else {
                    resolve(result);
                }
            } catch (err) {
                reject(err);
            }
        });
    }

    if (self.status === 'rejected') {
        return new MyPromise((resolve, reject) => {
            try {
                const result = onRejected(self.reason);
                
                if (result instanceof MyPromise) {
                    result.then(resolve, reject);
                } else {
                    resolve(result);
                }
            } catch (err) {
                reject(err);
            }
        });
    }

    if (self.status === 'pending') {
        return new MyPromise((resolve, reject) => {
            self.onFulfilledCallbacks.push(value => {
                let result = onFulfilled(value);
                if (result instanceof MyPromise) {
                    result.then(resolve, reject);
                } else {
                    resolve(result);
                }
            });

            self.onRejectedCallbacks.push(reason => {
                let result = onRejected(reason);
                if (result instanceof MyPromise) {
                    result.then(resolve, reject);
                } else {
                    resolve(result);
                }
            });
        });
    }
}

MyPromise.prototype.catch = function(fn) {
    this.then(null, fn);
}

MyPromise.prototype.resolve = function (value) {
    if (value instanceof MyPromise) return value;

    return new MyPromise((resolve, reject) => {
        if (value && value.then && typeof value.then === 'function') {
            value.then(resolve, reject);
        } else {
            resolve(value);
        }
    });
}

MyPromise.prototype.reject = function(reason) {
    return new MyPromise((resolve, reject) => reject(reason));
}

MyPromise.prototype.finally = function(fn) {
    this.then(value => {
        return MyPromise.resolve(fn()).then(() => value);
    }, err => {
        return MyPromise.resolve(fn()).then(() => {
            throw err;
        });
    })
}

MyPromise.race = function(promises) {
    return new MyPromise((resolve, reject) => {
        if (promises.length <= 0) return;

        for (let i = 0; i < promises.length; i++) {
            if (promises[i] instanceof MyPromise) {
                promises[i].then(value => {
                    resolve(value);
                    return;
                }, reason => {
                    reject(reason);
                    return;
                });
            } else {
                resolve(promises[i]);
                return;
            }
        }
    });
}

MyPromise.all = function(promises) {
    return new MyPromise((resolve, reject) => {
        const len = promises.length;
        const result = [];
        if (len === 0) {
            resolve(result);
            return;
        }

        let currentIndex = 0;
        let index = 0;

        function processVlaue(i, value) {
            result[i] = value;
            index++;

            if (index === len) {
                resolve(result);
            } else {
                const promise = promises.shift();
                if (promise != null) {
                    parallel(currentIndex++, promise);
                }
            }
        }

        function parallel(i, promise) {
            if (promise instanceof MyPromise) {
                promise.then(value => {
                    processVlaue(i, value);
                }, reason => {
                    reject(reason);
                    return;
                });
            } else {
                processVlaue(i, promise);
            }
        }

        for (let i = 0; i < 2; i++) {
            parallel(currentIndex++, promises.shift());
        }
    });
}