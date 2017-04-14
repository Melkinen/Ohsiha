document.onload(getNews());


function getNews(){
  console.log("getting");

  $.ajax({
    url: 'http://www.mtv.fi/api/feed/rss/uutiset_uusimmat',
    type: 'GET',
    success: function(data) {
      newsList = document.getElementById("newsList");
      console.log(data)
      //jsonObject = xmlToJson(data);
      //console.log(jsonObject)
      var items = data.getElementsByTagName("item");
      console.log(items);
      for (item in items){
        console.log(item);
        if (item == "length"){
          return;
        }

        var entry = document.createElement('li');
        var link = document.createElement('a');

        link.setAttribute('href', items[item].children[1].innerHTML);
        link.appendChild(document.createTextNode(items[item].children[0].innerHTML));
        entry.appendChild(link);
        entry.appendChild(document.createTextNode(items[item].children[7].innerHTML));



        //entry.appendChild(document.createTextNode(items[item].children[0].innerHTML + items[item].children[1].innerHTML) );
        newsList.appendChild(entry);

      }
      var news = items[0].children.getElementsByTagName("item");
      console.log(news);

    }
  });
}
