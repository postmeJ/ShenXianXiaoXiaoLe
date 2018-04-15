/**
 *
 * @author 
 *
 */
class WallView extends egret.Sprite{
    public index:number;
    public vo:WallVO;
    private level_src:number;
    private bg_src:string;
    private bg:egret.Bitmap;
    public width_set:number = 100;
    public height_set:number = 100;
	public constructor(i:number,v:WallVO) {
        super();
        this.index = i;
        this.vo = v;
        this.level_src = Math.floor(v.lv/5) + 1;
        this.updateHp(this.vo.max_hp);
	}
	
	public updateHp(n:number):void
	{
	    this.vo.hp = n;
	    var s:number = 4 - Math.ceil(n * 4 / this.vo.max_hp);
	    s = s < 1 ? 1 : s;
        var src: string = "wall_wall"+this.level_src+"_"+s;
	    if(this.bg == null || this.bg_src != src)
        {
            this.bg_src = src;
	        this.changeBg();
	    }
	}
	
	public damageDeal(d:number)
	{
        this.vo.hp -= d;
        if(this.vo.hp <= 0){
            this.vo.hp = 0;
	    }
        this.updateHp(this.vo.hp);
	}
	
	private changeBg():void
	{
	    if(this.bg != null && this.bg.parent != null){
	        this.bg.parent.removeChild(this.bg);
	    }
	    this.bg = new egret.Bitmap(RES.getRes(this.bg_src));
        this.bg.scaleX = this.bg.scaleY = 2;
        this.bg.x = (this.width_set - this.bg.texture.textureWidth * 2) / 2;
        this.bg.y = this.height_set - this.bg.texture.textureHeight * 2;
	    this.addChild(this.bg);
	}
}
