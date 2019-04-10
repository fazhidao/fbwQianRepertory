<template>
<view>
	<view class="top_box">
		<image class="top_bg" src="../../static/mine/top_bg.png" mode="aspectFill"></image>
		<view v-if="!user_info" class="top_unlogin_box absolute_center" @click="goView('/pages/login/login')">
			<view class="main_btn absolute_center unlogin_btn">立即登录</view>
		</view>
		<view v-if="user_info" class="top_avatar_box">
			<image v-if="!user_info.avatar" class="top_avatar" mode="aspectFill" src="../../static/mine/default_avatar.png" @click="goView('edit_userinfo')"></image>
			<image v-else class="top_avatar" mode="aspectFill" :src="user_info.avatar" @click="goView('edit_userinfo')"></image>
			<image v-if="user_info.user_class == 0" class="set_data_btn absolute_center" src="../../static/mine/set_data.png" @click="goView('/pages/login/chose_class')"></image>
			<image v-else class="set_data_btn absolute_center" src="../../static/mine/set_data.png" @click="goView('edit_userinfo')"></image>
		</view>
		<view v-if="user_info" class="top_info_box">
			<view class="top_message_box" @click="goView('message')">
				<!-- 消息提示 -->
				<image src="../../static/mine/message.png"></image>
				<!-- <view class="top_message_alert"></view> -->
			</view>
			<view class="username_box">
				<view class="username">{{user_info.name || '未设置昵称'}}</view>
				<view v-if="user_info.user_class != 0" class="vip_tag">
					<image class="vip_tag_normal_icon absolute_center" src="../../static/mine/normal.png"></image>
					<text>{{user_info.vip_title || '普通用户'}}{{user_info.user_class==1?' | 个人':''}}{{user_info.user_class==2?' | 企业':''}}{{user_info.user_class==3?' | 律师':''}}{{user_info.user_class==4?' | 律所':''}}</text>
				</view>
			</view>
			<view class="jifen_box">
				<view class="jifen_coln">
					<image class="jifen_icno absolute_center" src="../../static/mine/jifen.png"></image>
					<text class="jifen_text">积分：{{user_info.credit || 0}}</text>
				</view>
				<view class="jifen_coln">
					<image class="jifen_icno absolute_center" src="../../static/mine/xiazaiquan.png"></image>
					<text class="jifen_text">兑换券：{{user_info.coupon_amount || 0}}</text>
				</view>
			</view>
			<view v-if="user_info.user_class != 0" class="jion_vip" @click="goView('/pages/index/vip')">
				<image class="jion_vip_icon1 absolute_center" src="../../static/mine/vip.png"></image>
				<text v-if="user_info.vip_id == 0">加入vip</text>
				<text v-else>升级vip</text>
				<image class="jion_vip_icon2 absolute_center" src="../../static/mine/go.png"></image>
			</view>
			<view v-if="user_info.user_class == 0" class="go_identify" @click="goView('/pages/login/chose_class')">
				去完善身份信息
				<image class="jion_vip_icon2 absolute_center" src="../../static/mine/go.png"></image>
			</view>
		</view>
	</view>
	
	<view>
		<view class="menu_box">
			<block v-if="!user_info || user_info.user_class==1 || user_info.user_class==2">
				<view class="menu_item" @click="goViewCheck('my_ask_help')">
					<image src="../../static/mine/zixun.png" class="menu_icon absolute_center"></image>
					<text>我的咨询</text>
					<image src="../../static/arrow_right.png" class="menu_item_arrow right_arrow absolute_center"></image>
					<view class="borderY"></view>
				</view>
				<view class="menu_item" @click="goViewCheck('my_ask_entrust')">
					<image src="../../static/mine/weituo.png" class="menu_icon absolute_center"></image>
					<text>我的委托</text>
					<image src="../../static/arrow_right.png" class="menu_item_arrow right_arrow absolute_center"></image>
					<view class="borderY"></view>
				</view>
				<view class="menu_item" @click="goViewCheck('my_ask_advance')">
					<image src="../../static/mine/weituo.png" class="menu_icon absolute_center"></image>
					<text>我的诉讼垫资</text>
					<image src="../../static/arrow_right.png" class="menu_item_arrow right_arrow absolute_center"></image>
					<view class="borderY"></view>
				</view>
				<view class="menu_item" @click="goViewCheck('my_make_contract')">
					<image src="../../static/mine/dingdan.png" class="menu_icon absolute_center"></image>
					<text>我的合同定制</text>
					<image src="../../static/arrow_right.png" class="menu_item_arrow right_arrow absolute_center"></image>
					<view class="borderY"></view>
				</view>
			</block>
			<view class="menu_item" @click="goViewCheck('my_services')">
				<image src="../../static/mine/daili.png" class="menu_icon absolute_center"></image>
				<text>我的企业服务</text>
				<image src="../../static/arrow_right.png" class="menu_item_arrow right_arrow absolute_center"></image>
				<view class="borderY"></view>
			</view>
			<block v-if="user_info && user_info.user_class==3">
				<view class="menu_item" @click="goViewCheck('entrust_list')">
					<image src="../../static/mine/daili.png" class="menu_icon absolute_center"></image>
					<text>案件代理</text>
					<image src="../../static/arrow_right.png" class="menu_item_arrow right_arrow absolute_center"></image>
					<view class="borderY"></view>
				</view>
				<view class="menu_item" @click="goViewCheck('entrust_my')">
					<image src="../../static/mine/daili.png" class="menu_icon absolute_center"></image>
					<text>我的代理</text>
					<image src="../../static/arrow_right.png" class="menu_item_arrow right_arrow absolute_center"></image>
					<view class="borderY"></view>
				</view>
				<!-- <view class="menu_item" @click="weixinLogin()">
					<image src="../../static/mine/dingdan.png" class="menu_icon absolute_center"></image>
					<text>我的订单</text>
					<image src="../../static/arrow_right.png" class="menu_item_arrow right_arrow absolute_center"></image>
					<view class="borderY"></view>
				</view> -->
			</block>
			<view class="menu_item" @click="goViewCheck('my_constract')">
				<image src="../../static/mine/wenku.png" class="menu_icon absolute_center"></image>
				<text>我的文库</text>
				<image src="../../static/arrow_right.png" class="menu_item_arrow right_arrow absolute_center"></image>
				<view class="borderY"></view>
			</view>
			<view class="menu_item" @click="goViewCheck('convert')">
				<image src="../../static/mine/duihuan.png" class="menu_icon absolute_center"></image>
				<text>积分兑换</text>
				<image src="../../static/arrow_right.png" class="menu_item_arrow right_arrow absolute_center"></image>
			</view>
		</view>
		<view class="menu_box">
			<view class="menu_item" @click="goViewCheck('chat_webview?from=2')">
				<image src="../../static/ask_law/new_kefu.png" class="menu_icon absolute_center"></image>
				<text>在线客服</text>
				<image src="../../static/arrow_right.png" class="menu_item_arrow right_arrow absolute_center"></image>
				<view class="borderY"></view>
			</view>
			<view class="menu_item" @click="goViewCheck('system_manage')">
				<image src="../../static/mine/xitong.png" class="menu_icon absolute_center"></image>
				<text>系统设置</text>
				<image src="../../static/arrow_right.png" class="menu_item_arrow right_arrow absolute_center"></image>
				<view class="borderY"></view>
			</view>
			<view class="menu_item" @click="showShare()">
				<image src="../../static/mine/yaoqing.png" class="menu_icon absolute_center"></image>
				<text>邀请好友</text>
				<image src="../../static/arrow_right.png" class="menu_item_arrow right_arrow absolute_center"></image>
				<view class="borderY"></view>
			</view>
			<view class="menu_item" @click="goViewCheck('about_us')">
				<image src="../../static/mine/aboutus.png" class="menu_icon absolute_center"></image>
				<text>关于我们</text>
				<image src="../../static/arrow_right.png" class="menu_item_arrow right_arrow absolute_center"></image>
			</view>
		</view>
	</view>
	<view class="end_tip">
		&copy;2019 法保网
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
				user_info: false,
				avatar: false,
				is_show_share: false
			}
		},
		onPullDownRefresh() {
			if(!this.user_info){
				uni.stopPullDownRefresh();
				return 0;
			}
			//刷新用户信息
			this.loginByAppid();
		},
		onShow() {
			this.user_info = global.user_info;
		},
		methods: {
			goViewCheck(){
				if(global.appid){
					if(arguments[0]){
						this.goView(arguments[0]);
					}
					return 0;
				}
				this.goView('/pages/login/login');
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
		}
	}
