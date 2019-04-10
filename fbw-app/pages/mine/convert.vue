<template>
<div>
	<image class="convert_top_bg" src="../../static/mine/convert_bg.jpg" mode="widthFix"></image>
	<view class="credit_box">
		<view>剩余积分</view>
		<view class="credit">{{credit}}</view>
	</view>
	<view class="convert_title">积分兑换抵用券</view>
	<view class="flex_box">
		<view class="coupon_box">
			<image class="coupon_bg" src="../../static/mine/coupon.png" mode="widthFix"></image>
			<view class="coupon_text1">全场优惠券</view>
			<view class="coupon_text2">合同下载抵用券</view>
			<view class="coupon_text3">累计兑换 {{total}} 张</view>
			<view class="coupon_text4">使用期限：长期有效</view>
			<view class="coupon_text5">600积分</view>
			<view class="coupon_btn" @click="submitConvert()">立即兑换</view>
		</view>
	</view>
</div>
</template>

<script>
export default{
	data(){
		return {
			credit: 0,
			total: 0,
		}
	},
	onLoad() {
		this.credit = global.user_info.credit;
		this.getTotal();
	},
	methods: {
		getTotal(){
			this.requestApi({
				url: 'coupons/getTotal',
				success: res=>{
					this.total = res;
				}
			})
		},
		submitConvert(){
			this.requestApi({
				url: 'coupons/convert',
				success: ()=>{
					this.requestApi({
						url: 'users/getCredit',
						hide_loading: true,
						success: res=>{
							this.total ++;
							this.credit = global.user_info.credit = res.credit;
							global.user_info.coupon_amount = res.coupon_amount;
						}
					})
					uni.showToast({
						title: "兑换成功",
						icon: "success"
					});
				}
			})
		}
	}
}
</script>

<style>
.convert_top_bg{
	width: 100%;
}
.convert_title{
	font-size: 28upx;
	margin: 30upx;
}
.flex_box{
	display: flex;
	justify-content: center;
	flex-wrap: wrap;
}
.coupon_box{
	flex: none;
	position: relative;
	width: 700upx;
	box-sizing: border-box;
	margin-bottom: 40upx;
}
.coupon_bg{
	width: 100%;
}
.credit_box{
	position: absolute;
	top: 100upx;
	left: 0;
	width: 400upx;
	text-align: center;
	color: #FFFFFF;
	font-size: 32upx;
}
.credit{
	font-size: 60upx;
	font-weight: bold;
}
.coupon_text1{
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	width: 60upx;
	text-align: center;
	color: #FFFFFF;
	line-height: 60upx;
	writing-mode: tb-rl;
}
.coupon_text2{
	position: absolute;
	left: 90upx;
	top: 0;
	height: 80upx;
	line-height: 80upx;
	width: 415upx;
	font-size: 32upx;
}
.coupon_text3{
	position: absolute;
	left: 90upx;
	top: 74upx;
	height: 40upx;
	line-height: 40upx;
	font-size: 24upx;
	width: 415upx;
}
.coupon_text4{
	position: absolute;
	left: 90upx;
	top: 114upx;
	height: 40upx;
	line-height: 40upx;
	font-size: 22upx;
	width: 415upx;
	color: #999999;
}
.coupon_text5{
	position: absolute;
	right: 0;
	top: 0;
	height: 90upx;
	line-height: 90upx;
	font-size: 24upx;
	width: 180upx;
	text-align: center;
}
.coupon_btn{
	width: 130upx;
	height: 54upx;
	line-height: 54upx;
	text-align: center;
	font-size: 24upx;
	background: #ceb690;
	position: absolute;
	top: 90upx;
	right: 26upx;
	color: #FFFFFF;
	border-radius: 6upx;
}
.coupon_btn:active{
	background: #bf9346;
}
</style>
