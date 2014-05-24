/**
 * Game
 *
 * @class Game
 * @constructor
 * @author Michal Vlcek <mychalvlcek@gmail.com>
 */
BULANCI.Game = function(debug) {
    this.debug = debug;

    this.canvas;
    this.context;

    this.mouseX;
    this.mouseY;

    this.width = 0;
    this.height = 0;
    
    this.keys = []; // keyboard keys

    this.frameInterval;
    this.fpsInterval;
    this.fps = 30;
    this.numFramesDrawn = 0;
    this.curFPS = 0;

    this.status = 0;

    this.defaultGametime = 60; // sec
    this.remainingTime = -1;

    this.speed = 15;
    
    this.imagePath = 'resources/images/';
    this.resources = [];
    this.images = []; // resources
    this.curLoadResNum = 0;
    this.totalLoadResources = 7;

    this.map;
    this.players = [];
    // terrain

    this.elementList = [];
    this.hud = [];
}

BULANCI.Game.prototype.init = function(gameDiv, pCanvas, pheight) {
    this.width = pCanvas;
    this.height = pheight;

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

    this.context.fillText("loading...", this.width/2, this.height/3);
    
    // Load images
    // bulanek
    this.resources.push('bulanek/front.png');
    this.resources.push('bulanek/back.png');
    this.resources.push('bulanek/left.png');
    this.resources.push('bulanek/right.png');

    this.resources.push('bulanek/front-blue.png');
    this.resources.push('bulanek/back-blue.png');
    this.resources.push('bulanek/left-blue.png');
    this.resources.push('bulanek/right-blue.png');

    this.resources.push('bulanek/front-red.png');
    this.resources.push('bulanek/back-red.png');
    this.resources.push('bulanek/left-red.png');
    this.resources.push('bulanek/right-red.png');

    this.resources.push('bulanek/bulanek.png');

    this.resources.push('grass.jpg');

    this.resources.push('logo.png');

    this.loadImages();

    document.addEventListener('keydown', this.keyboardPressed.bind(this));
    document.addEventListener('keyup', this.keyboardUnpressed.bind(this));

    // new BULANCI.Map()
    this.map = new BULANCI.Background();

    // this.elementList.push(this.map);

    var bulanek = new BULANCI.Player('-red');
    bulanek.spawn(this.width, this.height, []);
    this.players.push(bulanek);
    
    bulanek = new BULANCI.Player('-blue');
    bulanek.spawn(this.width, this.height, []);
    this.players.push(bulanek);

    this.elementList = this.elementList.concat(this.players);

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

    // main menu
    var newGame = new BULANCI.RoundedButton('New game', this.width / 2 - 100, this.height / 2 - 100, 200, 100);
    newGame.font = '26px "Helvetica"';
    newGame.textColor = 'rgba(255,255,255,.8)';
    this.hud.elements['newGame'] = newGame;

    var again = new BULANCI.RoundedButton('Play again?', this.width / 2 - 100, this.height / 2 - 100, 200, 100);
    again.font = '26px "Helvetica"';
    again.textColor = 'rgba(255,255,255,.8)';
    this.hud.elements['again_btn'] = again;
}

/**
 * Main loop of the game.
 * All of the logic is processed here.
 */
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
                    this.players[p].respawn(this.width, this.height, this.elementList);
                }
            }
        }
    }

    if(this.status == 0) {
        // start screen
        this.drawMenu();
        // this.status = 1;
    } else {
        // new game
        if(this.remainingTime > 0) {
            this.keyBind();
        
            this.redraw();
        } else {
            // END GAME
            this.drawResults();
        }
    }         
}

