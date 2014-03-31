
BULANCI.RoundedButton = function(text, x, y, width, height, radius, stroke, fill, textColor) {
    this.x = x || 0;
    this.y = y || 0;
    this.width = width || 0;
    this.height = height || 0;
    this.radius = radius || 5;
    this.text = text || '';

    this.font = '20px "Helvetica"';
    this.fontWeight = '300';
    this.textColor = textColor || 'rgba(200,200,200,.8)';

    this.stroke = stroke  || 'rgb(68,68,68)';
    this.fill = fill  || 'rgba(0,0,0,0.2)';

    this.hide = false;

    this.hovered = false;
    this.clickable = true;
    this.hoverStroke = 'orange';
};

BULANCI.RoundedButton.prototype.isHidden = function() {
    return this.hide;
};

BULANCI.RoundedButton.prototype.setHide = function() {
    this.hide = true;
};

BULANCI.RoundedButton.prototype.show = function() {
    this.hide = false;
};

BULANCI.RoundedButton.prototype.contains = function(x, y) {
    return (x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height);
};

BULANCI.RoundedButton.prototype.redraw = function (context, text, x, y) {
    this.x = x || this.x;
    this.y = y || this.y;
    this.text = text || this.text;
    if(this.hovered) {
        this.draw(context, this.hoverStroke);
    } else {
        this.draw(context, this.stroke);
    }
    return (this);
}

BULANCI.RoundedButton.prototype.highlight = function (context, x, y) {
    this.x = x || this.x;
    this.y = y || this.y;
    this.draw(context, 'orange');
    return (this);
}

BULANCI.RoundedButton.prototype.draw = function (context, stroke) {
    if(!this.hide) {
        context.save();
        context.beginPath();
        context.moveTo(this.x + this.radius, this.y);
        context.lineTo(this.x + this.width - this.radius, this.y);
        context.quadraticCurveTo(this.x + this.width, this.y, this.x + this.width, this.y + this.radius);
        context.lineTo(this.x + this.width, this.y + this.height - this.radius);
        context.quadraticCurveTo(this.x + this.width, this.y + this.height, this.x + this.width - this.radius, this.y + this.height);
        context.lineTo(this.x + this.radius, this.y + this.height);
        context.quadraticCurveTo(this.x, this.y + this.height, this.x, this.y + this.height - this.radius);
        context.lineTo(this.x, this.y + this.radius);
        context.quadraticCurveTo(this.x, this.y, this.x + this.radius, this.y);
        context.fillStyle = this.fill;
        context.strokeStyle = stroke || this.stroke;
        context.lineWidth = 2;
        context.stroke();
        context.fill();

        // font
        context.font = this.font;
        context.fillStyle = this.textColor;
        context.fontWeight = this.fontWeight;
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2);

        context.restore();
    }
}