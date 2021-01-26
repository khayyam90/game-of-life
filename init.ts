import { GameOfLife } from "./GameOfLife";
import { Renderer } from "./Renderer";
import { StopStartButton } from "./StopStartButton";

/**
 * When the page is loaded, we plug all the event listeners
 */
window.onload = function(){
    let canvas = document.getElementsByTagName("canvas")[0];

    // what is the available width for the canvas ?
    let width = canvas.parentElement.getBoundingClientRect().width - 20;
    canvas.style.width = width.toString() + "px";
    canvas.setAttribute("width", width.toString());

    let div = document.getElementById("nb");

    let input1 = document.getElementById("alive1");
    let input2 = document.getElementById("alive2");
    let input3 = document.getElementById("alive3");

    let stopStartButton = new StopStartButton("stopStart");

    let renderer = new Renderer(div, canvas, 15, 2);
    let gof = new GameOfLife(renderer, 20, input1, input2, input3);

    stopStartButton.onStart(function(){        
        gof.start();
    }.bind(stopStartButton));

    stopStartButton.onStop(function(){
        gof.stop();
    }.bind(this));

    let recreate = document.getElementById("recreate");
    recreate.addEventListener("click", function(){
        gof.resetRandom();
    }.bind(recreate), false);

    let clear = document.getElementById("clear");
    clear.addEventListener("click", function(){
        gof.clear();
    }.bind(clear), false);
};