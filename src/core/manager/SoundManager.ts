/**
 *
 * @author 
 *
 */
class SoundManager {
	public constructor() {
	}
	
    private static instance: SoundManager;
    public static getInstance(): SoundManager {
        if(this.instance == null) {
            this.instance = new SoundManager();
        }
        return this.instance;
    }
    
    private bgSound: egret.Sound;
    private bgChannel:egret.SoundChannel;

    private bg_position:number = 0;
    
    public sound_switch:boolean = false;
    public sound_effect_switch:boolean = false;
    
    /**打开/关闭背景音乐*/
    public playBgSound(b:boolean):void
    {
        this.sound_switch = b;
        if(b) {
            if(this.bgSound == null) {
                this.bgSound = RES.getRes("bg_mp3");
            }
            if(this.bgChannel != null) {
                this.bgChannel.stop();
                this.bgChannel = null;
            }
            this.bgChannel = this.bgSound.play(this.bg_position,0);
        }
        else {
            if(this.bgChannel != null)
            {
                this.bg_position = this.bgChannel.position;
                this.bgChannel.stop();
                this.bgChannel = null;
            }
            else{
                this.bg_position = 0;
            }
        }
    }
    
    /**音效开关*/
    public setSoundEffectSwitch(b:boolean):void
    {
        this.sound_effect_switch = b;
    }
    
    /**播放音效*/
    public playEffectSound(str: string ="sound_11_wav"):void
    {
        if(!this.sound_effect_switch)
        {
            return;
        }
        var sound:egret.Sound = RES.getRes(str);
        if(sound != null)
        {
            var channel: egret.SoundChannel = sound.play(0,1);

            var obj = { s: sound,c: channel };
            var complete = function(): void {
                this.c.stop();
                this.c = null;
                this.s = null;
            }
            channel.addEventListener(egret.Event.SOUND_COMPLETE,complete,obj);
        }
    }
}
