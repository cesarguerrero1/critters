//Creating the world module
function World(width, height, critter, plant, predator){
    //How big is this world?
    this.width = width;
    this.height = height;

    //What inhabits this world?
    this.rock = "#";
    //Grabbing the objects so we can use them within the world!
    this.critter = critter;
    this.plant = plant;
    this.predator = predator;

    //The world template contains ONLY the rocks and walls, no "living" items
    this.worldTemplate = [];
    this.currentWorld  = [];

    //The world is keeping an array of all of the objects for each organism type
    this.critters = [];
    this.plants = [];
    this.predators = [];

    //We need to show the user active counts
    this.critterCount = 0;
    this.plantCount = 0;
    this.predatorCount = 0;

    //We should keep track of how long the game has been going on!
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

World.prototype.populate = function(){
    //We need to now introduce all of the "living" organisms to the world
    
    //This is so we get a DEEP copy
    var tempArray = JSON.stringify(this.worldTemplate);
    this.currentWorld = JSON.parse(tempArray);

    //We don't need to make a copy of this array as we want everything changed
    var currentWorld = this.currentWorld;

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
                    var newPlant = new this.plant(j, i);
                    currentRow[j] = newPlant.symbol;
                    this.plants.push(newPlant);
                    this.plantCount++;
                }else if(ranNum >= 990){
                    //Make critters!
                    var newCritter = new this.critter(j, i);
                    currentRow[j] = newCritter.symbol;
                    this.critters.push(newCritter);
                    this.critterCount++;
                }else if(ranNum < 5){
                    //Make new predators
                    var newPredator = new this.predator(j, i);
                    currentRow[j] = newPredator.symbol;
                    this.predators.push(newPredator);
                    this.predatorCount++;
                }
            }
        }
        currentWorld[i] = currentRow;
    }

    var tempCurrentWorld = JSON.stringify(this.currentWorld);

    var statsReadout = `New Critter Simulation created! Your simulation will begin shortly... \n Stats below: \n Critters: ${this.critterCount} \n Plants: ${this.plantCount} \n Predators: ${this.predatorCount}`;
    return [JSON.parse(tempCurrentWorld), statsReadout];
}

