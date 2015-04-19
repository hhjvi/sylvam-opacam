so.Cosmos = function () {
    var r = {
        monCnt: 0,
        solars: [],
        civils: [],
        flyers: [],
        _newlyReachedSpccrafts: [],
        _newlyReachedMassPts: []
    };
    r.solars[0] = so.SolarSystem(r, 'Nova Terra', cc.color(128, 192, 255), 0, 0, 10);
    r.solars[0].civil = 0;
    r.civils[0] = so.Civilization('Cygnia', 'Player', cc.color(128, 192, 255));
    r.civils[0].solars[0] = 0;
    r.civils[0].resource = so.resourceSeed;

    r.initMap = so.Cosmos.initMap;
    r.tick = so.Cosmos.tick;

    return r;
};

so.Cosmos.tick = function () {
    this.monCnt++;
    for (var i in this.civils) this.civils[i].tick();
    for (var i in this.flyers) this.flyers[i].tick();
    while (this._newlyReachedSpccrafts.length > 0) {
        var f = this._newlyReachedSpccrafts.pop();
        if (this.solars[f.destSolarIdx].civil === -1) {
            this.solars[f.destSolarIdx].civil = f.civil;
            this.civils[f.civil].resource += this.solars[f.destSolarIdx].resource;
            this.civils[f.civil].solars.push(f.destSolarIdx);
            this.solars[f.destSolarIdx].resource = 0;
            var spccrfts = this.civils[f.civil].spacecrafts;
            if (spccrfts.length === 1) this.civils[f.civil].spacecrafts = [];
            else spccrfts[spccrfts.indexOf(f.destSolarIdx)] = spccrfts.pop();
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
        var targetCiv = this.solars[m.destSolarIdx].civil, destroyedCiv;
        delete this.solars[m.destSolarIdx];
        if (targetCiv === -1) { // Do nothing. Just destroyed a solar system.
        } else if (this.civils[targetCiv].solars.length === 1) {
            if (this.civils[targetCiv].spacecrafts.length === 0) {
                // Civilization destroyed!!
                destroyedCiv = this.civils[targetCiv].name;
                delete this.civils[targetCiv];
            } else {
                this.civils[targetCiv].solars = [];
            }
        } else for (var i in this.civils[targetCiv].solars)
            if (this.civils[targetCiv].solars[i] === m.destSolarIdx) {
                this.civils[targetCiv].solars[i] = this.civils[targetCiv].solars.pop();
                break;
            }
        // If targetCiv !== undefined then a civilization has been destroyed
        m.callback.call(m.target, m.id, destroyedCiv);
        if (this.flyers.length === 1) this.flyers = [];
        else {
            this.flyers[m.id] = this.flyers.pop();
            this.flyers[m.id].id = m.id;
        }
    }
};

so.Cosmos.initMap = function () {
    for (var i = 0; i < 10; i++)
        this.solars.push(so.SolarSystem(
            this, 'Solar System ' + i, undefined,
            (40 * i - 140) / so.ly2pix, (15 * i - 88) / so.ly2pix, i + 5, i * 10));
};
