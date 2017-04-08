document.onload(getNews());


function getNews(){
  console.log("getting");

  $.ajax({
    url: 'http://www.mtv.fi/api/feed/rss/uutiset_uusimmat',
    type: 'GET',
    success: function(data) {
      console.log(data)
    var  xmlDoc = $.parseXML( data );
    var  xml = $( xmlDoc );
    var channel = xml.find( "channel" );
    console.log(channel);

    }
  });
}
