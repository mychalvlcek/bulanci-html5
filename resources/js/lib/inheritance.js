/**
* Function allowing inheritance
* @author Daniel Steigerwald
**/

var inherits = function(child, parent) {
    var F = function() {};
    F.prototype = parent.prototype;
    child.prototype = new F();
    child._superClass = parent.prototype;
    child.prototype.constructor = child;
};

/*
* Calling
* 
* inherits(Employee, Person);
*
*/
