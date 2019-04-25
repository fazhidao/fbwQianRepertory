<template>
<div>
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
			url: '',
			is_show_share: false,
		}
	},
	onLoad(options) {
		this.url = 'http://116.62.208.170/index.php/api/app/chatWeb/'+global.appid+'?from='+options.from;
	},
}
</script>

<style>
</style>
