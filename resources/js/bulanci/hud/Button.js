
BULANCI.Button = function(text, x, y, width, height, stroke) {
    this.x = x || 0;
    this.y = y || 0;
    this.width = width || 0;
    this.height = height || 0;
    this.text = text || '';
    this.stroke = stroke  || 'pink';

    this.hide = false;
};


BULANCI.Button.prototype.isHidden = function() {
    return this.hide;
};

BULANCI.Button.prototype.hide = function() {
    this.hide = true;
};

BULANCI.Button.prototype.show = function() {
    this.hide = false;
};

BULANCI.Button.prototype.contains = function(x, y) {
    return (x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height);
};

 BULANCI.Button.prototype.redraw = function (context, x, y) {
    this.x = x || this.x;
    this.y = y || this.y;
    this.draw(context, this.stroke);
    return (this);
}

BULANCI.Button.prototype.highlight = function (context, x, y) {
    this.x = x || this.x;
    this.y = y || this.y;
    this.draw(context, 'orange');
    return (this);
}

BULANCI.Button.prototype.draw = function (context, stroke) {
    if(!this.hide) {
        context.save();
        context.beginPath();
        context.rect(this.x, this.y, this.width, this.height);
        context.fillStyle = 'rgba(0,0,0,0.2)';
        context.strokeStyle = stroke;
        context.lineWidth = 2;
        context.stroke();
        context.fill();

        // font
        context.font = '20px "Helvetica"';
        context.fillStyle = 'rgba(230,230,230,1)';
        context.fontWeight = '300';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2);
        context.restore();
    }
}