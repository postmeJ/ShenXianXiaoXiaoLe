/**
 *
 * @author 
 *
 */
class GemView extends egret.Sprite{
    private bg:eui.Image;
    
    public vo:GemVO;
    public width_set:number = 100;
    public height_set:number = 90;
    
	public constructor(v:GemVO) {
    	  super();
    	  this.vo = v;
        this.addChild(ViewUtil.getShape(this.width_set,this.height_set));
    	  this.init();
	}
	
	/**当合成战士时，宝石暂时做隐藏*/
    public setAppear(b:boolean):void
    {
        this.visible = b;
        this.touchChildren = this.touchEnabled = b;
    }
	
	/**合成战士前的特效*/
    public changeBomb():void
    {
        this.bg.visible = false;
        var data = RES.getRes("bomb_json");
        var txtr = RES.getRes("bomb_png");
        var mcFactory: egret.MovieClipDataFactory = new egret.MovieClipDataFactory(data,txtr);
        var mc: egret.MovieClip = new egret.MovieClip(mcFactory.generateMovieClipData(this.vo.index%2==0?"bomb1":"bomb2"));
        mc.x = (this.width_set - mc.width)/2;
        mc.y = (this.height_set - mc.height)/2;
        this.addChild(mc);
        mc.play();
        
        mc.once(egret.Event.COMPLETE,function(e: egret.Event): void {
            if(mc != null && mc.parent != null)
            {
                mc.stop();
                mc.parent.removeChild(mc);
                mc = null;
            }
        },this);
    }
    
    
	
	/**更换索引（位置）*/
	public setIndex(i:number):void
	{
	    this.vo.index = i;
	}
	
	/**晃动*/
	public startTween(b:boolean):void
	{
    	if(b)
    	{
        this.bg.rotation = -20;
          var tw = egret.Tween.get(this.bg,{loop:true});
          tw.to({rotation:20},200).to({rotation:-20},200);
    	}
	  else
	  {
	      egret.Tween.removeTweens(this.bg);
	      this.bg.rotation = 0;
	  }
	}
	
	private init():void
	{
        var texture: egret.Texture = RES.getRes("fight_" + this.vo.type);
        this.bg = new eui.Image(texture);
        this.bg.anchorOffsetX = texture.textureWidth/2;
        this.bg.anchorOffsetY = texture.textureHeight/2;
        this.bg.x = texture.textureWidth/2;
        this.bg.y = texture.textureHeight/2;
        this.bg.smoothing = true;
        this.addChild(this.bg);
        
        this.initEvent();
	}
	
	private initEvent():void
	{
	    this.addEventListener(egret.TouchEvent.TOUCH_TAP,this.click,this);
	    this.once(egret.Event.REMOVED_FROM_STAGE,this.clear,this);
	}
	
	private click():void
	{
    	  console.log("点击宝石索引："+this.vo.index);
	    FightLogic.getInstance().setSelectGem(this.vo.index);
	}
	
	public clear():void
	{
    	  this.bg = null;
        this.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.click,this);
	}
}
