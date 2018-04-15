/**
 *
 * @author 
 *
 */
class LoadManager extends egret.EventDispatcher{
	public constructor() {
    	super();
	}
	
    private static instance: LoadManager;
    public static getInstance(): LoadManager {
        if(this.instance == null) {
            this.instance = new LoadManager();
        }
        return this.instance;
    }
    
    private loading_view:LoadingInGameUI;
    
    private event_name: string;
    private group_name:string;
    private is_loading:boolean;
    
    public startLoad(groupname: string,keys: string[],event_name:string, override: boolean=false)
    {
        if(this.loading_view == null)
        {
            this.loading_view = new LoadingInGameUI();
        }
        UIManager.getInstance().loadingCon.addChild(this.loading_view);
        this.group_name = groupname;
        this.event_name = event_name;
        
        RES.createGroup(groupname,keys,override);
        
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE,this.onResourceLoadComplete,this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR,this.onResourceLoadError,this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS,this.onResourceProgress,this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR,this.onItemLoadError,this);
        
        RES.loadGroup(groupname);
    }
    
    private onResourceLoadComplete(event: RES.ResourceEvent): void {
        if(event.groupName == this.group_name) {
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE,this.onResourceLoadComplete,this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR,this.onResourceLoadError,this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS,this.onResourceProgress,this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR,this.onItemLoadError,this);
            
            this.dispatchComplete();
        }
        if(this.loading_view != null && this.loading_view.parent != null)
        {
            this.loading_view.clear();
            this.loading_view.parent.removeChild(this.loading_view);
        }
    }
    
    private dispatchComplete():void
    {
        var event:MyUIEvent = new MyUIEvent(this.event_name);
        event.data = {groupname:this.group_name};
        this.dispatchEvent(event);
    }

    private onItemLoadError(event: RES.ResourceEvent): void {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    }

    private onResourceLoadError(event: RES.ResourceEvent): void {
        console.warn("Group:" + event.groupName + " has failed to load");
        this.onResourceLoadComplete(event);
    }

    private onResourceProgress(event: RES.ResourceEvent): void {
        if(event.groupName == this.group_name && this.loading_view != null) {
            this.loading_view.setProgress(event.itemsLoaded,event.itemsTotal);
        }
    }
}
