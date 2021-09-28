var fs = require('fs');

function thunkify(fn) {
    return function() {
        var args = new Array(arguments.length);
        var ctx = this;

        for (var i = 0; i < args.length; ++i) {
            args[i] = arguments[i];
        }

        return function (done) {
            var called;

            args.push(function () {
                if (called) return;
                called = true;
                done.apply(null, arguments);
            });

            console.log('args---', args);

            try {
                fn.apply(ctx, args);
            } catch (err) {
                done(err);
            }
        }
    }
};


var read = thunkify(fs.readFile);
read('test.txt')(function(err, str){
    console.log('str-----', str.toString());
});