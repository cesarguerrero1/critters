function Plant(x,y){
    this.name = "Plant#:" + Math.floor(Math.random()*10000);
    this.symbol = "*";
    this.x = x;
    this.y = y;
    this.sunlightGained = 0;
}

Plant.prototype.grow = function(){
    //The critter needs to be able to move
}

//We are now exporting the Critter "class"
module.exports = Plant;