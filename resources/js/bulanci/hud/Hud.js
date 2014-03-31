/**
* Bulanci-online game
*
* @author Michal Vlcek <vlcekmichal@yahoo.com>
*/
BULANCI.HUD = function() {
    this.elements = {};
    this.scores = [];
};

 BULANCI.HUD.prototype.redraw = function (context) {
    for (var key in this.elements) {
	  this.elements[key].redraw(context);
	}

    //this.draw(context, this.stroke);
}