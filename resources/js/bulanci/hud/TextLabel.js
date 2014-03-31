
BULANCI.TextLabel = function(x, y, text) {
    this.x = x || 0;
    this.y = y || 0;
    this.text = text || '';
    this.font = font || '20px "Helvetica"';
    this.color = color || 'rgba(230,230,230,1)';
};

BULANCI.TextLabel.prototype.draw = function (context, stroke) {
    // font
    context.font = this.font;
    context.fillStyle = this.color;
    context.fontWeight = '300';
    context.textAlign = 'center';
    context.textBaseline = 'middle';

    context.fillText(this.text, this.x, this.y);
}