</script>

<style>
	.top_box{
		position: relative;
		height: 440upx;
	}
	.top_bg{
		height: 100%;
		width: 100%;
	}
	.unlogin_btn{
		width: 260upx;
		letter-spacing: 2px;
		background: #98732d;
		font-size: 32upx;
	}
	.top_message_box{
		position: absolute;
		bottom: 40upx;
		right: 0;
		width: 60upx;
		height: 60upx;
	}
	.top_message_box image{
		height: 100%;
		width: 100%;
	}
	.top_message_alert{
		position: absolute;
		top: 0;
		right: 0;
		width: 20upx;
		height: 20upx;
		background: #e60012;
		border-radius: 50%;
	}
	.top_avatar_box{
		position: absolute;
		top: 100upx;
		left: 40upx;
		width: 180upx;
		height: 180upx;
	}
	.top_avatar{
		height: 100%;
		width: 100%;
		border-radius: 50%;
	}
	.set_data_btn{
		top: auto;
		bottom: -18upx;
		height: 36upx;
		width: 128upx;
	}
	.top_info_box{
		position: absolute;
		top: 100upx;
		bottom: 80upx;
		left: 240upx;
		right: 40upx;
		color: #FFFFFF;
	}
	.username_box{
		position: relative;
		line-height: 60upx;
		width: 250upx;
	}
	.username{
		width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-weight: bold;
		font-size: 34upx;
	}
	.vip_tag{
		position: absolute;
		left: 100%;
		top: 8upx;
		bottom: 8upx;
		line-height: 44upx;
		border-radius: 44upx;
		background: #9f9f9f;
		color: #FFFFFF;
		font-size: 24upx;
		width: 240upx;
	}
	.vip_tag image{
		width: 30upx;
		height: 30upx;
		left: 20upx;
		right: auto;
	}
	.vip_tag text{
		margin:  0 10upx 0 58upx;
	}
	.jifen_box{
		display: flex;
		line-height: 80upx;
	}
	.jifen_coln{
		flex: 1;
		position: relative;
	}
	.jifen_icno{
		width: 50upx;
		height: 50upx;
		left: 0;
		right: auto;
	}
	.jifen_text{
		margin-left: 60upx;
	}
	.jion_vip{
		position: relative;
		height: 50upx;
		line-height: 50upx;
		border-radius: 50upx;
		background: #bc434d;
		width: 230upx;
	}
	.jion_vip_icon1{
		width: 30upx;
		height: 30upx;
		left: 20upx;
		right: auto;
	}
	.jion_vip_icon2{
		width: 24upx;
		height: 24upx;
		left: auto;
		right: 30upx;
	}
	.jion_vip text{
		margin-left: 70upx;
	}
	.go_identify{
		position: relative;
		height: 50upx;
		line-height: 50upx;
		border-radius: 50upx;
		background: #bc434d;
		width: 230upx;
		text-align: center;
		padding-right: 50upx;
	}
	
	.scroll_view_mine{
		position: absolute;
		top: 440upx;
		bottom: 0;
		left: 0;
		right: 0;
	}
	.menu_box{
		padding-left: 100upx;
		margin-bottom: 20upx;
		background: #FFFFFF;
	}
	.menu_item{
		position: relative;
		line-height: 100upx;
		font-size: 36upx;
	}
	.menu_item:active{
		background: #efefef;
	}
	.menu_icon{
		left: -80upx;
		right: auto;
		width: 60upx;
		height: 60upx;
	}
	.menu_item_arrow{
		left: auto;
		right: 40upx;
	}
</style>