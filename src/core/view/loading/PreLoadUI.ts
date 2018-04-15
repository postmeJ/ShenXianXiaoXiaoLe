/**
 *
 * @author 
 *
 */
class PreLoadUI extends egret.Sprite{
    public constructor() {
        super();
        this.createView();
    }

    private bg: egret.Bitmap;
    private createView(): void {
        this.bg = new egret.Bitmap();
        this.bg.texture = RES.getRes("logo_png");
        this.addChild(this.bg);
        ViewUtil.setCenter(this.bg);
    }
}
