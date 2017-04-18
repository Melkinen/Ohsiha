$( document ).ready(dostuff());

function dostuff(){
  var lanes = getLane();

}

lanes = 0;

function getLane(){
  console.log("getting");
  var url = document.URL;
  console.log(url);
  var name = url.substring(27, url.lenght);
  console.log(url.substring(27, url.lenght));
  var lanes = 0;

  $.ajax({

    url: "/api/lane/"+ name,
    success: function(data) {
      var table = document.getElementById("laneTable");

      for (item in data){
        console.log(data[item]);
        var row = table.insertRow(table.lenght);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);
        cell1.innerHTML = data[item].name;
        cell2.innerHTML = data[item].place;
        cell3.id = "numberOfLanes";
        cell3.innerHTML = data[item].numberOfLanes;
        lanes = data[item].numberOfLanes;
        cell4.innerHTML = data[item].topography;
        cell5.innerHTML = data[item].description;
        table2 =  document.getElementById("laneTable2");
        var row2 = table2.insertRow(table.lenght);
        createForm(lanes, data[item].name,data[item].name);

        for (lane in data[item].lanes){
          var taulukko = document.createElement('table');
          var cellX = row2.insertCell(lane);

          var rivi = taulukko.insertRow(taulukko.lenght);
          var rivi2 = taulukko.insertRow(taulukko.lenght);

          var solu1 = rivi.insertCell(0);
          var solu2 = rivi2.insertCell(0);

          solu1.innerHTML = "dist: " + data[item].lanes[lane].distance;
          solu2.innerHTML =  "par: "+ data[item].lanes[lane].par;

          cellX.appendChild(taulukko);
        }


      }
      //createForm(lanes);
    }
  });

};

  function createForm(lanes,url, nameOfTrack){

    console.log("crating form");
    //var f = document.createElement("form")
    var f = document.getElementById('form1')
    //$( ".formPlace" ).append( f );
    f.setAttribute('method',"POST");
    f.setAttribute('action',"/api/lane/"+url);


    for (i = 0; i <lanes; i++){

      var input = document.createElement("input"); //input element, text
      input.setAttribute('type',"number");
      input.setAttribute('name',"lane"+i);
      input.setAttribute('id',"laneInput"+i);
      input.setAttribute("class"," form-control-inline")
      f.appendChild(input);

    }
    var input2 = document.createElement("input"); //input element, text
    input.setAttribute('type',"text");
    input.setAttribute('name',"description");
    input.setAttribute('id',"description");
    input.setAttribute("class"," form-control")
    f.appendChild(input2);

    var s = document.createElement("input"); //input element, Submit button
    s.setAttribute('type',"submit");
    s.setAttribute('value',"Submit");
    f.appendChild(s);


  }
