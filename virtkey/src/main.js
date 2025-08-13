import * as kM from './key-manager.js';

let keem= new kM.KeyManager(["a"]);

loop();

function loop(){
requestAnimationFrame(loop);
let h4 = document.querySelector('#titlebox h4');
if (keem.a.currentState == kM.kS.DOWN){
h4.innerHTML ="pressed";
}else {
h4.innerHTML ="not pressed";
}
keem.update();
}
