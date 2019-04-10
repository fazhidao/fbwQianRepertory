<template>
<div>
	<view style="padding: 20upx;">
		<view class="title">{{article.title}}</view>
		<view class="sub_title">
			<text style="color: #8b82b3;">法保网</text>
			<text style="color: #999999;">{{article.create_time}}</text>
		</view>
		<rich-text :nodes="article.content"></rich-text>
	</view>
</div>
</template>

<script>
export default{
	data(){
		return {
			article: {}
		}
	},
	onLoad(option) {
		this.getDetail(option.id);
	},
	methods:{
		getDetail(id){
			this.requestApi({
				url: 'articles/getDetail',
				data: {id},
				success: res=>{
					res.create_time = res.create_time.split(' ')[0];
					this.article = res;
				}
			})
		},
	}
}
</script>

<style>
	body{
		background: #FFFFFF;
	}
	.title{
		font-size: 40upx;
		color: #000000;
	}
	.sub_title{
		display: flex;
		justify-content: space-between;
		margin: 20upx 0;
	}
	img{
		display: block !important;
	}
</style>
