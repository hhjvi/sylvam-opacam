so.Spacecraft = function (cosmos, civil, level, src, dest, callback, target) {
    var r = {
        cosmos: cosmos,
        name: 'Shenzhou ' + (new Date()).getTime() % 10000,
        level: level,
        speed: so.Spacecraft.speed[level],
        warp: so.Spacecraft.warp[level],
        resource: so.Spacecraft.capacity[level],
        civil: civil,
        srcx: src.x, srcy: src.y,
        destx: dest.x, desty: dest.y,
        x: src.x, y: src.y,
        callback: callback, target: target,
        id: 0,  // Give it an ID manually
        destSolarIdx: -1,   // Manual
        _lastWayToGo: 18906416
    };
    r.tick = so.Spacecraft.tick;

    return r;
};

so.Spacecraft.speed = [undefined, 0.005, 0.015, 0.1, 1, 1];
so.Spacecraft.warp = [undefined, undefined, undefined, undefined, 0.8, 0];
so.Spacecraft.capacity = [undefined, 1500, 5000, 10000, 20000, 30000];

// Move for one month.
so.Spacecraft.tick = function () {
    var diffx = this.destx - this.x, diffy = this.desty - this.y;
    var way2go = Math.sqrt(diffx * diffx + diffy * diffy);
    if (way2go > this._lastWayToGo) {
        this.cosmos._newlyReached.push(this);
    }
    this.x += diffx / way2go * this.speed / 12;
    this.y += diffy / way2go * this.speed / 12;
    this._lastWayToGo = way2go;
};
