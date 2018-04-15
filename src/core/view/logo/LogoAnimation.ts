/**
 *
 * @author 
 *
 */
class LogoAnimation extends eui.Component{
    private logo:eui.Image;
    private logo_txt:eui.Label;
	public constructor() {
    	super();
        this.skinName = "resource/assets/skins/LogoAnimationSkin.exml";
        this.init();
        this.once(egret.Event.ADDED_TO_STAGE,this.onStage,this);
	}
	
	private init():void{
    	  this.addChild(ViewUtil.getShape(GlobalData.GameStage_width,GlobalData.GameStage_height,0x888888,0.2));
        this.logo.anchorOffsetX = this.logo.width / 2;
        this.logo.anchorOffsetY = this.logo.height / 2;
        this.logo.x = this.width/2;
        this.logo.y = 0;
        this.logo_txt.alpha = 0;
        this.logo.scaleX = this.logo.scaleY = 0.1;
	}
	
	private onStage(e:egret.Event):void
	{
        var tw = egret.Tween.get(this.logo);
        tw.to({ y: GlobalData.GameStage_height / 2 - 100,scaleX: 1,scaleY: 1 },500,egret.Ease.backInOut).call(this.txtTween,this);
        
        this.once(egret.Event.REMOVED_FROM_STAGE,this.removeStage,this);
	}
	
	private txtTween():void
	{
        var tw = egret.Tween.get(this.logo_txt);
        tw.to({ alpha:1},500).wait(100).call(this.clear,this);
	}
	
	private clear():void
	{
	    UIManager.getInstance().openFirstUI(UIManager.CLASS_UI_INDEX_LOGINMAIN);
	}
	
	private removeStage(e:egret.Event):void
	{
	    
	}
}
