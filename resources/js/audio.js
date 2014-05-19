// audio
var a = new Audio();

if(a.canPlayType('audio/mpeg'))
    a.src = 'resources/audio/gyears.mp3';
a.play();
// a.pause();
// 
document.getElementById('toggle-audio').addEventListener('click', function() { 
	if(a.paused) {
		a.play();
	} else {
		a.pause();
	}
});