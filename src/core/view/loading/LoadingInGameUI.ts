/**
 *
 * @author 
 *
 */
class LoadingInGameUI extends eui.Component{
	public constructor() {
    	super();
        this.skinName = "resource/assets/skins/LoadingSkin.exml";
	}
	
    private progress_txt: eui.Label;
    private progress_bar: eui.Image;
    private progress_bar_mask: eui.Image;
    private bar_width_min: number = 50;
    private bar_width_max: number = 338;
	
    public childrenCreated() {
        this.reset();

    }

    public reset(): void {
        this.progress_txt.text = "";
        this.progress_bar.width = this.bar_width_min;
        this.progress_bar.mask = this.progress_bar_mask;
    }

    public setText(str): void {

    }

    public setProgress(current,total): void {
        this.progress_bar.width = (current / total) * this.bar_width_max;
        this.progress_txt.text = "资源加载中..." + current + "/" + total;
    }

    public clear(): void {
        this.reset();
    }
}
