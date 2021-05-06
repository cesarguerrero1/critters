# This virtual simulation derives inspiration from the exercise in Eloquent Javascript.
# The entire simulation was done in vanilla Javascript utilizing Node JS. 

# Simple Premise:
# 1. Critters, plants, and predators inhabit a world of which the size is predefined. 
# 2. Each turn, the plants can grow if they have lived long enough and their is sufficient space around them. After the plants are allowed a chance to grow, the critters in the game are allowed to either  move  or eat a  plant if it is nearby. If the critters fail to eat, they will die off after 100 turns as each turn they lose 1 hp from their 100hp start. Finally,  the predators are allowed to move. These ONLY eat critters and like critters will die if they don't eat.
# 3. Mimicing real life, the game will continue even after the critters and predators are dead. (May potenntially add reproduction for critters and predators)