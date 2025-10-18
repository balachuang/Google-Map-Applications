const apps = [
	{
		id: 'LF', title: {en: 'Landmark Finder', zh: '尋找地標'}, path: '1_LandmarkFinder',
		desc: {
			en: 'Find the position of a landmark through two different points of view.',
			zh: '調整兩個 Streeview 的視角, 把你的目標放在中間的圓圈中, 就可以在大地圖上看到目標的所在位置. 點擊目標圖示可以開啟目標附近的 Streeview.'
		}
	},
	{
		id: 'MG', title: {en: 'Magnifier', zh: '地圖放大鏡'}, path: '2_Magnifier',
		desc: {
			en: 'Right-click on the Google Map to toggle a magnifier on it.',
			zh: '調整兩個 Streeview 的視角, 把你的目標放在中間的圓圈中, 就可以在大地圖上看到目標的所在位置. 點擊目標圖示可以開啟目標附近的 Streeview.'
		}
	},
	{
		id: 'RM', title: {en: 'Rearview Mirror', zh: '街景後視鏡'}, path: '3_RearviewMirror',
		desc: {
			en: 'Look forward and backup on Streeview at the same time.',
			zh: '模擬後視鏡效果.'
		}
	},
	{
		id: 'BP', title: {en: 'The Fastest Way', zh: '最佳行程'}, path: '4_BestPath',
		desc: {
			en: 'Find the best tour for multiple targets.',
			zh: '多點路徑規劃. 幫助你在多個目標點中, 找到最快可以走完的方法.'
		}
	},
	{
		id: 'LC', title: {en: 'Live Camera', zh: '即時影像'}, path: '5_LiveCameraMap',
		desc: {
			en: 'My favorate live cameras.',
			zh: '專門用來記錄我有興趣的線上即時影像. 從影像的內容儘量找到這個像機的地點和拍照方向.'
		}
	},
	{
		id: 'DM', title: {en: 'Dual Maps with Same Zoom Level', zh: '同步縮放'}, path: '6_SyncSizeDualMap',
		desc: {
			en: 'Two maps that can synx zoom level to each other.',
			zh: '兩個會同步縮放的地圖, 可以用來方便的比較兩個區址的大小.'
		}
	},
	{
		id: 'HS', title: {en: 'Horizontal Split Map and Street View', zh: '左右分割'}, path: '7_HorizontalSplit',
		desc: {
			en: 'Horizontal Split Map and Street View.',
			zh: '把地圖和街景視圖左右分開, 讓寬螢幕看起來更舒服.'
		}
	},
	{
		id: 'SM', title: {en: 'Shape on Map', zh: '幾何形狀'}, path: '8_ShapeOnMap',
		desc: {
			en: 'Draw geometric shapes on Google Maps.',
			zh: '在 Google Map 上繪製幾何形狀.'
		}
	},
	// {
	// 	id: 'tb_SM', title: {en: 'Fly Simulation', zh: '虛擬飛行'}, path: '9_FlySimulation',
	// 	desc: {
	// 		en: 'Draw geometric shapes on Google Maps.',
	// 		zh: '在 Google Map 上繪製幾何形狀.'
	// 	}
	// },
];

const appDomTemplate = 
	'<div class="col-md-4">                                                    ' +
	' <div class="panel panel-success">                                        ' +
	'  <div class="panel-heading">                                             ' +
	'   <h3 class="panel-title">                                               ' +
	'    <i18n en="{TITLE_EN}" zh-TW="{TITLE_ZH}"></i18n></h3></div><br>       ' +
	'  <center>                                                                ' +
	'   <a href="../{PATH}/main.html">                                         ' +
	'    <img class="img-thumbnail" alt="200x200" src="../{PATH}/tb_{ID}.png"  ' +
	'         data-holder-rendered="true" style="width: 90%;"></a></center>    ' +
	'  <div class="panel-body">                                                ' +
	'   <i18n en="{DESC_EN}" zh-TW="{DESC_ZH}"></i18n><br><br>                 ' +
	'   <a class="btn btn-default" href="../{PATH}/main.html" role="button">   ' +
	'    <i18n en="View details" zh-TW="進入"></i18n> »</a></div></div></div>  ' ;

const menuDomTemplate = '<li id="nav-{ID}"><a href="../{PATH}/main.html"><i18n en="{TITLE_EN}" zh-TW="{TITLE_ZH}"></i18n></a></li>' ;

function generateMenubar(jqMenubarObj, appId)
{
	jqMenubarObj.load('../menubar.html', function(){
		// generate menu item
		let menuHtml = '';
		for (var n=0; n<apps.length; ++n)
		{
			let app = apps[n];
			menuHtml += menuDomTemplate
					.replaceAll('{ID}',       app.id)
					.replaceAll('{PATH}',     app.path)
					.replaceAll('{TITLE_EN}', app.title.en)
					.replaceAll('{TITLE_ZH}', app.title.zh);
		};
		console.log(menuHtml);
		$('#menubar-items').html(menuHtml);

		if (appId != null) $('#nav-' + appId).addClass('active');
		var userLang = navigator.language || navigator.userLanguage;
		$('i18n').each(function(){
			var txt = $(this).attr(userLang);
			$(this).replaceWith(txt);
		});
		// window.setTimeout(function(){
		// }, 500);
	});
}

function generateAppIconHtml()
{
	let realHtml = '';
	for (var n=0; n<apps.length; ++n)
	{
		let app = apps[n];
		realHtml += appDomTemplate
				.replaceAll('{ID}',       app.id)
				.replaceAll('{PATH}',     app.path)
				.replaceAll('{TITLE_EN}', app.title.en)
				.replaceAll('{TITLE_ZH}', app.title.zh)
				.replaceAll('{DESC_EN}',  app.desc.en)
				.replaceAll('{DESC_ZH}',  app.desc.zh);
	}
	return realHtml;
}
