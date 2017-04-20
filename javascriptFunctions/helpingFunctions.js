var fs = require("fs");
var helpingFunctions ={

getDateNow : function (){
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0!
  var yyyy = today.getFullYear();
  var hh = today.getHours();
  var min = today.getMinutes();
  if(dd<10) {
      dd='0'+dd
  }
  if(mm<10) {
      mm='0'+mm
  }
  //2017-04-18T21:00:00.000Z
  //"2014-02-10T10:50:42.389Z"
  var returnDay = yyyy+ "-"+mm+"-"+dd+"T"+hh+":"+min+":"+"00.000Z";
  //var returnDay = min+ '-'+ hh + '-' + mm+'-'+dd+'-'+yyyy;
  return returnDay;
},

getCookie: function (name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
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
