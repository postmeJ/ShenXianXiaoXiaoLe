/**
 *
 * @author 
 *
 */
class BaseSecondUI extends eui.Component {
    public constructor() {
        super();
        
        //动画需要
        this.anchorOffsetX = GlobalData.GameStage_width / 2;
        this.anchorOffsetY = GlobalData.GameStage_height / 2;
    }
}
