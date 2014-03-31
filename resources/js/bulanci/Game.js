/**
* Game
* @class Game
* @constructor
* @author Michal Vlcek <vlcekmichal@yahoo.com>
*/
BULANCI.Game = function(debug) {
    this.debug = debug;

    this.canvas;
    this.context;

    this.mouseX;
    this.mouseY;

    this.imagePath = 'resources/images/';

    this.width = 0;
    this.initWidth = 0;
    this.height = 0;
    this.ratio = 1;
    
    this.keys = []; // keyboard keys

    this.frameInterval;
    this.fpsInterval;
    this.fps = 30;
    this.numFramesDrawn = 0;
    this.curFPS = 0;

    this.gametime = 90; // sec
    this.remainingTime = 90;

    this.level = 1;
    this.maxLevel = 10;
    this.speed = 15;
    
    this.images = []; // resources
    this.curLoadResNum = 0;
    this.totalLoadResources = 16;

    this.elementList = [];

    this.map;
    this.players = [];

    this.hud = [];
}

BULANCI.Game.prototype.init = function(gameDiv, pCanvas, pheight) {
    this.width = pCanvas;
    this.height = pheight;
    this.initWidth = this.width;

    // Create the canvas (Neccessary for IE because it doesn't know what a canvas element is)
    this.canvas = document.createElement('canvas');
    this.canvas.setAttribute('width', this.width);
    this.canvas.setAttribute('height', this.height);
    this.canvas.setAttribute('id', 'canvas');
    gameDiv.appendChild(this.canvas);
    
    // IE fix
    if(typeof G_vmlCanvasManager != 'undefined') {
        this.canvas = G_vmlCanvasManager.initElement(this.canvas);
    }
    this.context = this.canvas.getContext('2d');
    this.context.font = 'bold 12px "Helvetica Neue"';
    this.clearCanvas();
    try {
        this.context.fillText("loading...", this.width/2, this.height/3);
    } catch (ex) {

    }
    
    // Load images
    this.loadImage("legs");
    this.loadImage("torso");
    this.loadImage("head");
    this.loadImage("hair");
    this.loadImage("leftArm");
    this.loadImage("rightArm");
    this.loadImage("leftArm-jump");
    this.loadImage("legs-jump");
    this.loadImage("rightArm-jump");
    // bulanek
    this.loadImage('bulanek/front');
    this.loadImage('bulanek/back');
    this.loadImage('bulanek/left');
    this.loadImage('bulanek/right');

    this.loadImage('bulanek/bulanek');
    this.loadImage('bulanek/left-sprite');

    this.loadImage('grass');

    //this.keyboardCapture();
    document.addEventListener('keydown', this.keyboardCapture.bind(this));
    document.addEventListener('keyup', this.keyboardUncapture.bind(this));

    // new BULANCI.Map()
    this.map = new BULANCI.Background();

    this.elementList.push(this.map);

    var bulanek = new BULANCI.Player();
    bulanek.spawn(this.width, this.height);
    this.players.push(bulanek);
    
    bulanek = new BULANCI.Player();
    bulanek.setX(Math.random() * (this.width - 150) + 50);
    bulanek.setY(Math.random() * (this.height - 150) + 50);
    this.players.push(bulanek);

    this.elementList.concat(this.players);

    // HUD
    this.hud = new BULANCI.HUD();
    var pauseButton = new BULANCI.RoundedButton('Pause', this.width-120, this.height-50, 100, 30);
    this.hud.elements['pause_btn'] = pauseButton;

    var score1 = new BULANCI.RoundedLabel('score: 0', 20, this.height-50, 100, 30);
    score1.stroke = 'rgba(255,0,0,0.6)';
    score1.fill = 'rgba(255,0,0,0.2)';
    score1.textColor = 'rgba(255,255,255,.8)';
    this.hud.elements['score1'] = score1;

    var score2 = new BULANCI.RoundedLabel('score: 0', 140, this.height-50, 100, 30);
    score2.stroke = 'rgba(0,0,255,0.6)';
    score2.fill = 'rgba(0,0,255,0.2)';
    score2.textColor = 'rgba(255,255,255,.8)';
    this.hud.elements['score2'] = score2;

    var time = new BULANCI.RoundedButton('0', this.width / 2 - 40, this.height-50, 80, 40);
    time.font = '26px "Helvetica"';
    time.textColor = 'rgba(255,255,255,.8)';
    this.hud.elements['time'] = time;
}

