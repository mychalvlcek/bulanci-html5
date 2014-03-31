/**
 * Player representing character of the game
 *
 * @class Player
 * @constructor
 * @author Michal Vlcek <vlcekmichal@yahoo.com>
 */
BULANCI.Player = function() {
    // coordinates
    var x = 50;
    var y = 50;

    var width = 50;
    var height = 45;

    //var max

    var direction = 1;
    var moveInc = 8; // moving increment (in pixels)

    var spritePosition = 0;

    var isAlive = true; // is player alive?

    // game stats
    var score = 0;
    var kills = 0;
    var deaths = 0;

    var color = 0;

    var shooting = false; // was pressed shooting?
    var shootSpeed = 20;

    var shoots = []; // actual shooted bullets
    // var weapons = [];
    // var activeWeapon = weapons[0];

    this.death = function() {
        isAlive = false;
        deaths++;
    }

    this.respawn = function(maxWidth, maxHeight) {
        x = -100;
        y = -100;
        setTimeout(this.spawn.bind(this, maxWidth, maxHeight), 500);
    }

    this.spawn = function(maxWidth, maxHeight) {
        x = Math.random() * (maxWidth - 150) + 50;
        y = Math.random() * (maxHeight - 150) + 50;
        isAlive = true;
    }

    this.move = function(key) {
        if(isAlive) {
            direction = key;
            spritePosition = (spritePosition  < 700)?spritePosition + 95 : 0; // position for animation sprite image

            switch (key) {
                case 1:
                    if(x > 0)
                        x -= moveInc;
                    break;
                case 3:
                    if(x < _canvas.width - 50 )
                        x += moveInc;
                    break;
                case 2:
                    if(y > 0)
                        y -= moveInc;
                    break;
                case 4:
                    if(y < _canvas.height-50 )
                        y += moveInc;
                    break;
            }
        }
    }

    function activeShooting() {
        if(shooting === true) {
            shooting = false;
        }
    }

    this.shoot = function() {
        if(shooting === false) {
            shoot = new BULANCI.Shoot(x, y);
            shoot.launch(shootSpeed, direction); // gun.speed
            shoots.push(shoot);
            shooting = true;
            setTimeout(activeShooting, 400);
        }
    }
    
    function drawHitbox(context) {
        context.beginPath();
        context.rect(x, y+10, width, height);
        context.strokeStyle = 'rgba(255,0,0,0.8)';
        context.lineWidth = 0.5;
        context.stroke();
    }

    // (re)draw function
    this.draw = function(context, images, ratio) {
        // shots
        for(i = 0; i < shoots.length; i++) {
            if(shoots[i].getIsActive()) {
                shoots[i].draw(context);
            } else {
                delete shoots[i];
                shoots.splice(i, 1);
            }
        }

        drawShadow(context);
        //drawHitbox(context);

        switch (direction) {
            case 1:
                //context.drawImage(images["bulanek/bulanek"],0,0,60,90,x,y,60,90);
                context.drawImage(images["bulanek/left"], x, y);
                //context.drawImage(images["bulanek/left-sprite"],spritePosition,0,94,94,x,y,94,94);
                break;
            case 3:
                //context.drawImage(images["bulanek/bulanek"],60,0,60,90,x,y,60,90);
                context.drawImage(images["bulanek/right"], x, y);
                break;
            case 2:
                context.drawImage(images["bulanek/back"], x, y);
                break;
            case 4:
                context.drawImage(images["bulanek/front"], x, y);
                break;
        }
    }

    /* resize coordinates on window resize */
    this.uniform = function(xRatio, yRatio) {
        x = x*xRatio;
        y = y*yRatio;
    }

    function drawShadow(context) {
        context.fillStyle = 'rgba(0,0,0,0.4)';
        switch (direction) {
            case 1:
                var sx = x + 29;
                var sy = y + 40;
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
                var sx = x + 19;
                var sy = y + 40;
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
                var sx = x + 29;
                var sy = y + 40;
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
                var sx = x + 29;
                var sy = y + 34;
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

    this.isShootedBy = function(x1, y1) {
        if(x1 >= x && x1 <= x + width) {

            if(y1 >= (y+5) && y1 <= (y+5) + height) {
                return true;
            }
        }
        return false;
    }

    this.getX = function() { return x; }

    this.setX = function(pX) { x = pX; }

    this.getY = function() { return y; }

    this.setY = function(pY) { y = pY; }

    this.getShoots = function() {
        return shoots;
    }

    this.getScore = function() {
        return score;
    }

    this.setScore = function() {
        score++;
    }

};