BULANCI.Game.prototype.drawMenu = function() {
    this.map.draw(this.context, this.images);
    this.context.rect(0, 0, this.width, this.height);
    this.context.fillStyle = 'rgba(0,0,0,0.8)';
    this.context.fill();

    // font
    this.context.font = '40px "Bank Gothic"';
    this.context.fillStyle = 'rgba(230,230,230,1)';
    this.context.fontWeight = '300';
    this.context.textAlign = 'center';
    this.context.textBaseline = 'middle';

    // logo
    this.context.fillText('Bulánci', this.width / 2, 50);
    this.context.drawImage(this.images['logo.png'], this.width / 2 - 100, 100, 300, 161);

    this.context.font = '20px "Helvetica"';

    var y = this.height / 3;
    this.context.fillStyle = 'rgba(255,0,0,0.6)';
    this.context.fillText('Player 1 controls:', this.width / 4, y);
    y += 40;
    this.context.fillText('WASD + spacebar', this.width / 4, y);

    y = this.height / 3;
    this.context.fillStyle = 'rgba(0,0,255,0.6)';
    this.context.fillText('Player 2 controls:', this.width / 4 * 3, y);
    y += 40;
    this.context.fillText('arrows + enter', this.width / 4 * 3, y);

    // new game button
    this.hud.elements['newGame'].redraw(this.context, '', this.width / 2 - 100, this.height / 2 - 100);

}

BULANCI.Game.prototype.drawResults = function() {
    // RESULTS
    this.map.draw(this.context, this.images);
    this.context.rect(0, 0, this.width, this.height);
    this.context.fillStyle = 'rgba(0,0,0,0.8)';
    this.context.fill();

    this.context.font = '20px "Helvetica"';
    this.context.fillStyle = 'rgba(230,230,230,1)';
    this.context.fontWeight = '300';
    this.context.textAlign = 'center';
    this.context.textBaseline = 'middle';

    this.context.fillText('Game over!', this.width / 2, this.height / 2 - 150);

    this.hud.elements['again_btn'].redraw(this.context, '', this.width / 2 - 100, this.height / 2 - 100);

    heightRatio = this.height / 3;
    this.context.font = '30px "Helvetica"';

    var totalScore = this.players[0].getScore() + this.players[1].getScore();
    var score1Height = this.players[0].getScore() * (heightRatio/totalScore);
    var score2Height = this.players[1].getScore() * (heightRatio/totalScore);
    // score 1
    this.context.beginPath();
    this.context.rect(this.width / 4 - 50, this.height / 5 * 3, 100, -1 * score1Height );
    this.context.strokeStyle = 'rgba(255,0,0,0.8)';
    this.context.lineWidth = 2;
    this.context.stroke();
    this.context.fillStyle = 'rgba(255,0,0,0.2)';
    this.context.fill();

    this.context.fillStyle = 'rgba(255,0,0,0.5)';
    this.context.fillText(this.players[0].getScore(), this.width / 4, this.height / 4 * 3 );

    // score 2
    heightRatio = this.height / 3;
    this.context.beginPath();
    this.context.rect(this.width / 4 * 3 - 50, this.height / 5 * 3, 100, -1 * score2Height );
    this.context.strokeStyle = 'rgba(0,0,255,0.8)';
    this.context.lineWidth = 2;
    this.context.stroke();
    this.context.fillStyle = 'rgba(0,0,255,0.2)';
    this.context.fill();

    this.context.fillStyle = 'rgba(0,0,255,0.5)';
    this.context.fillText(this.players[1].getScore(), this.width / 4 * 3, this.height / 4 * 3 );
}

BULANCI.Game.prototype.redraw = function() {
    this.clearCanvas();
    // redraw map
    this.map.draw(this.context, this.images);
    // redraw hud
    // hud.redraw(context);
    this.hud.elements['score1'].redraw(this.context, 'score: ' + this.players[0].getScore(), 20, this.height-50);
    this.hud.elements['score2'].redraw(this.context, 'score: ' + this.players[1].getScore(), 140, this.height-50);
    this.hud.elements['pause_btn'].redraw(this.context, '', this.width-120, this.height-50);

    // remaining time
    this.hud.elements['time'].redraw(this.context, this.remainingTime.toTimeRemain(), this.width / 2 - 50, this.height-50);

    // redraw players
    for(var i = 0; i < this.players.length; i++) {
        this.players[i].draw(this.context, this.images);
    }

    if(this.debug) {
        this.printDebugInfo();
    }
}

