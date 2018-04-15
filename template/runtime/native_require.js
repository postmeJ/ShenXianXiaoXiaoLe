
var game_file_list = [
    //以下为自动修改，请勿修改
    //----auto game_file_list start----
	"libs/modules/egret/egret.js",
	"libs/modules/egret/egret.native.js",
	"libs/modules/eui/eui.js",
	"libs/modules/res/res.js",
	"libs/modules/tween/tween.js",
	"libs/modules/game/game.js",
	"libs/modules/game/game.native.js",
	"bin-debug/AssetAdapter.js",
	"bin-debug/core/command/HttpCommand.js",
	"bin-debug/core/data/GlobalData.js",
	"bin-debug/core/data/StringConst.js",
	"bin-debug/core/data/UIConst.js",
	"bin-debug/core/event/MyUIEvent.js",
	"bin-debug/core/manager/DataManager.js",
	"bin-debug/core/manager/LoadManager.js",
	"bin-debug/core/manager/RoleManager.js",
	"bin-debug/core/manager/SoundManager.js",
	"bin-debug/core/manager/TweenManager.js",
	"bin-debug/core/manager/UIManager.js",
	"bin-debug/core/utils/Base64Util.js",
	"bin-debug/core/utils/FilterUtil.js",
	"bin-debug/core/utils/md5.js",
	"bin-debug/core/utils/ViewUtil.js",
	"bin-debug/core/view/avg/AVGLogic.js",
	"bin-debug/core/view/avg/AvgMainUI.js",
	"bin-debug/core/view/component/BaseButton.js",
	"bin-debug/core/view/component/BaseFirstUI.js",
	"bin-debug/core/view/component/BasePopUI.js",
	"bin-debug/core/view/component/BaseSecondUI.js",
	"bin-debug/core/view/component/MyProgressBar.js",
	"bin-debug/core/view/fight/EnemyView.js",
	"bin-debug/core/view/fight/FightLogic.js",
	"bin-debug/core/view/fight/FightMainUI.js",
	"bin-debug/core/view/fight/FightPauseUI.js",
	"bin-debug/core/view/fight/FightResult.js",
	"bin-debug/core/view/fight/GemView.js",
	"bin-debug/core/view/fight/SoldierListView.js",
	"bin-debug/core/view/fight/SoldierView.js",
	"bin-debug/core/view/fight/WallView.js",
	"bin-debug/core/view/loading/LoadingInGameUI.js",
	"bin-debug/core/view/loading/LoadingUI.js",
	"bin-debug/core/view/loading/PreLoadUI.js",
	"bin-debug/core/view/login/LoginMain.js",
	"bin-debug/core/view/login/StartButton.js",
	"bin-debug/core/view/logo/LogoAnimation.js",
	"bin-debug/core/view/main/MenuUI.js",
	"bin-debug/core/view/main/SettingUI.js",
	"bin-debug/core/view/main/ShopUI.js",
	"bin-debug/core/view/pop/PopWindow.js",
	"bin-debug/core/view/story/ChapterSelect.js",
	"bin-debug/core/view/story/ChapterSelectUI.js",
	"bin-debug/core/view/story/ChapterUI.js",
	"bin-debug/core/view/story/MissionBtn.js",
	"bin-debug/core/view/story/MissionItem.js",
	"bin-debug/core/view/story/MissionUI.js",
	"bin-debug/core/view/story/StoryLogic.js",
	"bin-debug/core/view/story/StoryUI.js",
	"bin-debug/core/vo/EnemyVO.js",
	"bin-debug/core/vo/GemVO.js",
	"bin-debug/core/vo/SoldierVO.js",
	"bin-debug/core/vo/WallVO.js",
	"bin-debug/Main.js",
	"bin-debug/ThemeAdapter.js",
	//----auto game_file_list end----
];

var window = this;

egret_native.setSearchPaths([""]);

egret_native.requireFiles = function () {
    for (var key in game_file_list) {
        var src = game_file_list[key];
        require(src);
    }
};

egret_native.egretInit = function () {
    egret_native.requireFiles();
    egret.TextField.default_fontFamily = "/system/fonts/DroidSansFallback.ttf";
    //egret.dom为空实现
    egret.dom = {};
    egret.dom.drawAsCanvas = function () {
    };
};

egret_native.egretStart = function () {
    var option = {
        //以下为自动修改，请勿修改
        //----auto option start----
		entryClassName: "Main",
		frameRate: 30,
		scaleMode: "showAll",
		contentWidth: 640,
		contentHeight: 960,
		showPaintRect: false,
		showFPS: false,
		fpsStyles: "x:0,y:0,size:30,textColor:0x00c200,bgAlpha:0.9",
		showLog: false,
		logFilter: "",
		maxTouches: 2,
		textureScaleFactor: 1
		//----auto option end----
    };

    egret.native.NativePlayer.option = option;
    egret.runEgret();
    egret_native.Label.createLabel(egret.TextField.default_fontFamily, 20, "", 0);
    egret_native.EGTView.preSetOffScreenBufferEnable(true);
};