// main loop
BULANCI.Game.prototype.update = function() {
    ++this.numFramesDrawn;

    for(i = 0; i < this.players.length; i++) {
        var shoots = this.players[i].getShoots();
        for(s = 0; s < shoots.length; s++) {

            for(p = 0; p < this.players.length; p++) {
                if(p != i && this.players[p].isShootedBy(shoots[s].getX(), shoots[s].getY())) {
                    shoots[s].setIsActive(false);
                    this.players[i].setScore();
                    this.players[p].death();
                    this.players[p].respawn(this.width, this.height);
                }
            }
        }
    }

    if(this.remainingTime > 0) {
        this.keyBind();
    
        this.redraw();
    } else {
        // END GAME
        map.draw(context, images);
        context.rect(0, 0, width, height);
        context.fillStyle = 'rgba(0,0,0,0.8)';
        context.fill();

        context.font = '20px "Helvetica"';
        context.fillStyle = 'rgba(230,230,230,1)';
        context.fontWeight = '300';
        context.textAlign = 'center';
        context.textBaseline = 'middle';

        context.fillText('Game over!', width / 2, height / 2 - 50);

        context.beginPath();
        context.rect(width / 2 - 100, height / 2, 200, 100);
        context.strokeStyle = 'rgb(120,120,120)';
        context.lineWidth = 2;
        context.stroke();

        context.fillText('Play again?', width / 2, height / 2 + 50);

        heightRatio = height / 3;
        context.font = '30px "Helvetica"';

        var totalScore = players[0].getScore() + players[1].getScore();
        var score1Height = players[0].getScore() * (heightRatio/totalScore);
        var score2Height = players[1].getScore() * (heightRatio/totalScore);
        // score 1
        context.beginPath();
        context.rect(width / 4 - 50, height / 5 * 3, 100, -1 * score1Height );
        context.strokeStyle = 'rgba(255,0,0,0.8)';
        context.lineWidth = 2;
        context.stroke();
        context.fillStyle = 'rgba(255,0,0,0.2)';
        context.fill();

        context.fillStyle = 'rgba(255,0,0,0.5)';
        context.fillText(players[0].getScore(), width / 4, height / 4 * 3 );

        // score 2
        heightRatio = height / 3;
        context.beginPath();
        context.rect(width / 4 * 3 - 50, height / 5 * 3, 100, -1 * score2Height );
        context.strokeStyle = 'rgba(0,0,255,0.8)';
        context.lineWidth = 2;
        context.stroke();
        context.fillStyle = 'rgba(0,0,255,0.2)';
        context.fill();

        context.fillStyle = 'rgba(0,0,255,0.5)';
        context.fillText(players[1].getScore(), width / 4 * 3, height / 4 * 3 );
    }
          
}

BULANCI.Game.prototype.redraw = function() {
    this.clearCanvas();
    // redraw map
    //console.log(this);
    this.map.draw(this.context, this.images);

    if(this.remainingTime > 0) {
        // redraw hud
        //hud.redraw(context);
        this.hud.elements['score1'].redraw(this.context, 'score: ' + this.players[0].getScore(), 20, this.height-50);
        this.hud.elements['score2'].redraw(this.context, 'score: ' + this.players[1].getScore(), 140, this.height-50);
        this.hud.elements['pause_btn'].redraw(this.context, '', this.width-120, this.height-50);

        // remaining time
        this.hud.elements['time'].redraw(this.context, this.remainingTime.toTimeRemain(), this.width / 2 - 50, this.height-50);

        // redraw players
        for(var i = 0; i < this.players.length; i++) {
            this.players[i].draw(this.context, this.images);
        }
    } else {

    }

    if(this.debug) {
        this.printDebugInfo();
    }
}

BULANCI.Game.prototype.handleMouseMove = function(e) {
    this.mouseX = parseInt(e.clientX);
    this.mouseY = parseInt(e.clientY);

    for (var key in this.hud.elements) {
        if(this.hud.elements[key].contains(this.mouseX,this.mouseY) && this.hud.elements[key].clickable) {
            window.document.body.style.cursor = 'pointer';
            this.hud.elements[key].hovered = true;
        } else {
            this.hud.elements[key].hovered = false;
            window.document.body.style.cursor = 'auto';
        }
    }
}


