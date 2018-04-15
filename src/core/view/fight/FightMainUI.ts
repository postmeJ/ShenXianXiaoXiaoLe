/**
 *
 * @author 
 *
 */
class FightMainUI extends eui.Component {
    private pause_btn: eui.Image;
    private prop_btn_arr: eui.Image[];
    private prop_num_arr: eui.Label[];
    private enemy_arr: EnemyView[];
    private wall_arr: WallView[];
    private gem_arr: GemView[];
    private soldier_arr: SoldierListView[] = [];
    private wall_con: egret.Sprite;
    private enemy_con: egret.Sprite;
    private gem_con: egret.Sprite;
    private danger_rect:eui.Rect;
    private last_gem: GemView;
    private target_gem: GemView;
    private gem_move_time: number = 200;
    private soldier_move_time: number = 100;
    private enemy_start_y: number = -65;
    private enemy_end_y: number = 235;
    private max_enemy: number = 132;//正常6*20，最后12格为城墙破了以后走2步则算战斗失败
    private is_danger:boolean;
    private combo_soldier:SoldierVO[] = [];//前面战士攻击后，等待连击的战士
    private solder_attacking:boolean;

    public constructor() {
        super();
        this.skinName = "resource/assets/skins/FightBgSkin.exml";
    }

    protected childrenCreated(): void {
        super.childrenCreated();
        this.init();
    }

    private init(): void {
        this.prop_btn_arr = [];
        this.prop_num_arr = [];
        this.wall_arr = [];
        this.gem_arr = [];
        this.enemy_arr = new Array(this.max_enemy);

        this.enemy_con = new egret.Sprite();
        this.enemy_con.y = 0;
        this.addChildAt(this.enemy_con,2);

        this.wall_con = new egret.Sprite();
        this.wall_con.y = 430;
        this.addChild(this.wall_con);

        this.gem_con = new egret.Sprite();
        this.gem_con.y = 450;
        this.addChild(this.gem_con);

        this.initWall();
        this.initGem();
        this.addEnemyOnFirstRow();

        this.initEvent();

        FightLogic.getInstance().checkAllGemCompose();

    }

    private initWall(): void {
        var arr: WallVO[] = FightLogic.getInstance().getWalls()
        var w: number = 100;
        for(var i: number = 0;i < arr.length;i++) {
            var wall: WallView = new WallView(i,arr[i]);
            w = wall.width_set;
            wall.x = wall.width_set * i;
            wall.y = -wall.height_set;
            this.wall_arr.push(wall);
            this.wall_con.addChild(wall);
        }
        this.wall_con.x = (this.width - w * arr.length) / 2;
    }

    private initGem(): void {
        var arr: number[] = FightLogic.getInstance().getGemArr();
        for(var i: number = 0;i < arr.length;i++) {
            var vo: GemVO = new GemVO();
            vo.index = i;
            vo.type = arr[i];
            var gem: GemView = new GemView(vo);
            gem.x = (gem.width_set + 2) * (i % 6);
            gem.y = (gem.height_set + 10) * Math.floor(i / 6);
            this.gem_arr.push(gem);
            this.gem_con.addChild(gem);
        }
        this.gem_con.x = (this.width - this.gem_con.width) / 2;
    }

    /**生成最上面一排的敌人*/
    private addEnemyOnFirstRow(): void {
        var arr: EnemyVO[] = FightLogic.getInstance().birthOneRowEnemys();
        for(var i: number = 0;i < arr.length;i++) {
            var vo: EnemyVO = arr[i];
            if(this.enemy_arr[vo.position] != null) {//如果初始位置上因为某些原因(一排就被冰封住了，那这个敌人就出不来了)
                continue;
            }
            var enemy: EnemyView = new EnemyView(i,vo);
            enemy.x = enemy.width_set * (vo.position % 6);
            enemy.y = this.enemy_start_y + FightLogic.getInstance().step_height * Math.ceil(vo.position / 6);
            this.enemy_arr[vo.position] = enemy;
            this.enemy_con.addChildAt(enemy,0);
        }
        this.enemy_con.x = (this.width - this.enemy_con.width) / 2 - 5;
    }

