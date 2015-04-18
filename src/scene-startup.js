so.StartupScene = cc.Scene.extend({
    _mapLayer: null,
    _scale: null,
    _timeDisp: null,
    onEnter: function () {
        this._super();
        var size = cc.director.getVisibleSize();
        mapLayer = new so.MapLayer();
        mapLayer.setContentSize(cc.size(0, 0));
        mapLayer.setVisibleCentre(0, 0);
        this.addChild(mapLayer);
        so.enableTooltip(mapLayer);
        this._mapLayer = mapLayer;

        this.initControl();
        this.initMap();
        
        // Let's rock!!
        cc.director.getScheduler().scheduleCallbackForTarget(this, this.step, 0.5);
    },
    initControl: function () {
        var _parent = this;
        // The drag & drop mover
        cc.eventManager.addListener({
            event: cc.EventListener.MOUSE,
            _dragging: false,
            _moveTarget: _parent._mapLayer,
            onMouseDown: function (e) {
                this._dragging = true;
            },
            onMouseMove: function (e) {
                if (!this._dragging) return;
                this._moveTarget.setVisibleCentre(
                    this._moveTarget.getVisibleCentreX() - e.getDeltaX(),
                    this._moveTarget.getVisibleCentreY() - e.getDeltaY());
            },
            onMouseUp: function (e) {
                this._dragging = false;
            }
        }, this._mapLayer);
        // The scale
        var scale = new so.Scale();
        scale.dispScale(so.ly2pix);
        scale.setAnchorPoint(cc.p(0, 1));
        scale.setNormalizedPosition(cc.p(0, 1));
        this.addChild(scale);
        this._scale = scale;
        // The buttons for zooming
        var zoomInBtn = new cc.MenuItemImage(
            so.res.img_zoom_in, so.res.img_zoom_in_sel, function () { _parent.zoomIn(); });
        zoomInBtn.setAnchorPoint(cc.p(0, 1));
        zoomInBtn.setScale(0.5);
        zoomInBtn.setPosition(cc.p(140, so.size.height - 6));
        var zoomOutBtn = new cc.MenuItemImage(
            so.res.img_zoom_out, so.res.img_zoom_out_sel, function () { _parent.zoomOut(); });
        zoomOutBtn.setAnchorPoint(cc.p(0, 1));
        zoomOutBtn.setScale(0.5);
        zoomOutBtn.setPosition(cc.p(182, so.size.height - 6));
        var menu = new cc.Menu(zoomInBtn, zoomOutBtn);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);
        // The time display
        var timeDisp = new cc.LabelTTF('0 mon', 'Arial', 20);
        timeDisp.setAnchorPoint(cc.p(0, 0));
        timeDisp.setPosition(cc.p(66, 24));
        this.addChild(timeDisp);
        this._timeDisp = timeDisp;
    },
    _player: null,
    _lcone: null,
    _solarSys: [],
    initMap: function () {
        var player = new so.Circle(10, cc.color(128, 192, 255));
        player.setPosition(cc.p(0, 0));
        this._mapLayer.addMapPoint(player, 10);
        var playerTooltip = new so.Tooltip(['Cygnia', cc.color(128, 192, 255), 'Player', cc.color.BLACK]);
        so.putTooltip(this._mapLayer, player, player.getBLCorner(), player.getCircleSize(), playerTooltip);
        this._player = player;
        var lcone = new so.Circle(1, cc.color(0, 0, 48));
        lcone.setPosition(cc.p(0, 0));
        this._mapLayer.addMapRegion(lcone, 0);
        this._lcone = lcone;
        for (var i = 0; i < 10; i++) {
            var s = new so.Circle(i, cc.color(255, 64, 0));
            s.setPosition(cc.p(40 * i - 140, 15 * i - 88));
            s.setVisible(false);
            this._mapLayer.addMapPoint(s);
            var tt = new so.Tooltip(['Solar #' + i, cc.color(255, 64, 0), 'Ordinary', cc.color.WHITE]);
            so.putTooltip(this._mapLayer, s, s.getBLCorner(), s.getCircleSize(), tt);
            this._solarSys.push({
                x: (40 * i - 140) / so.ly2pix, y: (15 * i - 88) / so.ly2pix, node: s
            });
        }
        for (var i in this._solarSys) {
            this._solarSys[i].distSq =
                this._solarSys[i].x * this._solarSys[i].x +
                this._solarSys[i].y * this._solarSys[i].y;
        }
        console.log(this._solarSys);
    },

    _mapScale: 1,
    zoomIn: function () {
        this._mapScale *= Math.sqrt(2);
        this._mapLayer.setVisibleScale(this._mapScale);
        this._scale.dispScale(this._mapScale * so.ly2pix);
    },
    zoomOut: function () {
        this._mapScale /= Math.sqrt(2);
        this._mapLayer.setVisibleScale(this._mapScale);
        this._scale.dispScale(this._mapScale * so.ly2pix);
    },

    _monCnt: 0,
    _lconeRadius: 0,
    // One tick is 2 months.
    tick: function () {
        this._monCnt++;
        this._lconeRadius += 1 / 6;
    },
    refreshDisp: function () {
        this._lcone.setScale(this._lconeRadius * this._mapScale * so.ly2pix);
        var y = (this._monCnt - this._monCnt % 12) / 12, m = this._monCnt % 12;
        this._timeDisp.setString(
            y.toString() + (y === 1 ? ' yr ' : ' yrs ') + m.toString() + ' mon');
        for (var i in this._solarSys) {
            this._solarSys[i].node.setVisible(
                this._solarSys[i].distSq <= this._lconeRadius * this._lconeRadius);
        }
    },
    // Called every half second.
    step: function () {
        this.tick();
        this.refreshDisp();
    }
});
