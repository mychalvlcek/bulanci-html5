/**
* Constructs Background object
* @class Background
* @constructor
* @author Michal Vlcek <vlcekmichal@yahoo.com>
*/
BULANCI.Background = function() {
}
        
BULANCI.Background.prototype.draw = function(context, images) {
    context.drawImage(images['grass'], 0, 0, 2551, 1417);
}