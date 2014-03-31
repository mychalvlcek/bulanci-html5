/**
* Game
* @class Game
* @constructor
* @author Michal Vlcek <vlcekmichal@yahoo.com>
*/
BULANCI.Game = function(debug) {
    var debug = debug;

    this._canvas;
    this._context;

    var mouseX;
    var mouseY;

    var imagePath = 'resources/images/';

    var width = 0;
    var initWidth = 0;
    var height = 0;
    var ratio = 1;
    
    var keys = []; // keyboard keys

    var _frameInterval;
    var _fpsInterval;
    var fps = 30;
    var numFramesDrawn = 0;
    var curFPS = 0;

    var gametime = 90; // sec
    var remainingTime = 90;

    var level = 1;
    var maxLevel = 10;
    var speed = 15;
    
    var images = []; // resources
    var curLoadResNum = 0;
    var totalLoadResources = 13;

    var elementList = [];

    var map; // new Map()
    var players = [];

    var hud = [];

    this.init = function(gameDiv, pCanvas, pheight) {
        width = pCanvas;
        height = pheight;
        initWidth = width;
        
        // Create the canvas (Neccessary for IE because it doesn't know what a canvas element is)
        _canvas = document.createElement('canvas');
        _canvas.setAttribute('width', width);
        _canvas.setAttribute('height', height);
        _canvas.setAttribute('id', 'canvas');
        gameDiv.appendChild(_canvas);
        
        // IE fix
        if(typeof G_vmlCanvasManager != 'undefined') {
            _canvas = G_vmlCanvasManager.initElement(_canvas);
        }
        _context = _canvas.getContext('2d');
        _context.font = 'bold 12px "Helvetica Neue"';
        clearCanvas();
        try {
            _context.fillText("loading...", width/2, height/3);
        } catch (ex) {

        }
        
        // Load images
        loadImage("legs");
        loadImage("torso");
        loadImage("head");
        loadImage("hair");
        loadImage("leftArm");
        loadImage("rightArm");
        loadImage("leftArm-jump");
        loadImage("legs-jump");
        loadImage("rightArm-jump");
        // bulanek
        loadImage('bulanek/front');
        loadImage('bulanek/back');
        loadImage('bulanek/left');
        loadImage('bulanek/right');

        loadImage('bulanek/bulanek');
        loadImage('bulanek/left-sprite');

        loadImage('grass');

        keyboardCapture();

        // new BULANCI.Map()
        map = new BULANCI.Background();
        elementList.push(map);

        var bulanek = new BULANCI.Player();
        bulanek.spawn(width, height);
        players.push(bulanek);
        
        bulanek = new BULANCI.Player();
        bulanek.setX(Math.random() * (width - 150) + 50);
        bulanek.setY(Math.random() * (height - 150) + 50);
        players.push(bulanek);

        elementList.concat(players);

        // HUD
        hud = new BULANCI.HUD();
        var pauseButton = new BULANCI.RoundedButton('Pause', width-120, height-50, 100, 30);
        hud.elements['pause_btn'] = pauseButton;

        var score1 = new BULANCI.RoundedLabel('score: 0', 20, height-50, 100, 30);
        score1.stroke = 'rgba(255,0,0,0.6)';
        score1.fill = 'rgba(255,0,0,0.2)';
        score1.textColor = 'rgba(255,255,255,.8)';
        hud.elements['score1'] = score1;

        var score2 = new BULANCI.RoundedLabel('score: 0', 140, height-50, 100, 30);
        score2.stroke = 'rgba(0,0,255,0.6)';
        score2.fill = 'rgba(0,0,255,0.2)';
        score2.textColor = 'rgba(255,255,255,.8)';
        hud.elements['score2'] = score2;

        var time = new BULANCI.RoundedButton('0', width / 2 - 40, height-50, 80, 40);
        time.font = '26px "Helvetica"';
        time.textColor = 'rgba(255,255,255,.8)';
        hud.elements['time'] = time;
    }

    // main loop
    function update() {
        ++numFramesDrawn;

        for(i = 0; i < players.length; i++) {
            var shoots = players[i].getShoots();
            for(s = 0; s < shoots.length; s++) {

                for(p = 0; p < players.length; p++) {
                    if(p != i && players[p].isShootedBy(shoots[s].getX(), shoots[s].getY())) {
                        shoots[s].setIsActive(false);
                        players[i].setScore();
                        players[p].death();
                        players[p].respawn(width, height);
                    }
                }
            }
        }

        if(remainingTime > 0) {
            keyBind();
        
            redraw();
        } else {
            // END GAME
            map.draw(_context, images);
            _context.rect(0, 0, width, height);
            _context.fillStyle = 'rgba(0,0,0,0.8)';
            _context.fill();

            _context.font = '20px "Helvetica"';
            _context.fillStyle = 'rgba(230,230,230,1)';
            _context.fontWeight = '300';
            _context.textAlign = 'center';
            _context.textBaseline = 'middle';

            _context.fillText('Game over!', width / 2, height / 2 - 50);

            _context.beginPath();
            _context.rect(width / 2 - 100, height / 2, 200, 100);
            _context.strokeStyle = 'rgb(120,120,120)';
            _context.lineWidth = 2;
            _context.stroke();

            _context.fillText('Play again?', width / 2, height / 2 + 50);

            heightRatio = height / 3;
            _context.font = '30px "Helvetica"';

            var totalScore = players[0].getScore() + players[1].getScore();
            var score1Height = players[0].getScore() * (heightRatio/totalScore);
            var score2Height = players[1].getScore() * (heightRatio/totalScore);
            // score 1
            _context.beginPath();
            _context.rect(width / 4 - 50, height / 5 * 3, 100, -1 * score1Height );
            _context.strokeStyle = 'rgba(255,0,0,0.8)';
            _context.lineWidth = 2;
            _context.stroke();
            _context.fillStyle = 'rgba(255,0,0,0.2)';
            _context.fill();

            _context.fillStyle = 'rgba(255,0,0,0.5)';
            _context.fillText(players[0].getScore(), width / 4, height / 4 * 3 );

            // score 2
            heightRatio = height / 3;
            _context.beginPath();
            _context.rect(width / 4 * 3 - 50, height / 5 * 3, 100, -1 * score2Height );
            _context.strokeStyle = 'rgba(0,0,255,0.8)';
            _context.lineWidth = 2;
            _context.stroke();
            _context.fillStyle = 'rgba(0,0,255,0.2)';
            _context.fill();

            _context.fillStyle = 'rgba(0,0,255,0.5)';
            _context.fillText(players[1].getScore(), width / 4 * 3, height / 4 * 3 );
        }
              
    }

    function redraw() {
        clearCanvas();
        
        // redraw map
        map.draw(_context, images);

        if(remainingTime > 0) {
            // redraw hud
            //hud.redraw(_context);
            hud.elements['score1'].redraw(_context, 'score: ' + players[0].getScore(), 20, height-50);
            hud.elements['score2'].redraw(_context, 'score: ' + players[1].getScore(), 140, height-50);
            hud.elements['pause_btn'].redraw(_context, '', width-120, height-50);

            // remaining time
            hud.elements['time'].redraw(_context, remainingTime.toTimeRemain(), width / 2 - 50, height-50);

            // redraw players
            for(var i = 0; i < players.length; i++) {
                players[i].draw(_context, images);
            }
        } else {

        }

        if(debug) {
            printDebugInfo();
        }
    }

    this.handleMouseMove = function(e) {
        mouseX = parseInt(e.clientX);
        mouseY = parseInt(e.clientY);

        for (var key in hud.elements) {
            if(hud.elements[key].contains(mouseX,mouseY) && hud.elements[key].clickable) {
                window.document.body.style.cursor = 'pointer';
                console.log('adsf');
                hud.elements[key].hovered = true;
            } else {
                hud.elements[key].hovered = false;
                window.document.body.style.cursor = 'auto';
            }
        }
    }


    function printDebugInfo() {
        _context.fillStyle = 'rgba(0,0,0,0.6)';
        _context.fontWeight = '100';

        // version
        _context.font = '16px "Helvetica"';
        _context.fillText('version 0.1', 20, 30);
        // fps
        _context.font = '12px "Helvetica"';
        _context.fillText('FPS: ' + curFPS + '/' + fps + ' (' + numFramesDrawn + ')', 20, 45);

        var html = '';
        var y = 80;
        _context.fillText('pressed keys: ', 20, 60);
        for (var i in keys) {
            if (!keys.hasOwnProperty(i)) continue;
            _context.fillText(i, 20, y);
            y += 15;
        }
        if(level < maxLevel) {
            //_context.fillText("Level: " + level + " of " + maxLevel, 20, 30);
        } else {
            _context.fillText("You Win!", 300, 100);
        }
    }

    function clearCanvas() {
        _canvas.width = _canvas.width;
    }

    function keyBind() {
        var directions = { 
            65: 1, 87: 2 ,68: 3, 83: 4,
            37: 1, 38: 2 ,39: 3, 40: 4
        };

        for (var i in keys) {
            if (!keys.hasOwnProperty(i)) continue;

            if(i == 13) { // enter
                players[1].shoot(i);
            }
            if(i == 32) { // spacebar
                players[0].shoot(i);
            }
            if(i >= 37 && i <= 40) { // arrows
                players[1].move(directions[i]);
            }
            if(i == 65 || i == 68 || i == 83 || i == 87) { // WSAD
                players[0].move(directions[i]);
            }

        }
    }

    function start() {
        remainingTime = gametime;
        _frameInterval = setInterval(update, 1000/fps);
        _fpsInterval = setInterval(updateFPS, 1000);
    }

    function end() {
        // remainingTime = gametime;
        // _frameInterval = setInterval(update, 1000/fps);
        // _fpsInterval = setInterval(updateFPS, 1000);
    }

    // start game after resources are fully loaded
    function resourceLoaded() {
        if(++curLoadResNum == totalLoadResources) {
            start();
        }
    }

    function loadImage(name) {
        images[name] = new Image();
        images[name].onload = function() { resourceLoaded(); }
        if(name == 'grass') {
            images[name].src = imagePath + name + '.jpg';
        } else {
            images[name].src = imagePath + name + '.png';
        }
    }

    function updateFPS() {
        curFPS = numFramesDrawn;
        numFramesDrawn = 0;
        //if(remainingTime > 0)
            remainingTime--;
    }

    function keyboardCapture() {
        document.onkeydown = function (e) {
            var e = e || window.event;
            var arrows = [37, 38, 39, 40];
            if(arrows.indexOf(e.keyCode) != -1) {
                delete keys[37];
                delete keys[38];
                delete keys[39];
                delete keys[40];
            }
            var wasd = [65, 68, 83, 87];
            if(wasd.indexOf(e.keyCode) != -1) {
                delete keys[65];
                delete keys[68];
                delete keys[83];
                delete keys[87];
            }
            keys[e.keyCode] = e.type == 'keydown';
        }

        document.onkeyup = function (e) {
            delete keys[e.keyCode];
        }
    }

    this.resize = function() {
        newWidth = window.innerWidth || document.body.clientWidth;
        newHeight = window.innerHeight || document.body.clientHeight;

        xRatio = newWidth / width;
        yRatio = newHeight / height;

        width = newWidth;
        height = newHeight;

        _canvas.setAttribute('width', width);
        _canvas.setAttribute('height', height);

        // redraw other elements
        for(i = 0; i < players.length; i++) {
            players[i].uniform(xRatio, yRatio);
        }

    }
}