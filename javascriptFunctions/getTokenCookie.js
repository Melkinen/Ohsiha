function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}


window.document.onload = function(e){
var token = getCookie("token");
var username = getCookie("username");
var cookies = document.cookie;
console.log(token);
console.log("name :" + username);


var link1 = document.getElementById("informationLink");
var link2 = document.getElementById("matchHistoryLink");
var P = document.getElementById("usernameP");
if (link1 != undefined && link2 != undefined){
    link1.href = "/ownInformation/?user=" +username;
    link2.href = "/matchHistory/?user=" +username;
    P.innerHTML = "olet kirjautunut sisään nimellä: "+ username;

}
}
