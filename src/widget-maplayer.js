so.MapLayer = cc.Layer.extend({
    _visCentX: 0, _visCentY: 0,
    _visScale: 1,
    _mapChildren: [],   // These don't always scale with the map...
    _mapRegions: [],    // ... while these do.
    _clickableChildren: [],
    _firstChildOrigPos: null,
    _clickCallback: null, _target: null,
    ctor: function (clickCallback, target) {
        this._super();
        this._clickCallback = clickCallback;
        this._target = target;
    },
    addMapPoint: function (child, clickable) {
        if (this._mapChildren.length === 0)
            this._firstChildOrigPos = child.getPosition();
        this._mapChildren.push(child);
        if (clickable) this._clickableChildren.push(child);
        cc.Layer.prototype.addChild.apply(this, arguments);
    },
    addMapRegion: function (child) {
        this._mapRegions.push(child);
        this.addMapPoint(child);
        child._so_isMapRegion = true;
    },
    convertToMapRegion: function (child, cleanup) {
        if (!child._so_isMapRegion && this._mapRegions.indexOf(child) === -1) {
            this._mapRegions.push(child);
            child.setScale(child.getScale() * this._visScale);
            child._so_isMapRegion = true;
        }
    },

    getVisibleCentre: function () {
        return cc.p(this._visCentX, this._visCentY);
    },
    getVisibleCentreX: function () { return this._visCentX; },
    getVisibleCentreY: function () { return this._visCentY; },
    setVisibleCentre: function (x, y) {
        this.setPosition(cc.p(-x + so.size.width * 0.5, -y + so.size.height * 0.5));
        this._visCentX = x; this._visCentY = y;
    },
    setVisibleScale: function (scale) {
        var diffScale = scale / this._visScale;
        var centre = cc.p(this._visCentX, this._visCentY);
        for (var i in this._mapChildren) {
            var p = this._mapChildren[i].getPosition();
            this._mapChildren[i].setPosition(cc.pAdd(p, cc.pMult(cc.pSub(centre, p), 1 - diffScale)));
        }
        for (var i in this._mapRegions) {
            this._mapRegions[i].setScale(this._mapRegions[i].getScale() * diffScale);
        }
        this._visScale = scale;
    },
    click: function (p) {
        p = this.convertToNodeSpace(p);
        var selIdx = -1;    // The selected node's index in _clickableChildren
        // Check whether is clicking on a solar system
        for (var i in this._clickableChildren) {
            var c = this._clickableChildren[i], pp, ss;
            pp = c.getBLCorner(), ss = c.getCircleSize();
            if (p.x > pp.x && p.x < pp.x + ss.width
                    && p.y > pp.y && p.y < pp.y + ss.height) {
                // p = c.getPosition() === pp + (radius, radius)
                p = c.getPosition(); selIdx = parseInt(i); break;
            }
        }
        p = cc.pMult(
            cc.pAdd(p, cc.pSub(this._firstChildOrigPos, this._mapChildren[0].getPosition())),
            1 / this._visScale);
        if (this._clickCallback) this._clickCallback.call(this._target, p, selIdx);
    },
    clickableChild: function (idx) {
        return this._clickableChildren[idx];
    },
    // Testing:
    // m=cc.director.getRunningScene()._mapLayer; x=new so.Circle(5, cc.color.WHITE); m.addChild(x, 9999)
    at: function (x, y) {
        return cc.pAdd(
            cc.pMult(cc.p(x - this._firstChildOrigPos.x, y - this._firstChildOrigPos.y), this._visScale),
            this._mapChildren[0].getPosition());
    }
});
