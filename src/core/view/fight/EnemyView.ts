/**
 *
 * @author 
 *
 */
class EnemyView extends eui.Group {
    private wait_bg: egret.Bitmap;
    private walk_bg: egret.Bitmap;
    private bar: MyProgressBar;
    private freeze_bg: egret.Bitmap;
    private dot_bg: egret.Bitmap;
    private att_eff:egret.Bitmap;

    public width_set: number = 100;
    public height_set: number = 100;
    public vo: EnemyVO;
    private tween_time:number = 300;

    public constructor(i: number,v: EnemyVO) {
        super();
        this.vo = v;
        this.once(egret.Event.REMOVED_FROM_STAGE,this.clear,this);
    }

    protected childrenCreated(): void {
        super.childrenCreated();
        this.bar = new MyProgressBar("EnemyBarSkin",10,90);
        this.bar.x = (this.width_set - 90) / 2 - 5;
        this.addChild(this.bar);
        this.wait();
        this.setHp(this.vo.energy);
        this.bar.setText(this.vo.position+":"+this.vo.hp + "/" + this.vo.energy);
    }
    
    /**攻击*/
    public attack():void
    {
        if(this.att_eff != null && this.att_eff.parent != null) {
            this.att_eff.parent.removeChild(this.att_eff);
            this.att_eff = null;
        } 
        
        this.att_eff = new egret.Bitmap(RES.getRes("defattack_attack_" + this.vo.attacktype + "_0"));
        this.att_eff.x = (this.width_set - this.att_eff.width) / 2;
        this.addChild(this.att_eff);
        
        if(this.vo.type == FightLogic.ENEMY_TYPE_WARRIOR)
        {
            this.att_eff.y = this.height_set / 2;
        }
        else if(this.vo.type == FightLogic.ENEMY_TYPE_MAGICIAN)
        {
            this.att_eff.y = this.height_set / 2;
            var step: number = FightLogic.getInstance().total_step - Math.floor(this.vo.position / 6);
            var tarY: number = this.y + step * FightLogic.getInstance().step_height;
            egret.Tween.get(this.att_eff).to({ y: tarY },this.tween_time).call(() => {
                if(this.att_eff != null && this.att_eff.parent != null) {
                    this.att_eff.parent.removeChild(this.att_eff);
                    egret.Tween.removeTweens(this.att_eff);
                    this.att_eff = null;
                }
            },this);
        }
        else if(this.vo.type == FightLogic.ENEMY_TYPE_BOSS)
        {
            this.att_eff.y = this.height_set / 2;
        }
        else if(this.vo.type == FightLogic.ENEMY_TYPE_TREATER)
        {
            this.att_eff.y = (this.height_set - this.att_eff.height)/2;
        }
        
        setTimeout(() =>{
            if(this.att_eff != null && this.att_eff.parent != null) {
                this.att_eff.parent.removeChild(this.att_eff);
                egret.Tween.removeTweens(this.att_eff);
                this.att_eff = null;
            } 
        },this.tween_time*2);
    }

    /**是否可以攻击，达到攻击范围*/
    public canAttack(): boolean {
        //到达城墙为20步 - 当前位置 <= 攻击范围 
        return (FightLogic.getInstance().total_step - Math.floor(this.vo.position / 6)) <= this.vo.attack_range;
    }

    /**冰封状态-1*/
    public freezeRound(): void {
        this.vo.extra_value--;
        if(this.vo.extra_value == 0) {
            this.vo.has_freeze = false;
            if(this.freeze_bg != null && this.freeze_bg.parent != null) {
                this.freeze_bg.parent.removeChild(this.freeze_bg);
                this.freeze_bg = null;
            }
        }
    }

    /**中了dot，扣血
     * @return 返回是否已经死亡*/
    public dotRound(): boolean {
        //先扣血
        this.setHp(this.vo.hp - this.vo.dot_damage);

        //扣完血如果死了，移除
        if(this.vo.hp <= 0) {
            return true;
        }

        //还没死，检测状态回合数
        this.vo.extra_value--;
        if(this.vo.extra_value == 0) {
            this.vo.has_dot = false;
            if(this.dot_bg != null && this.dot_bg.parent != null) {
                this.dot_bg.parent.removeChild(this.dot_bg);
                this.dot_bg = null;
            }
        }
        return false;
    }
    
