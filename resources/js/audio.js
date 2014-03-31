// audio
var a = document.createElement('audio');
document.body.insertBefore(a, document.body.firstChild);

if(a.canPlayType('audio/mpeg'))
    a.src = 'resources/audio/gyears.mp3';
// a.play();
// a.pause();

document.getElementById('toggle-audio').onclick = function() { 
	if(a.paused) {
		a.play();
	} else {
		a.pause();
	}
}