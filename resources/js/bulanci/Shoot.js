/**
* Shoot of player
* @class Shoot
* @constructor
* @author Michal Vlcek <vlcekmichal@yahoo.com>
*/
BULANCI.Shoot = function(x, y) {
    this.x = x;
    this.y = y;
    this.direction;
    this.xDirection = 0;
    this.yDirection = 0;

    this.width = 10;
    this.height = 4;

    this.isActive = true;
    this.updateTimer;

    this.speed = 2;

    //this.bullets = []; // for more sophisticated weapons, Bullet class?

    this.updateTimer = setInterval(this.updateShoot.bind(this), 1000/30);
}

BULANCI.Shoot.prototype.launch = function(pSpeed, pDirection) {
    this.speed = pSpeed;
    this.direction = pDirection;
    switch (this.direction) {
        case 1:
            this.xDirection = -1;
            this.x -= 10;
            this.y += 43;
            break;
        case 3:
            this.xDirection = 1;
            this.x += 55;
            this.y += 22;
            break;
        case 2:
            this.yDirection = -1;
            var oldWidth = this.width;
            this.width = this.height;
            this.height = oldWidth;

            this.x += 18;
            this.y -= 10;
            break;
        case 4:
            this.yDirection = 1;
            var oldWidth = this.width;
            this.width = this.height;
            this.height = oldWidth;

            this.x += 34;
            this.y += 60;
            break;
    }

}

BULANCI.Shoot.prototype.updateShoot = function() {
    this.x += this.xDirection * this.speed;
    this.y += this.yDirection * this.speed;
    if(this.x < 0 || this.y < 0 || this.x > _canvas.width || this.y > _canvas.height) {
        this.isActive = false;
    }
}

BULANCI.Shoot.prototype.draw = function(context) {
    //bullet
    context.fillStyle = '#ffd649';
    context.fillRect(this.x,this.y,this.width,this.height);
    context.beginPath();
    context.lineWidth='0.8';
    context.strokeStyle= 'rgba(0,0,0,0.8)';
    context.rect(this.x,this.y,this.width,this.height);
    context.stroke();
    // shadow
    context.fillStyle = 'rgba(0,0,0,0.1)';
    context.fillRect(this.x,this.y+6,this.width,this.height);
}

BULANCI.Shoot.prototype.getX = function() {
    return this.x;
}

BULANCI.Shoot.prototype.setX = function(x) {
    this.x = x;
}

BULANCI.Shoot.prototype.getY = function() {
    return this.y;
}

BULANCI.Shoot.prototype.setY = function(y) {
    this.y = y;
}

BULANCI.Shoot.prototype.setIsActive = function(isActive) {
    this.isActive = isActive;
}

BULANCI.Shoot.prototype.getIsActive = function() {
    return this.isActive;
}