/**
 *
 * @author 
 *
 */
class BaseFirstUI extends eui.Component{
	public constructor() {
    	super();
    	
        this.addChild(ViewUtil.getShape(GlobalData.GameStage_width,GlobalData.GameStage_height,0x000000,0));
        this.anchorOffsetX = GlobalData.GameStage_width / 2;
        this.anchorOffsetY = GlobalData.GameStage_height / 2;
        this.verticalCenter = this.horizontalCenter = 0;
	}
}
