/**
 *
 * @author 
 *
 */
class SoldierView extends egret.Sprite{
    
    private skill:egret.MovieClip;
    private soldier:egret.MovieClip;
    private fly: egret.MovieClip;
    private bomb_bg: egret.Bitmap;
    
    public width_set:number = 100;
    public height_set:number = 90;
    private gem_type:number;
    
	public constructor(gem:number) {
    	super();
    	this.gem_type = gem;
    	this.init();
    	this.once(egret.Event.REMOVED_FROM_STAGE,this.clear,this);
	}
	
    
	public changeFly():void
	{
        this.removeChildren();
        this.soldier.stop();
        
        this.fly = FightLogic.getInstance().getMovieClip("fly");
        this.fly.frameRate = 12;
        this.fly.play(-1);
        this.addChild(this.fly);
	}
	
    /**战士攻击动画效果：各种爆炸，冰封效果*/
    public bombEffectPlay(): void {
        //黄色，红色，蓝色，黑色
        if(this.bomb_bg == null) {
            this.bomb_bg = new egret.Bitmap(RES.getRes("beattack_" + this.gem_type + "_0"));
            this.bomb_bg.scaleX = this.bomb_bg.scaleY = 2;
            this.bomb_bg.x = (this.width - this.bomb_bg.texture.textureWidth) / 2;
            this.bomb_bg.y = this.height - this.bomb_bg.texture.textureHeight;
            this.addChild(this.bomb_bg);
            
            setTimeout(this.removeBombBg,300);
        }
    }
	
	private init():void
	{
//        this.skill = FightLogic.getInstance().getMovieClip("skill");
//        this.skill.gotoAndStop(4);
//        this.skill.x = (this.width_set - this.skill.width)/2;
//        this.skill.y = (this.height_set - this.skill.height)/2;
        this.soldier = FightLogic.getInstance().getMovieClip("soldier");
        this.soldier.x = (this.width_set - this.soldier.width)/2;
        this.soldier.y = (this.height_set - this.soldier.height)/2;
        this.soldier.frameRate = 12;
        
//        this.skill.play(-1);
        this.soldier.play(-1);
//        this.addChild(this.skill);
        this.addChild(this.soldier);
	}
	
    private removeBombBg(): void {
        if(this.bomb_bg != null && this.bomb_bg.parent != null) {
            this.bomb_bg.parent.removeChild(this.bomb_bg);
            this.bomb_bg = null;
        }
    }
	
	private clear():void
	{
    	this.removeChildren();
	    this.soldier.stop();
	    if(this.skill != null){
	        this.skill.stop();
	    }
	    if(this.fly != null){
	        this.fly.stop();
	    }
	    this.fly = null;
	    this.skill = null;
	    this.soldier = null;
	}
}
