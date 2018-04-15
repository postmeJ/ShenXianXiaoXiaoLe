/**
 *
 * @author 
 *
 */
class FightPauseUI extends BaseSecondUI{
    private resume_btn:BaseButton;
    private back_btn:eui.Image;
    private refresh_btn:eui.Image;
    private sound_btn: eui.Image;
    private sound_eff_btn: eui.Image;
    
    
	public constructor() {
    	  super();
        this.skinName = "resource/assets/skins/FightPauseSkin.exml";
	}
	
    protected childrenCreated(): void {
        super.childrenCreated();
        this.init();
    }

    private init(): void {
        
        this.resume_btn = new BaseButton("goback_btn_png");
        this.resume_btn.anchorOffsetX = this.resume_btn.bg.width / 2;
        this.resume_btn.x = GlobalData.GameStage_width / 2;
        this.resume_btn.verticalCenter = 60;
        this.addChild(this.resume_btn);
        this.resume_btn.startTween();
        
        this.initEvent();
    }
    
    private initEvent():void
    {
        this.resume_btn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.resumeClick,this);
        this.back_btn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.backClick,this);
        this.once(egret.Event.REMOVED_FROM_STAGE,this.clear,this);
    }
    
    private backClick():void
    {
        UIManager.getInstance().closeSecondUI(true);
        FightLogic.getInstance().dispatchEvent(new MyUIEvent(MyUIEvent.FIGHT_CLOSEUI));
    }
    
    private resumeClick():void
    {
        UIManager.getInstance().closeSecondUI();
    }
    
    private clear():void
    {
        this.resume_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.resumeClick,this);
        this.back_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.backClick,this);
    }
}
