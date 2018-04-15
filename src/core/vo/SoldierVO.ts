/**
 *
 * @author 
 *
 */
class SoldierVO {
	public constructor() {
        FightLogic.getInstance().soldier_max_id ++;
    	  this.id = FightLogic.getInstance().soldier_max_id;
	}
	
	public id:number;
	/**战士的类型*/
	public derection:number;
	/**合成的位置索引数组*/
	public data:number[];
	/**宝石类型，所有小的攻击到第一排就消失，大战士穿透性<br>
	 *0黄色,  对第一排及其后面三排位置上造成伤害，大战士对第一排及其后面七排位置上造成伤害<br>
	 *1红色,  对第一排攻击并对左右两侧相邻位置造成一半伤害，大战士对前两排敌人造成伤害并对左右两侧相邻位置造成一半伤害<br>
	 *2绿色,  对第一排攻击并击退6步，大战士对前两排敌人造成伤害并击退6步<br>
	 *3蓝色,  对第一排攻击并冰封2回合，大战士对前两排敌人造成冰冻伤害并冰封3回合<br>
	 *4粉红,  对前两排敌人攻击并造成持续伤害2回合，大战士对当前屏幕对应列所有敌人造成伤害并造成持续伤害<br>
	 *5黑色,  对当前列及其左右两列的后面五排（共六排）造成大量伤害，大战士对第二排敌人造成相同效果（如果第一排攻击时已经把第二排干掉了，则没有了）
	 **/
	public gem_type:number;
}
