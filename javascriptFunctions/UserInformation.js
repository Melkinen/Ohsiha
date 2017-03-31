


document.onload(addListener());
function addListener(){
  document.getElementById("Button1").addEventListener("click", function(){
    sendPutRequest();
});
}

function sendPutRequest(){
  console.log("sending");
  var name = document.getElementById("name").value;
  var hometown = document.getElementById("hometown").value;
  var age = document.getElementById("age").value;
  $.ajax({
    url: '/ownInformation',
    type: 'PUT',
    data:  "name="+name+"&hometown="+hometown+"&age="+age,
    success: function(data) {
      alert(data);
    }
  });
}
