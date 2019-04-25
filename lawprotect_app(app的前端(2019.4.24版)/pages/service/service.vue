<template>
	<view style="position: relative;">
		<image class="service_bg" src="../../static/service/service_bg.jpg" mode="widthFix"></image>
		<view class="service_btn btn1" @click="goForm(1)"></view>
		<view class="service_btn btn2" @click="goForm(2)"></view>
		<view class="service_btn btn3" @click="goForm(3)"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		methods:{
			goForm(type){
				global.service_type = type;
				this.goView('form');
			}
		}
	}
</script>

<style>
body{
	background: #FFFFFF;
}
.service_bg{
	width: 100%;
}
.service_btn{
	position: absolute;
	left: 0;
	right: 0;
	height: 160upx;
}
.btn1{
	top: 51%;
}
.btn2{
	top: 65%;
}
.btn3{
	top: 80%;
}
</style>
