var fs = require('fs');

var readFile = function (fileName){
  return new Promise(function (resolve, reject){
    fs.readFile(fileName, function(error, data){
      if (error) return reject(error);
      resolve(data);
    });
  });
};

var gen = function* (){
  var f1 = yield readFile('./test.txt');
  var f2 = yield readFile('./test1.txt');
  console.log(f1.toString());
  console.log(f2.toString());
};

function run(gen) {
    var g = gen();
    function next(data) {
        var result = g.next(data);
        if (result.done) {
            return result.value;
        }
        result.value.then(function(data) {
            next(data);
        })
    }

    next();
}

run(gen);