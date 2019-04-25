<template>
<div>
	<view style="height: 120upx;"></view>
	<image class="register_logo" src="../../static/logo.png"></image>
	
	<!-- <view class="register_back_btn" @click="goView('/pages/mine/mine','tab')">
		取消
	</view> -->
	
	<view :class="'chose_class_btn'+(chosed_index==1?' active':'')" @click="chose(1)">
		<text>我是个人</text>
		<image src="../../static/login/gou.png" class="chose_class_gou absolute_center"></image>
	</view>
	
	<view :class="'chose_class_btn'+(chosed_index==2?' active':'')" @click="chose(2)">
		<text>我是企业</text>
		<image src="../../static/login/gou.png" class="chose_class_gou absolute_center"></image>
	</view>
	
	<view :class="'chose_class_btn'+(chosed_index==3?' active':'')" @click="chose(3)">
		<text>我是律师</text>
		<image src="../../static/login/gou.png" class="chose_class_gou absolute_center"></image>
	</view>
	
	<view class="main_btn chose_class_main_btn" @click="goIdentify()">开始认证</view>
	
	<view class="link_text" @click="goView('/pages/mine/mine','tab')">稍后设置</view>
</div>
</template>

<script>
	export default{
		data(){
			return {
				chosed_index: 1,
			}
		},
		methods:{
			chose(index){
				this.chosed_index = index;
			},
			goIdentify(){
				switch(this.chosed_index){
					case 1:
						this.goView('identify_person');
						break;
					case 2:
						this.goView('identify_company');
						break;
					case 3:
						this.goView('identify_lawyer');
						break;
				}
			}
		}
	}
</script>

<style>
	body{
		background: #FFFFFF;
	}
	.register_logo{
		display: block;
		width: 260upx;
		height: 260upx;
		margin: 0 auto 80upx auto;
	}
	.register_back_btn{
		position: absolute;
		top: 80upx;
		left: 0;
		width: 140upx;
		text-align: center;
		border-right: 1px solid #c8af6f;
		color: #c8af6f;
		font-size: 30upx;
		line-height: 50upx;
	}
	.chose_class_btn{
		position: relative;
		width: 520upx;
		height: 80upx;
		line-height: 80upx;
		border-radius: 80upx;
		border: 1px solid #ccb17e;
		color: #ccb17e;
		text-align: center;
		font-size: 34upx;
		letter-spacing: 12upx;
		margin: 0 auto 40upx auto;
	}
	.chose_class_btn.active{
		background: #deccab;
		border: 1px solid #deccab;
		color: #FFFFFF;
	}
	.chose_class_gou{
		display: none;
		left: auto;
		right: 40upx;
		width: 40upx;
		height: 40upx;
	}
	.chose_class_btn.active .chose_class_gou{
		display: block;
	}
	.chose_class_main_btn{
		margin: 120upx auto 0 auto;
	}
	.link_text{
		margin-top: 40px;
		color: #19B3FF;
		text-decoration: underline;
		text-align: center;
		font-size: 14px;
	}
</style>
