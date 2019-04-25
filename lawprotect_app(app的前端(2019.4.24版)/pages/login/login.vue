<template>
	<view>
		<image class="login_top_bg" src="../../static/login/login_top_bg.jpg"></image>
		
		<view class="register_back_btn" @click="goView(-1)" style="color: #FFFFFF;border-right: 1px solid #FFFFFF;">
			取消
		</view>
		
		<view class="login_box">
			<view class="login_tab_box">
				<view class="login_tab_item" @click="choseTab(1)">
					<view :class="'login_tab_item_text'+(chosed_tab==1?' active':'')">账号密码登录</view>
				</view>
				<view class="login_tab_item" @click="choseTab(2)">
					<view :class="'login_tab_item_text'+(chosed_tab==2?' active':'')">手机验证码登录</view>
				</view>
			</view>
			<view class="borderY"></view>
			<view class="register_row">
				<view class="register_row_left">
					<text>账　号</text>
				</view>
				<view class="register_row_right">
					<input-box classes="register_row_input" v-model="phone" type="number" placeholder="请输入您的手机号" @clear="phone=''"></input-box>
				</view>
			</view>
			<view class="borderY"></view>
			<view v-show="chosed_tab==1" class="register_row">
				<view class="register_row_left">
					<text>密　码</text>
				</view>
				<view class="register_row_right">
					<input-box classes="register_row_input" v-model="password" type="password" placeholder="请输入6-20位密码" @clear="password=''"></input-box>
				</view>
			</view>
			<view v-show="chosed_tab==2" class="register_row">
				<view class="register_row_left">
					<text>验证码</text>
				</view>
				<view class="register_row_right">
					<input-box classes="register_row_input register_row_input_sms" v-model="phone_code" type="number" placeholder="短信验证码" @clear="phone_code=''"></input-box>
					<view class="sms_btn absolute_center" @click="getSmsCode()">
						{{code_time==0?'获取验证码':'（'+code_time+'s）'}}
					</view>
				</view>
			</view>
			<view class="borderY"></view>
			
			<view style="height: 60upx;"></view>
			<button type="primary" @click="submitLogin()">登录</button>
			
			<view class="bottom_btn_box">
				<!-- <view class="agreement_text" @click="goView('register_agreement')">《法保网用户注册协议》</view> -->
				<view></view>
				<view @click="goView('register')">快速注册</view>
			</view>
			
			<view class="third_login_box">
				<view v-if="is_show_wxlogin" class="third_login_item" @click="weixinLogin()">
					<image src="../../static/payment/weixin.png" mode=""></image>
					<text>微信登录</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import './common.css';
	export default {
		data() {
			return {
				chosed_tab: 1,
				phone: '',
				password: '',
				phone_code: '',
				code_time: 0,
				is_show_wxlogin: false,
			};
		},
		onLoad() {
			if(global.appid){
				this.goView(-1)
			}
			//如果是ios系统未安装微信则不能使用微信登录
			uni.getSystemInfo({
				success: (res) => {
					if(res.platform == 'android'){
						this.is_show_wxlogin = true;
					}else{
						let WXApi = plus.ios.import("WXApi");  
						let isWXInstalled = WXApi.isWXAppInstalled();  
						if(isWXInstalled){
							this.is_show_wxlogin = true;
						}
					}
				},
			})
		},
		methods:{
			choseTab(index){
				this.chosed_tab = index; 
			},
			checkInput(){
				if(this.phone == ''){
					uni.showToast({
						icon: 'none',
						title: '请输入您的手机号'
					});
					return 0;
				}else if(this.phone.length != 11){
					uni.showToast({
						icon: 'none',
						title: '请输入11位手机号'
					});
					return 0;
				}
				if(this.chosed_tab==1 && this.password==''){
					uni.showToast({
						icon: 'none',
						title: '请输入登录密码'
					});
					return 0;
				}
				if(this.chosed_tab==2 && this.phone_code==''){
					uni.showToast({
						icon: 'none',
						title: '请输入短信验证码'
					});
					return 0;
				}
				return true;
			},
			submitLogin(){
				if(!this.checkInput()){ return 0; }
				
				let request_data = {phone: this.phone}
				if(this.chosed_tab == 1){
					request_data.password = this.password;
				}else{
					request_data.phone_code = this.phone_code
				}
				this.requestApi({
					url: 'login',
					data: request_data,
					success: res=>{
						res.avatar && (res.avatar = this.ImgUrl+res.avatar);
						this.saveUserinfo(res);
						if(res.name == null){
							this.goView('/pages/login/chose_class');
						}else{
							this.goView(-1);
						}
					}
				})
			},
			weixinLogin(){
				uni.showLoading({
					mask: true
				})
				uni.login({
					provider: 'weixin',
					success: (loginRes)=>{
						this.requestApi({
							url: 'login',
							data: {openid: loginRes.authResult.openid},
							success: res=>{
								if(res){
									res.avatar && (res.avatar = this.ImgUrl+res.avatar);
									this.saveUserinfo(res);
									this.goView(-1);
								}else{
									global.openid = loginRes.authResult.openid;
									this.goView('/pages/login/bind_phone');
								}
							}
						})
					}
				})
			},
			saveUserinfo(data){
				//手机本地保存用户信息
				uni.setStorage({
					key: 'appid',
					data: data.appid
				})
				global.appid = data.appid;
				global.user_info = data;
				global.vip_info = JSON.parse(data.vip_info);
				// #ifdef APP-PLUS
				this.saveClientid();
				// #endif
			},
			saveClientid(){ //保存个推id
				let info = plus.push.getClientInfo();
				this.requestApi({
					url: 'users/saveClientid',
					data: {
						clientid: info.clientid
					},
					success: res=>{
						console.log(res);
					}
				})
			},
			getSmsCode(){
				if(this.phone == ''){
					uni.showToast({
						icon: 'none',
						title: '请输入您的手机号'
					});
					return 0;
				}else if(this.phone.length != 11){
					uni.showToast({
						icon: 'none',
						title: '请输入11位手机号'
					});
					return 0;
				}
				this.code_time = 60;
				setTimeout(()=>{
					this.codeTimeTick();
				},1000)
				this.requestApi({
					sms: 'getCode',
					data: {phone: this.phone},
					success: res=>{
						uni.showToast({
							icon: 'none',
							duration: 3000,
							title: '已发送，注意查看手机短信'
						});
					}
				})
			},
			codeTimeTick(){
				if(this.code_time > 0){
					this.code_time --;
					setTimeout(()=>{
						this.codeTimeTick();
					},1000)
				}
			},
		}
	}
</script>

<style>
body{
	background: #FFFFFF;
}
.login_top_bg{
	width: 100%;
	height: 388upx;
}
.login_box{
	padding: 0 50upx;
}
.login_tab_box{
	display: flex;
}
.login_tab_item{
	flex: 1;
	display: flex;
	line-height: 72upx;
	justify-content: center;
	font-size: 28upx;
}
.login_tab_item_text.active{
	color: #ccb17e;
	border-bottom: 4upx solid #ccb17e;
}

.bottom_btn_box{
	display: flex;
	justify-content: space-between;
	color: #ccb17e;
	font-size: 28upx;
}
.bottom_btn_box view{
	line-height: 120upx;
}
.third_login_box{
	margin-top: 40upx;
	display: flex;
}
.third_login_item{
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	font-size: 24upx;
	color: #979797;
}
.third_login_item image{
	width: 80upx;
	height: 80upx;
	margin-bottom: 10upx;
}
</style>
