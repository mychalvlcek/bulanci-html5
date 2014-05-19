/**
* Map
* @class Background
* @constructor
* @author Michal Vlcek <mychalvlcek@gmail.com>
*/
BULANCI.Map = function() {
}
        
BULANCI.Map.prototype.draw = function(context, images) {
    // gradient
    var grd = context.createLinearGradient(0, 0, _canvas.width, _canvas.height);
    grd.addColorStop(0, '#8ED6FF'); // light blue
    grd.addColorStop(1, '#004CB3'); // dark blue
    context.fillStyle = grd;
    context.fill();
}