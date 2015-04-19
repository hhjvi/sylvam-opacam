// The 'scale' here is a noun instead of a verb. (比例尺 in Chinese)
var scaleWidth = 120;
var scaleHeight = 120;
var scaleMaxSegWidth = 108;
var scaleLineWidth = 3;
var scaleLineColour = cc.color(192, 192, 192);
so.Scale = cc.Node.extend({
    _painter: null,
    _label: null,
    ctor: function () {
        this._super();
        this._painter = new cc.DrawNode();
        this._painter.setPosition(cc.p(6, scaleHeight - 12));
        this.addChild(this._painter);
        this._label = new cc.LabelTTF('1 ly', 'Karla', 18);
        this._label.setAnchorPoint(cc.p(0, 1));
        this._label.setPosition(cc.p(4, scaleHeight - 24));
        this.addChild(this._label);
        this.setContentSize(cc.size(scaleWidth, scaleHeight));
    },
    // Refreshes the display.
    // Argument scale shows the pixel/light year ratio (default is 100 - see boot.js).
    dispScale: function (scale) {
        this._painter.clear();
        var maxUnit = scaleMaxSegWidth / scale, tenpow = 1;
        while (maxUnit < 1) { maxUnit *= 10; tenpow /= 10; }
        while (maxUnit > 10) { maxUnit /= 10; tenpow *= 10; }
        // Creepy floating point precision... 0.1 * 7 = 0.7000000000000001
        var finalUnit = Math.floor(maxUnit) * tenpow,
            x = finalUnit / (maxUnit * tenpow) * scaleMaxSegWidth;
        var str = finalUnit.toString();
        if (finalUnit < 1) {
            str = tenpow.toString();
            str = str.substr(0, str.length - 1)
                + String.fromCharCode(Math.floor(maxUnit) + 48);
        }
        this._label.setString(str + ' ly');
        this._painter.drawSegment(cc.p(0, 0), cc.p(x, 0), scaleLineWidth, scaleLineColour);
        this._painter.drawSegment(cc.p(0, -6), cc.p(0, 6), scaleLineWidth, scaleLineColour);
        this._painter.drawSegment(cc.p(x, -6), cc.p(x, 6), scaleLineWidth, scaleLineColour);
    }
});
