<template>
<div style="background: #FFFFFF;">
	<view class="borderY"></view>
	<view class="messsage_row">
		<view class="messsage_row_left">
			<image class="absolute_center" src="../../static/mine/default_avatar.png" mode=""></image>
		</view>
		<view class="messsage_row_right">
			<view class="messsage_row_name">支付助理</view>
			<view class="messsage_row_abstract">暂无消息</view>
			<!-- <view class="messsage_row_time">9-13</view> -->
		</view>
	</view>
	<view class="borderY"></view>
	<view class="messsage_row" @click="goView('chat_webview?from=3')">
		<view class="messsage_row_left">
			<image class="absolute_center" src="../../static/mine/default_avatar.png" mode=""></image>
		</view>
		<view class="messsage_row_right">
			<view class="messsage_row_name">在线客服</view>
			<view class="messsage_row_abstract">暂无消息</view>
			<!-- <view class="messsage_row_time">9-13</view> -->
		</view>
	</view>
	<view class="borderY"></view>
</div>
</template>

<script>
</script>

<style>
.messsage_row{
	display: flex;
}
.messsage_row_left{
	position: relative;
	flex: none;
	width: 160upx;
	height: 160upx;
}
.messsage_row_left image{
	width: 100upx;
	height: 100upx;
}
.messsage_row_right{
	position: relative;
	flex: 1;
}
.messsage_row_name{
	font-size: 30upx;
	color: #000000;
	padding: 40upx 0 10upx 0;
}
.messsage_row_abstract{
	font-size: 24upx;
	color: #7f7e7e;
	margin-right: 100upx;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}
.messsage_row_time{
	position: absolute;
	right: 24upx;
	top: 40upx;
	font-size: 24upx;
	color: #7f7e7e;
}
</style>
