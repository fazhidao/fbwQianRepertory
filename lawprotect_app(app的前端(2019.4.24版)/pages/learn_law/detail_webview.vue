<template>
<div>
	<web-view :webview-styles="webviewStyles" :src="url"></web-view>
	
	<view v-if="is_show_share" class="select_bg" @click="hideShare()"></view>
	<view :class="'share_box'+(is_show_share?' active':'')">
		<view class="share_item" @click="doShare(1)">
			<image src="../../static/index/share1.jpg" mode=""></image>
			<text>分享到微信朋友圈</text>
		</view>
		<view class="share_item" @click="doShare(2)">
			<image src="../../static/index/share2.jpg" mode=""></image>
			<text>分享给微信好友</text>
		</view>
	</view>
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
	onLoad(option) {
		this.url = 'http://116.62.208.170/index.php/api/app/articleWeb/'+option.id+'?inapp=1';
		this.share_url = '/index.php/api/app/articleWeb/'+option.id;
		this.article_id = option.id;
		this.getTitle(option.id);
	},
	onNavigationBarButtonTap(event) {
		uni.showActionSheet({
			itemList: ['分享给微信好友', '分享到微信朋友圈'],
			success: (res)=>{
				this.doShare(res.tapIndex);
			}
		});
	},
	methods: {
		showShare(){
			this.is_show_share = true;
		},
		hideShare(){
			this.is_show_share = false;
		},
		getTitle(id){
			this.requestApi({
				url: 'articles/getTitle',
				data: {id},
				success: res=>{
					this.share_title = res.title;
				}
			})
		},
		doShare(type){
			this.requestApi({
				url: 'getShareData',
				data: {article_id: this.article_id},
				success: res=>{
					let scene = type==1 ? 'WXSenceTimeline' : 'WXSceneSession';
					uni.share({
						provider: "weixin",
						scene,
						type: 0,
						href: res[3].value+this.share_url,
						imageUrl: res[1].value,
						title: this.share_title || res[2].value,
						summary: res[2].value,
						success: function (res) {
							uni.showToast({
								title: "分享成功",
								icon: "success"
							})
						}
					});
				}
			})
		}
	}
}
</script>

<style>
</style>
