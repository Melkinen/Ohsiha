$( document ).ready(dostuff());

function dostuff(){
  var lanes = getLane();
  //doChart(lanes);

}

function doChart(data){
  console.log(data);
  ratamaara = data[0].lanes.length;
  kategoriat = [];
  for (i = 0 ;i <ratamaara; i++){
    kategoriat[i] = "väylä " + (i+1);
  }

  parArray = [];
  for (i = 0 ;i <ratamaara; i++){
    parArray[i] = parseInt(data[0].lanes[i].par);
  }
  nameOfTrack = document.getElementById("nameOfTrack").innerHTML;
  console.log(nameOfTrack)
    $.ajax({


      url: "/api/UserslaneHistory/5/" + nameOfTrack,
      success: function(ownHistoryData) {
        console.log(ownHistoryData);
      results = [];
      jsonSeries = [];
      jsonSeries[0] =  {name: 'Radan ihannesuoritus (PAR)',data: parArray};
      for (item in ownHistoryData){
        results[item] = ownHistoryData[item].laneResults;
        jsonSeries.push ({name: ownHistoryData[item].created_at ,data:ownHistoryData[item].laneResults.map(Number)})
       }
       console.log(jsonSeries);


      Highcharts.chart('container', {

          chart: {
              type: 'column'
          },
          title: {
              text: 'Viimeiset viisi historiaasi väylittäin radalta: '+ nameOfTrack
          },
          subtitle: {
              text: 'jos niitä on niin monta...'
          },
          xAxis: {
              categories: kategoriat,

              crosshair: true
          },
          yAxis: {
              min: 0,
              title: {
                  text: 'Heittojen määrä'
              }
          },
          tooltip: {
              headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
              pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                  '<td style="padding:0"><b>{point.y:.1f} </b></td></tr>',
              footerFormat: '</table>',
              shared: true,
              useHTML: true
          },
          plotOptions: {
              column: {
                  pointPadding: 0.2,
                  borderWidth: 0
              }
          },
          series: jsonSeries

    });

    seriesJSON2 = [];
    resultsSummed = [];
    Xplot = [];
    console.log(results);
    var sum = 0;
    for (i = 0; i< results.length; i++){
      sum =  results[i].map(Number).reduce(function(acc, val){return acc + val});
      console.log(sum);
      resultsSummed.push(sum);
      Xplot.push(ownHistoryData[item].created_at);
    }
    seriesJSON2.push({name:"yhteistulokset", data: resultsSummed});

    console.log(seriesJSON2)
    Highcharts.chart('container2', {

    title: {
        text: 'Yhteistuloksesi radalta: ' + nameOfTrack
    },

    subtitle: {
        text: 'ajalta'
    },

    yAxis: {
        title: {
            text: 'Heittojen määrä kaikilta väylitä yhteensä'
        }
    },
    xAxis: {
        categories: Xplot
    },
    legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle'
    },

    plotOptions: {
       line: {
           dataLabels: {
               enabled: true
           },
           enableMouseTracking: false
       }
   },

    series: seriesJSON2

});
  }
});
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
        cell1.id = "nameOfTrack";
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
      doChart(data);
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


    for (i = 0; i <=lanes; i++){

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
    input.setAttribute("placeholder","Kuvaus suorituksesta ")
    f.appendChild(input2);

    var s = document.createElement("input"); //input element, Submit button
    s.setAttribute('type',"submit");
    s.setAttribute('value',"Lisää uusi historiatieto");

    f.appendChild(s);


  }
