//We need to import our modules for critter world
var World = require('./Critter_WorldModule');
var Critter = require('./Critter_CritterModule');
var Plant = require('./Critter_PlantModule');
var Predator = require('./Critter_PredatorModule');

var critterWorld = new World(75, 25);
critterWorld.build();

//We need to now pass the critter, plant, and predator objects to the world to populate
var worldCreation = critterWorld.populate(Critter, Plant, Predator);
printToScreen(worldCreation);


//We now need to introduce a turn structure
for(var i = 0; i < 5; i++){
    var turnResult = critterWorld.turn();
    printToScreen(turnResult);
}

function gameStart(){
    window.setTimeout(function(){
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
    console.log(statsReadout);
    console.log(worldArray.join("\n"));
}