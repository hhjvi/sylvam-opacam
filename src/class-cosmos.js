so.arrayRemove = function (a, e) {
    var idx = a.indexOf(e);
    if (idx === a.length - 1) a.pop();
    else a[idx] = a.pop();
};

so.Cosmos = function (solarDestroyCallback, civDestroyCallback, callbackTarget) {
    var r = {
        solarDestroyCallback: solarDestroyCallback,
        civDestroyCallback: civDestroyCallback,
        callbackTarget: callbackTarget,
        monCnt: 0,
        solars: [],
        civils: [],
        flyers: [],
        dimDcrsrs: [],
        _newlyReachedSpccrafts: [],
        _newlyReachedMassPts: [],
        _newlyReachedDimDcrsrs: []
    };
    r.solars[0] = so.SolarSystem(r, 'Nova Terra', cc.color(128, 192, 255), 0, 0, 10);
    r.solars[0].civil = 0;
    r.civils[0] = so.Civilization('Cygnia', 'Player', cc.color(128, 192, 255));
    r.civils[0].solars[0] = 0;
    r.civils[0].resource = so.resourceSeed;

    r.initMap = so.Cosmos.initMap;
    r.tick = so.Cosmos.tick;
    r.destroySolarSys = so.Cosmos.destroySolarSys;

    return r;
};

so.Cosmos.tick = function () {
    this.monCnt++;
    for (var i in this.civils) this.civils[i].tick();
    for (var i in this.flyers) this.flyers[i].tick();
    for (var i in this.dimDcrsrs) {
        var curd = this.dimDcrsrs[i];
        for (var j in this.solars)
            if (cc.pLengthSQ(cc.p(curd.x - this.solars[j].x,
                    curd.y - this.solars[j].y)) < curd.radius * curd.radius) {
                this.destroySolarSys(j);
            }
        for (var j in this.flyers)
            if (!this.flyers[j].isDimDcrsr && cc.pLengthSQ(cc.p(curd.x - this.flyers[j].x,
                    curd.y - this.flyers[j].y)) < curd.radius * curd.radius) {
                var f = this.flyers[j];
                if (f.isSpacecraft) {
                    var spccrfts = this.civils[f.civil].spacecrafts;
                    if (spccrfts.length === 1) {
                        this.civils[f.civil].spacecrafts = [];
                        if (this.civils[f.civil].solars.length === 0) {
                            var destroyedCivName = this.civils[f.civil].name;
                            delete this.civils[f.civil];
                            this.civDestroyCallback.call(this.callbackTarget, destroyedCivName);
                        }
                    } else so.arrayRemove(spccrfts, f);
                }
                delete this.flyers[j];
            }
    }
    while (this._newlyReachedSpccrafts.length > 0) {
        var f = this._newlyReachedSpccrafts.pop();
        if (this.solars[f.destSolarIdx].civil === -1) {
            this.solars[f.destSolarIdx].civil = f.civil;
            this.civils[f.civil].resource += this.solars[f.destSolarIdx].resource;
            this.civils[f.civil].solars.push(f.destSolarIdx);
            this.solars[f.destSolarIdx].resource = 0;
            var spccrfts = this.civils[f.civil].spacecrafts;
            so.arrayRemove(spccrfts, f);
        }
        f.callback.call(f.target, f.id);
        if (this.flyers.length === 1) this.flyers = [];
        else {
            this.flyers[f.id] = this.flyers.pop();
            this.flyers[f.id].id = f.id;
        }
    }
    while (this._newlyReachedMassPts.length > 0) {
        var m = this._newlyReachedMassPts.pop();
        this.destroySolarSys(m.destSolarIdx);
        // If targetCiv !== undefined then a civilization has been destroyed
        m.callback.call(m.target, m.id);
        if (this.flyers.length === 1) this.flyers = [];
        else {
            this.flyers[m.id] = this.flyers.pop();
            this.flyers[m.id].id = m.id;
        }
    }
    while (this._newlyReachedDimDcrsrs.length > 0) {
        var d = this._newlyReachedDimDcrsrs.pop();
        d.x = d.destx, d.y = d.desty;
        d.radius = 0;
        d.tick = function () { this.radius += 1 / 12; };
        this.dimDcrsrs.push(d);
    }
};

so.Cosmos.initMap = function () {
    for (var i = 0; i < 10; i++)
        this.solars.push(so.SolarSystem(
            this, 'Solar System ' + i, undefined,
            (40 * i - 140) / so.ly2pix, (15 * i - 88) / so.ly2pix, i + 5, i * 10));
};

so.Cosmos.destroySolarSys = function (solarIdx) {
    var targetCiv = this.solars[solarIdx].civil, destroyedCivName;
    delete this.solars[solarIdx];
    //if (targetCiv !== -1) console.log(this.civils[targetCiv].solars);
    if (targetCiv === -1) { // Do nothing. Just destroyed a solar system.
    } else if (this.civils[targetCiv].solars.length === 1) {
        if (this.civils[targetCiv].spacecrafts.length === 0) {
            // Civilization destroyed!!
            destroyedCivName = this.civils[targetCiv].name;
            delete this.civils[targetCiv];
        } else {
            this.civils[targetCiv].solars = [];
        }
    } else for (var i in this.civils[targetCiv].solars)
        if (this.civils[targetCiv].solars[i] == solarIdx) {
            this.civils[targetCiv].solars[i] = this.civils[targetCiv].solars.pop();
            break;
        }
    //if (targetCiv !== -1) console.log(this.civils[targetCiv].solars, solarIdx);
    this.solarDestroyCallback.call(this.callbackTarget, solarIdx);
    if (destroyedCivName)
        this.civDestroyCallback.call(this.callbackTarget, destroyedCivName);
}
