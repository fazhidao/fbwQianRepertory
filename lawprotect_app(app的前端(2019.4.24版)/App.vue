<script>
	export default {
		onLaunch() {
			//#ifdef APP-PLUS
			this.initPush();
			this.checkUpdate();
			//#endif
			
			//appid静默登录
			this.loginByAppid();
			
			console.log('launch app');
		},
		onShow() {
			//#ifdef APP-PLUS
			plus.push.clear();
			//#endif
		},
		methods:{
			initPush(){
				plus.push.addEventListener('receive',(msg)=>{
					// console.log(JSON.stringify(msg))
					if(msg.type == 'receive' ){ //ios 推送   iOS本地推送也会触发
						plus.push.createMessage(msg.payload.title,msg.payload.url);
					}else if(msg.payload[0] == "{"){  //安卓推送
						msg = JSON.parse(msg.payload);
						plus.push.createMessage(msg.title,msg.url);
					}
				})
				plus.push.addEventListener('click',(msg)=>{
					// console.log(JSON.stringify(msg))
					if(msg.aps){
						msg.payload = msg.payload.url;
						global.need_go_from_push = msg.payload;
					}else{
						this.goView(msg.payload);
					}
				})
			},
			checkUpdate(){
				let app_version = plus.runtime.version;
				app_version = app_version.split('.');
				app_version = app_version[0]+'.'+app_version[1]+'.'+app_version[2];
				plus.runtime.getProperty(plus.runtime.appid, (widgetInfo)=>{
					uni.getSystemInfo({
						success: (sysinfo) => {
							this.requestApi({
								url: 'checkUpdate',
								data:{
									app_version: app_version,
									wdg_version: widgetInfo.version,
									platform: sysinfo.platform
								},
								success: (data)=>{
									if (data.status == 1) { //热更新
										global.updating = true;
										uni.showToast({
											title: '更新下载中...',
											mask: true,
											duration: 0,
											icon: 'loading'
										});
										uni.downloadFile({
											url: data.url,
											success: (downloadResult) => {
												if (downloadResult.statusCode === 200) {
													plus.runtime.install(downloadResult.tempFilePath, {
														force: true
													}, function() {
														uni.hideToast();
														plus.runtime.restart();
													}, function(e) {});
												}
											}
										});
									}else if(data.status == 2){ //整包更新提示
										global.need_update = true;
										global.force_update = data.force_update;
										global.update_url = data.url;
										global.update_text = data.update_text.split(',');
										uni.hideToast();
									}else{
										uni.hideToast();
									}
								}  
							})
						},
					})
				});
			}
		}
	}
</script>

<style>
	/*每个页面公共css */
	body{
		font-size: 26upx;
		color: #535353;
		background: #F3F3F3;
	}
	.borderY{
		height: 1px;
		background: #CECECE;
		transform: scaleY(0.5);
		transform-origin: 0 100%;
	}
	.borderX{
		width: 1px;
		background: #CECECE;
		transform: scaleX(0.5);
	}
	.absolute_center{
		display: block;
		position: absolute;
		margin: auto;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
	}
	.view_f3f3f3{
		background: #F3F3F3;
	}
	
	.navbar_common{
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		padding-top: 40upx;
		font-size: 34upx;
		background: #FFFFFF;
		text-align: center;
		z-index: 99;
		box-shadow: 0 0 1px #AEAEAE;
	}
	.navbar_transparent{
		position: absolute;
		background: transparent;
		box-shadow: none;
	}
	.navbar_height{
		height: 130upx;
	}
	.navbar_common_back{
		position: absolute;
		left: 0;
		top: 40upx;
		bottom: 0;
		width: 120upx;
		font-size: 24upx;
		display: flex;
		justify-content: center;
		align-items: center;
		/* line-height: 90upx;
		height: 90upx; */
	}
	.navbar_common_back_icon{
		display: block;
		width: 40upx;
		height: 40upx;
		margin: auto 0;
	}
	.navbar_title{
		flex: 1;
		text-align: center;
		line-height: 90upx;
		color: #535353;
		letter-spacing: 2px;
	}
	.navbar_right_icon_box{
		position: absolute;
		top: 40upx;
		bottom: 0;
		right: 0;
		width: 100upx;
	}
	.navbar_right_icon_box image{
		width: 40upx;
		height: 40upx;
	}
	
	.split_line{
		height: 16upx;
		background: #F3F3F3;
	}
	.scroll_view_with_navbar{
		padding-top: 130upx;
	}
	
	.right_arrow{
		width: 16upx;
		height: 32upx;
	}
	
	.icon_row{
		position: relative;
		height: 80upx;
		line-height: 80upx;
		padding-left: 90upx;
		background: #FFFFFF;
	}
	.icon_row_icon{
		width: 50upx;
		height: 50upx;
		left: 20upx;
		right: auto;
	}
	.icon_row_arrow{
		right: 20upx;
		left: auto;
	}
	
	.font_bold{
		font-weight: bold;
	}

	.pagenate_box{
		display: flex;
	}
	.pagenate_btn{
		flex: 0 0 auto;
	}
	.pagenate_page{
		flex: 1;
		text-align: center;
		font-size: 36upx;
	}
	.btn_group{
		display: flex;
		justify-content: space-between;
		padding: 0 40upx;
	}
	.btn_group button{
		width: 40%;
		margin-left: 0;
		margin-right: 0;
	}
	.empty_icon{
		display: block;
		margin: 40upx auto;
		width: 260upx;
		height: 170upx;
	}
	.empty_text{
		text-align: center;
		font-size: 26upx;
		color: #AEAEAE;
	}
	
	.main_btn{
		width: 520upx;
		height: 80upx;
		line-height: 80upx;
		border-radius: 80upx;
		background: #ccb17e;
		box-shadow: 0 0 20px #ccb17e;
		text-align: center;
		color: #FFFFFF;
		font-size: 40upx;
		letter-spacing: 12upx;
	}
	.main_btn:active{
		background: #a58446;
	}
	.main_btn_large{
		width: 90%;
		height: 90upx;
		line-height: 90upx;
		border-radius: 8upx;
		background: #ccb17e;
		box-shadow: 0 0 10px #ccb17e;
		text-align: center;
		color: #FFFFFF;
		font-size: 40upx;
		letter-spacing: 12upx;
	}
	.main_btn_large:active{
		background: #bd913f;
	}
	
	.end_tip{
		text-align: center;
		color: #CECECE;
		text-shadow: 1px 1px 0 #FFFFFF;
		padding: 10upx 0;
	}
	
	.form_box{
		padding-left: 40upx;
		margin-bottom: 40upx;
	}
	.form_row{
		line-height: 90upx;
		display: flex;
		justify-content: space-between;
	}
	.form_row_title{
		flex: none;
	}
	.form_row_right_box{
		position: relative;
		flex: 1;
		text-align: right;
		padding-right: 70upx;
		box-sizing: border-box;
		color: grey;
	}
	.form_row_select_icon{
		left: auto;
		right: 40upx;
		width: 16upx;
		height: 32upx;
	}
	.form_row_input{
		flex: 1;
		text-align: right;
		align-self: center;
		padding-right: 40upx;
		height: 90upx;
	}
	.form_row_right_text{
		padding-right: 20upx;
	}
	.form_row_picker{
		width: 100%;
		height: 100%;
	}
	.form_row_picker_text{
		height: 100%;
	}
	.select_bg{
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background: rgba(0,0,0,0.5);
		z-index: 100;
	}
	.select_box{
		position: fixed;
		bottom: 120upx;
		width: 600upx;
		height: 800upx;
		z-index: 101;
		background: #FFFFFF;
		border-radius: 10upx;
	}
	.select_title{
		line-height: 70upx;
		text-align: center;
		color: #FFFFFF;
		background: #eac37c;
		letter-spacing: 1px;
		font-size: 28upx;
		border-radius: 10upx 10upx 0 0;
	}
	.select_content_box{
		background: #FFFFFF;
		height: 720upx;
		border-radius: 0 0 10upx 10upx;
	}
	.select_row{
		position: relative;
		line-height: 80upx;
		padding-left: 40upx;
	}
	.select_icon{
		left: auto;
		right: 40upx;
		width: 30upx;
		height: 30upx;
	}
	.select_btn_group{
		padding: 20upx 0 0 0;
	}
	.select_input{
		font-size: 34upx;
		padding: 10upx 0;
	}
	.select_position_info{
		line-height: 60upx;
		color: #989797;
		padding-left: 40upx;
		background: #F3F3F3;
	}
	.select_position_btn{
		border: 1px solid #CECECE;
		padding: 2upx 20upx;
		border-radius: 8upx;
		background: #FFFFFF;
	}
	
	.pay_bar{
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		display: flex;
		height: 90upx;
		line-height: 90upx;
		background: #FFFFFF;
	}
	.pay_bar_text{
		flex: 1;
		width: 52%;
		padding: 10upx 20upx;
		box-sizing: border-box;
		font-size: 24upx;
		font-weight: 600;
		line-height: 40upx;
	}
	.pay_bar_text_alert{
		color: #DB2222;
		font-size: 22upx;
		font-weight: 500;
	}
	.pay_bar_btn{
		flex: 0 0 auto;
		width: 24%;
		text-align: center;
		color: #FFFFFF;
	}
	.pay_bar_btn.vip{
		background: #d75454;
	}
	.pay_bar_btn.pay{
		background: #ccb17e;
	}
	
	.share_box{
		position: fixed;
		top: 100%;
		left: 0;
		right: 0;
		background: #FFFFFF;
		height: 160upx;
		display: flex;
		transform: translate3d(0,0,0);
		opacity: 0;
		transition: all 0.5s;
		z-index: 101;
	}
	.share_box.active{
		opacity: 1;
		transform: translate3d(0,-100%,0);
	}
	.share_item{
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}
	.share_item image{
		width: 80upx;
		height: 80upx;
	}
	
	.agreement_row{
		display: flex;
		justify-content: center;
		padding: 20px 0;
	}
	.agreement_text{
		font-size: 14px;
		text-align: center;
		color: #19B3FF;
	}
	.uncheck{
		width: 40upx;
		height: 40upx;
		border-radius: 50%;
		border: 1px solid #AEAEAE;
		box-sizing: border-box;
	}
	.docheck{
		width: 40upx;
		height: 40upx;
		border-radius: 50%;
	}
</style>
