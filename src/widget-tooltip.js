var tooltipWidth = 60;
var tooltipTextSize = 18;
var tooltipBgColour = cc.color(255, 255, 255, 108);
so.Tooltip = cc.Node.extend({
    ctor: function (texts) {
        cc.Node.prototype.ctor.call(this);
        var size = cc.size(tooltipWidth, tooltipTextSize * texts.length / 2);
        this.setContentSize(size);
        this.setAnchorPoint(cc.p(0, 0));
        var painter = new cc.DrawNode();
        painter.setContentSize(size);
        painter.setAnchorPoint(cc.p(0, 0));
        painter.drawRect(cc.p(0, 0), cc.p(size.width, size.height), tooltipBgColour);
        this.addChild(painter, 0);
        for (var i = 0; i < texts.length / 2; i++) {
            var label = new cc.LabelTTF(texts[i + i], 'Arial', tooltipTextSize);
            label.setColor(texts[i + i + 1]);
            label.setAnchorPoint(cc.p(0, 1));
            label.setNormalizedPosition(cc.p(0, 1 - i / (texts.length / 2)));
            this.addChild(label);
        }
    }
});