BULANCI.Game.prototype.printDebugInfo = function() {
    this.context.fillStyle = 'rgba(0,0,0,0.6)';
    this.context.fontWeight = '100';

    // version
    this.context.font = '16px "Helvetica"';
    this.context.fillText('version ' + BULANCI.VERSION, 20, 30);
    // fps
    this.context.font = '12px "Helvetica"';
    this.context.fillText('FPS: ' + this.curFPS + '/' + this.fps + ' (' + this.numFramesDrawn + ')', 20, 45);

    var html = '';
    var y = 80;
    this.context.fillText('pressed keys: ', 20, 60);
    for (var i in this.keys) {
        if (!this.keys.hasOwnProperty(i)) continue;
        this.context.fillText(i, 20, y);
        y += 15;
    }
}

BULANCI.Game.prototype.clearCanvas = function() {
    this.canvas.width = this.canvas.width;
}

BULANCI.Game.prototype.keyBind = function() {
    var directions = { 
        65: 1, 87: 2 ,68: 3, 83: 4,
        37: 1, 38: 2 ,39: 3, 40: 4
    };

    for (var i in this.keys) {
        if (!this.keys.hasOwnProperty(i)) continue;

        if(i == 13) { // enter
            this.players[1].shoot(i);
        }
        if(i == 32) { // spacebar
            this.players[0].shoot(i);
        }
        if(i >= 37 && i <= 40) { // arrows
            this.players[1].move(directions[i], this.canvas);
        }
        if(i == 65 || i == 68 || i == 83 || i == 87) { // WSAD
            this.players[0].move(directions[i], this.canvas);
        }

    }
}

BULANCI.Game.prototype.start = function() {
    this.remainingTime = this.gametime;
    this.frameInterval = setInterval(this.update.bind(this), 1000/this.fps);
    this.fpsInterval = setInterval(this.updateFPS.bind(this), 1000);
}

BULANCI.Game.prototype.end = function() {
    // remainingTime = gametime;
    // frameInterval = setInterval(update, 1000/fps);
    // fpsInterval = setInterval(updateFPS, 1000);
}

// start game after resources are fully loaded
BULANCI.Game.prototype.resourceLoaded = function() {
    if(++this.curLoadResNum == this.totalLoadResources) {
        console.log('start');
        this.start();
    }
}

/**
 * loading resource images
 */
BULANCI.Game.prototype.loadImage = function(name) {
    this.images[name] = new Image();
    //this.images[name].onload = function() { this.resourceLoaded(); }
    this.images[name].onload = this.resourceLoaded();
    if(name == 'grass') {
        this.images[name].src = this.imagePath + name + '.jpg';
    } else {
        this.images[name].src = this.imagePath + name + '.png';
    }
}

BULANCI.Game.prototype.updateFPS = function() {
    this.curFPS = this.numFramesDrawn;
    this.numFramesDrawn = 0;
    //if(this.remainingTime > 0)
        this.remainingTime--;
}

BULANCI.Game.prototype.keyboardCapture = function(e) {
    //document.addEventListener('keydown', this.clickHandler.bind(this));
    //document.onkeydown = function (e) {
        var e = e || window.event;
        var arrows = [37, 38, 39, 40];
        if(arrows.indexOf(e.keyCode) != -1) {
            delete this.keys[37];
            delete this.keys[38];
            delete this.keys[39];
            delete this.keys[40];
        }
        var wasd = [65, 68, 83, 87];
        if(wasd.indexOf(e.keyCode) != -1) {
            delete this.keys[65];
            delete this.keys[68];
            delete this.keys[83];
            delete this.keys[87];
        }
        this.keys[e.keyCode] = e.type == 'keydown';
    //}

    // document.onkeyup = function (e) {
    //     delete this.keys[e.keyCode];
    // }
}

BULANCI.Game.prototype.keyboardUncapture = function(e) {
    delete this.keys[e.keyCode];
}

BULANCI.Game.prototype.resize = function() {
    newWidth = window.innerWidth || document.body.clientWidth;
    newHeight = window.innerHeight || document.body.clientHeight;

    xRatio = newWidth / this.width;
    yRatio = newHeight / this.height;

    this.width = newWidth;
    this.height = newHeight;

    this.canvas.setAttribute('width', this.width);
    this.canvas.setAttribute('height', this.height);

    // redraw other elements
    for(i = 0; i < this.players.length; i++) {
        this.players[i].uniform(xRatio, yRatio);
    }

}