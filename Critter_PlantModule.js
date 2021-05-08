function Plant(x,y){
    this.name = "Plant#:" + Math.floor(Math.random()*10000);
    this.symbol = "*";
    this.x = x;
    this.y = y;
    this.type = "plant";
    this.alive = true;
    this.health = 200;
    this.sunlightGained = 0;
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

Plant.prototype.grow = function(){
    var numChoices = (Object.keys(this.directions).length - 1);
    var chosenDirection = this.directions[Math.round(Math.random() * numChoices)];
    return chosenDirection
}

//We are now exporting the Critter "class"
module.exports = Plant;