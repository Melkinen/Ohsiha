var fs = require("fs");
var helpingFunctions ={

getDateNow : function (){
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0!
  var yyyy = today.getFullYear();
  if(dd<10) {
      dd='0'+dd
  }
  if(mm<10) {
      mm='0'+mm
  }
  var returnDay = mm+'-'+dd+'-'+yyyy;
  return returnDay;
},

getOneRandomWord: function(req,res,next){
  fs.readFile("./sanalista.txt", "utf8",function(err,file){
    if (err){
          return console.log(err);
        }
        var lines = file.split("\n");
        console.log(lines.length);
        var word = lines[Math.floor(Math.random() * lines.length) + 1];
        var sentence = "";
        for (i = 0; i< 7 ; i++){
          word = lines[Math.floor(Math.random() * lines.length) + 1];
          sentence = sentence +" "+ word;
        }
        res.send(sentence.toString()+ ".");
      });

    }
};

module.exports = helpingFunctions;
