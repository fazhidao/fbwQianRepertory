<template>
<div>
	<view class="success_bg_box">
		<image class="success_bg_img" src="../../static/payment/success_bg.jpg" mode="widthFix"></image>
		<view class="success_title_box">
			<view class="success_main_title">支付成功</view>
			<view>感谢您对我们的信任与支持！</view>
		</view>
	</view>
	<view class="trade_info_box">
		<view class="trade_info_row">
			<text>交易金额</text>
			<text class="trade_info">￥{{price}}</text>
		</view>
		<view class="borderY"></view>
		<view class="trade_info_row">
			<text>交易方式</text>
			<text class="trade_info">{{pay_type}}</text>
		</view>
		<view class="borderY"></view>
		<view class="trade_info_row">
			<text>交易内容</text>
			<text class="trade_info">{{payment_title}}</text>
		</view>
		<view class="borderY"></view>
		<view class="trade_info_row">
			<text>交易时间</text>
			<text class="trade_info">{{date}}</text>
		</view>
	</view>
	<view class="main_btn_large success_btn" @click="goBack()">返回</view>
</div>
</template>

<script>
export default{
	data() {
		return {
			price: '',
			date: '',
			payment_title: '',
			pay_type: ''
		}
	},
	onLoad() {
		let time = new Date();
		this.date = time.getFullYear() + '-' + (time.getMonth()+1) + '-' + time.getDate();
		this.price = global.price_to_pay;
		this.pay_type = global.pay_type_name;
		this.payment_title = global.payment_title;
	},
	methods:{
		goBack(){
			if(global.buy_vip_success){
				// 刷新用户信息
				this.loginByAppid();
				global.buy_vip_success = false;
			}
			uni.navigateBack();
		}
	}
}
</script>

<style>
body{
	background: #FFFFFF;
}
.success_bg_box{
	position: relative;
}
.success_bg_img{
	width: 100%;
}
.success_title_box{
	position: absolute;
	left: 0;
	right: 0;
	top: 30%;
	text-align: center;
	color: #FFFFFF;
	font-size: 28upx;
	letter-spacing: 2px;
}
.success_main_title{
	font-size: 60upx;
}
.trade_info_box{
	padding: 70upx;
}
.trade_info_row{
	display: flex;
	justify-content: space-between;
	font-size: 30upx;
	line-height: 80upx;
}
.trade_info{
	color: #b89a6b;
}
.success_btn{
	margin: 0 auto 40upx auto;
}
</style>