    /**敌人行动*/
    private enemysAction(): void {
        console.log("enemysAction");
        //所有行动从最下面开始走起
        for(var i: number = this.enemy_arr.length - 1;i >= 0;i--) {
            var enemy: EnemyView = this.enemy_arr[i];
            if(enemy != null) {
                if(enemy.vo.has_dot)//如果中毒了，优先扣血
                {
                    if(enemy.dotRound())//如果扣血以后死亡，移除这个敌人
                    {
                        this.removeEnemy(enemy.vo.position);
                        enemy = null;
                        continue;
                    }
                    else//扣完血没死，移动
                    {
                        if(!enemy.vo.has_freeze) {
                            this.enemyAction(i);
                        }
                    }
                }
                else if(enemy.vo.has_freeze)//如果被冰封了，原地待命，并且冰封回合-1
                {
                    enemy.freezeRound();
                }
                else if(enemy.vo.is_dead) {
                    this.removeEnemy(enemy.vo.position);
                    enemy = null;
                }
                else {
                    this.enemyAction(i);
                }
            }
        }
        this.addEnemyOnFirstRow();
        setTimeout(()=>{
            this.checkDangerous();
            },500);
    }

    /**单个敌人行动：移动或者攻击*/
    private enemyAction(i: number): void {
        var enemy: EnemyView = this.enemy_arr[i];
        if(this.checkWallDestory(i % 6))//城墙已破，可以移动，不会攻击
        {
            this.enemyMove(i,true);
        }
        else {
            if(enemy.canAttack()) {
                //攻击
                this.enemyAttack(i);
            }
            else {
                this.enemyMove(i);
            }
        }
    }
    /**检测这个位置的敌人是否可以移动*/
    private checkEnemyCanWalk(i: number): boolean {
        if(this.enemy_arr[i + 6] != null)//前面有人挡住着 不能走
        {
            return false;
        }
        else if(this.enemy_arr[i].canAttack())//到达攻击距离
        {
            return false;
        }
        else {
            return true;
        }
    }

    /**敌人攻击*/
    private enemyAttack(i: number): void {
        this.enemy_arr[i].attack();
        if(this.enemy_arr[i].vo.type != FightLogic.ENEMY_TYPE_TREATER) {
            this.damageWall(i % 6,this.enemy_arr[i].vo.attack);
        }
    }
    
    /**检测是否由危险：城墙破 敌人还有2步就到我方基地*/
    private checkDangerous():void
    {
        for(var i: number = 0;i < 6;i++) {
            if(!this.is_danger && this.checkWallDestory(i) && this.getStepBetweenWallAndEnemy(i) < 3) {
                this.is_danger = true;
                if(this.danger_rect == null) {
                    this.danger_rect = new eui.Rect(GlobalData.GameStage_width,640,0xff0000);
                    this.danger_rect.horizontalCenter = 0;
                    this.danger_rect.bottom = 0;
                }
                this.danger_rect.touchChildren = this.danger_rect.touchEnabled = false;
                this.addChild(this.danger_rect);
                this.danger_rect.alpha = 0;
                egret.Tween.get(this.danger_rect,{ loop: true }).to({ alpha: 0.3 },200).to({ alpha: 0 },200);
                return;
            }
        }
        //危险解除
        if(!this.is_danger && this.danger_rect != null)
        {
            if(this.danger_rect.parent != null) {
                this.danger_rect.parent.removeChild(this.danger_rect);
            }
            egret.Tween.removeTweens(this.danger_rect);
            this.danger_rect = null;
            this.is_danger = false;
        }
    }
    
    /**这个城墙列的敌人距离城墙的最短距离*/
    private getStepBetweenWallAndEnemy(i:number):number
    {
        var step: number = 99;
        var pos:number = this.max_enemy - 12 + i;
        var n:number = 1;
        while(pos >= 0)
        {
            if(this.enemy_arr[pos] != null){
                step = n;
                break;
            }
            pos -= 6;
            n++;
        }
        console.log("距离基地："+step);
        return step;
    }

    /**敌人移动*/
    private enemyMove(i: number,wallDestroy: boolean = false): void {
        //检测能否移动
        if(wallDestroy || this.checkEnemyCanWalk(i)) {
            //真正的移动
            var enemy: EnemyView = this.enemy_arr[i];
            var move_step: number = enemy.vo.speed * 6;
            while(i + move_step > this.max_enemy)//如果速度太快，最后一步直接走到尽头越界了，则固定为城墙口
            {
                move_step -= 6;
            }
            enemy.setPosition(enemy.vo.position + move_step)
            this.enemy_arr[i] = null;
            this.enemy_arr[i + move_step] = enemy;
            var tw = egret.Tween.get(enemy);
            var tarY: number = enemy.y + enemy.vo.speed * FightLogic.getInstance().step_height;
            tw.to({ y: tarY },this.gem_move_time).call(this.enemyMoveFinish,this,[i + move_step]);
        }
    }

