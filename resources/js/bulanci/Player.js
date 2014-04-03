/**
 * Player representing character of the game
 *
 * @class Player
 * @constructor
 * @author Michal Vlcek <vlcekmichal@yahoo.com>
 */
BULANCI.Player = function() {
    // coordinates
    this.x = 50;
    this.y = 50;

    this.width = 50;
    this.height = 45;

    //var max

    this.direction = 1;
    this.moveInc = 8; // moving increment (in pixels)

    this.spritePosition = 0;

    this.isAlive = true; // is player alive?

    // game stats
    this.score = 0;
    this.kills = 0;
    this.deaths = 0;

    this.color = 0;

    this.shooting = false; // was pressed shooting?
    this.shootSpeed = 25;

    this.shoots = []; // actual shooted bullets
    // this.weapons = [];
    // this.activeWeapon = weapons[0];
}

BULANCI.Player.prototype.death = function() {
    this.isAlive = false;
    this.deaths++;
}

BULANCI.Player.prototype.respawn = function(maxWidth, maxHeight) {
    this.x = -100;
    this.y = -100;
    setTimeout(this.spawn.bind(this, maxWidth, maxHeight), 500);
}

BULANCI.Player.prototype.spawn = function(maxWidth, maxHeight) {
    this.x = Math.random() * (maxWidth - 150) + 50;
    this.y = Math.random() * (maxHeight - 150) + 50;
    this.isAlive = true;
}

BULANCI.Player.prototype.move = function(key, canvas, obstacles) {
    if(this.isAlive) {
        this.direction = key;
        this.spritePosition = (this.spritePosition  < 700)?this.spritePosition + 95 : 0; // position for animation sprite image

        switch (this.direction) {
            case 1:
                if(this.x > 0 && !this.hasCollision(this.x - this.moveInc, this.y, obstacles))
                    this.x -= this.moveInc;
                break;
            case 3:
                if(this.x < canvas.width - 50 && !this.hasCollision(this.x + this.moveInc, this.y, obstacles))
                    this.x += this.moveInc;
                break;
            case 2:
                if(this.y > 0 && !this.hasCollision(this.x, this.y - this.moveInc, obstacles))
                    this.y -= this.moveInc;
                break;
            case 4:
                if(this.y < canvas.height-50 && !this.hasCollision(this.x, this.y + this.moveInc, obstacles))
                    this.y += this.moveInc;
                break;
        }
    }
}

BULANCI.Player.prototype.hasCollision = function(x, y, obstacles) {
    for(i = 0; i < obstacles.length; i++) {
        var r = obstacles[i];
        console.log(this == r);
        if(this != r) {
            if ( x + this.width < r.x || r.x + r.width < x || y + this.height < r.y || r.y + r.height < y ) {
            } else {
                return true;
            }
        }
    }
    return false;
}

BULANCI.Player.prototype.activeShooting = function() {
    if(this.shooting === true) {
        this.shooting = false;
    }
}

BULANCI.Player.prototype.shoot = function() {
    if(this.shooting === false) {
        shoot = new BULANCI.Shoot(this.x, this.y);
        shoot.launch(this.shootSpeed, this.direction); // gun.speed
        this.shoots.push(shoot);
        this.shooting = true;
        setTimeout(this.activeShooting.bind(this), 400);
    }
}
    
BULANCI.Player.prototype.drawHitbox = function(context) {
    context.beginPath();
    context.rect(this.x, this.y+10, this.width, this.height);
    context.strokeStyle = 'rgba(255,0,0,0.8)';
    context.lineWidth = 0.5;
    context.stroke();
}

    // (re)draw function
BULANCI.Player.prototype.draw = function(context, images, ratio) {
    // shots
    for(i = 0; i < this.shoots.length; i++) {
        if(this.shoots[i].getIsActive()) {
            this.shoots[i].draw(context);
        } else {
            delete this.shoots[i];
            this.shoots.splice(i, 1);
        }
    }

    this.drawShadow(context);
    //drawHitbox(context);

    switch (this.direction) {
        case 1:
            //context.drawImage(images["bulanek/bulanek"],0,0,60,90,this.x,this.y,60,90);
            context.drawImage(images["bulanek/left.png"], this.x, this.y);
            //context.drawImage(images["bulanek/left-sprite"],spritePosition,0,94,94,x,y,94,94);
            break;
        case 3:
            //context.drawImage(images["bulanek/bulanek"],60,0,60,90,x,y,60,90);
            context.drawImage(images["bulanek/right.png"], this.x, this.y);
            break;
        case 2:
            context.drawImage(images["bulanek/back.png"], this.x, this.y);
            break;
        case 4:
            context.drawImage(images["bulanek/front.png"], this.x, this.y);
            break;
    }
}

