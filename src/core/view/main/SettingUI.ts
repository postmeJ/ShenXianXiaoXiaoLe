/**
 *
 * @author 
 *
 */
class SettingUI extends BaseSecondUI{
    private back_btn: BaseButton;
    private bg:eui.Image;
    private reg_btn:eui.Image;
    private quit_btn:eui.Image;
    private sound_btn:eui.Image;
    private sound_eff_btn:eui.Image;
    private reg_content:eui.Image;
    private quit_content:eui.Image;
    private sound_close:eui.Image;
    private sound_eff_close:eui.Image;
    
	public constructor() {
    	super();
        this.skinName = "resource/assets/skins/SettingSkin.exml";
	}
	
    protected childrenCreated(): void {
        super.childrenCreated();
        
        this.back_btn = new BaseButton("goback_btn_png");
        this.back_btn.anchorOffsetX = this.back_btn.bg.width / 2;
        this.back_btn.x = GlobalData.GameStage_width / 2;
        this.back_btn.y = this.bg.y + this.bg.height - this.back_btn.bg.height / 2;
        this.addChild(this.back_btn);
        this.back_btn.startTween();

        this.sound_close.visible = !SoundManager.getInstance().sound_switch;
        this.sound_eff_close.visible = !SoundManager.getInstance().sound_effect_switch;
        this.initEvent();
    }
    
    private initEvent(): void {
        this.back_btn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.clickBack,this);
        this.sound_btn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.clickSoundSwitch,this);
        this.sound_eff_btn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.clickSoundEffectSwitch,this);
        this.once(egret.Event.REMOVED_FROM_STAGE,this.clear,this);
    }
    
    private clickSoundSwitch():void
    {
        SoundManager.getInstance().playBgSound(!SoundManager.getInstance().sound_switch);
        this.sound_close.visible = !SoundManager.getInstance().sound_switch;
        SoundManager.getInstance().playEffectSound();
    }
    
    private clickSoundEffectSwitch():void
    {
        SoundManager.getInstance().setSoundEffectSwitch(!SoundManager.getInstance().sound_effect_switch);
        this.sound_eff_close.visible = !SoundManager.getInstance().sound_effect_switch;
        SoundManager.getInstance().playEffectSound();
    }

    private clickBack(): void {
        SoundManager.getInstance().playEffectSound();
        UIManager.getInstance().closeSecondUI();
    }

    private clear(): void {
        this.back_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.clickBack,this);
        this.sound_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.clickSoundSwitch,this);
        this.sound_eff_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.clickSoundEffectSwitch,this);
    }
}
