/**
 *
 * @author 
 *
 */
class HttpCommand {
	public constructor() {
	}
	
	private static instance:HttpCommand;
	public static getInstance():HttpCommand
	{
	    if(this.instance == null)
        {
            this.instance = new HttpCommand();
        }
        return this.instance;
	}
	
    private http_url: string = "http://api.fx1q.com/";
    private http_key: string = "Vbu1WSodPL!4fNg3";
    private http_head: string = "Accept:application/vnd.qq5.v1+json;charset=UTF-8";
	
	public test():void
	{
        var request = new egret.HttpRequest();
        request.responseType = egret.HttpResponseType.TEXT;
        var data: string = this.getString("");
        request.open("http://api.qq5.com/res/news",egret.HttpMethod.POST);
        request.setRequestHeader("Content-Type",this.http_head);
        request.send();
        request.addEventListener(egret.Event.COMPLETE,this.onGetComplete,this);
        request.addEventListener(egret.IOErrorEvent.IO_ERROR,this.onGetIOError,this);
        request.addEventListener(egret.ProgressEvent.PROGRESS,this.onGetProgress,this);
	}
	
    private onGetComplete(e: egret.Event): void {
        console.log("postComplete"+e);
    }
    
    private onGetIOError(e: egret.Event): void {
        var request: egret.HttpRequest = (e.currentTarget as egret.HttpRequest).response;
        console.log("postError:" + e);
        console.log("postError:" + request.response);
        console.log("postError:" + e.data);
    }
    
    private onGetProgress(e: egret.Event): void {
        console.log("postProgress"+e);
    }
    
    /**
    * qq5采用json数据
    */
    public getString(data:string):string
    {
        var data64: string = Base64Util.encode(data);
        var time:string = Math.floor(new Date().getTime() / 1000).toString();
        return "&data=" + data64  + 
            "&time=" + time + 
            "&sign=" + new md5().hex_md5(data64 + time + this.http_url)+
            "&device_type=" + "android" + 
            "&version=" + "1.2.1";
    }
	
}
