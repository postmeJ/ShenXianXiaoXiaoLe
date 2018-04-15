/**
 *
 * @author 
 *
 */
class RoleManager extends egret.EventDispatcher {
    public constructor() {
        super();
    }

    private static instance: RoleManager;
    public static getInstance(): RoleManager {
        if(this.instance == null) {
            this.instance = new RoleManager();
        }
        return this.instance;
    }
    
    public attack:number = 30;
}
