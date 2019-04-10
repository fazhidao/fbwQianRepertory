<template>
<div style="background: #FFFFFF;">
	<view class="borderY"></view>
	<view class="form_row" @click="bindWeixin()">
		<view class="form_row_title system_row">绑定微信</view>
		<view class="form_row_right_box">
			<image src="../../static/arrow_right.png" class="form_row_select_icon absolute_center"></image>
		</view>
	</view>
	<view class="borderY"></view>
	<view class="form_row" @click="checkUpdate()">
		<view class="form_row_title system_row">检测更新</view>
		<view class="form_row_right_box">
			<text>v {{version}}</text>
			<image src="../../static/arrow_right.png" class="form_row_select_icon absolute_center"></image>
		</view>
	</view>
	<view class="borderY"></view>
	<view class="form_row" @click="loginOut()">
		<view class="form_row_title system_row">退出登录</view>
		<view class="form_row_right_box">
			<image src="../../static/arrow_right.png" class="form_row_select_icon absolute_center"></image>
		</view>
	</view>
</div>
</template>

<script>
	export default{
		data(){
			return {
				version: '1.0.0',
			}
		},
		onLoad() {
			plus.runtime.getProperty(plus.runtime.appid, (widgetInfo)=>{
				this.version = widgetInfo.version;
			})
		},
		methods: {
			loginOut(){
				uni.showModal({
					title: '操作提示',
					content: '确定退出登录?',
					success: res => {
						if(res.confirm){
							this.clearUserData();
							uni.switchTab({
								url: '/pages/mine/mine'
							});
						}
					},
				});
			},
			checkUpdate(){
				plus.runtime.getProperty(plus.runtime.appid, (widgetInfo)=>{
					uni.getSystemInfo({
						success: (sysinfo) => {
							this.requestApi({
								url: 'checkUpdate',
								manually_hide_loading: true,
								data:{
									app_version: plus.runtime.version,
									wdg_version: widgetInfo.version,
									platform: sysinfo.platform
								},
								success: (data)=>{
									if(data.status == 2){
										uni.showModal({
											title: '发现新版本',
											content: '是否立即下载更新?',
											success: res => {
												if(res.confirm){
													plus.runtime.openURL(data.url);
												}
											},
										});
									}else{
										uni.showToast({
											title: '已是最新版本!',
											icon: 'none'
										});
									}
								}  
							})
						},
					})
				});
			},
			bindWeixin(){
				uni.showLoading({
					mask: true
				})
				uni.login({
					provider: 'weixin',
					success: (loginRes)=>{
						this.requestApi({
							url: 'users/bindWeixin',
							data: {openid: loginRes.authResult.openid},
							success: res=>{
								uni.showToast({
									title: '绑定成功',
									icon: 'success'
								});
								setTimeout(()=>{this.goView(-1);},1500)
							}
						})
					}
				})
			}
		}
	}
</script>

<style>
.system_row{
	padding-left: 40upx;
}
</style>
