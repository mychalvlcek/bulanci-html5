/**
 * Game object base class
 *
 * @class GameObject
 * @constructor
 * @author Vojtěch Tranta <vojta.tranta@gmail.com>
 */

BULANCI.GameObject = function() {

	this.x = 0;
	this.y = 0;

	this.width = 0;
    this.height = 0;

	this.direction = 1;

}

BULANCI.GameObject.prototype.getX = function() {
    return this.x;
}

BULANCI.GameObject.prototype.setX = function(x) {
    this.x = x;
}

BULANCI.GameObject.prototype.getY = function() {
    return this.y;
}

BULANCI.GameObject.prototype.setY = function(y) {
    this.y = y;
}
