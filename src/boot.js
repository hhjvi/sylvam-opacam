so.res = {
};
so.res_preload = [
];

cc.game.onStart = function () {
    cc.view.adjustViewPort(true);
    cc.view.setDesignResolutionSize(640, 320, cc.ResolutionPolicy.SHOW_ALL);
    cc.view.resizeWithBrowserSize(true);
    cc.director.setDisplayStats(true);
    // Load resources and here we go!
    cc.LoaderScene.preload(so.res_preload, function () {
        cc.director.runScene(new so.StartupScene());
    }, this);
};

window.onload = function () {
    cc.game.run('game_canvas');
};