World.prototype.turn = function(){
    //We need to simulate movement through each turn
    //1. Plants go first
    //2. Critters go second
    //3. Predators go last

    var newCritters = [];
    var newPlants = [];
    var newPredators = [];

    //DO NOT USE forEach. The complexity of "this" in a forEach is not worth the saved code lines... Just realized I couldve solved this with a getter or setter
    var plants = this.plants;
    for(var i = 0; i < plants.length; i++){
        
        var plant = plants[i];
        //The plant is slowly dying and is absorbing sunlight for growth (photosynthesis)
        plant.sunlightGained += 2;
        plant.health--;

        if(plant.health <= 0){
            //Don't want to remove here because then the entire for loop is thrown off.
            this.plantCount--;
            plant.alive = false;
        }else{
            //If the plant isn't dead then let it reproduce IF possible.
            if(plant.sunlightGained >= 100){
                //Give the plant a chance to grow!
                var validDestination = false;
                var counter = 0;
                while(validDestination == false){
                    var growthDirection = plant.grow();
    
                    //Once we pick a direction, see if it is valid in the world
                    var newLocation = this.validLocation(plant.type, plant.x, plant.y, growthDirection);
                    counter++;

                    //This means we have a valid new movement array so let's complete the action
                    if(newLocation.length != 0){
                        //Change variable driving loop
                        validDestination = true;
                        
                        var decisionOverload = newLocation[3];

                        //If there is a decision overload then do nothing!
                        if(decisionOverload){
                            continue
                        }else{
                            //For plants if there is no action then don't do anything at all otherwise the plant wants to "grow"
                            if(growthDirection != "no-action"){
                                //Make a new plant
                                var newPlant = new this.plant(newLocation[0], newLocation[1]);
                                newPlants.push(newPlant);
                                this.plantCount++;
                            }
                        }

                    }
                }
            }
        }

    }
    
    var critters = this.critters;
    for(var i = 0; i < critters.length; i++){

        var critter = critters[i];
        //The critter is slowly dying, but if it eats a plant, it will have full health
        critter.health --;

        if(critter.health <= 0){
            //Don't want to remove here because then the entire for loop is thrown off.
            this.critterCount--;
            critter.alive = false;
        }else{
            var validDestination = false;
            var counter = 0;
            while(validDestination == false){
                var chosenDirection = critter.move();

                //Once we pick a direction, see if it is valid in the world
                var newLocation = this.validLocation(critter.type, critter.x, critter.y, chosenDirection);
                counter++;

                if(newLocation.length != 0 ){

                    //Change variable driving loop
                    validDestination = true

                    //We now need to know if the critter is eating a plant or not!
                    var isEating = newLocation[2];
                    var decisionOverload = newLocation[3];
                    
                    if(decisionOverload){
                        continue
                    }else{
                        //Update critter X and Y
                        critter.x = newLocation[0];
                        critter.y = newLocation[1];

                        if(isEating){
                            critter.eat();
                            //We need to find the plant that was consumed to remove it from the world
                            var plants = this.plants
                            for(var j = 0; j < plants.length; j++){
                                //Find the plant we are interested in!
                                var plant = plants[j];

                                //If the plant matches the coordinates of the critter, then we found the one that was consumed.
                                if(plant.x == critter.x && plant.y == critter.y){
                                    console.log(`${plant.name} was consumed by ${critter.name}!`)
                                    plant.alive = false;
                                    this.plantCount--;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    var predators = this.predators;
    for(var i = 0; i < predators.length; i++){
        
        var predator = predators[i];
        //The predator is slowly dying, but if it eats a critter, it will have full health
        predator.health--;

        if(predator.health <= 0){
            //Don't want  to  remove here because then the entire for loop is thrown off.
            this.predatorCount--;
            predator.alive = false;
        }else{
            var validDestination = false;
            var counter = 0;
            while(validDestination == false){
                var chosenDirection = predator.move();

                //Once we pick a direction, see if it is valid in the world
                var newLocation = this.validLocation(predator.type, predator.x, predator.y, chosenDirection, counter);
                counter++;

                if(newLocation.length != 0 ){
                    //Change variable driving loop
                    validDestination = true

                    //We now need to know if the predator is eating a critter or not!
                    var isEating = newLocation[2];
                    var decisionOverload = newLocation[3];

                    if(decisionOverload){
                        continue
                    }else{
                        //Update predator X and Y
                        predator.x = newLocation[0];
                        predator.y = newLocation[1];

                        if(isEating){
                            predator.eat();
                            //We need to find the critter that was consumed to remove it from the world
                            var critters = this.critters
                            for(var j = 0; j < critters.length; j++){
                                //Find the critter we are interested in!
                                var critter = critters[j];

                                //If the critter matches the coordinates of the predator, then we found the one that was consumed.
                                if(critter.x == predator.x && critter.y == predator.y){
                                    console.log(`${critter.name} was consumed by ${predator.name}!`)
                                    critter.alive = false;
                                    this.critterCount--;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    //After all the turns have occurred, then we need to redo the map!
    return this.refreshWorld(newCritters, newPlants, newPredators);
}

World.prototype.validLocation = function(type, organismX, organismY, chosenDirection, counter){

    //When any of the organisms are looking for squares the world needs to verify if they can even go there
    const directionVector = {
        "north-west": [-1,-1],
        "north": [0, -1],
        "north-east": [1, -1],
        "west": [-1, 0],
        "no-action": [0, 0],
        "east": [1, 0],
        "south-west": [-1, 1],
        "south": [0, 1],
        "south-east": [1, 1]
    }

    var movementArray = directionVector[chosenDirection];
    var possibleLocationX = organismX + movementArray[0];
    var possibleLocationY = organismY + movementArray[1];

    var location = this.currentWorld[possibleLocationY][possibleLocationX]
 
    if(location == "#"){
        //The organism is trying to move into a wall which is not allowed
        return []
    }else if(location == " " || chosenDirection == "no-action"){
        //This means either nothing is there OR they decided not to move, so complete the action
        var decisionOverload = false;
        var isEating = false;
        return [possibleLocationX, possibleLocationY, isEating, decisionOverload]
    }else{
        //The organism did not run into an empty space or wall and it is choosing to act
        if(type == "critter"){
            if(location == "*"){
                //Eat the plant!
                var decisionOverload = false;
                var isEating = true;
                return [possibleLocationX, possibleLocationY, isEating, decisionOverload]
            }else{
                //The critter ran into something other than a plant which is not allowed but after 5  attempts, force the critter to stand still.
                if(counter <= 5){
                    return []
                }else{
                    var decisionOverload = true;
                    var isEating = false;
                    return [organismX, organismY, isEating, decisionOverload]
                }
            }
        }else if(type == "predator"){
            if(location == "O"){
                //Eat the critter!
                var decisionOverload = false;
                var isEating = true;
                return [possibleLocationX, possibleLocationY, isEating, decisionOverload]
            }else{
                //The predator ran into something other than a critter which is not allowed but after 5 attempts, force the critter to stand still.
                if(counter <= 5){
                    return []
                }else{
                    var decisionOverload = true;
                    var isEating = false;
                    return [organismX, organismY, isEating, decisionOverload]
                }
            }
        }else if(type = "plant"){
                if(counter <= 5){
                    return []
                }else{
                    var decisionOverload = true;
                    var isEating = false;
                    return [organismX, organismY, isEating, decisionOverload]
                }
        }
    }
}

World.prototype.refreshWorld = function(newCritters, newPlants, newPredators){
    //Grab the base template and then repopulate it with all of the organisms by their location
    this.turnCount++;
    
    var tempArray = JSON.stringify(this.worldTemplate);
    this.currentWorld = JSON.parse(tempArray);
    var currentWorld = this.currentWorld;

    //We need to filter out any dead organisms!
    this.critters = this.critters.filter(function(critter){
        return critter.alive
    })

    this.plants = this.plants.filter(function(plant){
        return plant.alive
    })

    this.predators = this.predators.filter(function(predator){
        return predator.alive
    })

    //Add the new critters, plants, and predators
    for(var i = 0; i < newPlants.length; i++){
        this.plants.push(newPlants[i]);
    }
    for(var i = 0; i < newCritters.length; i++){
        this.critters.push(newCritters[i]);
    }
    for(var i = 0; i < newPredators.length; i++){
        this.predators.push(newPredators[i]);
    }

    //For the organisms in the array, print them out!
    this.plants.forEach(function(plant){
        currentWorld[plant.y][plant.x] = plant.symbol
    })

    this.critters.forEach(function(critter){
        currentWorld[critter.y][critter.x] = critter.symbol
    })
    
    this.predators.forEach(function(predator){
        currentWorld[predator.y][predator.x] = predator.symbol
    })

    //Don't send the current world property natively as printing it to the console will change it via a direct reference
    var tempCurrentWorld = JSON.stringify(this.currentWorld);

    var statsReadout = `Critters:${this.critterCount} \n Plants: ${this.plantCount} \n Predators: ${this.predatorCount} \n Turn: ${this.turnCount}`;
    return [JSON.parse(tempCurrentWorld), statsReadout];
}

//We are now exporting the World "class"
module.exports = World;
