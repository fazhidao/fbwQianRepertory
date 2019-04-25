<template>
<div>
	<view id="welcome_box" class="welcome_box">
		<swiper class="welcome_swiper" :indicator-dots="false" :autoplay="false" @change="changeSwipe" @animationfinish="finish">
			<swiper-item>
				<image class="welcome_pic" src="../../static/index/welcome1.jpg" mode="aspectFill"></image>
			</swiper-item>
			<swiper-item>
				<image class="welcome_pic" src="../../static/index/welcome2.jpg" mode="aspectFill"></image>
			</swiper-item>
			<swiper-item>
				<image class="welcome_pic" src="../../static/index/welcome3.jpg" mode="aspectFill"></image>
			</swiper-item>
			<swiper-item>
			</swiper-item>
		</swiper>
		
		<view class="welcome_indicator_box">
			<view :class="'welcome_indicator'+(index==0?' active':'')"></view>
			<view :class="'welcome_indicator'+(index==1?' active':'')"></view>
			<view :class="'welcome_indicator'+(index==2?' active':'')"></view>
		</view>
	</view>
</div>
</template>

<script>
	export default{
		data(){
			return {
				index: 0
			}
		},
		methods:{
			changeSwipe(event){
				if(event.detail.current == 3){
					uni.setStorage({
						key: 'is_welcomed',
						data: 'true'
					})
// 					uni.switchTab({
// 						url: '/pages/index/index'
// 					})
					uni.navigateBack({
						delta: 1,
						animationType: 'slide-out-left',
						animationDuration: 200
					});
				}else{
					this.index = event.detail.current
				}
			},
			finish(){
				console.log(this.index)
			}
		}
	}
</script>

<style>
	.welcome_box{
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background: #FFFFFF;
	}
	.welcome_swiper{
		width: 100%;
		height: 100%;
	}
	.welcome_pic{
		display: block;
		width: 100%;
		height: 100%;
	}
	.welcome_indicator_box{
		position: absolute;
		margin: auto;
		bottom: 100upx;
		left: 0;
		right: 0;
		width: 150upx;
		display: flex;
		justify-content: space-between;
	}
	.welcome_indicator{
		width: 20upx;
		height: 20upx;
		border-radius: 50%;
		background: #e9e6ea;
	}
	.welcome_indicator.active{
		background: #d3ba8a;
	}
</style>
