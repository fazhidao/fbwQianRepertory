<template>
<div style="background: #FFFFFF;">
	<view class="borderY"></view>
	<view class="form_row" @click="goView('lawyer_manage_web')">
		<view class="form_row_title system_row">入驻律师管理办法</view>
		<view class="form_row_right_box">
			<image src="../../static/arrow_right.png" class="form_row_select_icon absolute_center"></image>
		</view>
	</view>
</div>
</template>

<script>
	export default{
		data(){
			return {
				version: '1.0.0',
			}
		},
		onLoad() {
		},
		methods: {
		}
	}
</script>

<style>
.system_row{
	padding-left: 40upx;
}
</style>