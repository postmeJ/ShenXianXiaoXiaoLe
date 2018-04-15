/**
 *
 * @author 
 *
 */
class FilterUtil {
	public constructor() {
	}	
	
    /**灰色滤镜*/
    public static getGrayFilter(): egret.ColorMatrixFilter[] {
        var colorMatrix = [
            0.3,0.6,0,0,0,
            0.3,0.6,0,0,0,
            0.3,0.6,0,0,0,
            0,0,0,1,0
        ];
        var colorFlilter = new egret.ColorMatrixFilter(colorMatrix);
        return [colorFlilter];
    }
    
    /**模糊滤镜*/
    public static getBlurFilter(): egret.BlurFilter[] {
        var blurFliter = new egret.BlurFilter(1,1);
        return [blurFliter];
    }
}
