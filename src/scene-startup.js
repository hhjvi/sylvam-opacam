var timeflowRates = [0, 1, 3, 6, 12, 30, 60];   // <- This is constant
var dblclickMinIntv = 500;  // In milliseconds
so.StartupScene = cc.Scene.extend({
    _mapLayer: null,
    _scale: null,
    _timeflowDisp: null,
    _timeDisp: null,
    _devBar: null,
    _devPanel: null,
    _resDisp: null, _stbltDisp: null,
    _notificator: null,
    _launcher: null, _launchMarker: null,
    onEnter: function () {
        this._super();
        var size = cc.director.getVisibleSize();
        mapLayer = new so.MapLayer(this.mapClick, this);
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
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            _dragging: false, _dragMoved: true, // Prevent accident MouseUps
            _moveTarget: _parent._mapLayer,
            swallowTouches: true,
            onTouchBegan: function (e) {
                this._dragging = true;
                this._dragMoved = false;
                return true;
            },
            onTouchMoved: function (e) {
                if (!this._dragging) return;
                this._dragMoved = true;
                this._moveTarget.setVisibleCentre(
                    this._moveTarget.getVisibleCentreX() - e.getDelta().x,
                    this._moveTarget.getVisibleCentreY() - e.getDelta().y);
            },
            onTouchEnded: function (e) {
                this._dragging = false;
                if (!this._dragMoved) {
                    this._moveTarget.click(e.getLocation());
                    this._dragMoved = true;
                }
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
        // The time-flow control
        var tfc = new cc.MenuItemSprite(
            new so.ContentCircle(30, cc.color(255, 255, 255, 192)),
            new so.ContentCircle(30, cc.color(192, 192, 192, 192)),
            this.timeflowToggle, this);
        tfc.setAnchorPoint(cc.p(0, 0));
        tfc.setPosition(cc.p(0, 0));
        // ... along with the label
        var tfd = new cc.LabelTTF('x1', 'Karla', 30);
        tfd.setAnchorPoint(cc.p(0.5, 0.5));
        tfd.setPosition(30, 26);
        tfd.setColor(cc.color.BLACK);
        tfc.addChild(tfd);
        this._timeflowDisp = tfd;
        var menu = new cc.Menu(zoomInBtn, zoomOutBtn, tfc);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);
        // The time display
        var timeDisp = new cc.LabelTTF('0 yrs 0 mon', 'Karla', 20);
        timeDisp.setAnchorPoint(cc.p(0, 0));
        timeDisp.setPosition(cc.p(66, 24));
        this.addChild(timeDisp);
        this._timeDisp = timeDisp;
        // The development control panel
        var devpnl = new so.DevCtrlPanel(this.adjustDevPace, this);
        devpnl.setPosition(cc.p(0, -dcpFadeInOffset));
        devpnl.setVisible(false);
        this.addChild(devpnl, 1);
        this._devPanel = devpnl;
        // The development display bar
        var devbar = new so.DevBar(devpnl.show, devpnl);
        devbar.setCapacity(so.balanceBase);
        devbar.setAnchorPoint(cc.p(0, 0));
        devbar.setPosition(cc.p(66, 2));
        this.addChild(devbar, 0);
        this._devBar = devbar;
        // The resource and stability display
        var rd = new cc.LabelTTF('Res. ' + so.resourceSeed.toString() + '.0', 'Karla', 20);
        rd.setAnchorPoint(cc.p(1, 0));
        rd.setPosition(cc.p(so.size.width - 4, 24));
        this.addChild(rd);
        this._resDisp = rd;
        var sd = new cc.LabelTTF('Stab. 100.0', 'Karla', 20);
        sd.setAnchorPoint(cc.p(1, 1));
        sd.setPosition(cc.p(so.size.width - 4, 24));
        sd.setColor(cc.color.GREEN);
        this.addChild(sd);
        this._stbltDisp = sd;
        // The notification display
        var ntf = new so.Notificator();
        ntf.setPosition(cc.p(0, 60));
        this.addChild(ntf);
        this._notificator = ntf;
        // The launch controller
        var lchr = new so.Launcher(this.launchClick, this);
        lchr.setAnchorPoint(cc.p(1, 1));
        lchr.setNormalizedPosition(cc.p(1, 1));
        this.addChild(lchr);
        this._launcher = lchr;
        // The launch marker
        var lmrk = new so.Circle(30, cc.color(255, 255, 0, 64));
        lmrk.setVisible(false);
        this.addChild(lmrk);
        this._launchMarker = lmrk;
    },
    _cosmos: null,
    _lcone: null,
    _solarNodes: [],
    _flyerNodes: [],
    initMap: function () {
        this._cosmos = so.Cosmos(this.solarCrash, this.civilCrash, this);
        this._cosmos.initMap();
        so.Cosmos.tick_AI.scene = this;
        var lcone = new so.Circle(1, cc.color(0, 0, 48));
        lcone.setPosition(cc.p(0, 0));
        this._mapLayer.addMapRegion(lcone, 0);
        this._lcone = lcone;

        for (var i in this._cosmos.solars) {
            var s = this._cosmos.solars[i];
            var slrDisp = new so.Circle(s.radius, s.colour);
            slrDisp.setPosition(cc.p(s.x * so.ly2pix, s.y * so.ly2pix));
            slrDisp.setVisible(false);
            this._mapLayer.addMapPoint(slrDisp, true);  // Can be selected as a fixed point
            so.putTooltip(this._mapLayer, slrDisp,
                slrDisp.getBLCorner(), slrDisp.getCircleSize(), s.getTooltip());
            slrDisp.bindedSolarSys = i;
            slrDisp.glow = new so.Circle(s.radius + 3, cc.color(0, 0, 0, 0));
            slrDisp.addChild(slrDisp.glow, -1);
            this._solarNodes[i] = slrDisp;
        }
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
    _idxToLaunch: -1,
    launchClick: function (idx) {
        if (this._idxToLaunch === idx) {    // Cancelling
            this._idxToLaunch = -1;
            this._notificator.addNotification('Launch cancelled');
            this._launchMarker.setVisible(false);
        } else {
            this._idxToLaunch = idx;
            this._notificator.addNotification('Select your starting point, click again to cancel');
            this._launchMarker.setVisible(true);
            this._launchMarker.setPosition(this._launcher.getLaunchButtonCentre(idx));
            this._selectedSrc = null;
        }
    },
    _selectedSrc: null,
    mapClick: function (p, idx) {
        if (this._idxToLaunch === -1) return;
        var selSolarIdx, selSolarSys;
        if (idx >= 0) {
            selSolarIdx = this._mapLayer.clickableChild(idx).bindedSolarSys;
            selSolarSys = this._cosmos.solars[selSolarIdx];
        }
        switch (this._idxToLaunch) {
        case 0: // Spacecraft
            if (idx === -1) return;
            if (!this._selectedSrc) {
                if (selSolarSys.civil === 0) {
                    this._selectedSrc = cc.pMult(p, 1 / so.ly2pix);
                    this._notificator.addNotification('Select your destination');
                }
                return;
            }
            console.log(this._selectedSrc);
            var sc = so.Spacecraft(this._cosmos, 0, this._cosmos.civils[0].devLevels[2],
                this._selectedSrc, cc.p(selSolarSys.x, selSolarSys.y), this.spacecraftArrive, this);
            sc.id = this._cosmos.flyers.push(sc) - 1;
            sc.destSolarIdx = selSolarIdx;
            var scDisp = new so.Circle(8, cc.color.YELLOW);
            scDisp.setPosition(
                this._mapLayer.at(this._selectedSrc.x * so.ly2pix),
                this._mapLayer.at(this._selectedSrc.y * so.ly2pix));
            this._mapLayer.addMapPoint(scDisp, 9999);
            this._flyerNodes[sc.id] = scDisp;
            this._notificator.addNotification(
                'Spacecraft [' + sc.name + '] sent to ' + selSolarSys.name,
                cc.color(255, 255, 96));
            this._selectedSrc = null; break;
        case 1: // Mass Point
            if (idx === -1) return;
            if (!this._selectedSrc) {
                if (selSolarSys.civil === 0) {
                    this._selectedSrc = cc.pMult(p, 1 / so.ly2pix);
                    this._notificator.addNotification('Select your destination');
                    this._cosmos.civils[0].resource -= 200;
                }
                return;
            }
            var mp = so.MassPoint(this._cosmos, 0,
                this._selectedSrc, cc.p(selSolarSys.x, selSolarSys.y), this.massPtArrive, this);
            mp.id = this._cosmos.flyers.push(mp) - 1;
            mp.destSolarIdx = selSolarIdx;
            var mpDisp = new so.Circle(2, cc.color(192, 0, 0));
            mpDisp.setPosition(
                this._mapLayer.at(this._selectedSrc.x * so.ly2pix),
                this._mapLayer.at(this._selectedSrc.y * so.ly2pix));
            this._mapLayer.addMapPoint(mpDisp, 9999);
            this._flyerNodes[mp.id] = mpDisp;
            this._notificator.addNotification(
                'Mass Point sent to ' + selSolarSys.name, cc.color(192, 0, 0));
            this._cosmos.civils[0].resource -= 1000;
            this._selectedSrc = null; break;
        case 2: // 3->2 Dimension Decreaser
            if (!this._selectedSrc) {
                if (idx !== -1 && selSolarSys.civil === 0) {
                    this._selectedSrc = cc.pMult(p, 1 / so.ly2pix);
                    this._notificator.addNotification('Select your destination');
                }
                return;
            }
            var dc = so.DimDcrsr(this._cosmos, 0,
                this._selectedSrc, cc.p(p.x / so.ly2pix, p.y / so.ly2pix));
            dc.id = this._cosmos.flyers.push(dc) - 1;
            var dcDisp = new so.Circle(2, cc.color(64, 0, 192));
            dcDisp.setPosition(
                this._mapLayer.at(this._selectedSrc.x * so.ly2pix),
                this._mapLayer.at(this._selectedSrc.y * so.ly2pix));
            this._mapLayer.addMapPoint(dcDisp, 9999);
            this._flyerNodes[dc.id] = dcDisp;
            this._notificator.addNotification('Dimension Decreaser sent', cc.color(64, 0, 192));
            this._cosmos.civils[0].resource -= 3000;
            this._selectedSrc = null; break;
        }
        this._idxToLaunch = -1;
        this._launchMarker.setVisible(false);
    },
    spacecraftArrive: function (id) {
        this._notificator.addNotification(
            '[' + this._cosmos.flyers[id].name + '] reached its destination.',
            cc.color(255, 255, 96));
        var destSolarIdx = this._cosmos.flyers[id].destSolarIdx;
        var slrDisp = this._solarNodes[destSolarIdx];
        so.refreshTooltip(this._mapLayer, slrDisp,
            slrDisp.getBLCorner(), slrDisp.getCircleSize(),
            this._cosmos.solars[destSolarIdx].getTooltip());
        // Remove the flyer node. The flyer object will be removed by the cosmos class.
        this.removeFlyerNode(id);
    },
    massPtArrive: function (id) {
        this._notificator.addNotification(
            'A mass point reached its destination.', cc.color(192, 0, 0));
        var destSolarIdx = this._cosmos.flyers[id].destSolarIdx;
        var slrDisp = this._solarNodes[destSolarIdx];
        so.removeTooltip(this._mapLayer, slrDisp);
        slrDisp.removeFromParent();
        this.removeFlyerNode(id);
    },
    removeFlyerNode: function (id) {
        this._flyerNodes[id].removeFromParent();
        so.arrayRemove(this._flyerNodes, this._flyerNodes[id]);
    },
    solarCrash: function (solarIdx) {
        so.removeTooltip(this._mapLayer, this._solarNodes[solarIdx]);
        this._solarNodes[solarIdx].removeFromParent();
    },
    civilCrash: function (civilName) {
        console.log('Civilization [' + civilName + '] has been destroyed!');
        this._notificator.addNotification(
            'Civilization [' + civilName + '] has been destroyed!', cc.color(192, 0, 0));
    },

    _timeflowIdx: 1,    // timeflowRates[_timeflowIdx] is 1x
    _lastTimeflowTapTime: 0,
    _lastTimeflowIdx: -1,   // The flow index before last pause
    timeflowToggle: function () {
        var curtime = (new Date()).getTime();
        if (curtime - this._lastTimeflowTapTime <= dblclickMinIntv) {
            // Double-click!
            if (this._lastTimeflowIdx !== timeflowRates.length - 1)
                this._timeflowIdx = this._lastTimeflowIdx + 1;
            else this._timeflowIdx = this._lastTimeflowIdx;
            curtime = 0;
        } else {
            this._lastTimeflowIdx = this._timeflowIdx;
            this._timeflowIdx = Number(!this._timeflowIdx); // 0 => 1, other => 0
        }
        this._lastTimeflowTapTime = curtime;
        if (this._timeflowIdx === 0)
            this._timeflowDisp.setString('--');
        else
            this._timeflowDisp.setString('x' + timeflowRates[this._timeflowIdx].toString());
    },
    adjustDevPace: function (dev) {
        var c = [], dptot = 0;
        for (var i in dcpItems) {
            var n = dev[dcpItems[i][0]];
            c.push({num: n, colour: dcpItems[i][2]});
            dptot += n;
            this._cosmos.civils[0].devPace[i] = n;
        }
        this._devBar.setContents(c);
        this._cosmos.civils[0].devPaceTot = dptot;
    },

    refreshDisp: function () {
        var mon = this._cosmos.monCnt, lconeRad = mon / 12;
        this._lcone.setScale(lconeRad * this._mapScale * so.ly2pix);
        var y = (mon - mon % 12) / 12, mon = mon % 12;
        this._timeDisp.setString(
            y.toString() + (y === 1 ? ' yr ' : ' yrs ') + mon.toString() + ' mon');
        for (var i in this._cosmos.solars) {
            this._solarNodes[i].setVisible(
                this._cosmos.solars[i].distToOrigSq <= lconeRad * lconeRad);
            if (this._cosmos.solars[i].civil >= 0) {
                this._solarNodes[i].glow.setColour(
                    this._cosmos.civils[this._cosmos.solars[i].civil].colour);
            }
        }
        var cygnia = this._cosmos.civils[0];
        if (!cygnia) this.gameOver('You lost all your planets and spacecrafts.');
        var ss = (cygnia.resource + 0.00625).toString();
        this._resDisp.setString('Res. ' + ss.substr(0, ss.lastIndexOf('.') + 2));
        ss = (cygnia.stability + 0.00625).toString();
        this._stbltDisp.setString('Stab. ' + ss.substr(0, ss.lastIndexOf('.') + 2));
        if (cygnia.stability >= 80) this._stbltDisp.setColor(cc.color.GREEN);
        else if (cygnia.stability >= 60) this._stbltDisp.setColor(cc.color.YELLOW);
        else if (cygnia.stability >= 40) this._stbltDisp.setColor(cc.color(255, 128, 0));
        else this._stbltDisp.setColor(cc.color.RED);
        // Check whether the game is over.
        if (cygnia.resource <= 0) this.gameOver('You ran out of resources.');
        else if (cygnia.stability <= 0) this.gameOver('The stability is too low.');
        else if (cygnia.devLevels[2] >= 7) this.gameOver('You win. The Cygnians escaped the Dark Forest again.\nCheers!');
        // Refresh level display in the panel
        this._devBar.setCapacity(so.balanceBase + cygnia.devLevelsTot);
        for (var i in dcpItems)
            this._devPanel.updateLevelLabel(i, cygnia.devLevels[i], cygnia.upgradeProgress[i]);
        // Display level up messages
        while (cygnia.lastLevelUp.length > 0) {
            var upIdx = cygnia.lastLevelUp.pop();
            this._notificator.addNotification(
                dcpItems[upIdx][1] + ' upgraded to level ' + cygnia.devLevels[upIdx],
                dcpItems[upIdx][2]);
        }
        // Check the availability of those unconventional weapons.
        // 2 is the index of Basic Science Dev. Level.
        for (var i in so.res.launch)
            this._launcher._launchBtns[i]
                .setVisible(cygnia.devLevels[2] >= so.launchRequirement[i]);
        // Update the map
        for (var i in this._cosmos.flyers) {
            var f = this._cosmos.flyers[i];
            this._flyerNodes[f.id].setPosition(this._mapLayer.at(f.x * so.ly2pix, f.y * so.ly2pix));
            if (f.radius) {
                // A Dimension Decreaser OwO
                this._mapLayer.convertToMapRegion(this._flyerNodes[f.id]);
                this._flyerNodes[f.id].setRadius(f.radius * so.ly2pix);
            }
        }
    },
    // Called every half second.
    step: function () {
        for (var i = 0; i < timeflowRates[this._timeflowIdx]; i++) this._cosmos.tick();
        this.refreshDisp();
    },

    gameOver: function (text) {
        cc.director.getScheduler().unscheduleCallbackForTarget(this, this.step);
        var l = new cc.LayerColor(cc.color(0, 0, 0, 216));
        this.addChild(l);
        var lbl = new cc.LabelTTF('Game Over\n' + text, 'Karla', 40);
        lbl.setNormalizedPosition(cc.p(0.5, 0.6));
        l.addChild(lbl);
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function () { return true; }
        }, l);
    }
});
