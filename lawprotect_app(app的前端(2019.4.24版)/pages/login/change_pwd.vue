<template>
	<view>
		<image class="login_top_bg" src="../../static/login/login_top_bg.jpg"></image>
		
		<view class="register_back_btn" @click="goView(-1)" style="color: #FFFFFF;border-right: 1px solid #FFFFFF;">
			取消
		</view>
		
		<view class="login_box">
			<view class="login_tab_box">
				<view class="login_tab_item" @click="choseTab(1)">
					<view :class="'login_tab_item_text'+(chosed_tab==1?' active':'')">密码修改</view>
				</view>
				<view class="login_tab_item" @click="choseTab(2)">
					<view :class="'login_tab_item_text'+(chosed_tab==2?' active':'')">验证码修改</view>
				</view>
			</view>
			<view class="borderY"></view>
			<view v-show="chosed_tab==1" class="register_row">
				<view class="register_row_left">
					<text>原密码</text>
				</view>
				<view class="register_row_right">
					<input-box classes="register_row_input" v-model="old_password" type="number" placeholder="请输入原密码" @clear="old_password=''"></input-box>
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
			<view class="register_row">
				<view class="register_row_left">
					<text>新密码</text>
				</view>
				<view class="register_row_right">
					<input-box classes="register_row_input" v-model="new_password" type="password" placeholder="请输入6-20位新密码" @clear="new_password=''"></input-box>
				</view>
			</view>
			<view class="borderY"></view>
			
			<view style="height: 60upx;"></view>
			<button type="primary" @click="submitChange()">确认修改</button>
			
		</view>
	</view>
</template>

<script>
	import './common.css';
	export default {
		data() {
			return {
				chosed_tab: 1,
				old_password: '',
				new_password: '',
				phone_code: '',
				code_time: 0,
			};
		},
		methods:{
			choseTab(index){
				this.chosed_tab = index; 
			},
			checkInput(){
				if(this.chosed_tab==1 && this.old_password == ''){
					uni.showToast({
						icon: 'none',
						title: '请输入原密码'
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
				if(this.new_password==''){
					uni.showToast({
						icon: 'none',
						title: '请输入新密码'
					});
					return 0;
				}else if(this.new_password.length < 6){
					uni.showToast({
						icon: 'none',
						title: '密码长度至少需要6位'
					});
					return 0;
				}
				return true;
			},
			submitChange(){
				if(!this.checkInput()){ return 0; }
				
				let request_data = {new_password: this.new_password}
				if(this.chosed_tab == 1){
					request_data.old_password = this.old_password;
				}else{
					request_data.phone_code = this.phone_code
				}
				this.requestApi({
					url: 'users/changePassword',
					data: request_data,
					success: res=>{
						uni.showToast({
							title: '修改成功',
							mask: false,
							duration: 1500
						});
						setTimeout(()=>{
							this.goView(-1);
						},1500)
					}
				})
			},
			getSmsCode(){
				this.code_time = 60;
				setTimeout(()=>{
					this.codeTimeTick();
				},1000)
				this.requestApi({
					url: 'getPhone',
					success: res=>{
						this.requestApi({
							sms: 'getCode',
							data: {phone: res},
							success: ()=>{
								uni.showToast({
									icon: 'none',
									duration: 3000,
									title: '已发送，注意查看手机短信'
								});
							}
						})
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
