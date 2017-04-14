document.onload(getMatches());

function getMatches(){
  console.log("getting");

  $.ajax({

    url: "/api/match",
    success: function(data) {
      var table = document.getElementById("matchTable");

      for (item in data){
        console.log(data[item]);
        var row = table.insertRow(0);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);
        var cell6 = row.insertCell(5);
        cell1.innerHTML = data[item].name;
        cell2.innerHTML = data[item].player1;
        cell3.innerHTML = data[item].player2;
        cell4.innerHTML = data[item].player1Points;
        cell5.innerHTML = data[item].player2Points;
        cell6.innerHTML = data[item].location;
        if (item == "length"){
          return;
        }
      }
    }
  });

}
