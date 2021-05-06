function Predator(x,y){
    this.name = "Predator#:" + Math.floor(Math.random()*10000);
    this.symbol = "<";
    this.x = x;
    this.y = y;
    this.health = 100;
    this.directions = {
        0: "north-west",
        1: "north",
        2: "north-east",
        3: "west",
        4: "stand-still",
        5: "east",
        6: "south-west",
        7: "south",
        8: "south-east"
    }
}

Predator.prototype.move = function(){
    //The critter needs to be able to move
        //The critter needs to be able to move
        var numChoices = (Object.keys(this.directions).length - 1);
        var chosenDirection = this.directions[Math.round(Math.random() * numChoices)];
        return chosenDirection
}

Predator.prototype.eat = function(){
    //Eat a critter!
}

//We are now exporting the Critter "class"
module.exports = Predator;