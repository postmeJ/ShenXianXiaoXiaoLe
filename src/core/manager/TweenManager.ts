/**
 *
 * @author 
 *
 */
class TweenManager {
	public constructor() {
	}
	
    private static instance: TweenManager;
    public static getInstance(): TweenManager {
        if(this.instance == null) {
            this.instance = new TweenManager();
        }
        return this.instance;
    }
    
    /**随机取 非0的任意一种*/
    public static TWEEN_UI_RANDOM:          number = -1;
    public static TWEEN_UI_NONE:            number = 0;
    public static TWEEN_UI_MOVE:            number = 1;
    public static TWEEN_UI_SCALE:           number = 2;
    public static TWEEN_UI_SCALE_ROTATION:  number = 3;

    private tween_ui_time: number = 500;
    
    /**对ui进行缓动进入*/
    public uiAppearTween(ui: egret.DisplayObject,type: number,extra: number,callback: Function,thisObj: any): void {
        var tw = egret.Tween.get(ui);
        var w:number = GlobalData.GameStage_width;
        var h:number = GlobalData.GameStage_height;
        var xx:number = 0;//目标x
        var yy:number = 0;//目标y
        //先根据类型初始化状态 
        if(type == TweenManager.TWEEN_UI_MOVE)//平移
        {
            ui.anchorOffsetX = w/2;
            ui.anchorOffsetY = h/2;
            if(extra == 0)//向右平移
            {
                ui.x = -w/2;
                ui.y = h/2;
            }
            else if(extra == 1) //向下平移
            {
                ui.x = w/2;
                ui.y = -h/2;
            }
            else if(extra == 2)//向左平移
            {
                ui.x = w * 3/2;
                ui.y = h/2;
            }
            else //向上平移
            {
                ui.x = w/2;
                ui.y = h *3/2;
            }
            if(callback == null) {
                tw.to({ x: w / 2,y: h/2 },this.tween_ui_time);
            } else {
                tw.to({ x: w / 2,y: h/2 },this.tween_ui_time).call(callback,thisObj);
            }
        }
        else if(type == TweenManager.TWEEN_UI_SCALE)//缩放：缩放完成以后原来界面才消失
        {
            if(extra == 0)//从正中间出来
            {
                //中间坐标不用变
                ui.anchorOffsetX = w/2;
                ui.anchorOffsetY = h/2;
                ui.x = w/2;
                ui.y = h/2;
                xx = w/2;
                yy = h/2;
            }
            else if(extra == 1) {//从右上方出来
                ui.anchorOffsetX = w;
                ui.anchorOffsetY = 0;
                ui.x = w * 2;
                ui.y = -h;
                xx = w;
                yy = 0;
            }
            else if(extra == 2)//从右下方出来
            {
                ui.anchorOffsetX = w;
                ui.anchorOffsetY = h;
                ui.x = w * 2;
                ui.y = h * 2;
                xx = w;
                yy = h;
            }
            else if(extra == 3)//从左下方出来
            {
                ui.anchorOffsetX = 0;
                ui.anchorOffsetY = h;
                ui.x = -w;
                ui.y = h * 2;
                xx = 0;
                yy = h;
            }
            else {//从左上方出来
                ui.anchorOffsetX = 0;
                ui.anchorOffsetY = 0;
                ui.x = -w;
                ui.y = -h;
                xx = 0;
                yy = 0;
            }
            ui.scaleX = ui.scaleY = 0;
            if(callback == null) {
                tw.to({ x: xx,y: yy,scaleX: 1,scaleY: 1},this.tween_ui_time);
            } else {
                tw.to({ x: xx,y: yy,scaleX: 1,scaleY: 1},this.tween_ui_time).call(callback,thisObj);
            }

        }
        else if(type == TweenManager.TWEEN_UI_SCALE_ROTATION)//旋转
        {
            ui.alpha = 0;

            if(callback == null) {
                tw.to({ alpha: 1 },this.tween_ui_time);
            } else {
                tw.to({ alpha: 1 },this.tween_ui_time).call(callback,thisObj);
            }
        }
    }
    
