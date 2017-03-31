function readOneWord(){
    var fs = require("fs");
    fs.readFile("./kotus-sanalista_v1.xml", "utf8",function(err,file){
      if (err){
            return console.log(err);
          }
          var lines = file.split("\n");
          console.log(lines.length);
          var newFile;
          for (line in lines){
            var first = lines[line].search("<s>");
            var second = lines[line].search("</s>");
            var word = lines[line].substring(first+3, second);

            newFile = newFile +word + "\n";
          }
          fs.writeFile("./sanalista.txt", newFile, function(err) {
              if(err) {
                  return console.log(err);
              }
              console.log("The file was saved!");
            });
    });

}
