so.res = {
    white_px: 'res/white-px.png',
    img_zoom_in: 'res/zoom-in.png',
    img_zoom_in_sel: 'res/zoom-in-sel.png',
    img_zoom_out: 'res/zoom-out.png',
    img_zoom_out_sel: 'res/zoom-out-sel.png',
    up_btn: 'res/up-btn.png',
    up_btn_sel: 'res/up-btn-sel.png',
    down_btn: 'res/down-btn.png',
    down_btn_sel: 'res/down-btn-sel.png',
    launch: [
        ['res/launch-spccraft.png', 'res/launch-spccraft-sel.png'],
        ['res/launch-masspt.png', 'res/launch-masspt-sel.png'],
        ['res/launch-2datk.png', 'res/launch-2datk-sel.png']
    ]
};
so.res_preload = [
    so.res.white_px,
    so.res.img_zoom_in, so.res.img_zoom_in_sel,
    so.res.img_zoom_in, so.res.img_zoom_out_sel,
    so.res.up_btn, so.res.up_btn_sel,
    so.res.down_btn, so.res.down_btn_sel,
    so.res.launch[0][0], so.res.launch[0][1],
    so.res.launch[1][0], so.res.launch[1][1],
    so.res.launch[2][0], so.res.launch[2][1]
];
so.size = cc.size(0, 0);
so.centre = cc.p(0, 0);

// Game-related constants
so.ly2pix = 100;    // By default, 100 pixels = 1 light year
so.balanceBase = 5; // The balance point is (5 + sum of all levels)
so.resourceSeed = 30000;

// Basic Science Dev. Levels required by each launchable object
so.launchRequirement = [
    1,  // Fuel/Nuclear-powered / Warp-driven spacecrafts
    4,  // Mass Points
    5   // Dimension Attack: 3D->2D
];

cc.game.onStart = function () {
    cc.view.adjustViewPort(true);
    cc.view.setDesignResolutionSize(640, 320, cc.ResolutionPolicy.SHOW_ALL);
    cc.view.resizeWithBrowserSize(true);
    cc.director.setDisplayStats(false);
    so.size = cc.director.getVisibleSize();
    so.centre = cc.p(so.size.width * 0.5, so.size.height * 0.5);
    // Load resources and here we go!
    cc.LoaderScene.preload(so.res_preload, function () {
        cc.director.runScene(new so.StartupScene());
    }, this);
};

window.onload = function () {
    cc.game.run('game_canvas');
};
