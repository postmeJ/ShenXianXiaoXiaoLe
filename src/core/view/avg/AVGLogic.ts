/**
 *
 * @author 
 *
 */
class AVGLogic {
	public constructor() {
	}
	
    private static instance: AVGLogic;
    public static getInstance(): AVGLogic {
        if(this.instance == null) {
            this.instance = new AVGLogic();
        }
        return this.instance;
    }
    
    /**开始剧情*/
    public startAVG(mission_id: number): void {
        
        FightLogic.getInstance().startFight(mission_id);
    }
}
