document.onload(getMatches());


function doPieChart(dataDict){
  Highcharts.chart('container', {
      chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: true,
          type: 'pie'
      },
      title: {
          text: 'Pelaamasi radat'
      },
      tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      plotOptions: {
          pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: {
                  enabled: true,
                  format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                  style: {
                      color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                  }
              }
          }
      },
      series: [{
          name: 'Radat',
          colorByPoint: true,
          data: dataDict
      }]
  });


}

function deleteHistory(selfButton){
  console.log("asd");
  $.ajax({
    url: '/match/'+ID,
    type: 'DELETE',
    success: function(data) {
      alert(data);
    }
  });
}



function getMatches(){
  console.log("getting");

  $.ajax({

    url: "/api/UserslaneHistory/15",
    success: function(data) {
      var table = document.getElementById("historyTable");
      table.innerHTML = "";

      for (item in data){
        console.log(data[item]);
        var row = table.insertRow(table.length);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);
        cell2.innerHTML = data[item].description;
        var time = data[item].created_at.substring(0,16)
        var year = time.substring(0,4);
        var month = time.substring(5,7);
        var day = time.substring(8,10);
        var clock = time.substring(11,16);

        cell3.innerHTML = day + "."+ month +"."+ year + " klo: " +clock;
        cell4.innerHTML = data[item].laneResults;

        var link= document.createElement('a');
        link.href = "/lane/" + data[item].nameOfTrack;
        link.text = data[item].nameOfTrack;

        var btn = document.createElement("BUTTON");
        btn.value=data[item]._id;
        console.log(data[item]._id);
        btn.innerHTML = "poista historia";
        btn.onclick = function() {$.ajax({
          url: '/api/laneHistory/' + this.value,
          type: 'DELETE',
          success: function(data) {

          }
        });
        getMatches();
      }

        cell1.appendChild(link);
        cell5.appendChild(btn);

      }
      dataDict = {};
      var key = "";
      for (item in data){
        key = (data[item].nameOfTrack)
        if (dataDict[key] == undefined ||dataDict[key] < 1 ){
          dataDict[key] = 1;
        }
        else{
          dataDict[key] = dataDict[key] + 1 ;
        }

      }
      console.log(dataDict)
      jsonList = []
      value = "";
      keys = Object.keys(dataDict);
      for (i = 0; i < keys.length; i ++){
        value = dataDict[keys[i]];
        jsonList.push({name: keys[i],y: dataDict[keys[i]]})

      }
      console.log(jsonList)
      doPieChart(jsonList);
    }
  });

}
