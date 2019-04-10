<template>
<div>
	<!-- 注册协议webview -->
	<web-view :webview-styles="webviewStyles" :src="url"></web-view>
</div>
</template>

<script>
export default {
	data() {
		return {
			webviewStyles: {
				progress: {
					color: '#409EFF'
				}
			},
			url: ''
		}
	},
	onLoad() {
		this.url = 'http://116.62.208.170/index.php/api/app/lawyerManage';
	}
}
</script>

<style>
</style>
