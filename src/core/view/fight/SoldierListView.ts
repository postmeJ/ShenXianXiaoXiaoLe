/**
 *
 * @author 
 *
 */
class SoldierListView extends egret.Sprite {
    public vo: SoldierVO;
    private soldier_arr: SoldierView[];
    
    private bomb_bg:egret.Bitmap;
    
    public constructor(v: SoldierVO) {
        super();
        this.vo = v;
        this.touchEnabled = true;

        this.soldier_arr = [];
        if(this.vo.derection == FightLogic.SOLDIER_LIST_TYPE_BIG) {//大战士
            var s: SoldierView = new SoldierView(this.vo.gem_type);
            s.scaleX = s.scaleY = 2;
            this.soldier_arr.push(s);
            this.addChild(s);
        }
        else {
            for(var i: number = 0;i < this.vo.data.length;i++) {
                var s: SoldierView = new SoldierView(this.vo.gem_type);
                if(this.vo.derection == FightLogic.SOLDIER_LIST_TYPE_HORIZONTAL) {
                    s.x = (s.width_set + 2) * i;
                }
                else {
                    s.y = (s.height_set + 10) * i;
                }
                this.soldier_arr.push(s);
                this.addChild(s);
            }
        }

        this.addEventListener(egret.TouchEvent.TOUCH_TAP,this.click,this);
        this.once(egret.Event.REMOVED_FROM_STAGE,this.clear,this);
    }

    /***/


    /**移动到城墙变身为球型效果*/
    public change(): void {
        var index: number = 0;
        while(index < this.numChildren) {
            (this.getChildAt(index) as SoldierView).changeFly();
            index++;
        }
    }

    /**战士攻击动画效果：各种爆炸，冰封效果*/
    public bombEffectPlay(i:number): void {
        if(this.vo.derection == FightLogic.SOLDIER_LIST_TYPE_BIG)
        {
            if(this.bomb_bg == null) {
                this.bomb_bg = new egret.Bitmap(RES.getRes("beattack_"+ this.vo.gem_type+"_0"));
                this.bomb_bg.scaleX = this.bomb_bg.scaleY = 2;
                this.bomb_bg.x = (this.width - this.bomb_bg.texture.textureWidth) / 2;
                this.bomb_bg.y = this.height - this.bomb_bg.texture.textureHeight;
                this.addChild(this.bomb_bg);
                
                setTimeout(this.removeBombBg,300);
            }
        }
        else
        {
            this.soldier_arr[i].bombEffectPlay();
        }
        
    }
    
    /**战士消失*/
    public soldierDiappear(i:number)
    {
        if(this.soldier_arr[i] != null) {
            this.soldier_arr[i].visible = this.vo.derection == FightLogic.SOLDIER_LIST_TYPE_BIG;//小战士消失，大战士一直存在
        }
    }

    private click(): void {
        FightLogic.getInstance().attack_combo_num = 1;
        FightLogic.getInstance().soldierFight(this.vo);
    }
    
    private removeBombBg():void
    {
        if(this.bomb_bg != null && this.bomb_bg.parent != null) {
            this.bomb_bg.parent.removeChild(this.bomb_bg);
            this.bomb_bg = null;
        }
    }

    private clear(): void {
        this.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.click,this);
        this.removeChildren();
        this.vo = null;
    }
}
