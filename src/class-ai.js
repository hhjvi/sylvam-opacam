// This file's gonna be large... I think.
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
            curCiv.devPace = [max - avg * 2, avg, avg];
        }
    }
};
