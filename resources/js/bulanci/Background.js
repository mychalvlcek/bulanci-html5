/**
* Constructs Background objects
* @class Background
* @constructor
* @namespace BULANCI.Game
*/
BULANCI.Background = function() {
        
    this.draw = function(context, images) {
        context.drawImage(images['grass'], 0, 0, 2551, 1417);
        //context.rect(0, 0, _canvas.width, _canvas.height);
        // gradient
        var grd = context.createLinearGradient(0, 0, _canvas.width, _canvas.height);
        grd.addColorStop(0, '#8ED6FF'); // light blue
        grd.addColorStop(1, '#004CB3'); // dark blue
        context.fillStyle = grd;
        context.fill();
    }
}