BULANCI.Game.prototype.handleMouseMove = function(e) {
    this.mouseX = parseInt(e.clientX);
    this.mouseY = parseInt(e.clientY);

    for (var key in this.hud.elements) {
        if(this.hud.elements[key].contains(this.mouseX,this.mouseY) && this.hud.elements[key].clickable && !this.hud.elements[key].isHidden()) {
            window.document.body.style.cursor = 'pointer';
            this.hud.elements[key].hovered = true;
        } else {
            this.hud.elements[key].hovered = false;
            window.document.body.style.cursor = 'auto';
        }
    }
}

BULANCI.Game.prototype.handleMouseClick = function(e) {
    this.mouseX = parseInt(e.clientX);
    this.mouseY = parseInt(e.clientY);

    for (var key in this.hud.elements) {
        if(this.hud.elements[key].contains(this.mouseX,this.mouseY) && this.hud.elements[key].clickable) {
            this.hud.elements[key].hovered = true;
            if(key == 'newGame') {
                this.status = 1;
                this.hud.elements[key].hide();
            }

            if(key == 'again_btn') {
                this.restart();
                for(i = 0; i < this.players.length; i++) {
                    this.players[i].restart();
                }
            }

            if(key == 'pause_btn') {
                console.log('paused');
            }
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

    var html = '';
    var y = 60;
    this.context.fillText('pressed keys: ', 20, 45);
    for (var i in this.keys) {
        if (!this.keys.hasOwnProperty(i)) continue;
        this.context.fillText(i, 20, y);
        y += 15;
    }
}

BULANCI.Game.prototype.clearCanvas = function() {
    this.canvas.width = this.canvas.width;
}

BULANCI.Game.prototype.start = function() {
    this.remainingTime = this.defaultGametime;
    this.frameInterval = setInterval(this.update.bind(this), 1000/this.fps);
    this.fpsInterval = setInterval(this.updateFPS.bind(this), 1000);
}

BULANCI.Game.prototype.restart = function() {
    this.remainingTime = this.defaultGametime;
    this.status = 1;
}

BULANCI.Game.prototype.setGametime = function(time) {
    localStorage.setItem('gametime', time);
}

BULANCI.Game.prototype.getGametime = function() {
    if (localStorage.getItem('gametime') === null) {
        localStorage.setItem('gametime', this.defaultGametime);
    }
    return localStorage.getItem('gametime');
}

/**
 * start game after resources are fully loaded
 */
BULANCI.Game.prototype.resourceLoaded = function() {
    if(++this.curLoadResNum == this.resources.length) {
        this.start();
    }
}

/**
 * loading resource images
 */
BULANCI.Game.prototype.loadImages = function() {
    for(i = 0; i < this.resources.length; i++) {
        var name = this.resources[i];
        this.images[name] = new Image();
        this.images[name].addEventListener('load', this.resourceLoaded(), false);
        this.images[name].src = this.imagePath + name;
    }
}

BULANCI.Game.prototype.updateFPS = function() {
    this.curFPS = this.numFramesDrawn;
    this.numFramesDrawn = 0;
    if(this.status == 1 && this.remainingTime > 0)
        this.remainingTime--;
}

BULANCI.Game.prototype.keyBind = function() {
    var directions = { 
        65: 1, 87: 2 ,68: 3, 83: 4,
        37: 1, 38: 2 ,39: 3, 40: 4
    };

    for (var i in this.keys) {
        if (!this.keys.hasOwnProperty(i)) continue;
        if(i == 13) { // enter
            this.players[1].shoot();
        }
        if(i == 32) { // spacebar
            this.players[0].shoot();
        }
        if(i >= 37 && i <= 40) { // arrows
            this.players[1].move(directions[i], this.canvas, this.elementList);
        }
        if(i == 65 || i == 68 || i == 83 || i == 87) { // WSAD
            this.players[0].move(directions[i], this.canvas, this.elementList);
        }

    }
}

BULANCI.Game.prototype.keyboardPressed = function(e) {
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
}

BULANCI.Game.prototype.keyboardUnpressed = function(e) {
    var e = e || window.event;
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