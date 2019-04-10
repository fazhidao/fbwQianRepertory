<template>
<div style="background: #FFFFFF;">
	<swiper class="swiper" :circular="true" previous-margin="40px" next-margin="40px">
		<swiper-item v-for="item in banners" :key="item.article_id">
			<view class="img_box" @click="goDetail(item.article_id)">
				<image class="img_box_pic" :src="img_url+item.url" mode="aspectFill"></image>
			</view>
		</swiper-item>
		<swiper-item v-if="banners.length==0">
			<view class="img_box">
				<image class="img_box_pic" src="../../static/index/example_lvshi.jpg" mode="aspectFill"></image>
			</view>
		</swiper-item>
	</swiper>
	
	<view class="tab2_box">
		<view :class="'tab2_item'+(type==1?' active':'')" @click="changeTab(1)">法律头条</view>
		<view :class="'tab2_item'+(type==2?' active':'')" @click="changeTab(2)">经典案例</view>
	</view>
	
	<view class="anli_box">
		<view class="anli_item" v-for="(item,index) in article_list" :key="item.id" @click="goDetail(item.id)">
			<image class="anli_item_pic" :src="img_url+item.title_picture" mode="aspectFill"></image>
			<view class="anli_item_right">
				<view class="anli_tag" :style="{background: item.tag_color}">{{item.tag}}</view>
				<view class="anli_item_title">
					{{item.title}}
				</view>
				<!-- <view class="anli_item_abstract">
					{{item.abstract}}
				</view> -->
				<view class="anli_item_views_box">
					<image class="anli_item_views_icon absolute_center" src="../../static/index/hot.png"></image>
					<span class="anli_item_views_nums">{{item.views}}热度</span>
					<span>{{item.create_time}}</span>
				</view>
			</view>
		</view>
	</view>
	<image v-show="article_list.length == 0" class="empty_icon" src="../../static/contracts/empty.png" mode=""></image>
	<view v-show="article_list.length == 0" class="empty_text">暂无搜索结果，<text class="link_to_all" @click="linkToAll()">返回所有</text></view>
	<view v-show="article_list.length > 0" class="end_tip">{{is_end?"- 已经到底啦 -":"加载中..."}}</view>
</div>
</template>

<script>
	export default{
		data(){
			return {
				img_url: '',
				type: 1,
				keywords: '',
				page_size: 10,
				page: 1,
				is_end: false,
				is_loading: false,
				article_list: [],
				banners: [],
			}
		},
		onLoad(options) {
			this.img_url = this.ImgUrl;
			if(options.index){
				this.type = options.index;
			}
			this.getArticles();
			this.getBanners();
		},
		onReachBottom() {
			this.getArticles();
		},
		onPullDownRefresh() {
			this.getArticles('new_arr');
			this.getBanners();
		},
		methods:{
			goDetail(id){
				if(id>0){
					uni.navigateTo({
						url: '/pages/learn_law/detail_webview?id='+id
					})
				}
			},
			getBanners(){
				this.requestApi({
					url: 'articles/getBanners',
					success: res=>{
						this.banners = res.map(el=>{
							return {url: el.picture, article_id: el.article_id}
						})
					}
				})
			},
			getArticles(){
				if(this.is_loading || (this.is_end&&!arguments[0])){
					return 0;
				}
				this.is_loading = true;
				let request_data = {
					page_size: this.page_size,
					page: arguments[0]==undefined? this.page : 1,
					type: this.type
				};
				if(this.keywords != ''){
					request_data.keywords = this.keywords;
				}
				this.requestApi({
					url: 'articles/getList',
					data: request_data,
					success: res=>{
						this.is_loading = false;
						if(arguments[0]==undefined){
							res.data.forEach(el=>{
								el.create_time = el.create_time.split(' ')[0];
								this.article_list.push(el);
							})
							this.page ++;
						}else{
							this.article_list = res.data.map(el=>{
								el.create_time = el.create_time.split(' ')[0];
								return el;
							});
							this.page = 2;
						}
						if(this.article_list.length >= res.total){
							this.is_end = true;
						}else{
							this.is_end = false;
						}
						uni.stopPullDownRefresh();
					}
				})
			},
			linkToAll(){
				this.keywords = '';
				this.is_end = false;
				this.page = 1;
				this.getarticles();
			},
			changeTab(type){
				this.type = type;
				this.getArticles('new_arr');
			}
		}
	}
</script>

<style>
	.swiper{
		height: 380upx;
	}
	.img_box{
		height: 300upx;
		margin: 40upx;
	}
	.img_box_pic{
		display: block;
		width: 100%;
		height: 100%;
		border-radius: 8px;
		box-shadow: 0 0 20px rgba(0,0,0,0.5);
	}
	
	.tab2_box{
		display: flex;
		padding-left: 80upx;
		margin: 10upx 30upx 40upx 30upx;
	}
	.tab2_item{
		flex: 1;
		margin-right: 80upx;
		text-align: center;
		letter-spacing: 1px;
		font-size: 26upx;
		color: #d0b685;
		border-radius: 60upx;
		line-height: 60upx;
		border: 4upx solid #ebebeb;
		background: #FFFFFF;
	}
	.tab2_item.active{
		border: 4upx solid #d0b685;
		color: #FFFFFF;
		background: #d0b685;
		box-shadow: 0 0 20px rgba(0,0,0,0.2);
	}
	
	.navbar_search_input{
		padding: 0 0 0 60upx;
		text-align: left;
		color: #535353;
		background: #F3F3F3;
		border-radius: 90upx;
		margin: 0 40upx;
		height: 90upx;
	}
	.navbar_search_icon{
		width: 30upx;
		height: 30upx;
		right: auto;
		left: 60upx;
		bottom: 2upx;
	}
	
	.link_to_all{
		text-decoration: underline;
		color: #282828;
	}
	
	.anli_box{
		padding: 0 40upx;
	}
	.anli_item{
		position: relative;
		margin-bottom: 30upx;
		border-radius: 20upx;
		box-shadow: 0 1px 20px rgba(0,0,0,0.1);
		height: 230upx;
		display: flex;
		overflow: hidden;
	}
	.anli_item_pic{
		display: block;
		flex: none;
		width: 230upx;
		height: 230upx;
	}
	.anli_item_right{
		position: relative;
		flex: 1;
		padding: 20upx;
	}
	.anli_tag{
		font-size: 20upx;
		color: #FFFFFF;
		background: #78d07d;
		text-align: center;
		width: 120upx;
		line-height: 40upx;
		border-radius: 40upx;
	}
	.anli_item_title{
		margin-top: 4upx;
		font-size: 28upx;
		/* line-height: 50upx; */
		width: 400upx;
		height: 120upx;
		text-align: justify;
		/* overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis; */
	}
	.anli_item_abstract{
		font-size: 26upx;
		color: #999999;
		height: 60upx;
		width: 400upx;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	.anli_item_views_box{
		position: absolute;
		bottom: 10upx;
		padding-left: 40upx;
		right: 20upx;
		left: 20upx;
		display: flex;
		justify-content: space-between;
		color: #AEAEAE;
	}
	.anli_item_views_icon{
		height: 30upx;
		left: 0;
		top: -4upx;
		width: 30upx;
		right: auto;
	}
	.anli_item_views_nums{
		font-size: 26upx;
		font-weight: 500;
	}
</style>
