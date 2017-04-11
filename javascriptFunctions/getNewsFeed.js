document.onload(getNews());

// Changes XML to JSON
function xmlToJson(xml) {

	// Create the return object
	var obj = {};

	if (xml.nodeType == 1) { // element
		// do attributes
		if (xml.attributes.length > 0) {
		obj["@attributes"] = {};
			for (var j = 0; j < xml.attributes.length; j++) {
				var attribute = xml.attributes.item(j);
				obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
			}
		}
	} else if (xml.nodeType == 3) { // text
		obj = xml.nodeValue;
	}

	// do children
	if (xml.hasChildNodes()) {
		for(var i = 0; i < xml.childNodes.length; i++) {
			var item = xml.childNodes.item(i);
			var nodeName = item.nodeName;
			if (typeof(obj[nodeName]) == "undefined") {
				obj[nodeName] = xmlToJson(item);
			} else {
				if (typeof(obj[nodeName].push) == "undefined") {
					var old = obj[nodeName];
					obj[nodeName] = [];
					obj[nodeName].push(old);
				}
				obj[nodeName].push(xmlToJson(item));
			}
		}
	}
	return obj;
};

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
