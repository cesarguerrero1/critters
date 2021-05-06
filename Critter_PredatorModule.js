function Predator(x,y){
    this.name = "Predator#:" + Math.floor(Math.random()*10000);
    this.symbol = "<";
    this.x = x;
    this.y = y;
    this.health = 100;
}

Predator.prototype.move = function(){
    //The critter needs to be able to move
}

Predator.prototype.eat = function(){
    //Eat a critter!
}

//We are now exporting the Critter "class"
module.exports = Predator;