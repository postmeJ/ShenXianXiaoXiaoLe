/**
 *
 * @author 
 *
 */
class LoginMain extends eui.Component{
    
    private btn:StartButton;
    
	public constructor() {
    	super();
        this.skinName = "resource/assets/skins/LoginMainSkin.exml";
	}
    
    protected createChildren() {
        super.createChildren();
        this.btn = new StartButton("startgame_png");
        this.addChild(this.btn);
        this.btn.startTween();
        this.btn.once(egret.TouchEvent.TOUCH_TAP,this.click,this);
        this.once(egret.Event.REMOVED_FROM_STAGE,this.clear,this);
    }
    
    private click(e:egret.Event):void
    {
        StoryLogic.getInstance().openStory();
    }
    
    private clear():void
    {
        if(this.btn.parent != null)
        {
            this.btn.parent.removeChild(this.btn);
        }
        this.btn.clear();
        this.btn = null;
    }
}
