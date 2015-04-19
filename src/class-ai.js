// This file's gonna be large... I think.
var sqr = function (x) { return x * x; };

so.Cosmos.tick_AI = function () {
    // The AIs.
    for (var i in this.civils) {
        if (i == 0) continue;
        var curCiv = this.civils[i];

        // Adjust development pace.
        if (curCiv.devLevels[0] < 3) {
            // Continuously develop energy until level 3 is reached.
            curCiv.devPace = [so.balanceBase + curCiv.devLevelsTot, 0, 0];
        } else {
            // TODO: Give every single civilization a unique character.
            // For LD, only the simplest decision is used...
            var max = so.balanceBase + curCiv.devLevelsTot;
            var avg = Math.floor(max / 3);
            curCiv.devPace = [avg, avg, avg];
            curCiv.devPace[randomInt(3)] = max - avg * 2;
        }

        // The firing part
        var firePossib = curCiv.badge === 'Fire Lover' ? 1 / 300 : 1 / 1200;
        if (curCiv.devLevels[2] >= so.launchRequirement[1] && Math.random() < firePossib * 0.1) {
            //console.log(curCiv.name + ' fired');
            // Find the nearest.
            var minDistSq = 18906416,
                srcSolar = this.solars[curCiv.solars[randomInt(curCiv.solars.length)]],
                selSolarIdx = -1;
            for (var j in this.solars) if (this.solars[j].civil != i && this.solars[j].civil != -1) {
                var distSq = sqr(this.solars[j].x - srcSolar.x) + sqr(this.solars[j].y - srcSolar.y);
                if (minDistSq > distSq) { minDistSq = distSq; selSolarIdx = j; }
            }
            var selSolarSys = this.solars[selSolarIdx];
            var mp = so.MassPoint(this, i,
                cc.p(srcSolar.x, srcSolar.y),
                cc.p(selSolarSys.x, selSolarSys.y),
                so.Cosmos.tick_AI.scene.massPtArrive, so.Cosmos.tick_AI.scene);
            mp.id = this.flyers.push(mp) - 1;
            mp.destSolarIdx = selSolarIdx;
            var mpDisp = new so.Circle(2, cc.color(192, 0, 0));
            mpDisp.setPosition(
                so.Cosmos.tick_AI.scene._mapLayer.at(srcSolar.x * so.ly2pix),
                so.Cosmos.tick_AI.scene._mapLayer.at(srcSolar.y * so.ly2pix));
            so.Cosmos.tick_AI.scene._mapLayer.addMapPoint(mpDisp, 9999);
            so.Cosmos.tick_AI.scene._flyerNodes[mp.id] = mpDisp;
        }
    }
};
so.Cosmos.tick_AI.scene = null;
