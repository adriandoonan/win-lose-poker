import Game from "./game";

window.onload = function(){
    setTimeout(function(){
    document.getElementById("fadein").remove();
  },1000);
};

let spinTimer;
let spin = 0;
const element = document.querySelector('#motion-path-example-span')

spinTimer = setInterval(() => {
  if (spin === 360) {
    spin = 0
  }
  element.style.offsetRotate = `${spin}deg`
  spin++
},10
)

setTimeout(() => clearInterval(spinTimer),100000)

