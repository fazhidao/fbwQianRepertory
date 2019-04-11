<template>
	<view style="background: #FFFFFF;">
		<view class="navbar_index">
			<div class="navbar_index_title">首页 </div>
			<view class="navbar_index_icon_box" @click="goSign()">
				<image class="navbar_index_icon absolute_center" src="../../static/index/qiandao2.png"></image>
			</view>
			<view class="navbar_index_icon_box" @click="showShare()">
				<image class="navbar_index_icon absolute_center" src="../../static/index/share2.png"></image>
			</view>
		</view>
		
		<!-- 轮播图 -->
		<view class="index_swiper_box">
			<swiper indicator-color="rgba(256, 256, 256, .3)" indicator-active-color="#999999" class="index_swiper" :circular="true" :autoplay="true" :interval="4000" :duration="1000"  :indicator-dots="indicatorDots">
				<swiper-item class="index_swiper_item" v-for="item in swiper_img_list" :key="item">
					<image class="swiper_img" :src="item" mode="aspectFill"></image>
				</swiper-item>
				<!-- <swiper-item class="index_swiper_item" v-if="swiper_img_list.length==0">
					<image class="swiper_img" src="../../static/index/example_swiper.jpg"></image>
				</swiper-item> -->
			</swiper>
			<view class="swiper_dots_box">
				<view class="swiper_dot"></view>
			</view>
		</view>
		
		<!-- 顶部四个主菜单 -->
		<view class="four_menu_box">
			<view class="four_menu_item" @click="goView('/pages/contract/contracts')">
				<image src="../../static/index/menu4.png" mode=""></image>
				<view>合同文库</view>
			</view>
			<view class="four_menu_item" @click="changeToAsklawTab(1)">
				<image src="../../static/index/menu3.png" mode=""></image>
				<view>法律咨询</view>
			</view>
			<view class="four_menu_item" @click="goSerices()">
				<image src="../../static/index/menu2.png" mode=""></image>
				<view>企业服务</view>
			</view>
			<view class="four_menu_item" @click="goView('/pages/index/vip')">
				<image src="../../static/index/menu1.png" mode=""></image>
				<view>VIP服务</view>
			</view>
		</view>
		
		<view class="borderY"></view>
		
		<!-- 法律头条 -->
		<view class="title_box" @click="changeToLearnTab(1)">
			法律头条<image class="absolute_center" src="../../static/index/more.png" mode=""></image>
		</view>
		<scroll-view scroll-x="true">
			<view class="falvtoutiao_box">
				<view class="falvtoutiao_item" v-for="(item,index) in toutiaos" :key="item.id" @click="goDetail(item.id)">
					<image class="falvtoutiao_item_pic" :src="img_url+item.title_picture" mode="aspectFill"></image>
					<view>{{item.title}}</view>
				</view>
			</view>
		</scroll-view>
		
		<!-- 热门案例 -->
		<view class="title_box" @click="changeToLearnTab(2)">
			热门案例<image class="absolute_center" src="../../static/index/more.png" mode=""></image>
		</view>
		<view class="anli_box">
			<view class="anli_item" v-for="(item,index) in anlis" :key="item.id" @click="goDetail(item.id)">
				<image class="anli_item_pic" :src="img_url+item.title_picture" mode="aspectFill"></image>
				<view class="anli_item_right">
					<view class="anli_item_title">
						{{item.title}}
					</view>
					<view class="anli_item_abstract">
						{{item.abstract}}
					</view>
				</view>
			</view>
			<view class="end_tip" style="background: #F3F3F3;">{{is_end?"- 已经到底啦 -":"加载中..."}}</view>
		</view>
		
		<view v-if="is_show_update" class="select_bg" @click="hideUpdate()"></view>
		<view v-if="is_show_update" class="update_box">
			<image class="update_bg" src="../../static/index/update.png"></image>
			<view class="update_title">发现新版本</view>
			<view class="update_detail" v-for="item in update_text" :key="item">{{item}}</view>
			<view class="main_btn update_btn" @click="goUpdate()">立即更新</view>
		</view>
		
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
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				indicatorDots: true,
				services: [],
				toutiaos: [],
				anlis: [],
				swiper_img_list: [],
				img_url: '',
				navbar_bg: 'rgba(0,0,0,0)',
				is_show_share: false,
				is_show_update: false,
				update_text: [],
				force_update: 0,
				page_size: 5,
				page: 2,
				is_end: false,
				is_loading: false,
			}
		},
		onLoad() {		
			uni.getStorage({
				key: 'is_welcomed',
				fail: (res) => {
					uni.navigateTo({
						url: '/pages/index/welcome'
					})
				}
			})
			this.img_url = this.ImgUrl
			console.log(this.img_url)
			this.getIndexData();
			
			if(global.need_update){
				console.log(global.need_update)
				global.need_update = false;
				this.showUpdate();
			}
		},
		onShow() {
			if(global.need_go_from_push){
				this.goView(global.need_go_from_push);
				global.need_go_from_push = false;
			}
		},
		onPageScroll(options) {
			// console.log(options)
			if(options.scrollTop > 60){
				this.navbar_bg = 'rgba(0,0,0,1)';
			}else{
				this.navbar_bg = 'rgba(0,0,0,0)';
			}
		},
		onPullDownRefresh() {
			this.getIndexData();
		},
		onReachBottom() {
			this.getAnliList();
		},
		methods: {
			getAnliList(){
				if(this.is_loading || this.is_end){
					return 0;
				}
				this.is_loading = true;
				this.requestApi({
					url: 'articles/getList',
					data: {
						page_size: this.page_size,
						page: arguments[0]==undefined? this.page : 1,
						type: 2
					},
					success: res=>{
						this.is_loading = false;
						this.anlis.push(...res.data);
						this.page ++;
						if(this.anlis.length >= res.total){
							this.is_end = true;
						}
					}
				})
			},
			getIndexData(){
				this.requestApi({
					url: 'getIndexData',
					success: res=>{
						this.services = res.services;
						this.anlis = res.anlis;
						this.toutiaos = res.toutiaos;
						this.swiper_img_list = res.banners.map(el=>{
							return this.ImgUrl+el.picture
						});
						this.is_end = false;
						uni.stopPullDownRefresh();
					}
				})
			},
			changeToAsklawTab(index){
				global.ask_law_index = index;
				uni.switchTab({
					url: '/pages/ask_law/ask_law'
				})
			},
			changeToLearnTab(index){
				uni.switchTab({
					url: '/pages/learn_law/learn_law?index='+index
				})
			},
			goDetail(id){
				uni.navigateTo({
					url: '/pages/learn_law/detail_webview?id='+id
				})
			},
			goSign(){
				if(global.appid){
					console.log(global.appid);
					this.goView('/pages/index/sign');
				}else{
					this.goView('/pages/login/login')
				}
			},
			goSerices(){
				if(global.appid){
					this.goView('/pages/service/service');
				}else{
					this.goView('/pages/login/login')
				}
			},
			showShare(){
				uni.hideTabBar();
				this.is_show_share = true;
			},
			hideShare(){
				setTimeout(()=>{uni.showTabBar()},300)
				this.is_show_share = false;
			},
			doShare(type){
				this.requestApi({
					url: 'getShareData',
					success: res=>{
						let scene = type==1 ? 'WXSenceTimeline' : 'WXSceneSession';
						uni.share({
							provider: "weixin",
							scene,
							type: 0,
							href: res[0].value,
							imageUrl: res[1].value,
							title: res[2].value,
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
			},
			showUpdate(){
				uni.hideTabBar();
				this.update_text = global.update_text;
				this.is_show_update = true;
			},
			hideUpdate(){
				if(global.force_update == 1){
					return 0;
				}
				uni.showTabBar();
				this.is_show_update = false;
			},
			goUpdate(){
				plus.runtime.openURL(global.update_url);
			}
		}
	}
</script>

<style scoped>
	.anli_item_title{
		display: -webkit-box;
		-webkit-box-orient:vertical;
		overflow: hidden;
		-webkit-line-clamp:1;
	}
	.anli_item_abstract{
		line-height: 18px;
		display: -webkit-box;
		-webkit-box-orient:vertical;
		overflow: hidden;
		-webkit-line-clamp:4;
	}
	.navbar_index{
		height: 50px;
		line-height: 50px;
		display: flex;
		padding: 20px 10px 0 20px;
	}
	.navbar_index_title{
		flex: 2;
		letter-spacing: 6px;
		font-size: 16px;
	}
	.navbar_index_icon_box{
		width: 40px;
		position: relative;
	}
	.navbar_index_icon{
		display: block;
		width: 24px;
		height: 24px;
	}
	.navbar_index_icon.left_icon{
		left: 40upx;
	}
	.navbar_index_icon.right_icon{
		bottom: 26upx;
		right: 40upx;
	}
	
	.index_swiper_box{
		position: relative;
		height: 340upx;
	}
	.index_swiper{
		height: 100%;
		padding: 4px 0;
	}
	.index_swiper_item{
		padding: 4px 0;
		box-sizing: border-box;
	}
	.swiper_img{
		display: block;
		width: 90%;
		height: 100%;
		border-radius: 8px;
		margin: 0 auto;
		box-shadow: 0 0 4px #CECECE;
	}
	.swiper_bottom{
		position: absolute;
		width: 1000upx;
	}
	
	.four_menu_box{
		display: flex;
		padding: 20px 0;
		justify-content: space-between;
	}
	.four_menu_item{
		width: 25%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.four_menu_item image{
		width: 40px;
		height: 40px;
		margin-bottom: 2px;
	}
	
	.dongtai_box{
		position: relative;
		height: 130upx;
		line-height: 130upx;
	}
	.dongtai_pic{
		position: absolute;
		top: 0;
		left: 0;
		height: 130upx;
		width: 170upx;
	}
	.dongtai_swiper{
		position: absolute;
		top: 0;
		left: 170upx;
		right: 120upx;
		height: 130upx;
	}
	
	.split_line{
		height: 14upx;
		background: #f3f3f3;
	}
	
	.falvtoutiao_title{
		display: block;
		width: 250upx;
		height: 60upx;
		margin: 0 auto;
	}
	.falvtoutiao_box{
		display: flex;
		padding: 0 0 20px 10px;
		flex-wrap: nowrap;
	}
	.falvtoutiao_item{
		flex: 0 0 auto;
		width: 160px;
		padding-right: 10px;
		font-size: 12px;
	}
	.falvtoutiao_item_pic{
		width: 100%;
		height: 100px;
		border-radius: 8px;
	}
	.falvtoutiao_item .borderX{
		position: absolute;
		right: 0;
		top: 0;
		bottom: 10upx;
	}
	
	.anli_item{
		position: relative;
		display: flex;
		margin-bottom: 20px;
		padding-right: 10px;
	}
	.anli_item_title{
		font-size: 14px;
		color: #000000;
		text-align: justify;
		margin-bottom: 10px;
	}
	.anli_item_views_box{
		position: relative;
		line-height: 40upx;
		padding-left: 70upx;
	}
	.anli_item_views_icon{
		height: 30upx;
		top: -4upx;
		left: 30upx;
		width: 30upx;
		right: auto;
	}
	.anli_item_views_nums{
		font-size: 26upx;
		color: #989797;
		font-weight: 500;
	}
	.anli_item_abstract{
		font-size: 12px;
		color: #AEAEAE;
		text-align: justify;
	}
	.anli_item_pic{
		flex: 0 0 auto;
		display: block;
		width: 140px;
		height: 100px;
		box-shadow: 0 0 4px #CECECE;
		margin: 0 10px 0 20px;
		border-radius: 8px;
	}
	.anli_item_right{
		flex: 1;
	}
	
	.title_box{
		position: relative;
		font-size: 14px;
		line-height: 50px;
		padding-left: 20px;
	}
	.title_box .absolute_center{
		right: auto;
		left: 90px;
		height: 14px;
		width: 7px;
		display: block;
	}
	
	.update_box{
		position: fixed;
		margin: auto;
		top: 50%;
		left: 0;
		right: 0;
		width: 480upx;
		transform: translateY(-50%);
		background: #FFFFFF;
		z-index: 101;
		border-radius: 8px;
		overflow: hidden;
		padding-bottom: 20px;
		box-shadow: 0 0 8px #333333;
	}
	.update_bg{
		display: block;
		width: 100%;
		height: 200upx;
	}
	.update_title{
		font-size: 16px;
		color: #1c346b;
		text-align: center;
		margin-bottom: 10px;
	}
	.update_detail{
		line-height: 20px;
		font-size: 14px;
		color: #AEAEAE;
		padding: 0 10px;
	}
	.update_btn{
		margin: 14px auto 0 auto;
		width: 160px;
		height: 36px;
		line-height: 36px;
		border-radius: 36px;
		font-size: 18px;
		background: #28c95f;
		letter-spacing: 2px;
		box-shadow: none;
	}
</style>
