so.res = {
    img_zoom_in: 'res/zoom-in.png',
    img_zoom_in_sel: 'res/zoom-in-sel.png',
    img_zoom_out: 'res/zoom-out.png',
    img_zoom_out_sel: 'res/zoom-out-sel.png'
};
so.res_preload = [
    so.res.img_zoom_in, so.res.img_zoom_in_sel,
    so.res.img_zoom_in, so.res.img_zoom_out_sel
];
so.size = cc.size(0, 0);
so.centre = cc.p(0, 0);

cc.game.onStart = function () {
    cc.view.adjustViewPort(true);
    cc.view.setDesignResolutionSize(640, 320, cc.ResolutionPolicy.SHOW_ALL);
    cc.view.resizeWithBrowserSize(true);
    cc.director.setDisplayStats(true);
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
