/**
* Constructs Background object
* @class Background
* @constructor
* @author Michal Vlcek <mychalvlcek@gmail.com>
*/
BULANCI.Background = function() {
}
        
BULANCI.Background.prototype.draw = function(context, images) {
    context.drawImage(images['grass.jpg'], 0, 0, 2551, 1417);
}