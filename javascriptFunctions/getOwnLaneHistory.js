document.onload(getMatches());







function getMatches(){
  console.log("getting");

  $.ajax({

    url: "/api/UserslaneHistory/5",
    success: function(data) {
      var table = document.getElementById("historyTable");

      for (item in data){
        console.log(data[item]);
        var row = table.insertRow(table.length);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);
        var cell6 = row.insertCell(5);
        cell1.innerHTML = data[item].nameOfTrack;
        cell2.innerHTML = data[item].description;
        cell3.innerHTML = data[item].created_at;
        cell4.innerHTML = data[item].laneResults;
      }
      doChart(data);
    }
  });

}
