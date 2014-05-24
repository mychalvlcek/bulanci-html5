// Create an instance of Meny
var meny = Meny.create({
    menuElement: document.getElementById('meny'),
    contentsElement: document.getElementById('content'), // The contents that gets pushed aside while Meny is active
    position: 'left', // [optional] The alignment of the menu (top/right/bottom/left)
    height: 200, // [optional] The height of the menu (when using top/bottom position)
    width: 300, // [optional] The width of the menu (when using left/right position)
    threshold: 40, // [optional] Distance from mouse (in pixels) when menu should open
    mouse: true, // [optional] Use mouse movement to automatically open/close
    touch: true // [optional] Use touch swipe events to open/close
});

// Embed an iframe if a URL is passed in
if( Meny.getQuery().u && Meny.getQuery().u.match( /^http/gi ) ) {
    var content = document.getElementById('content');
    content.style.padding = '0px';
    content.innerHTML = '<div class="cover"></div><iframe src="'+ Meny.getQuery().u +'" style="width: 100%; height: 100%; border: 0; position: absolute;"></iframe>';
}


document.addEventListener('DOMContentLoaded', function() {
    var game = new BULANCI.Game(true);
    game.init(document.getElementById('game'), window.innerWidth, window.innerHeight);
    window.addEventListener('resize', function() {
        game.resize();
    });

    window.addEventListener('click', function(e) {
        game.handleMouseClick(e);
    });

    window.addEventListener('mousemove', function(e) {
        game.handleMouseMove(e);
    });
});