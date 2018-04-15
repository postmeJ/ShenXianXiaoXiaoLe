/**
 *
 * @author 
 *
 */
class StartButton extends BaseButton{
	public constructor(src_str:string) {
    	super(src_str);
	}
	
    protected createChildren() {
        super.createChildren();
        
        this.anchorOffsetX = this.bg.width/2;
        this.anchorOffsetY = this.bg.height;
        this.bottom = 50;
        this.horizontalCenter = 0;
    }
}
