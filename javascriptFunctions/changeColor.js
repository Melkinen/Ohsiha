function changeColor(){
  var x = document.getElementById("colorPicker");
  var a = document.getElementById("bigContainer1");
  console.log(x.value);
  a.style.backgroundColor = x.value;
  localStorage.color = x.value
}

function setColor(){

  var a = document.getElementById("bigContainer1");
  a.style.backgroundColor = localStorage.color;

}
