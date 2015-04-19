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
    r.tick_AI = so.Cosmos.tick_AI;
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
            so.arrayRemove(this.flyers, this.flyers[f.id]);
            if (this.flyers.length > f.id) this.flyers[f.id].id = f.id;
        }
    }
    while (this._newlyReachedMassPts.length > 0) {
        var m = this._newlyReachedMassPts.pop();
        this.destroySolarSys(m.destSolarIdx);
        // If targetCiv !== undefined then a civilization has been destroyed
        m.callback.call(m.target, m.id);
        if (this.flyers.length === 1) this.flyers = [];
        else {
            so.arrayRemove(this.flyers, this.flyers[m.id]);
            if (this.flyers.length > m.id) this.flyers[m.id].id = m.id;
        }
    }
    while (this._newlyReachedDimDcrsrs.length > 0) {
        var d = this._newlyReachedDimDcrsrs.pop();
        d.x = d.destx, d.y = d.desty;
        d.radius = 0;
        d.tick = function () { this.radius += 1 / 12; };
        this.dimDcrsrs.push(d);
    }

    this.tick_AI();
};

var randomLetter = function () {
    return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
};
// Gives a random integer in [0, upperbound).
var randomInt = function (upperbound) {
    return Math.floor(Math.random() * upperbound);
};
var randomColour = function () {
    return cc.color(randomInt(256), randomInt(256), randomInt(256));
};
so.Cosmos.randomStarName = function () {
    if (Math.random() <= 1 / 5) {
        return randomLetter() + randomLetter() + '-' + randomInt(1000);
    } else if (Math.random() <= 1 / 4) {
        return randomLetter() + randomLetter().toLowerCase() +
            randomLetter().toLowerCase() + randomInt(20);
    } else if (Math.random() <= 1 / 3) {
        return randomLetter() + randomInt(100) + '-' + randomLetter().toLowerCase();
    } else if (Math.random() <= 1 / 2) {
        return 'K' + (randomInt(8000) + 2000);
    } else {
        return randomLetter().toLowerCase() + '-' + randomInt(50) + '-' + randomInt(10);
    }
};
so.Cosmos.randomBadge = function () {
    var x = Math.random();
    if (x < 0.1) return 'Fire Lover';
    else if (x < 0.2) return 'Optimist';
    else return 'Ordinary';
};

so.Cosmos.initMap = function () {
    // Generate 200 stars in the area of 400 ly * 400 ly
    // Average distance between stars is about 400 / sqrt(200) = ~28 ly.
    for (var i = 0; i < 195; i++)
        this.solars.push(so.SolarSystem(
            this, so.Cosmos.randomStarName(), undefined,
            Math.random() * 400 - 200, Math.random() * 400 - 200,
            Math.random() * 10 + 5, Math.floor(Math.random() * 4500) + 500));
    for (var i = 196; i < 200; i++)
        this.solars.push(so.SolarSystem(
            this, so.Cosmos.randomStarName(), undefined,
            Math.random() * 10 - 5, Math.random() * 10 - 5,
            Math.random() * 10 + 5, Math.floor(Math.random() * 4500) + 500));

    // Generate 30 civilizations.
    for (var i = 1; i <= 30; i++) {
        this.civils[i] = so.Civilization('Civ ' + i, so.Cosmos.randomBadge(), randomColour());
        do {
            this.civils[i].solars[0] = randomInt(200) + 1;
        } while (this.solars[this.civils[i].solars[0]].civil !== -1);
        this.solars[this.civils[i].solars[0]].civil = i;
        this.civils[i].resource = this.solars[this.civils[i].solars[0]].resource;
    }
};

so.Cosmos.destroySolarSys = function (solarIdx) {
    if (!this.solars[solarIdx]) return; // A strange patch...
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
    } else so.arrayRemove(this.civils[targetCiv].solars, solarIdx);
    //if (targetCiv !== -1) console.log(this.civils[targetCiv].solars, solarIdx);
    this.solarDestroyCallback.call(this.callbackTarget, solarIdx);
    if (destroyedCivName)
        this.civDestroyCallback.call(this.callbackTarget, destroyedCivName);
}
