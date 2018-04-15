/**
 *
 * @author 
 *
 */
class StoryUI extends BaseFirstUI{
    private chapter_ui:ChapterUI;//剧情关卡主题
    private new_chapter_ui:ChapterUI;//如果切换章节，因动画需要会用到
    private menu_btn:BaseButton;//菜单按钮
    private chapter_select:ChapterSelectUI;//章节选择
    private menu:MenuUI;//菜单2级界面
    
    private new_chapter_id: number;//需要切换的章节id，如果切换章节，因动画需要会用到
    private chapter_id:number = -1;//当前章节id
    private is_tween:boolean;
    
	public constructor() {
    	  super();
        this.once(egret.Event.ADDED_TO_STAGE,this.onStage,this);
	}
	
	private onStage(e:egret.Event):void
	{
    	  this.new_chapter_id = StoryLogic.getInstance().current_chapterID;
    	 
        this.chapter_select = new ChapterSelectUI();
        this.chapter_select.y = 75;
        this.addChild(this.chapter_select);
        
        this.menu_btn = new BaseButton("menubtnbg_png");
        var bmp = new egret.Bitmap(RES.getRes("caidan_png"));
        bmp.x = (this.menu_btn.bg.width - bmp.width)/2;
        bmp.y = 238;
        this.menu_btn.bg.addChild(bmp);
        this.menu_btn.anchorOffsetX = this.menu_btn.bg.width / 2;
        this.menu_btn.x = GlobalData.GameStage_width/2;
        this.menu_btn.y = GlobalData.GameStage_height - this.menu_btn.bg.height;
        this.addChild(this.menu_btn);
        this.menu_btn.startTween();
        
        this.initEvent();
        
        this.loadChapter();
        
        SoundManager.getInstance().playBgSound(SoundManager.getInstance().sound_switch);
	}
	
	private loadChapter():void
	{
        //组装需要加载的资源
        var groupname: string = "story_" + this.new_chapter_id;
        var keys: string[] = ["story_" + this.new_chapter_id + "_jpg"];

        LoadManager.getInstance().startLoad("story"+this.new_chapter_id,keys,MyUIEvent.LOAD_STORY_CHAPTER);
	}
	
    private initChapter(e:MyUIEvent):void
	{
        if(e.data.groupname != "story"+this.new_chapter_id)
       {
           return;
       }
	    this.new_chapter_ui = new ChapterUI(this.new_chapter_id);
	    if(this.chapter_ui == null)//第一次直接加上
        {
            this.chapter_ui = this.new_chapter_ui;
            this.chapter_id = this.new_chapter_id;
            this.addChildAt(this.chapter_ui,0);
            this.new_chapter_ui = null;
        }
        else
        {
            this.chapter_select.setTween(true);
            this.addChildAt(this.new_chapter_ui,0);
            var tw1 = egret.Tween.get(this.chapter_ui);
            var tw2 = egret.Tween.get(this.new_chapter_ui);
            var goX:number;
            if(this.new_chapter_id < this.chapter_id)
            {
                this.new_chapter_ui.x = -GlobalData.GameStage_width;
                goX = GlobalData.GameStage_width;
            }
            else
            {
                this.new_chapter_ui.x = GlobalData.GameStage_width;
                goX = -GlobalData.GameStage_width;
            }
            tw1.to({ x: goX },500);
            tw2.to({ x: 0 },500).call(this.tweenFinish,this);
        }
	}
	
	private tweenFinish():void
	{
	    if(this.chapter_ui != null && this.chapter_ui.parent != null)
        {
            this.chapter_ui.parent.removeChild(this.chapter_ui);
            this.chapter_ui = null;
        }
        this.chapter_ui = this.new_chapter_ui;
        this.chapter_id = this.new_chapter_id;
        this.new_chapter_ui = null;
        this.chapter_select.setTween(false);
	}
	
	private initEvent():void
	{
    	  this.menu_btn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.clickMenu,this);
    	  StoryLogic.getInstance().addEventListener(MyUIEvent.OPEN_MISSION_LIST,this.openMission,this);
        StoryLogic.getInstance().addEventListener(MyUIEvent.CHANGE_CHAPTER,this.changeChapter,this);
        StoryLogic.getInstance().addEventListener(MyUIEvent.CLOSE_MENU,this.closeMenu,this);
    	  LoadManager.getInstance().addEventListener(MyUIEvent.LOAD_STORY_CHAPTER,this.initChapter,this);
        this.once(egret.Event.REMOVED_FROM_STAGE,this.clear,this);
	}
	
	private openMission(e:MyUIEvent):void
	{
        SoundManager.getInstance().playEffectSound();
        var ui:MissionUI = new MissionUI(this.chapter_id,e.data);
        this.addChild(ui);
	}
	
	private changeChapter(e:MyUIEvent):void
	{
        SoundManager.getInstance().playEffectSound();
	    this.new_chapter_id = e.data.id;
	    this.loadChapter();
	}
	
    private clickMenu(e: TouchEvent):void
	{
        SoundManager.getInstance().playEffectSound();
        if(this.is_tween)
        {
            return;
        }
        
        this.is_tween = true;
        var tw = egret.Tween.get(this.menu_btn);
        tw.to({x:-GlobalData.GameStage_width/2},300).call(this.openMenu,this);
	}
	
	private openMenu():void
	{
	    this.is_tween = false;
	    if(this.menu == null)
        {
            this.menu = new MenuUI(); 
        }
        this.addChild(this.menu);
        this.menu.x = -GlobalData.GameStage_width/2;
        var tw = egret.Tween.get(this.menu);
        tw.to({x:0},300);
	}
	
    private closeMenu():void
	{
    	  this.menu = null;
        this.is_tween = true;
        var tw = egret.Tween.get(this.menu_btn);
        tw.to({ x: GlobalData.GameStage_width / 2 },300).call(this.menuBtnAppear,this);
	}
	
    private menuBtnAppear(): void
    {
        this.is_tween = false;
    }
	
	private clear():void
	{
        this.menu_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.clickMenu,this);
        StoryLogic.getInstance().removeEventListener(MyUIEvent.OPEN_MISSION_LIST,this.openMission,this);
        StoryLogic.getInstance().removeEventListener(MyUIEvent.CHANGE_CHAPTER,this.changeChapter,this);
        StoryLogic.getInstance().removeEventListener(MyUIEvent.CLOSE_MENU,this.closeMenu,this);
        LoadManager.getInstance().removeEventListener(MyUIEvent.LOAD_STORY_CHAPTER,this.initChapter,this);
        egret.Tween.removeAllTweens();
        this.removeChildren();
        this.chapter_select = null;
        this.menu_btn.clear();
        this.menu_btn = null;
        this.menu = null;
	}
}
