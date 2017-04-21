document.onload(getMatches());

function createTableForAllLanes(data){

  var table = document.getElementById("laneTable");
  //var nimilista = document.getElementById("nimilista");



  for (item in data){
    /*
    var option = document.createElement("option");
    option.text = data[item].name;
    option.value = data[item].name;

    nimilista.appendChild(option);
    */
    var row = table.insertRow(table.lenght);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);
    var cell6 = row.insertCell(5);
    var cell7 = row.insertCell(6);

    cell2.innerHTML = data[item].place;
    cell3.innerHTML = data[item].numberOfLanes;
    cell4.innerHTML = data[item].topography;
    cell5.innerHTML = data[item].description;
    var link= document.createElement('a');
    link.href = "/lane/" + data[item].name;
    link.text = data[item].name;

    cell1.appendChild(link);


    var taulukko = document.createElement('table');
    taulukko.id = "vaylaTaulukko"

    for (lane in data[item].lanes){
      var rivi = taulukko.insertRow(taulukko.lenght);
      var solu1 = rivi.insertCell(0);
      var solu2 = rivi.insertCell(1);
      solu1.innerHTML = "dist: " + data[item].lanes[lane].distance;
      solu2.innerHTML =  "par: "+ data[item].lanes[lane].par;

    }
    cell6.appendChild(taulukko);
    cell6.style="display:none";
    cell5.style="display:none";
  }
}

function getMatches(){
  if (localStorage.allLanes != undefined){
    createTableForAllLanes(JSON.parse(localStorage.allLanes));


    return;
  }
  console.log(" no storge data -> need to get");
  $.ajax({
    url: "/api/lane",
    success: function(data) {
        localStorage.allLanes = JSON.stringify(data);

        createTableForAllLanes(data);
    }
  });

}
