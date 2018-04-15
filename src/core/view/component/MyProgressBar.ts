/**
 *
 * @author 
 *
 */
class MyProgressBar extends eui.Component{
    
    private progress_txt: eui.Label;
    private progress_bar: eui.Image;
    private progress_bar_mask: eui.Image;
    private bar_width_min: number;
    private bar_width_max: number;
    private current_value:number;
    private current_max:number;
    private target_value:number;
    private target_max:number;
    
	public constructor(skin_str:string,bar_min_width:number,bar_max_width:number) {
    	super();
        this.skinName = skin_str;
        this.bar_width_min = bar_min_width;
        this.bar_width_max = bar_max_width;
	}
	
	public setBarMinMax(min:number,max:number):void
	{
        this.bar_width_min = min;
        this.bar_width_max = max;
	}
	
    public childrenCreated() {
        this.reset();
    }

    public reset(): void {
        if(this.progress_txt != null) 
        {
            this.progress_txt.text = "";
        }
        this.progress_bar.width = this.bar_width_min;
        this.progress_bar.mask = this.progress_bar_mask;
        this.current_value = 0;
        this.current_max = 0;
    }

    public setText(str): void {
        if(this.progress_txt != null)
        {
            this.progress_txt.text = str;
        }
    }

    /**设置进度
     * @param current 当前值 (如果有升级，则填升级以后的当前值)
     * @param total 总值 (如果有升级，则填升级以后的总值)
     * @param tween 是否需要动画
     * @param lv_up 是否升级*/
    public setProgress(current,total,tween:boolean=false,lv_up:boolean=false): void {
        current = current < 0 ? 0 : current;
        if(tween)
        {
            this.target_value = current;
            this.target_max = total;
            egret.Tween.removeTweens(this.progress_bar);
            egret.Tween.removeTweens(this);
            var tw = egret.Tween.get(this.progress_bar);
            var tw1 = egret.Tween.get(this,{ onChange: this.updateText,onChangeObj: this });
            var s: number = 1100 - Math.ceil(this.current_value * 10 / this.current_max) * 100;//升级前的缓动时间,离尽头越近,时间越短
            if(lv_up)
            {
                //bar动画：先缓动到顶，执行一些升级特效
                tw.to({ width: this.bar_width_max },s).call(this.levelUp,this);
                /**数字先到max，然后归0，然后继续到目标值*/
                tw1.to({ current_value: this.current_max },s).call(this.txtTweenPause,this);
            }
            else
            {
                var tar_width: number = (current / total) * this.bar_width_max + this.bar_width_min;
                tw.to({ width: tar_width },s);
                tw1.to({ current_value: this.target_value },s);
            }
        }
        else
        {
            this.setText(current + " / " + total);
            this.progress_bar.width = (current / total) * this.bar_width_max + this.bar_width_min;
            this.current_value = current;
            this.current_max = total;
        }
    }
    
    private levelUp():void
    {
        this.progress_bar.width = this.bar_width_min;//先归0
        this.current_max = this.target_max;
        
        //升级特效
        //。。。
        
        egret.Tween.removeTweens(this.progress_bar);
        var tw = egret.Tween.get(this.progress_bar);
        var s: number = Math.ceil(this.target_value * 10 / this.target_max) * 100;//升级前的缓动时间,离尽头越近,时间越短
        var tar_width: number = (this.target_value / this.target_max) * this.bar_width_max + this.bar_width_min;
        tw.to({ width: tar_width },s);
    }
    
    /**升级时 文字第一次tween完归0继续tween*/
    private txtTweenPause():void
    {
        egret.Tween.removeTweens(this);
        var tw1 = egret.Tween.get(this,{ onChange: this.updateText,onChangeObj: this });
        this.current_max = this.target_max;
        this.current_value = 0;
        var s: number = Math.ceil(this.target_value * 10 / this.target_max) * 100;//升级以后的缓动时间
        tw1.to({ current_value: this.target_value },s);
    }
    
    /**文字tween的刷新函数*/
    private updateText():void
    {
        this.current_value = Math.ceil(this.current_value);
        this.setText(this.current_value + " / " + this.current_max);
    }
    
    /**结束以后强制设置一下，防止中途出错*/
    private tweenFinish():void
    {
        this.current_value = this.target_value;
        this.current_max = this.target_max;
        this.setText(this.current_value + " / " + this.current_max);
    }

    public clear(): void {
        egret.Tween.removeTweens(this.progress_bar);
        egret.Tween.removeTweens(this);
        this.progress_txt = null;   
        this.progress_bar = null;
        this.progress_bar_mask = null;
    }
}
