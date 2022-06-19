// Add active class to the current button (highlight it)
// function layerNames(){
// var header = document.getElementById("btn-DIV");
// var btns = header.getElementsByClassName("layer-btn");
// for (var i = 0; i < btns.length; i++) {
//   btns[i].addEventListener("click", function () {
//     var current = document.getElementsByClassName("active");
//     current[0].className = current[0].className.replace(" active", "");
//     this.className += " active";
//   });
// }
// }

var age = document.getElementById("age-legend");
var concrete = document.getElementById("concrete-legend");
var brick = document.getElementById("brick-legend");
var stone = document.getElementById("stone-legend");
var glass = document.getElementById("glass-legend");
var metal = document.getElementById("metal-legend");
var wood = document.getElementById("wood-legend");
var legend = document.getElementById("legend");

function noneToggle() {
  age.style.display = "none";
  concrete.style.display = "none";
  brick.style.display = "none";
  stone.style.display = "none";
  glass.style.display = "none";
  metal.style.display = "none";
  wood.style.display = "none";
}

function ageToggle(){
  age.style.display = "none";
  var element = document.getElementById("age-legend");
  if (element.style.display === "none") {
    element.style.display = "block";}
  concrete.style.display = "none";
  brick.style.display = "none";
  stone.style.display = "none";
  glass.style.display = "none";
  metal.style.display = "none";
  wood.style.display = "none";
}

function concreteToggle(){
  concrete.style.display = "none";
  var element = document.getElementById("concrete-legend");
  if (element.style.display === "none") {
    element.style.display = "block";}
  age.style.display = "none";
  brick.style.display = "none";
  stone.style.display = "none";
  glass.style.display = "none";
  metal.style.display = "none";
  wood.style.display = "none";
}

function brickToggle(){
  brick.style.display = "none";
  var element = document.getElementById("brick-legend");
  if (element.style.display === "none") {
    element.style.display = "block";}
    age.style.display = "none";
    concrete.style.display = "none";
    stone.style.display = "none";
    glass.style.display = "none";
    metal.style.display = "none";
    wood.style.display = "none";
}

function stoneToggle(){
  stone.style.display = "none";
  var element = document.getElementById("stone-legend");
  if (element.style.display === "none") {
    element.style.display = "block";}
    age.style.display = "none";
    concrete.style.display = "none";
    brick.style.display = "none";
    glass.style.display = "none";
    metal.style.display = "none";
    wood.style.display = "none";
}

function glassToggle(){
  glass.style.display = "none";
  var element = document.getElementById("glass-legend");
  if (element.style.display === "none") {
    element.style.display = "block";}
    age.style.display = "none";
    concrete.style.display = "none";
    brick.style.display = "none";
    stone.style.display = "none";
    metal.style.display = "none";
    wood.style.display = "none";
}

function metalToggle(){
  metal.style.display = "none";
  var element = document.getElementById("metal-legend");
  if (element.style.display === "none") {
    element.style.display = "block";}
    age.style.display = "none";
    concrete.style.display = "none";
    brick.style.display = "none";
    stone.style.display = "none";
    glass.style.display = "none";
    wood.style.display = "none";
}

function woodToggle(){
  wood.style.display = "none";
  var element = document.getElementById("wood-legend");
  if (element.style.display === "none") {
    element.style.display = "block";}
    age.style.display = "none";
    concrete.style.display = "none";
    brick.style.display = "none";
    stone.style.display = "none";
    glass.style.display = "none";
    metal.style.display = "none";
}


function openCity(evt, cityName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(cityName).style.display = "block";
  evt.currentTarget.className += " active";
}

// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click();

