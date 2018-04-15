/**
 *
 * @author 
 *
 */
class MyUIEvent extends egret.Event{
    public constructor(type: string,bubbles: boolean = false,cancelable: boolean = false) {
        super(type,bubbles,cancelable);
    }
	
    public data:any = null;
    /**登录*/
    public static LOGIN_IN: string = "LOGIN_IN";
    
    /**切换章节*/
    public static CHANGE_CHAPTER: string = "CHANGE_CHAPTER";
    /**打开关卡*/
    public static OPEN_MISSION_LIST: string = "OPEN_MISSION_LIST";
    /**更新小关卡界面*/
    public static UPDATE_MISSION_ITEM: string = "UPDATE_MISSION_ITEM";
    /**关闭菜单界面*/
    public static CLOSE_MENU: string = "CLOSE_MENU";
    
    
    /**战斗界面——关闭界面*/
    public static FIGHT_CLOSEUI: string = "FIGHT_CLOSEUI";
    /**战斗界面--宝石操作*/
    public static FIGHT_GEM_OPERATOR: string = "FIGHT_GEM_OPERATOR";
    /**战斗界面--战士攻击*/
    public static FIGHT_SOLDIER_ATTACK: string = "FIGHT_SOLDIER_ATTACK";
    /**战斗界面--合成战士*/
    public static FIGHT_SOLDIER_COMPOSE: string = "FIGHT_SOLDIER_COMPOSE";
    /**战斗界面--攻击后宝石补全*/
    public static FIGHT_GEM_COMPLEMENT: string = "FIGHT_GEM_COMPLEMENT";
    /**战斗界面--连击：战士合成+自动攻击*/
    public static FIGHT_SOLDIER_COMBO: string = "FIGHT_SOLDIER_COMBO";
    
    /**加载资源：章节资源*/
    public static LOAD_STORY_CHAPTER: string = "LOAD_STORY_CHAPTER";
}
