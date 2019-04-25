<template >
<view >
	<view class="menu_box">
		<view class="menu_item" @click="goView('/pages/contract/contracts')">
			<image class="menu_item_icon" src="../../static/use_law/hetong.png"></image>
			<text class="menu_item_title">合同文库</text>
		</view>
		<view class="menu_item" @click="goView('make_contract')">
			<image class="menu_item_icon" src="../../static/use_law/dingzhi.png"></image>
			<text class="menu_item_title">合同定制与审核</text>
		</view>
		<view class="menu_item" @click="goView('daixie_wenshu')">
			<image class="menu_item_icon" src="../../static/use_law/daixie.png"></image>
			<text class="menu_item_title">代写文书</text>
		</view>
		<view class="menu_item" @click="goView('lvshihan')">
			<image class="menu_item_icon" src="../../static/use_law/lvshi.png"></image>
			<text class="menu_item_title">律师函</text>
		</view>
		<view class="menu_item" @click="goView('calculate_susong')">
			<image class="menu_item_icon" src="../../static/use_law/susongfei.png"></image>
			<text class="menu_item_title">诉讼费计算</text>
		</view>
		<view class="menu_item" @click="goView('calculate_weiyue')">
			<image class="menu_item_icon" src="../../static/use_law/weiyuejin.png"></image>
			<text class="menu_item_title">违约金计算</text>
		</view>
	</view>
</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		}
	}
</script>

<style>

.menu_box{
	display: flex;
	flex-wrap: wrap;
	padding: 60upx 0 0 60upx;
}
.menu_item{
	flex: none;
	margin: 0 60upx 60upx 0;
	width: 285upx;
	height: 285upx;
	border: 4upx solid #d2ad69;
	border-radius: 20px;
	/* background: #FFFFFF; */
	border-radius: 30upx;
	display: flex;
	flex-direction: column;
	justify-content: center;
	box-sizing: border-box;
}
.menu_item_icon{
	width: 160upx;
	height: 160upx;
	margin: 0 auto;
}
.menu_item_title{
	text-align: center;
	font-size: 28upx;
	margin-top: 14upx;
	color: #535353;
}
</style>
