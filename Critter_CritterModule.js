function Critter(x,y){
    this.name = "Critter#:" + Math.floor(Math.random()*10000);
    this.symbol = "O";
    this.x = x;
    this.y = y;
    this.type = "critter";
    this.alive = true;
    this.health = 150;
    this.directions = {
        0: "north-west",
        1: "north",
        2: "north-east",
        3: "west",
        4: "no-action",
        5: "east",
        6: "south-west",
        7: "south",
        8: "south-east"
    }
}

Critter.prototype.move = function(){
    //The critter needs to be able to move
    var numChoices = (Object.keys(this.directions).length - 1);
    var chosenDirection = this.directions[Math.round(Math.random() * numChoices)];
    return chosenDirection
}

Critter.prototype.eat = function(){
    //We ate a plant so reset the health
    this.health = 150;
}

//We are now exporting the Critter "class"
module.exports = Critter;