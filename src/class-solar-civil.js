so.SolarSystem = function (cosmos, name, colour, x, y, radius, res) {
    var r = {
        cosmos: cosmos,
        name: name || 'Unnamed Solar System',
        colour: colour || cc.color(255, 64, 0),
        x: x || 0, y: y || 0, radius: radius || 10,
        resource: res || 0,
        civil: -1
    };
    // For calculating the player's light cone faster
    r.distToOrigSq = r.x * r.x + r.y * r.y;
    r.getTooltip = so.SolarSystem.getTooltip;
    return r;
};

so.SolarSystem.getTooltip = function () {
    var args = [this.name, this.colour];
    if (this.civil >= 0) {
        args[2] = this.cosmos.civils[this.civil].name;
        args[3] = this.cosmos.civils[this.civil].colour;
        args[4] = this.cosmos.civils[this.civil].badge;
        args[5] = cc.color.BLACK;
    } else {
        args[2] = 'Vacant, Res. ' + this.resource;
        args[3] = cc.color.WHITE;
    }
    return new so.Tooltip(args);
};

so.Civilization = function (name, badge, colour) {
    var r = {
        name: name || 'Mysteria',
        badge: badge || 'Ordinary',
        solars: [],
        colour: colour || cc.color(255, 0, 64),
        resource: 0,
        devPace: {}, devPaceTot: 0,
        devPoints: {},
        devLevels: {}, devLevelsTot: 0,
        stability: 100,
        spacecrafts: []
    };

    for (var i in dcpItems)
        r.devPace[i] = r.devLevels[i] = r.devPoints[i] = 0;

    r.levelRequirement = so.Civilization.levelRequirement;
    r.energyCoefficient = so.Civilization.energyCoefficient;
    r.energyUpgradeBonus = so.Civilization.energyUpgradeBonus;
    r.tick = so.Civilization.tick;

    if (badge === 'Player') {
        r.lastLevelUp = [], r.upgradeProgress = [];
        r.tick = so.Civilization.tickForPlayer;
    }

    return r;
};

so.Civilization.levelRequirement = function (i, lv) {
    if (i === 0) return ((6 * lv + 350) * lv + 850) * lv;
    else return (450 * lv + 750) * lv;
};
so.Civilization.energyCoefficient = function () {
    // When you get 10000 pts in energy, you get a 10% discount. And that's it.
    return 90000 / (this.devPoints[0] + 90000);
};
so.Civilization.energyUpgradeBonus = function () {
    return 400 * this.devLevels[0];
};

// One tick is 1 month.
so.Civilization.tick = function () {
    this.resource -= (10 + 5 * this.devPaceTot) * this.energyCoefficient();
    this.stability += (so.balanceBase + this.devLevelsTot - this.devPaceTot) * 0.1;
    if (this.stability > 100) this.stability = 100;
    // Let's develop!
    for (var i in dcpItems) {
        this.devPoints[i] += this.devPace[i] * 5;
        var nextReq = this.levelRequirement(i, this.devLevels[i] + 1);
        if (this.devPoints[i] >= nextReq) {
            this.devLevels[i]++; this.devLevelsTot++;
            // If the energy dev. level is going up, we get some resources
            // Since i is a string ('0'), use == instead of ===
            if (i == 0) this.resource += this.energyUpgradeBonus();
        }
    }
};
// Record more information for displaying.
so.Civilization.tickForPlayer = function () {
    this.resource -= (10 + 5 * this.devPaceTot) * this.energyCoefficient();
    this.stability += (so.balanceBase + this.devLevelsTot - this.devPaceTot) * 0.1;
    if (this.stability > 100) this.stability = 100;
    // Let's develop!
    for (var i in dcpItems) {
        this.devPoints[i] += this.devPace[i] * 5;
        var lastReq = this.levelRequirement(i, this.devLevels[i]),
            nextReq = this.levelRequirement(i, this.devLevels[i] + 1);
        if (this.devPoints[i] >= nextReq) {
            this.devLevels[i]++; this.devLevelsTot++;
            // Update for calculating upgrade progress
            lastReq = nextReq;
            nextReq = this.levelRequirement(i, this.devLevels[i] + 1);
            this.lastLevelUp.push(i);
            // If the energy dev. level is going up, we get some resources
            // Since i is a string ('0'), use == instead of ===
            if (i == 0) this.resource += this.energyUpgradeBonus();
        }
        this.upgradeProgress[i] = (this.devPoints[i] - lastReq) / (nextReq - lastReq);
    }
};