    private enemyMoveFinish(i: number): void {
        //检测是否到达我方基地，是-->战斗结束
        if(this.checkEnemyBeatMe(i)) {
            this.gameOver(false);
        }
    }

    /**检测是否胜利（每次攻击完毕或者dot减伤以后检测）*/
    private checkWin(): void {
        for(var i: number = 0;i < this.enemy_arr.length;i++) {
            if(this.enemy_arr[i] != null) {
                return;//只要还有一个敌人 就不算赢
            }
        }
        this.gameOver(true);
    }

    /**判断敌人是否到达我放基地*/
    private checkEnemyBeatMe(i: number): boolean {
        return i >= (FightLogic.getInstance().total_step + 1) * 6;
    }

    /**判断城墙是否已破*/
    private checkWallDestory(i: number): boolean {
        return this.wall_arr[i].vo.hp <= 0;
    }

    /**城墙伤害计算*/
    private damageWall(i: number,damange: number) {
        this.wall_arr[i].damageDeal(damange);
    }

    /**战斗结束*/
    private gameOver(win: boolean): void {
        this.stopActions();
        console.log("战斗结束：" + win);
        UIManager.getInstance().openSecondUI(new FightResult(win));
    }

    private initEvent(): void {
        this.pause_btn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.pauseClick,this);
        FightLogic.getInstance().addEventListener(MyUIEvent.FIGHT_CLOSEUI,this.closeUI,this);
        FightLogic.getInstance().addEventListener(MyUIEvent.FIGHT_GEM_OPERATOR,this.operatorGem,this);
        FightLogic.getInstance().addEventListener(MyUIEvent.FIGHT_SOLDIER_COMPOSE,this.soldierCompose,this);
        FightLogic.getInstance().addEventListener(MyUIEvent.FIGHT_SOLDIER_ATTACK,this.soldierAttack,this);
        FightLogic.getInstance().addEventListener(MyUIEvent.FIGHT_GEM_COMPLEMENT,this.gemComplement,this);
        FightLogic.getInstance().addEventListener(MyUIEvent.FIGHT_SOLDIER_COMBO,this.soldierCombo,this);
        this.once(egret.Event.REMOVED_FROM_STAGE,this.clear,this);
    }

    /**连击*/
    private soldierCombo(e: MyUIEvent): void {
        this.combo_soldier = e.data;
        if(this.combo_soldier.length > 0) {
            this.soldierComposeReal(this.combo_soldier);
        }
        console.log("接受连击数组:"+this.combo_soldier.length+"---:战士攻击结束了吗?" + this.solder_attacking);
        //如果战士攻击已经结束，那么这里直接连击；如果攻击还没结束，等待前面战士攻击结束以后 触发连击
        if(!this.solder_attacking && this.combo_soldier.length > 0){
            this.soldierComboReal(this.combo_soldier);
        }
        else
        {
            FightLogic.getInstance().attack_combo_num = 0;
        }
    }
    
    private soldierComboReal(arr: SoldierVO[]): void {
        FightLogic.getInstance().attack_combo_num++;//一次检测只能算一次连击
        for(var i: number = 0;i < arr.length;i++) {
            FightLogic.getInstance().soldierFight(arr[0]);//目前连击只做了一次连击一个
            break;
        }
    }

    /**战士攻击以后，原来的宝石消失，后面的往前补充,补充结束后再次检测是否可以连击*/
    private gemComplement(e: MyUIEvent): void {
        //e.data = { disappear: arr_disappear,move: arr_move_up,complement:arr_complement,cancel:arr_cancel,movegrid:grid_num};
        //下面顺序不能乱，否则数据会错
        this.soldierCancel(e.data.cancel);
        this.soldierMove(e.data.move_soldiers,e.data.movegrid);
        this.gemDisappear(e.data.disappear);
        this.gemMoveUp(e.data.move,e.data.movegrid);
        this.gemBelowComplement(e.data.complement,e.data.movegrid);
        //补充完成后，要重新检测下面是否合成战士,
        var lag: number = this.gem_move_time * e.data.movegrid + 500;
        setTimeout(this.checkCombo,lag,e.data.disappear);
    }

    private checkCombo(arr: number[]): void {
        FightLogic.getInstance().checkAttackCombo(arr);
    }

    /**战士攻击后，原来位置上的宝石销毁*/
    private gemDisappear(arr: number[]): void {
        for(var i: number = 0;i < arr.length;i++) {
            var gem: GemView = this.gem_arr[arr[i]];
            if(gem != null && gem.parent != null) {
                gem.parent.removeChild(gem);
            }
            this.gem_arr[arr[i]] = null;
        }
    }
    /**战士攻击后，战士下面的宝石移动上来*/
    private gemMoveUp(arr: number[],grid: number): void {
        for(var i: number = 0;i < arr.length;i++) {
            var gem: GemView = this.gem_arr[arr[i]];
            var tw = egret.Tween.get(gem);
            tw.to({ y: gem.y - (gem.height_set + 10) * grid },this.gem_move_time * grid).call(this.gemMoveUpFinish,this,[gem,gem.vo.index - grid * 6]);
        }
    }
    private gemMoveUpFinish(gem: GemView,index: number): void {
        gem.setIndex(index);
        this.gem_arr[index] = gem;
    }

    /**战士攻击后并且宝石移动以后，空缺的地方补充宝石*/
    private gemBelowComplement(arr: GemVO[],grid: number): void {
        for(var i: number = 0;i < arr.length;i++) {
            var gem: GemView = new GemView(arr[i]);
            gem.x = (gem.width_set + 2) * (arr[i].index % 6);
            gem.y = (gem.height_set + 10) * (Math.floor(arr[i].index / 6) + grid);
            this.gem_con.addChild(gem);
            var tw = egret.Tween.get(gem);
            tw.to({ y: gem.y - (gem.height_set + 10) * grid },this.gem_move_time * grid).call(this.gemMoveUpFinish,this,[gem,gem.vo.index]);
        }
    }
    /**战士攻击后并且宝石移动以后，原来的战士可能会不满足合成，所以取消*/
    private soldierCancel(ids: number[]) {
        for(var i: number = 0;i < ids.length;i++) {
            var soldier: SoldierListView = this.getSoldier(ids[i]);
            if(soldier != null) {
                var arr: number[] = soldier.vo.data;
                //战士对应宝石显示
                for(var j: number = 0;j < arr.length;j++) {
                    var gem: GemView = this.gem_arr[arr[j]];
                    gem.setAppear(true);
                }
                //销毁战士
                this.removeSoldier(soldier.vo.id);
                if(soldier.parent != null) {
                    soldier.parent.removeChild(soldier);
                }

            }
        }
    }

    private removeSoldier(id: number): void {
        for(var i: number = 0;i < this.soldier_arr.length;i++) {
            if(this.soldier_arr[i].vo.id == id) {
                this.soldier_arr.splice(i,1);
            }
        }
    }

    private removeEnemy(i: number): void {
        var self = this;
        var lagRemove = function():void{
            if(self.enemy_arr[i] != null && self.enemy_arr[i].parent != null) {
                self.enemy_arr[i].parent.removeChild(self.enemy_arr[i]);
                self.enemy_arr[i] = null;
            }
        }
        
        setTimeout(lagRemove,300);//延迟一下等攻击特效播放完再消失
    }

    /**战士攻击后并且宝石移动以后，原来的完整战士，往上移动*/
    private soldierMove(ids: number[],step: number) {
        for(var i: number = 0;i < ids.length;i++) {
            var soldier: SoldierListView = this.getSoldier(ids[i]);
            if(soldier != null) {
                var tw = egret.Tween.get(soldier);
                tw.to({ y: soldier.y - 100 * step },this.gem_move_time * step);
                //战士的data也要随之改变
                for(var j: number = 0;j < soldier.vo.data.length;j++) {
                    soldier.vo.data[j] = soldier.vo.data[j] - step * 6;
                }
            }
        }
    }

    /**战士攻击*/
    private soldierAttack(e: MyUIEvent): void {
        if(e.data == null) {
            console.log("soldierAttack错误");
        }
       
        var soldier = this.getSoldier(e.data.id);
        if(soldier == null)
        {
            return;
        }
        
        this.solder_attacking = true;
        var arr: number[] = soldier.vo.data;
        if(soldier.vo.derection == FightLogic.SOLDIER_LIST_TYPE_BIG) {//如果是大战士，只要计算2个
            arr = arr.slice(2);
        }

        var states: number[] = [];//0去城墙 1到达城墙，前往第一个敌人 2到达第一个敌人后，并前往后面攻击后面敌人 3没有敌人一路到底
        for(var i:number=0;i<arr.length;i++){
            states[i] = 0;
        }
        var enemys: number[][] = [];
        var attack_times: number[] = [];
        var tw = egret.Tween.get(soldier,{
            onChange: () => {
                //士兵在行动过程中的刷新
                for(var i: number = 0;i < arr.length;i++) {
                    var state = states[i];
                    console.log("soldier:"+i+":" + soldier.y + "----:" + "state:" + state);
                    if(state == 0) {
                        if(soldier.y <= 330)//第一次到达城墙，变成球，同时改变state
                        {
                            soldier.change();
                            //计算敌人位置
                            var column: number = arr[i] % 6;
                            var enemy_positions = this.getColumnEnemys(column);
                            enemys.push(enemy_positions);
                            attack_times.push(0);
                            if(enemy_positions.length == 0) {
                                states[i] = 3;
                            }
                            else {
                                states[i] = 1;
                            }
                        }
                    }
                    else if(state == 1) {
                        var first_enemy_position = enemys[i][0];//循环处理，第一个敌人处理过了就移除，然后处理第二个，如果有这个必要
                        if(first_enemy_position == null)
                        {
                            states[i] = 3;
                            continue;
                        }
                        var first_enemy = this.enemy_arr[first_enemy_position];
                        if(first_enemy != null)
                        {
                            if (soldier.y <= first_enemy.y)//战士移动到第一个敌人的位置，发生战斗
                            {
                                //计算伤害
                                var damage = FightLogic.getInstance().getGemDamage(soldier.vo.derection);
                                //战士攻击动画效果,特效放完检测是否死亡
                                soldier.bombEffectPlay(i);
                                switch (soldier.vo.gem_type)
                                {
                                    case FightLogic.GEM_TYPE_YELLOW:
                                        soldier.soldierDiappear(i);
                                        //对第一排及其后面三排位置上造成伤害，大战士对第一排及其后面七排位置上造成伤害
                                        var l: number = soldier.vo.derection == FightLogic.SOLDIER_LIST_TYPE_BIG ? 8 : 4;
                                        for (var k: number = 0; k < l; k++)
                                        {
                                            var index = first_enemy_position - k * 6;
                                            if (this.enemy_arr[index] != null)
                                            {
                                                this.enemy_arr[index].damage(k == 0 ? damage : damage / 2);//后面的位置造成一半伤害
                                                if (this.enemy_arr[index].vo.hp <= 0)
                                                {
                                                    this.removeEnemy(index);
                                                }
                                            }
                                        }
                                        states[i] = 3;
                                        break;
                                    case FightLogic.GEM_TYPE_RED:
                                        soldier.soldierDiappear(i);
                                        if (soldier.vo.derection == FightLogic.SOLDIER_LIST_TYPE_BIG)
                                        {//如果是大战士，要穿透一共攻击2次
                                            attack_times[i] = 2;
                                        }
                                        //对第一排攻击并对左右两侧相邻位置造成一半伤害，大战士对前两排敌人造成伤害并对左右两侧相邻位置造成一半伤害
                                        var red_arr: number[] = [];
                                        red_arr.push(first_enemy_position);
                                        red_arr.push((FightLogic.getInstance().getNearPostion(first_enemy_position)));
                                        red_arr.push((FightLogic.getInstance().getNearPostion(first_enemy_position, false)));
                                        for (var k: number = 0; k < red_arr.length; k++)
                                        {
                                            var index = red_arr[k];
                                            if (this.enemy_arr[index] != null)
                                            {
                                                this.enemy_arr[index].damage(i == 0 ? damage : damage / 2);//左右的位置造成一半伤害
                                            }
                                            if (this.enemy_arr[index] != null && this.enemy_arr[index].vo.hp <= 0)
                                            {
                                                this.removeEnemy(index);
                                            }
                                        }
                                        enemys[i].shift();//攻击一次以后把第一个敌人删除
                                        attack_times[i]--;
                                        if (attack_times[i] <= 0)//攻击次数没了
                                        {
                                            states[i] = 3;
                                        }
                                        break;
                                    case FightLogic.GEM_TYPE_GREEN:
                                        if (soldier.vo.derection == FightLogic.SOLDIER_LIST_TYPE_BIG)
                                        {//如果是大战士，要穿透一共攻击2次
                                            attack_times[i] = 2;
                                        }
                                        //对第一排攻击并击退6步，大战士对前两排敌人造成伤害并击退6步
                                        var tartY: number = first_enemy.y -
                                            FightLogic.getInstance().step_height * FightLogic.GREEN_GEM_REPUSLE;//移动到被击退的位置
                                        egret.Tween.get(first_enemy).to({ y: tartY }, 600).call(() =>
                                        {
                                            first_enemy.damage(damage);
                                            if (first_enemy.vo.hp <= 0)
                                            {
                                                this.removeEnemy(first_enemy_position);
                                            }
                                            else
                                            {
                                                if (first_enemy_position - 6 * 5 < 0)
                                                {//击退到屏幕外面去了
                                                    this.removeEnemy(first_enemy_position);
                                                }
                                                else
                                                {
                                                    this.enemy_arr[first_enemy_position] = null;
                                                    first_enemy.setPosition(first_enemy_position - 6 * 5);
                                                    this.enemy_arr[first_enemy_position - 6 * 5] = first_enemy;
                                                    this.changeEnemyDisplayIndex(first_enemy_position - 6 * 5);
                                                }
                                            }
                                        }, this);
                                        enemys[i].shift();//攻击一次以后把第一个敌人删除
                                        attack_times[i]--;
                                        if (attack_times[i] <= 0)//攻击次数没了
                                        {
                                            states[i] = 3;
                                        }
                                        break;
                                    case FightLogic.GEM_TYPE_BLUE:
                                        soldier.soldierDiappear(i);
                                        if (soldier.vo.derection == FightLogic.SOLDIER_LIST_TYPE_BIG)
                                        {//如果是大战士，要穿透一共攻击2次
                                            attack_times[i] = 2;
                                        }
                                        //对第一排攻击并冰封2回合，大战士对前两排敌人造成冰冻伤害并冰封3回合 < br >
                                        first_enemy.damage(damage);
                                        first_enemy.freeze(2);
                                        if (first_enemy.vo.hp <= 0)
                                        {
                                            this.removeEnemy(first_enemy_position);
                                        }
                                        enemys[i].shift();//攻击一次以后把第一个敌人删除
                                        attack_times[i]--;
                                        if (attack_times[i] <= 0)//攻击次数没了
                                        {
                                            states[i] = 3;
                                        }
                                        break;
                                    case FightLogic.GEM_TYPE_PINK:
                                        if (soldier.vo.derection == FightLogic.SOLDIER_LIST_TYPE_BIG)
                                        {//如果是大战士，要穿透一共攻击2次
                                            attack_times[i] = 99;
                                        }
                                        else
                                        {
                                            attack_times[i] = 2;
                                        }
                                        soldier.soldierDiappear(i);
                                        //对前两排敌人攻击并造成持续伤害2回合，大战士对当前屏幕对应列所有敌人造成伤害并造成持续伤害<br>
                                        first_enemy.damage(damage);
                                        first_enemy.dot(2, damage / 2);
                                        if (first_enemy.vo.hp <= 0)
                                        {
                                            this.removeEnemy(first_enemy_position);
                                        }
                                        enemys[i].shift();//攻击一次以后把第一个敌人删除
                                        attack_times[i]--;
                                        if (attack_times[i] <= 0)//攻击次数没了
                                        {
                                            states[i] = 3;
                                        }
                                        break;
                                    case FightLogic.GEM_TYPE_BLACK:
                                        soldier.soldierDiappear(i);
                                        if (soldier.vo.derection == FightLogic.SOLDIER_LIST_TYPE_BIG)
                                        {//如果是大战士，要穿透一共攻击2次
                                            attack_times[i] = 2;
                                        }
                                        //对当前列及其左右两列的后面五排（共六排）造成毁灭伤害，大战士对第二排敌人造成相同效果
                                        //（如果第一排攻击时已经把第二排干掉了，则没有了）
                                        var black_arr: number[] = [];
                                        black_arr.push(first_enemy_position);
                                        black_arr.push((FightLogic.getInstance().getNearPostion(first_enemy_position)));
                                        black_arr.push((FightLogic.getInstance().getNearPostion(first_enemy_position, false)));
                                        for (var k: number = 0; k < black_arr.length; k++)
                                        {
                                            if (black_arr[k] != -1)
                                            {
                                                for (var j: number = 0; j < 6; j++)
                                                {
                                                    if (this.enemy_arr[black_arr[k] - j] != null)
                                                    {
                                                        this.removeEnemy(black_arr[k] - j);
                                                    }
                                                }
                                            }
                                        }
                                        enemys[i].shift();//攻击一次以后把第一个敌人删除
                                        attack_times[i]--;
                                        if (attack_times[i] <= 0)//攻击次数没了
                                        {
                                            states[i] = 3;
                                        }
                                        break;
                                }
                        }
                        
                        }
                    }
                    else if(state == 3) {//已经打完不用管了

                    }
                }
            },onChangeObj: this
        });

        tw.to({ y: -100 },1000).call(() => {
            //战士攻击结束
            this.solder_attacking = false;
            if(soldier != null && soldier.parent != null) {
                this.removeSoldier(soldier.vo.id);
                soldier.parent.removeChild(soldier);
                FightLogic.getInstance().is_gem_move = false;
                this.checkDangerous();//检测是否解除危险
            }
            if(this.combo_soldier.length > 0){
                this.soldierComboReal(this.combo_soldier);
            }
        },this);

        FightLogic.getInstance().gemComplement(soldier.vo);//战士攻击以后，后面的宝石要跟随移动并补充
    }
    
    /**敌人被击退后，改变其深度
     * @param i 当前敌人的位置*/
    private changeEnemyDisplayIndex(i:number):void
    {
        var pos:number = i + 6;
        var up_index:number = -1;
        while(pos < this.max_enemy)
        {
            if(this.enemy_arr[pos] != null){
                up_index = this.enemy_con.getChildIndex(this.enemy_arr[pos]);
                break;
            }
            pos += 6;
        }
        if(up_index != -1){
            this.enemy_con.setChildIndex(this.enemy_arr[i],up_index);
        }
    }

    /**获取该列的所有敌人的位置*/
    private getColumnEnemys(n: number,num: number = 0): number[] {
        var arr: number[] = [];
        var i: number = this.max_enemy - 6 + n;
        while(i >= 0) {
            if(this.enemy_arr[i] != null) {
                arr.push(i);
                if(num > 0)
                {
                    if(arr.length >= num) {
                        return arr;
                    }
                }
            }
            i -= 6;
        }
        return arr;
    }

    /**根据vo寻找当前图上的战士*/
    private getSoldier(id: number): SoldierListView {
        for(var i: number = 0;i < this.soldier_arr.length;i++) {
            var soldier = this.soldier_arr[i];
            if(soldier.vo.id == id) {
                return soldier;
            }
        }
        return null;
    }

    /**合成战士*/
    private soldierCompose(e: MyUIEvent): void {
        var arr: SoldierVO[] = e.data;
        this.soldierComposeReal(e.data);

    }
    private soldierComposeReal(arr: SoldierVO[]): void {
        if(this.soldier_arr == null) {
            this.soldier_arr = [];
        }
        for(var i: number = 0;i < arr.length;i++) {
            var vo: SoldierVO = arr[i];
            if(!this.hasThisSoldier(vo)) {//因为连击的时候这个数组有可能是原来就有的不是合成的
                var soldier: SoldierListView = new SoldierListView(vo);
                soldier.x = this.gem_con.x + this.gem_arr[vo.data[0]].x;
                soldier.y = this.gem_con.y + this.gem_arr[vo.data[0]].y;
                this.addChild(soldier);
                this.soldier_arr.push(soldier);
                this.setGemDisappear(vo.data);
            }
        }
    }
    
    /**因为连击的时候这个数组有可能是原来就有的不是合成的*/
    private hasThisSoldier(vo:SoldierVO):boolean{
        for(var i:number=0;i<this.soldier_arr.length;i++){
            if(this.soldier_arr[i].vo.id == vo.id){
                return true;
            }
        }
        return false;
    }

    /**合成战士以后原来位置的宝石暂时消失*/
    private setGemDisappear(arr: number[]): void {
        for(var i: number = 0;i < arr.length;i++) {
            this.gem_arr[arr[i]].setAppear(false);
        }
    }

    /**宝石操作*/
    private operatorGem(e: MyUIEvent): void {
        var type: number = e.data.type;
        var last: number = e.data.last;
        var target: number = e.data.target;
        if(last > -1) {
            this.last_gem = this.gem_arr[last];
        }
        if(target > -1) {
            this.target_gem = this.gem_arr[target];
        }
        if(type == FightLogic.GEM_OPERATOR_CLICK) {
            if(this.last_gem != null) {
                this.last_gem.startTween(false);
                this.last_gem = null;
            }
            if(this.target_gem != null) {
                this.target_gem.startTween(true);
            }
        }
        else if(type == FightLogic.GEM_OPERATOR_CLICK_CANCEL) {
            if(this.last_gem != null) {
                this.last_gem.startTween(false);
                this.last_gem = null;
            }
        }
        else if(type == FightLogic.GEM_OPERATOR_MOVE) {
            if(this.last_gem != null && this.target_gem != null) {
                this.gemMove();
            }
        }
        else if(type == FightLogic.GEM_OPERATOR_NEW_CLICK) {
            if(this.last_gem != null) {
                this.last_gem.startTween(false);
                this.last_gem = null;
            }
            if(this.target_gem != null) {
                this.target_gem.startTween(true);
            }
        }
    }

    private gemMove(): void {
        this.last_gem.startTween(false);
        var lastX: number = this.last_gem.x;
        var lastY: number = this.last_gem.y;
        var tarX: number = this.target_gem.x;
        var tarY: number = this.target_gem.y;
        var t1 = egret.Tween.get(this.last_gem);
        var t2 = egret.Tween.get(this.target_gem);
        FightLogic.getInstance().is_gem_move = true;
        t1.to({ x: tarX,y: tarY },this.gem_move_time).call(this.gemMoveFinish,this);
        t2.to({ x: lastX,y: lastY },this.gem_move_time);

        this.enemysAction();
    }

    private gemMoveFinish(): void {
        FightLogic.getInstance().is_gem_move = false;

        //宝石数组2个交换
        this.gem_arr[this.last_gem.vo.index] = this.target_gem;
        this.gem_arr[this.target_gem.vo.index] = this.last_gem;

        //2个宝石的索引交换
        var i: number = this.last_gem.vo.index;
        this.last_gem.setIndex(this.target_gem.vo.index);
        this.target_gem.setIndex(i);

        //因为已经交换过了，这里要填原来的
        FightLogic.getInstance().changeGem(this.target_gem.vo.index,this.last_gem.vo.index);
        this.last_gem = null;
        this.target_gem = null;
    }

    private pauseClick(): void {
        UIManager.getInstance().openSecondUI(new FightPauseUI());
    }

    private closeUI(): void {
        if(this.parent != null) {
            this.parent.removeChild(this);
        }
    }

    private clearGems(): void {

    }

    private clearLastTargetGem() {
        if(this.last_gem != null) {
            if(this.last_gem.parent != null) {
                this.last_gem.parent.removeChild(this.last_gem);
            }
            this.last_gem.clear();
            this.last_gem = null;
        }
        if(this.target_gem != null) {
            if(this.target_gem.parent != null) {
                this.target_gem.parent.removeChild(this.target_gem);
            }
            this.target_gem.clear();
            this.target_gem = null;
        }
    }

    private stopActions(): void {
        egret.Tween.removeTweens(this);
    }

    private clear(): void {
        this.pause_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.pauseClick,this);
        FightLogic.getInstance().removeEventListener(MyUIEvent.FIGHT_CLOSEUI,this.closeUI,this);
        FightLogic.getInstance().removeEventListener(MyUIEvent.FIGHT_GEM_OPERATOR,this.operatorGem,this);
        FightLogic.getInstance().removeEventListener(MyUIEvent.FIGHT_SOLDIER_COMPOSE,this.soldierCompose,this);
        FightLogic.getInstance().removeEventListener(MyUIEvent.FIGHT_SOLDIER_ATTACK,this.soldierAttack,this);
        FightLogic.getInstance().removeEventListener(MyUIEvent.FIGHT_GEM_COMPLEMENT,this.gemComplement,this);
        FightLogic.getInstance().removeEventListener(MyUIEvent.FIGHT_SOLDIER_COMBO,this.soldierCombo,this);
    }
}