    /**中了冰封*/
    public freeze(n: number): void {
        this.vo.has_freeze = true;
        this.vo.extra_value = n;
        if(this.freeze_bg != null && this.freeze_bg.parent != null) {
            this.freeze_bg.parent.removeChild(this.freeze_bg);
        }
        if(this.freeze_bg == null) {
            this.freeze_bg = new egret.Bitmap(RES.getRes("beattack_frozen"));
            this.freeze_bg.x = (this.width_set - this.freeze_bg.texture.textureWidth) / 2;
            this.freeze_bg.y = this.bar.height;
        }
        this.addChild(this.freeze_bg);
    }
    
    /**中了dot*/
    public dot(n: number,dotdamage:number): void {
        this.vo.dot_damage = dotdamage;
        this.vo.has_dot = true;
        this.vo.extra_value = n;
        if(this.dot_bg != null && this.dot_bg.parent != null) {
            this.dot_bg.parent.removeChild(this.dot_bg);
        }
        if(this.dot_bg == null) {
            this.dot_bg = new egret.Bitmap(RES.getRes("beattack_skull0"));
            this.dot_bg.x = (this.width_set - this.dot_bg.texture.textureWidth) / 2;
            this.dot_bg.y = this.bar.height;
        }
        this.addChild(this.dot_bg);
    }

    public wait(): void {
        if(this.walk_bg != null && this.walk_bg.parent != null) {
            this.walk_bg.parent.removeChild(this.walk_bg);
        }
        if(this.wait_bg == null) {
            this.wait_bg = new egret.Bitmap(RES.getRes("def_wait" + this.vo.img + "_1"));
            this.wait_bg.x = (this.width_set - this.wait_bg.texture.textureWidth) / 2;
            this.wait_bg.y = this.bar.height;
        }
        this.addChild(this.wait_bg);
    }

    public walk(): void {
        if(this.wait_bg != null && this.walk_bg.parent != null) {
            this.wait_bg.parent.removeChild(this.wait_bg);
        }
        if(this.walk_bg == null) {
            this.walk_bg = new egret.Bitmap(RES.getRes("def_walk" + this.vo.img + "_1"));
            this.walk_bg.x = (this.width_set - this.walk_bg.texture.textureWidth) / 2;
            this.walk_bg.y = this.bar.height;
        }
        this.addChild(this.walk_bg);
    }

    public setHp(n: number): void {
        this.vo.hp = n;
        this.bar.setProgress(n,this.vo.energy);
        this.bar.setText(this.vo.position + ":" + this.vo.hp + "/" + this.vo.energy);
    }
    
    /**受到伤害*/
    public damage(n:number):void
    {
        if(this.vo == null){
            return;
        }
        this.vo.hp -= n;
        if(this.vo.hp <= 0)
        {
            this.vo.hp = 0;
        }
        this.bar.setProgress(this.vo.hp,this.vo.energy);
        this.bar.setText(this.vo.position + ":" + this.vo.hp + "/" + this.vo.energy);
    }
    
    public setPosition(i:number):void
    {
        this.vo.position = i;
        this.bar.setText(this.vo.position + ":" + this.vo.hp + "/" + this.vo.energy);
    }

    private clear(): void {
        this.vo = null;
        if(this.walk_bg != null && this.walk_bg.parent != null) {
            this.walk_bg.parent.removeChild(this.walk_bg);
            this.walk_bg = null;
        }
        if(this.wait_bg != null && this.wait_bg.parent != null) {
            this.wait_bg.parent.removeChild(this.wait_bg);
            this.wait_bg = null;
        }
        if(this.freeze_bg != null && this.freeze_bg.parent != null) {
            this.freeze_bg.parent.removeChild(this.freeze_bg);
            this.freeze_bg = null;
        }
        if(this.dot_bg != null && this.dot_bg.parent != null) {
            this.dot_bg.parent.removeChild(this.dot_bg);
            this.dot_bg = null;
        } 
        if(this.att_eff != null && this.att_eff.parent != null) {
            this.att_eff.parent.removeChild(this.att_eff);
            this.att_eff = null;
        } 
        if(this.bar != null && this.bar.parent != null) {
            this.bar.parent.removeChild(this.bar);
            this.bar.clear();
            this.bar = null;
        }

    }
}
