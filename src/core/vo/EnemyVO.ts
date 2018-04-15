/**
 *
 * @author 
 *
 */
class EnemyVO {
	public constructor() {
        FightLogic.getInstance().soldier_max_id++;
        this.uuid = FightLogic.getInstance().soldier_max_id;
	}
	
	public id:string;
    public uuid:number;
	public lv:number;
	public name:string;
	/**0战士/骑士  1法师  2boss/hero  3牧师*/
	public type:number;
	/**血量*/
	public energy:number;
	public img:number;
	/**攻击类型 <br>
	 *0 远程攻击，远程攻击 <br>
	 *1 boss攻击<br>
	 *2 hero攻击<br>
	 *3 骑士/战士的攻击<br>
	 *4 牧师回血，恢复三列5排格子内血量*/
	public attacktype:number;
	public dropjb:number;
	public exp:number;
	public speed:number;
	/**攻击力*/
	public attack:number;
	/**攻击范围 */
	public attack_range:number = 10;
	
	/**当前剩余的生命值*/
	public hp:number;
	/**当前离出发点的步数*/
	public step:number;
	/**在整个数组中的位置 0-119*/
	public position:number;
	/**自身状态 0正常，可以走   99已死亡，移除*/
	public state:number = 0;
    public dot_damage:number = 0;
	public has_dot:boolean;
	public has_freeze:boolean;
	public is_dead:boolean;
	/**额外数据 当冰封时为冰封剩余回合数 中毒是为剩余中毒回合数数 */
	public extra_value:number = 0;
}
