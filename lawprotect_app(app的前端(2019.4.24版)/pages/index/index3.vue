<template>
	<view style="background: #FFFFFF;">
		<view class="navbar_common navbar_index" :style="{backgroundColor: navbar_bg}">
			<view class="left_icon_box" @click="goSign()">
				<image class="navbar_index_icon absolute_center" src="../../static/index/qiandao.png"></image>
			</view>
			<div class="navbar_title" style="color: #FFFFFF;">首页</div>
			<view class="right_icon_box" @click="showShare()">
				<image class="navbar_index_icon absolute_center" src="../../static/index/share.png"></image>
			</view>
		</view>
		
		<!-- 轮播图 -->
		<view class="index_swiper_box">
			<swiper class="index_swiper" :circular="true" :autoplay="true" :interval="4000" :duration="1000">
				<swiper-item v-for="item in swiper_img_list" :key="item">
					<image class="swiper_img" :src="item" mode="aspectFill"></image>
				</swiper-item>
				<swiper-item v-if="swiper_img_list.length==0">
					<image class="swiper_img" src="../../static/index/example_swiper.jpg"></image>
				</swiper-item>
			</swiper>
			<view class="swiper_dots_box">
				<view class="swiper_dot"></view>
			</view>
		</view>
		
		<!-- 顶部四个主菜单 -->
		<view class="top_four_menu">
			<image style="width: 100%;" src="../../static/index/top_four_menu.png" mode="widthFix"></image>
			<view class="four_menu_box">
				<!-- 合同文库 -->
				<view class="four_menu_item" @click="goView('/pages/contract/contracts')"></view>
				<!-- 法律咨询 -->
				<view class="four_menu_item" @click="changeToAsklawTab(1)"></view>
				<!-- 诉讼垫资 -->
				<view class="four_menu_item" @click="changeToAsklawTab(3)"></view>
				<!-- VIP服务 -->
				<view class="four_menu_item" @click="goView('/pages/index/vip')"></view>
			</view>
		</view>
		
		<!-- 服务动态 -->
		<view class="dongtai_box">
			<image class="dongtai_pic" src="../../static/index/dongtai.png"></image>
			<swiper class="dongtai_swiper" :circular="true" :vertical="true" :autoplay="true" :interval="4000" :duration="1000">
				<swiper-item v-for="item in services" :key="item.id">
					<view>{{item.title}}</view>
				</swiper-item>
			</swiper>
		</view>
		
		<view class="split_line"></view>
		
		<!-- 法律头条 -->
		<view class="title_box">
			<image class="falvtoutiao_title" src="../../static/index/falvtoutiao.png"></image>
			<view class="title_more" @click="changeToLearnTab(1)">
				<text>查看更多 </text>
				<image class="title_more_icon absolute_center" src="../../static/index/see_more.png"></image>
			</view>
		</view>
		<view class="borderY"></view>
		<view class="falvtoutiao_box">
			<block v-for="(item,index) in toutiaos" :key="item.id">
				<view class="falvtoutiao_item" @click="goDetail(item.id)">
					<view>{{item.title}}</view>
					<view class="falvtoutiao_views_text">
						<image class="falvtoutiao_views_icon absolute_center" src="../../static/index/views.png"></image>
						{{item.views}}
					</view>
					<!-- <image class="falvtoutiao_views_icon2" src="../../static/index/zan.png"></image>
					<view class="falvtoutiao_views_text2">130</view> -->
					<view v-if="index == 1" class="borderX"></view>
				</view>
				<view v-if="index == 0" class="falvtoutiao_item" @click="goDetail(item.id)">
					<image class="falvtoutiao_item_pic" :src="img_url+item.title_picture" mode="aspectFill"></image>
				</view>
				<view v-if="index == 0" class="borderY" style="flex: 0 0 auto;width: 100%;"></view>
			</block>
		</view>
		
		<view class="split_line"></view>
		
		<!-- 热门案例 -->
		<view class="title_box">
			<image class="falvtoutiao_title" src="../../static/index/remenanli.png"></image>
			<view class="title_more" @click="changeToLearnTab(2)">
				<text>查看更多 </text>
				<image class="title_more_icon absolute_center" src="../../static/index/see_more.png"></image>
			</view>
		</view>
		<view class="borderY"></view>
		<view class="anli_box">
			<view v-for="(item,index) in anlis" :key="item.id" @click="goDetail(item.id)">
				<view class="anli_item">
					<view class="anli_item_title">
						{{index+1}}. {{item.title}}
					</view>
					<view class="anli_item_abstract">
						{{item.abstract}}
					</view>
					<image class="anli_item_pic" :src="img_url+item.title_picture" mode="aspectFill"></image>
					<view class="anli_item_views_box">
						<image class="anli_item_views_icon absolute_center" src="../../static/index/hot.png"></image>
						<span class="anli_item_views_nums">{{item.views}}热度</span>
					</view>
				</view>
				<view class="borderY"></view>
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
			this.getIndexData();
			
			if(global.need_update){
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
					this.goView('/pages/index/sign');
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

<style>
	.top_icon_box{
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		padding-top: 40upx;
		height: 90upx;
		z-index: 2;
	}
	.navbar_index{
		color: #FFFFFF;
		transition: background-color 0.5s;
		box-shadow: none;
	}
	.left_icon_box,.right_icon_box{
		position: absolute;
		top: 40upx;
		bottom: 0;
		left: 0;
		width: 140upx;
	}
	.right_icon_box{
		left: auto;
		right: 0;
	}
	.navbar_index_icon{
		display: block;
		width: 40upx;
		height: 40upx;
	}
	.navbar_index_icon.left_icon{
		left: 40upx;
	}
	.navbar_index_icon.right_icon{
		bottom: 26upx;
		right: 40upx;
	}
	
	.index_swiper_box{
		height: 440upx;
		overflow: hidden;
		/* 四个主菜单的高度 */
		margin-bottom: 150upx;
	}
	.index_swiper{
		height: 100%;;
	}
	.swiper_img{
		display: block;
		width: 100%;
		height: 100%;
	}
	.swiper_bottom{
		position: absolute;
		width: 1000upx;
	}
	
	.top_four_menu{
		position: absolute;
		left: 0;
		right: 0;
		top: 360upx;
	}
	.four_menu_box{
		position: absolute;
		top: 20upx;
		bottom: 20upx;
		left: 40upx;
		right: 40upx;
		display: flex;
	}
	.four_menu_item{
		flex: 0 0 auto;
		width: 25%;
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
		flex-wrap: wrap;
	}
	.falvtoutiao_item{
		position: relative;
		flex: 0 0 auto;
		width: 375upx;
		height: 180upx;
		box-sizing: border-box;
		padding: 20upx;
		font-size: 26upx;
		text-align: justify;
		word-break: break-all;
	}
	.falvtoutiao_views_icon{
		width: 36upx;
		height: 26upx;
		right: auto;
	}
	.falvtoutiao_views_text{
		position: absolute;
		height: 36upx;
		line-height: 36upx;
		bottom: 12upx;
		left: 20upx;
		font-size: 28upx;
		padding-left: 46upx;
	}
	.falvtoutiao_views_icon2{
		position: absolute;
		width: 40upx;
		height: 40upx;
		bottom: 30upx;
		left: 170upx;
	}
	.falvtoutiao_views_text2{
		position: absolute;
		height: 36upx;
		line-height: 36upx;
		bottom: 30upx;
		left: 220upx;
		font-size: 28upx;
	}
	.falvtoutiao_item_pic{
		width: 335upx;
		height: 140upx;
	}
	.falvtoutiao_item .borderX{
		position: absolute;
		right: 0;
		top: 0;
		bottom: 10upx;
	}
	
	.anli_item{
		position: relative;
		padding: 20upx 30upx;
	}
	.anli_item_title{
		font-size: 28upx;
		font-weight: 600;
		line-height: 50upx;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		padding-right: 40upx;
		color: #ccb17e;
		width: 400upx;
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
		font-size: 26upx;
		color: #616161;
		margin: 10upx 0;
		padding: 0 30upx;
		width: 340upx;
		min-height: 100upx;
		text-align: justify;
	}
	.anli_item_pic{
		display: block;
		position: absolute;
		margin: auto;
		width: 300upx;
		height: 160upx;
		top: 0;
		bottom: 0;
		right: 20upx;
	}
	
	.title_box{
		position: relative;
		font-size: 24upx;
	}
	.title_more{
		position: absolute;
		right: 30upx;
		top: 0;
		bottom: 0;
		line-height: 60upx;
		color: #727272;
		padding-right: 28upx;
	}
	.title_more_icon{
		left: auto;
		right: 0;
		height: 12upx;
		width: 24upx;
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
