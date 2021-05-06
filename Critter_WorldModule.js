//Creating the world module
function World(width, height){
    //How big is this world?
    this.width = width;
    this.height = height;

    this.rock = "#";

    //The world template contains ONLY the rocks and walls, no "living" items
    this.worldTemplate = [];
    this.currentWorld  = [];

    this.critters = [];
    this.plants = [];
    this.predators = [];

    //We need to show the user active counts
    this.critterCount = 0;
    this.plantCount = 0;
    this.predatorCount = 0;

    this.turnCount = 0;
}

World.prototype.build = function(){
    //We need to create the world with rocks scattered around the world
    var width  = this.width;
    var height = this.height;

    var rows = [];

    //This loop is building the perimeter walls of the world and scattering rocks
    for(var i = 0; i < height; i++){
        var rowCells = [];
        //Building north and south wall
        if(i == 0 || i == (height - 1)){
            for(var j = 0; j < width; j++){
                rowCells.push(this.rock);
            }
        }else{
            for(var j = 0; j < width; j++){
                //Building the west and east wall
                if(j == 0 || j == (width - 1)){
                    rowCells.push(this.rock);
                }else{
                    //Populating random rocks
                    var ranNum = Math.floor(Math.random() * 1000);
                    if(ranNum >= 950){
                        rowCells.push(this.rock);
                    }else{
                        rowCells.push(" ");
                    }
                }
            }
        }
        rows.push(rowCells);
    }

    //Send the World Object our current base world
    this.worldTemplate = Array.from(rows);
}

World.prototype.populate = function(critter, plant, predator){
    //We need to now introduce all of the "living" organisms to the world
    
    //This is so we get a DEEP copy
    var tempArray = JSON.stringify(this.worldTemplate);
    this.currentWorld = JSON.parse(tempArray);

    var currentWorld = Array.from(this.currentWorld);

    for(var i = 0; i < currentWorld.length; i++){
        var currentRow = currentWorld[i];
        for(var j = 0; j < currentRow.length; j++){
            if(currentRow[j] == this.rock){
                continue
            }else{
                //We now need to randomize all organism population
                var ranNum = Math.floor(Math.random() * 1000);
                if(ranNum >= 935 && ranNum <= 950){
                    //Make a plant!
                    var newPlant = new plant(j, i);
                    currentRow[j] =  newPlant.symbol;
                    this.plants.push(newPlant);
                    this.plantCount++;
                }else if(ranNum >= 995){
                    //Make critters!
                    var newCritter = new critter(j, i);
                    currentRow[j] = newCritter.symbol;
                    this.critters.push(newCritter);
                    this.critterCount++;
                }else if(ranNum < 4){
                    //Make new predators
                    var newPredator = new predator(j, i);
                    currentRow[j] = newPredator.symbol;
                    this.predators.push(newPredator);
                    this.predatorCount++;
                }
            }
        }
        currentWorld[i] = currentRow;
    }
    this.currentWorld = Array.from(currentWorld);
    console.log(`New Critter Simulation created! Stats below: \n Critters:${this.critterCount} \n Plants:${this.plantCount} \n Predators:${this.predatorCount}`)
    return this.currentWorld;
}

World.prototype.turn = function(){
    //We need to simulate movement through each turn
    //1. Plants go first
    //2. Critters go second
    //3. Predators go last
    var currentWorld = this.currentWorld;

    this.plants.forEach(function(plant){
        //console.log(plant.name);
    })
    
    //We need to ensure that the this variable is point at the right place 
    this.critters.forEach(function(critter){
        var validDestination = false;
        while(validDestination == false){
            var chosenDirection = critter.move();
            //Once we pick a direction, see if it is valid in the world
            var newLocation = this.prototype.validLocation(critter.x, critter.y, chosenDirection, currentWorld);
            if(newLocation.length != 0){
                //Change variable driving loop
                validDestination = true
                //Update critter X and Y
                critter.x = newLocation[0];
                critter.y = newLocation[1];
            }
        }
    }, World)
    
    this.predators.forEach(function(predator){
        //console.log(predator.name);
    })

    //After all the turns have occurred, then we need to redo the map!
    return this.refreshWorld();
}

World.prototype.validLocation = function(organismX, organismY, chosenDirection, currentWorld){
    //Given the weirdness of forEach, I found it easier to just directly pass in the world!
    var currentWorld = currentWorld;
    //When any of the organisms are looking for squares the world needs to verify if they can even go there
    const directionVector = {
        "north-west": [-1,-1],
        "north": [0, -1],
        "north-east": [1, -1],
        "west": [-1, 0],
        "stand-still": [0, 0],
        "east": [1, 0],
        "south-west": [-1, 1],
        "south": [0, 1],
        "south-east": [1, 1]
    }

    var movementArray = directionVector[chosenDirection];
    var possibleLocationX = organismX + movementArray[0];
    var possibleLocationY = organismY + movementArray[1];
    if( currentWorld[possibleLocationY][possibleLocationX] ==  " "){
        //This means something is there so we can't move there!
        return [possibleLocationX, possibleLocationY]
    }else{
        //This means that the space is open so we should pass this location to update the critter location
        return []
    }
    
}

World.prototype.refreshWorld = function(){
    //Grab the base template and then repopulate it with all of the organisms by their location
    this.turnCount++;
    
    var tempArray = JSON.stringify(this.worldTemplate);
    this.currentWorld = JSON.parse(tempArray);

    var currentWorld = Array.from(this.currentWorld);

    this.plants.forEach(function(plant){
        currentWorld[plant.y][plant.x] = plant.symbol
    })

    this.critters.forEach(function(critter){
        currentWorld[critter.y][critter.x] = critter.symbol
    })
    
    this.predators.forEach(function(predator){
        currentWorld[predator.y][predator.x] = predator.symbol
    })

    //Update the current world placeholder.
    this.currentWorld = Array.from(currentWorld);

    //Send data over in a JSON to be
    console.log(`Critters:${this.critterCount} \n Plants:${this.plantCount} \n Predators:${this.predatorCount} \n Turn:${this.turnCount}`)
    return this.currentWorld
}

//We are now exporting the World "class"
module.exports = World;
