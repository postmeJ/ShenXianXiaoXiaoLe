/**
 *
 * @author 
 *
 */
class FightResult extends BaseSecondUI{
    private back_btn: BaseButton;
    public constructor(win: boolean) {
        super();
        this.skinName = win ? "FightWinSkin" : "FightLostSkin";
    }

    protected childrenCreated() {
        super.childrenCreated();
        
        this.back_btn = new BaseButton("goback_btn_png");
        this.back_btn.anchorOffsetX = this.back_btn.bg.width / 2;
        this.back_btn.x = GlobalData.GameStage_width / 2;
        this.back_btn.y = this.height - 300;
        this.addChild(this.back_btn);
        this.back_btn.startTween();
        
        this.initEvent();
    }
    
    private initEvent(): void {
        this.back_btn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.clickBack,this);
        this.once(egret.Event.REMOVED_FROM_STAGE,this.clear,this);
    }
    
    private clickBack(): void {
        SoundManager.getInstance().playEffectSound();
        UIManager.getInstance().closeSecondUI();
        FightLogic.getInstance().dispatchEvent(new MyUIEvent(MyUIEvent.FIGHT_CLOSEUI));
    }

    private clear(): void {
        this.back_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.clickBack,this);
    }
}
