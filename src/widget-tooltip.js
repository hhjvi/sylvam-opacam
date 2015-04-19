var tooltipWidth = 60;
var tooltipTextSize = 18;
var tooltipLineHeight = 24;
var tooltipPaddingR = 6;
var tooltipBgColour = cc.color(255, 255, 255, 108);
so.Tooltip = cc.Node.extend({
    ctor: function (texts) {
        cc.Node.prototype.ctor.call(this);
        var size = cc.size(tooltipWidth, tooltipLineHeight * texts.length / 2);
        this.setContentSize(size);
        this.setAnchorPoint(cc.p(0, 0));
        var painter = new cc.DrawNode();
        painter.setAnchorPoint(cc.p(0, 0));
        this.addChild(painter, 0);
        var maxWidth = 0;
        for (var i = 0; i < texts.length / 2; i++) {
            var label = new cc.LabelTTF(texts[i + i], 'Arial', tooltipTextSize);
            label.setColor(texts[i + i + 1]);
            label.setAnchorPoint(cc.p(0, 0.5));
            label.setPosition(cc.p(tooltipPaddingR, (1 - (i + i + 1) / texts.length) * size.height));
            this.addChild(label);
            if (label.getContentSize().width > maxWidth)
                maxWidth = label.getContentSize().width;
        }
        painter.drawRect(
            cc.p(0, 0), cc.p(maxWidth + tooltipPaddingR * 2, size.height),
            tooltipBgColour);
    }
});

so.enableTooltip = function (host) {
    host._so_tooltips = [];
    host._so_tooltipLayer = new cc.Layer();
    host.addChild(host._so_tooltipLayer, 2333333);
    cc.eventManager.addListener({
        event: cc.EventListener.MOUSE,
        onMouseMove: function (e) {
            var t = e.getCurrentTarget();
            var p = t.convertToNodeSpace(e.getLocation());
            //console.log(p);
            host._so_tooltipLayer.setPosition(p);
            for (var i in t._so_tooltips) {
                var pp = t._so_tooltips[i];
                //console.log(pp);
                // Stop being affected by the movement of the nodes
                var diffNodePos = cc.pSub(pp.node.getPosition(), pp.initialNodePos);
                pp.tooltip.setVisible(
                    pp.node.isVisible()
                    && p.x >= pp.pos1.x + diffNodePos.x && p.x <= pp.pos2.x + diffNodePos.x
                    && p.y >= pp.pos1.y + diffNodePos.y && p.y <= pp.pos2.y + diffNodePos.y);
            }
        }
    }, host);
};

so.putTooltip = function (host, node, pos, size, tooltip) {
    node._so_tooltipID = host._so_tooltips.length;
    host._so_tooltips.push({
        node: node,
        initialNodePos: node.getPosition(),
        pos1: pos,
        pos2: cc.p(pos.x + size.width, pos.y + size.height),
        tooltip: tooltip
    });
    tooltip.setVisible(false);
    host._so_tooltipLayer.addChild(tooltip);
};

so.refreshTooltip = function (host, node, pos, size, tooltip) {
    var idx = node._so_tooltipID;
    host._so_tooltips[idx].tooltip.removeFromParent();
    host._so_tooltips[idx].tooltip = tooltip;
    host._so_tooltipLayer.addChild(tooltip);
};

so.removeTooltip = function (host, node) {
    var idx = node._so_tooltipID;
    host._so_tooltips[idx].tooltip.removeFromParent();
    delete host._so_tooltips[idx];
};
