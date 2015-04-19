so.Cosmos = function () {
    var r = {
        monCnt: 0,
        solars: [],
        civils: [],
        flyers: [],
        _newlyReached: []
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
    while (this._newlyReached.length > 0) {
        var f = this._newlyReached.pop();
        if (this.solars[f.destSolarIdx].civil === -1) {
            this.solars[f.destSolarIdx].civil = f.civil;
            this.civils[f.civil].resource += this.solars[f.destSolarIdx].resource;
            this.solars[f.destSolarIdx].resource = 0;
        }
        f.callback.call(f.target, f.id);
        if (this.flyers.length === 1) this.flyers = [];
        else {
            this.flyers[f.id] = this.flyers.pop();
            this.flyers[f.id].id = f.id;
        }
    }
};

so.Cosmos.initMap = function () {
    for (var i = 0; i < 10; i++)
        this.solars.push(so.SolarSystem(
            this, 'Solar System ' + i, undefined,
            (40 * i - 140) / so.ly2pix, (15 * i - 88) / so.ly2pix, i + 5, i * 10));
};
