so.Cosmos = function () {
    var r = {
        monCnt: 0,
        solars: [],
        civils: [],
        flyers: []
    };
    r.solars[0] = so.SolarSystem('Nova Terra', cc.color(128, 192, 255), 0, 0, 10);
    r.solars[0].civil = 0;
    r.civils[0] = so.Civilization('Cygnia', 'Player');
    r.civils[0].solar = 0;
    r.civils[0].resource = so.resourceSeed;

    r.initMap = so.Cosmos.initMap;
    r.tick = so.Cosmos.tick;

    return r;
};

so.Cosmos.tick = function () {
    this.monCnt++;
    for (var i in this.civils) this.civils[i].tick();
    for (var i in this.flyers) this.flyers[i].tick();
};

so.Cosmos.initMap = function () {
    for (var i = 0; i < 10; i++)
        this.solars.push(so.SolarSystem(
            undefined, undefined,
            (40 * i - 140) / so.ly2pix, (15 * i - 88) / so.ly2pix, i + 5, i * 10));
};
