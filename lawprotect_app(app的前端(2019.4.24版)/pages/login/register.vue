<template>
<div>
	<view style="height: 120upx;"></view>
	<image class="register_logo" src="../../static/logo.png" mode=""></image>
	
	<view class="register_back_btn" @click="goView(-1)">
		取消
	</view>
	
	<view class="register_content_box">
		<view class="register_title">请输入手机号并获取短信验证码</view>
		<view class="borderY"></view>
		<view class="register_row">
			<view class="register_row_left">
				<text>+86</text>
				<view class="borderX"></view>
			</view>
			<view class="register_row_right">
				<input-box classes="register_row_input" v-model="phone" type="number" placeholder="您的手机号" @clear="phone=''"></input-box>
			</view>
		</view>
		<view class="borderY"></view>
		<view class="register_row">
			<view class="register_row_left">
				<image src="../../static/login/sms_code.png" class="absolute_center"></image>
				<view class="borderX"></view>
			</view>
			<view class="register_row_right">
				<input-box classes="register_row_input register_row_input_sms" v-model="phone_code" type="number" placeholder="短信验证码" @clear="phone_code=''"></input-box>
				<view class="sms_btn absolute_center" @click="getSmsCode()">
					{{code_time==0?'获取验证码':'（'+code_time+'s）'}}
				</view>
			</view>
		</view>
		<view class="borderY"></view>
		<view class="register_row">
			<view class="register_row_left">
				<image src="../../static/login/password.png" class="absolute_center"></image>
				<view class="borderX"></view>
			</view>
			<view class="register_row_right">
				<input-box classes="register_row_input" v-model="password" type="text" placeholder="设置登录密码" @clear="password=''"></input-box>
			</view>
		</view>
		<view class="borderY"></view>
		
		<view class="agreement_row" @click="goAgreement()">
			<view v-if="checked==0" class="uncheck"></view>
			<image v-if="checked==1" src="../../static/login/checked.png" class="docheck"></image>
			<view class="agreement_text">《法保网用户注册协议》</view>
		</view>
		
		<view class="main_btn register_btn" @click="submitRegister()">
			注册
		</view>
	</view>
</div>
</template>

<script>
	import './common.css';
	export default{
		data(){
			return {
				phone: '',
				password: '',
				phone_code: '',
				code_time: 0,
				checked: false,
			}
		},
		methods:{
			goAgreement(){
				this.checked = !this.checked;
				if(this.checked)
					this.goView('register_agreement');
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
			submitRegister(){
				if(!this.checked){
					uni.showToast({
						icon: 'none',
						title: '请同意注册协议'
					});
					return 0;
				}
				if(this.phone == ''){
					uni.showToast({
						icon: 'none',
						title: '请输入手机号码'
					});
					return 0;
				}
				if(this.phone_code == '' || this.phone_code.length != 6){
					uni.showToast({
						icon: 'none',
						title: '请输入6位短信验证码'
					});
					return 0;
				}
				if(this.password == ''){
					uni.showToast({
						icon: 'none',
						title: '请输入登录密码'
					});
					return 0;
				}else if(this.password.length < 6){
					uni.showToast({
						icon: 'none',
						title: '密码长度至少需要6位'
					});
					return 0;
				}
				this.requestApi({
					url: 'register',
					data: {
						phone: this.phone,
						code: this.phone_code,
						password: this.password
					},
					success: res=>{
						uni.setStorage({
							key: 'appid',
							data: res
						})
						global.appid = res;
						uni.showToast({
							icon: 'success',
							title: '注册成功',
							mask: true,
							duration: 1500,
							success: ()=>{
								setTimeout(()=>{
									uni.redirectTo({
										url: 'chose_class'
									});
								},1500)
							}
						})
					}
				})
			}
		}
	}
</script>

<style>
	body{
		background: #FFFFFF;
	}
</style>
