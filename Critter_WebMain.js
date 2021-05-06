//This version is for the browser

//Grabbing DIV callout
var statsContainer = document.getElementById("stats-container");
var gameContainer = document.getElementById("simulation-container");
var startButton = document.getElementsByClassName("start-button");
var stopButton = document.getElementsByClassName("stop-button");
var resetButton = document.getElementsByClassName("reset-button");

//We need to import our modules for critter world
var World = require('./Critter_WorldModule');
var Critter = require('./Critter_CritterModule');
var Plant = require('./Critter_PlantModule');
var Predator = require('./Critter_PredatorModule');

var critterWorld = new World(75, 25);
critterWorld.build();

//Disable the buttons before the game starts!
startButton[0].disabled = true;
stopButton[0].disabled = true;

//We need to now pass the critter, plant, and predator objects to the world to populate
var worldCreation = critterWorld.populate(Critter, Plant, Predator);
printToScreen(worldCreation);

//This starts our autonomous simulation
function gameStart(){
    window.setTimeout(function(){
        stopButton[0].disabled = false;
        game = setInterval(function(){
                        var turnResult = critterWorld.turn();
                        printToScreen(turnResult);
                }, 1000) 
    }, 3000)
}

gameStart();

function printToScreen(array){
    var worldArray = array[0]
    var statsReadout = array[1];
    for(var n = 0; n < worldArray.length; n++){
        worldArray[n] = worldArray[n].join("");
    }
    statsContainer.innerHTML = statsReadout;
    gameContainer.innerHTML = worldArray.join("\n");
}

startButton[0].onclick = function(){
    gameStart();
    alert("The game will resume in 3 seconds.")
    startButton[0].disabled = true;
};

stopButton[0].onclick = function(){
    alert("The simulation has been paused. Please click the Start button to resume the simulation.")
    startButton[0].disabled = false;
    stopButton[0].disabled = true;
    window.clearTimeout(game);
};

resetButton[0].onclick = function(){
    alert("You have clicked the reset button. The entire game will reload to produce a new simulation.");
    location.reload();
}
