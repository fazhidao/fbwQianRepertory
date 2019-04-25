<template>
<div>
	<view class="sign_box" @click="doSign()">
		<image class="sign_bg" src="../../static/mine/sign_bg.jpg" mode="widthFix"></image>
		<block v-if="has_signed">
			<view class="sign_text1">签到成功</view>
			<view class="sign_text2">+{{add_credit}}</view>
		</block>
		<view v-if="!has_signed && !has_signed_today" class="sign_text4_box">
			<text>点击签到</text>
		</view>
		<view v-if="has_signed_today" class="sign_text4_box">
			<text>今日已签</text>
		</view>
		<view class="sign_text3">剩余 {{credit}} 积分</view>
	</view>
</div>
</template>

<script>
export default{
	data(){
		return {
			has_signed: false,
			has_signed_today: false,
			credit: 0,
			add_credit: 0,
		}
	},
	onLoad(){
		this.credit = global.user_info.credit || 0;
		this.isSign();
	},
	methods:{
		isSign(){
			this.requestApi({
				url: 'users/isSign',
				success: res=>{
					if(res.is_sign){
						this.has_signed_today = true;
					}
				}
			})
		},
		doSign(){
			if(this.has_signed){
				return 0;
			}
			this.requestApi({
				url: 'users/sign',
				success: (res)=>{
					global.user_info.credit = global.user_info.credit*1 + res*1;
					this.credit = this.credit*1 + res*1;
					this.add_credit = res*1;
					this.has_signed = true;
					uni.showToast({
						title: '签到成功',
						icon: 'success'
					})
				}
			})
		}
	}
}
</script>

<style>
.sign_bg{
	width: 100%;
}
.sign_text1{
	position: absolute;
	margin: auto;
	top: 220upx;
	left: 0;
	right: 0;
	width: 160upx;
	line-height: 70upx;
	border-bottom: 1px solid #c71525;
	text-align: center;
	font-size: 36upx;
	color: #c71525;
}
.sign_text2{
	position: absolute;
	margin: auto;
	top: 290upx;
	left: 30upx;
	right: 0;
	width: 140upx;
	line-height: 80upx;
	text-align: center;
	font-size: 38upx;
	color: #c71525;
	animation: fadeUp 1s;
}
@keyframes fadeUp{
	from{
		opacity: 0;
		transform: translate3d(0,10px,0);
	}
	to{
		opacity: 1;
		transform: translate3d(0,0,0);
	}
}
.sign_text3{
	position: absolute;
	top: 430upx;
	left: 50upx;
	font-size: 28upx;
	color: #FFFFFF;
}
.sign_text4_box{
	position: absolute;
	margin: auto;
	top: 190upx;
	left: 0;
	right: 0;
	text-align: center;
	font-size: 40upx;
	width: 200upx;
	line-height: 200upx;
	background: #FFFFFF;
	border-radius: 50%;
	color: #c71525;
}
</style>
