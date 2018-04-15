/**
 *
 * @author 
 *
 */
class ChapterSelect extends eui.Component{
    
    private select:eui.Image;
    private chapter_arr:eui.Image[];
    private chapter1: eui.Image;
    private chapter2: eui.Image;
    private chapter3: eui.Image;
    private chapter4: eui.Image;
    
	public constructor() {
    	super();
        this.skinName = "ChapterSelectSkin";
        this.horizontalCenter = 0;
        this.top = 60;
        
        this.init();
	}
	
	private init():void
	{
        this.chapter_arr = [this.chapter1,this.chapter2,this.chapter3,this.chapter4];
        this.chapter1.filters = this.chapter2.filters = FilterUtil.getGrayFilter();
	}
	
	public setSelect(i:number):void
	{
    	  if(i>1)
        {
              
        }
	}
}