    /**对一级UI的缓动退出*/
    public uiDisappearTween(ui:egret.DisplayObject,type:number,extra:number,callback:Function,thisObj:any):void
    {
        var tw = egret.Tween.get(ui);
        var w: number = GlobalData.GameStage_width;
        var h: number = GlobalData.GameStage_height;
        var xx: number = 0;
        var yy: number = 0;
        
        //所有要移出前 先把瞄点和坐标重置一下
        if(type == TweenManager.TWEEN_UI_MOVE)//平移
        {
            ui.anchorOffsetX = w / 2;
            ui.anchorOffsetY = h / 2;
            ui.x = w/2;
            ui.y = h/2;
            if(extra == 0)//向右平移
            {
                xx = w*3/2;
                yy = h/2;
            }
            else if(extra == 1) //向下平移
            {
                xx = w/2;
                yy = h*3/2;
            }
            else if(extra == 2)//向左平移
            {
                xx = -w/2;
                yy = h/2;
            }
            else //向上平移
            {
                xx = w/2;
                yy = -h/2;
            }
            if(callback == null)
            {
                tw.to({ x: xx,y: yy },this.tween_ui_time);
            }else
            {
                tw.to({ x: xx,y: yy },this.tween_ui_time).call(callback,thisObj);
            }
        }
        else if(type == TweenManager.TWEEN_UI_SCALE)
        {
            if(callback == null) {
                tw.to({ alpha: 0 },this.tween_ui_time);
            } else {
                tw.to({ alpha: 0 },this.tween_ui_time).call(callback,thisObj);
            }
        }
        else if(type == TweenManager.TWEEN_UI_SCALE_ROTATION) {
            if(extra == 0)//向右上角
            {
                xx = w;
                yy = -h;
            }
            else if(extra == 1) //向右下平移
            {
                xx = w;
                yy = h;
            }
            else if(extra == 2)//向左下平移
            {
                xx = -w;
                yy = h;
            }
            else //向左上平移
            {
                xx = -w;
                yy = -h;
            }
           
            if(callback == null) {
                tw.to({ x: xx,y: yy,scaleX: 0.01,scaleY: 0.01,rotation: 720 },this.tween_ui_time);
            } else {
                tw.to({ x: xx,y: yy,scaleX: 0.01,scaleY: 0.01,rotation: 720 },this.tween_ui_time).call(callback,thisObj);
            }
        }
    }
    
    /**二级UI的缓动退出，与一级UId差别，方向相反。注意：callback不能为空，必须在callback内删除ui*/
    public uiSecondDisappearTween(ui: egret.DisplayObject,type: number,extra: number,callback: Function,thisObj: any): void {
        var tw = egret.Tween.get(ui);
        var w: number = GlobalData.GameStage_width;
        var h: number = GlobalData.GameStage_height;
        var xx: number = 0;
        var yy: number = 0;

        //所有要移出前 先把瞄点和坐标重置一下
        if(type == TweenManager.TWEEN_UI_MOVE)//平移
        {
            ui.anchorOffsetX = w / 2;
            ui.anchorOffsetY = h / 2;
            ui.x = w / 2;
            ui.y = h / 2;
            if(extra == 0)//进来的时候向右平移，消失的时候向左平移
            {              
                xx = -w / 2;
                yy = h / 2;
            }
            else if(extra == 1) //向上平移
            {
                xx = w / 2;
                yy = -h / 2;
            }
            else if(extra == 2)//向左平移
            {
                xx = w * 3 / 2;
                yy = h / 2;
            }
            else //向上平移
            {
                xx = w / 2;
                yy = h * 3 / 2;
            }
            if(callback == null) {
                tw.to({ x: xx,y: yy },this.tween_ui_time);
            } else {
                tw.to({ x: xx,y: yy },this.tween_ui_time).call(callback,thisObj);
            }
        }
        else if(type == TweenManager.TWEEN_UI_SCALE) {
            //由于进入的时候设置好了，退出时原路返回即可
            tw.to({scaleX: 0,scaleY: 0 },this.tween_ui_time).call(callback,thisObj);
        }
        else if(type == TweenManager.TWEEN_UI_SCALE_ROTATION) {
            if(extra == 0)//向右上角
            {
                xx = w;
                yy = -h;
            }
            else if(extra == 1) //向右下平移
            {
                xx = w;
                yy = h;
            }
            else if(extra == 2)//向左下平移
            {
                xx = -w;
                yy = h;
            }
            else //向左上平移
            {
                xx = -w;
                yy = -h;
            }

            tw.to({ x: xx,y: yy,scaleX: 0.01,scaleY: 0.01,rotation: 720 },this.tween_ui_time).call(callback,thisObj);
        }
    }
}
