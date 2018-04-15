/**
 *
 * @author 
 *
 */
class DataManager extends egret.EventDispatcher {
    public constructor() {
        super();
    }

    private static instance: DataManager;
    public static getInstance(): DataManager {
        if(this.instance == null) {
            this.instance = new DataManager();
        }
        return this.instance;
    }
    
    private enemy_arr:Object[];
    private wall_arr:Object[];
    
    public initJsonData():void
    {
        RES.getResByUrl("Definfos_json",this.DefinfosCompelte,this,RES.ResourceItem.TYPE_JSON);
        RES.getResByUrl("WallData_json",this.WallDataCompelte,this,RES.ResourceItem.TYPE_JSON);
    }
    
    public getEnemyVOByID(id:number):EnemyVO
    {
        var vo:EnemyVO = new EnemyVO();
        var i:number = Math.floor(Math.random() * this.enemy_arr.length);//临时随机，待服务器发正确id
        var o:Object = this.enemy_arr[i];
        vo.id = o['id'];
        vo.lv = parseInt(o['lv']);
        vo.name = o['name'];
        vo.hp = vo.energy = parseInt(o['energy']);
        vo.type = parseInt(o['type']);
        vo.img = parseInt(o['img']);
        vo.attacktype = parseInt(o['attacktype']);
        vo.dropjb = parseInt(o['dropjb']);
        vo.exp = parseInt(o['exp']);
        vo.speed = parseInt(o['speed']);
        vo.attack = parseInt(o['attack']);
        return vo;
    }
    
    public getWallVOByLevel(lv:number):WallVO
    {
        var vo:WallVO = new WallVO();
        var o:Object = this.wall_arr[lv-1];
        vo.id = lv - 1;
        vo.lv = lv;
        vo.gold = o['gold'];
        vo.name = o['name'];
        vo.max_hp = o['hp'];
        return vo;
    }
    
    public getJsonData(src:string):any
    {
        switch(src){
            case "Definfos_json":
                return this.enemy_arr;
            case "WallData_json":
                return this.wall_arr;
        }
        return null;
    }
    
    private DefinfosCompelte(e:any):void
    {
        this.enemy_arr = e;
    }
    
    private WallDataCompelte(e:any)
    {
        this.wall_arr = e;
    }
}
