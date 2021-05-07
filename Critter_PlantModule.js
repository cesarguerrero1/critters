function Plant(x,y){
    this.name = "Plant#:" + Math.floor(Math.random()*10000);
    this.symbol = "*";
    this.x = x;
    this.y = y;
    this.alive = true;
    this.sunlightGained = 0;
    this.directions = {
        0: "north-west",
        1: "north",
        2: "north-east",
        3: "west",
        4: "no-growth",
        5: "east",
        6: "south-west",
        7: "south",
        8: "south-east"
    }
}

Plant.prototype.grow = function(){
    //The critter needs to be able to move
}

//We are now exporting the Critter "class"
module.exports = Plant;