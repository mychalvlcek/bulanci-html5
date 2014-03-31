/**
* Shoot of player
* @class Shoot
* @constructor
* @author Michal Vlcek <vlcekmichal@yahoo.com>
*/
BULANCI.Shoot = function(x, y) {
    var x = x;
    var y = y;
    var direction;
    var xDirection = 0;
    var yDirection = 0;

    var width = 10;
    var height = 4;

    var isActive = true;
    var updateTimer;

    var speed = 2;

    //var bullets = []; // for more sophisticated weapons, Bullet class?

    updateTimer = setInterval(updateShoot, 1000/30);
            
    this.launch = function(pSpeed, pDirection) {
        speed = pSpeed;
        direction = pDirection;
        switch (pDirection) {
            case 1:
                xDirection = -1;
                x -= 10;
                y += 43;
                break;
            case 3:
                xDirection = 1;
                x += 55;
                y += 22;
                break;
            case 2:
                yDirection = -1;
                var oldWidth = width;
                width = height;
                height = oldWidth;

                x += 18;
                y -= 10;
                break;
            case 4:
                yDirection = 1;
                var oldWidth = width;
                width = height;
                height = oldWidth;

                x += 34;
                y += 60;
                break;
        }

    }

    function updateShoot() {
        x += xDirection * speed;
        y += yDirection * speed;
        if(x < 0 || y < 0 || x > _canvas.width || y > _canvas.height) {
            isActive = false;
        }
    }

    this.draw = function(context) {
        //bullet
        context.fillStyle = '#ffd649';
        context.fillRect(x,y,width,height);
        context.beginPath();
        context.lineWidth='0.8';
        context.strokeStyle= 'rgba(0,0,0,0.8)';
        context.rect(x,y,width,height);
        context.stroke();
        // shadow
        context.fillStyle = 'rgba(0,0,0,0.1)';
        context.fillRect(x,y+6,width,height);
    }

    this.getX = function() { return x; }

    this.setX = function(pX) { x = pX; }

    this.getY = function() { return y; }

    this.setY = function(pY) { y = pY; }

    this.setIsActive = function(a) {
        isActive = a;
    }

    this.getIsActive = function() {
        return isActive;
    }
}