<template>
<div>
	<image class="form_top" src="../../static/service/form_bg.jpg.png" mode="widthFix"></image>
	<view class="form_box">
		<view class="form_flex">
			<view class="form_title">企业名称:</view>
			<input class="form_input" type="text" v-model="name" />
		</view>
		<view class="borderY"></view>
	</view>
	<view class="form_box">
		<view class="form_flex">
			<view class="form_title">联 系 人:</view>
			<input class="form_input" type="text" v-model="contactor" />
		</view>
		<view class="borderY"></view>
	</view>
	<view class="form_box">
		<view class="form_flex">
			<view class="form_title">联系方式:</view>
			<input class="form_input" type="text" v-model="phone" />
		</view>
		<view class="borderY"></view>
	</view>
	
	<view class="main_btn" @click="submitForm()">
		确认提交
	</view>
</div>
</template>

<script>
export default{
	data(){
		return {
			name: '',
			contactor: '',
			phone: '',
		}
	},
	methods:{
		submitForm(){
			if(this.name == '' || this.contactor == '' || this.phone == ''){
				uni.showToast({
					title: '请填写完整内容',
					icon: 'none'
				});return 0;
			}
			this.requestApi({
				url: 'services/add',
				data: {
					name: this.name,
					contactor: this.contactor,
					phone: this.phone,
					type: global.service_type
				},
				success: ()=>{
					uni.showToast({
						title: '提交成功',
						icon: 'success',
						mask: true,
						duration: 1000
					});
					setTimeout(()=>{
						uni.navigateBack()
					},1000)
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
.form_top{
	display: block;
	width: 100%;
}
.form_box{
	margin: 20px 40px;
}
.form_flex{
	display: flex;
	padding-bottom: 4px;
}
.form_title{
	width: 90px;
	text-align: justify;
	font-size: 16px;
	letter-spacing: 2px;
}
.form_input{
	flex: 1;
	font-size: 16px;
}
.main_btn{
	margin: 40px auto 0 auto;
}
</style>