/* resize coordinates on window resize */
BULANCI.Player.prototype.uniform = function(xRatio, yRatio) {
    this.x = this.x*xRatio;
    this.y = this.y*yRatio;
}

BULANCI.Player.prototype.drawShadow = function(context) {
    context.fillStyle = 'rgba(0,0,0,0.4)';
    switch (this.direction) {
        case 1:
            var sx = this.x + 29;
            var sy = this.y + 40;
            var w = 50;
            var h = 5;

            context.beginPath();
            // gun
            context.moveTo(sx-10,sy - h/2);
            // body
            context.moveTo(sx-h/2,sy);
            context.bezierCurveTo(sx+h+10, sy+w/2, // 1st controlpoint
                                  sx-h/2, sy+w/2, // 2nd controlpoint
                                  sx-h-8 , sy); // end point

            context.bezierCurveTo(sx-h/2,sy-w/2,
                                  sx+h/2,sy-w/2,
                                  sx+h/2,sy);

            context.fill();
            context.closePath();
            break;
        case 3:
            var sx = this.x + 19;
            var sy = this.y + 40;
            var w = 50;
            var h = 5;

            context.beginPath();
            // gun
            context.moveTo(sx-10,sy - h/2);
            context.bezierCurveTo(sx+w/3, sy-h/2, // 1st controlpoint
                                  sx+w/3, sy+h/2, // 2nd controlpoint
                                  sx, sy+h); // end point
            context.bezierCurveTo(sx+w-10,sy+h,
                                  sx+w-10,sy-h/2,
                                  sx,sy-h/2);
            // body
            context.moveTo(sx-h/2,sy);

            context.bezierCurveTo(sx-h-10, sy+w/2, // 1st controlpoint
                                  sx+h/2, sy+w/2, // 2nd controlpoint
                                  sx+h+8 , sy); // end point

            context.bezierCurveTo(sx+h/2,sy-w/2,
                                  sx-h/2,sy-w/2,
                                  sx-h/2,sy);

            context.fill();
            context.closePath();
            break;
        case 2: // UP
            var sx = this.x + 29;
            var sy = this.y + 40;
            var w = 60;
            var h = 5;


            context.beginPath();
            context.moveTo(sx,sy - h/2);

            context.bezierCurveTo(sx-w/2, sy-h/2, // 1st controlpoint
                                  sx-w/2, sy+h, // 2nd controlpoint
                                  sx, sy+h+5); // end point

            context.bezierCurveTo(sx+w/2,sy+h,
                                  sx+w/2,sy-h/2,
                                  sx,sy-h/2);

            context.fill();
            context.closePath();
            break;
        case 4: // DOWN
            var sx = this.x + 29;
            var sy = this.y + 34;
            var w = 60;
            var h = 5;


            context.beginPath();
            context.moveTo(sx,sy - h/2);

            context.bezierCurveTo(sx-w/2, sy-h/2, // 1st controlpoint
                                  sx-w/2, sy+h, // 2nd controlpoint
                                  sx, sy+h+3); // end point

            context.bezierCurveTo(sx+w/2,sy+h,
                                  sx+w/2,sy-h/2,
                                  sx,sy-h/2);

            context.fill();
            context.closePath();
            break;
    }

  // ctx.beginPath();
  // ctx.moveTo(148 + xoff, 173 + yoff);
  // ctx.bezierCurveTo(148 + xoff, 214 + yoff, 346 + xoff, 223 + yoff, 357 + xoff, 178 + yoff);
  // ctx.stroke();

}

BULANCI.Player.prototype.isShootedBy = function(x1, y1) {
    if(x1 >= this.x && x1 <= this.x + this.width) {

        if(y1 >= (this.y+5) && y1 <= (this.y+5) + this.height) {
            return true;
        }
    }
    return false;
}

BULANCI.Player.prototype.getX = function() { return this.x; }

BULANCI.Player.prototype.setX = function(pX) { this.x = pX; }

BULANCI.Player.prototype.getY = function() { return this.y; }

BULANCI.Player.prototype.setY = function(pY) { this.y = pY; }

BULANCI.Player.prototype.getShoots = function() {
    return this.shoots;
}

BULANCI.Player.prototype.getScore = function() {
    return this.score;
}

BULANCI.Player.prototype.setScore = function() {
    this.score++;
}