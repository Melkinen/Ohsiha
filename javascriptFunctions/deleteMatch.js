
document.onload(addListener());
function addListener(){
  document.getElementById("Button1").addEventListener("click", function(){
    sendDeleteRequest();
});
}

function sendDeleteRequest(){
  console.log("sending");

  var pathArray = window.location.pathname.split( '/' );
  var ID = pathArray[2];
  console.log(pathArray);

  $.ajax({
    url: '/match/'+ID,
    type: 'DELETE',
    success: function(data) {
      alert(data);
    }
  });
}
