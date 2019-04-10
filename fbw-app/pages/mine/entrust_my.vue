<template>
<div style="padding: 1px 0;">
	<view class="entrust_box" v-for="(item,index) in entrust_list" :key="item.id">
		<view class="entrust_title">
			<image class="absolute_center" src="../../static/ask_law/miaoshu.png" mode=""></image>
			<text>委托描述：</text>
		</view>
		<view class="entrust_content">{{item.content}}</view>
		<view class="entrust_type">{{item.type_name}}</view>
		<view class="borderY"></view>
		<view class="entrust_detail">
			<image src="../../static/ask_law/weizhi.png" mode=""></image>
			<text>案件地点：{{item.province}} {{item.province==item.city?'':item.city}} {{item.district||''}}</text>
		</view>
		<view class="entrust_detail">
			<image src="../../static/ask_law/jiage.png" mode=""></image>
			<text>案件价格：面议</text>
		</view>
		<view class="entrust_detail">
			<image src="../../static/ask_law/shijian.png" mode=""></image>
			<text>案件时间：{{item.create_time}}</text>
		</view>
		<view class="entrust_detail">
			<text v-if="item.contract_file==''||item.contract_file=='undefined'">相关图片：无</text>
			<block v-else>
				<text>相关图片：</text>
				<text class="agreement_text" @click="showPicture(item.contract_file)">点击查看</text>
			</block>
		</view>
		<view class="entrust_btn_box">
			<button type="primary" size="mini" @click="contactUser(item)">联系委托人</button>
			<button type="default" size="mini" @click="cancelTakeEntrust(index,item.id)">撤销代理</button>
		</view>
	</view>
	
	<image v-if="entrust_list.length == 0" class="empty_icon" src="../../static/contracts/empty.png" mode=""></image>
	<view v-if="entrust_list.length == 0" class="empty_text">暂无内容</view>
	<view v-if="entrust_list.length > 0" class="end_tip">{{is_end?"- 已经到底啦 -":"加载中..."}}</view>
		
	<view v-if="is_show_pictures" class="picture_box" @click="is_show_pictures=false">
		<swiper class="swiper" previous-margin="40px" next-margin="40px">
			<swiper-item class="picture_flex" v-for="item in chosed_pictures" :key="item">
				<image :src="item" mode="widthFix"></image>
			</swiper-item>
		</swiper>
	</view>
</div>
</template>

<script>
export default{
	data(){
		return {
			entrust_list: [],
			is_end: false,
			is_loading: false,
			page_size: 10,
			page: 1,
			chosed_pictures: [],
			is_show_pictures: false,
		}
	},
	onLoad() {
		this.getDataList();
	},
	onPullDownRefresh() {
		this.getDataList('new_arr');
	},
	onReachBottom() {
		this.getDataList();
	},
	methods:{
		getDataList(){
			if(this.is_loading || (this.is_end&&!arguments[0])){
				return 0;
			}
			this.is_loading = true;
			arguments[0] && (this.page = 1);
			this.requestApi({
				url: 'ask_law/get_my_entrustList',
				data: {
					page: this.page,
					page_size: this.page_size
				},
				success: res=>{
					uni.stopPullDownRefresh();
					this.is_loading = false;
					if(arguments[0]==undefined){
						this.entrust_list.push(...res.data);
						this.page ++;
					}else{
						this.entrust_list = res.data;
						this.page = 2;
					}
					if(this.entrust_list.length >= res.total){
						this.is_end = true;
					}else{
						this.is_end = false;
					}
				}
			})
		},
		cancelTakeEntrust(index,id){
			uni.showModal({
				title: '操作提示',
				content: '确定取消代理此委托?',
				success: (res) => {
					if(res.confirm){
						this.requestApi({
							url: 'ask_law/cancel_take_entrust',
							data: { id },
							success: res=>{
								uni.showToast({
									title: '取消成功',
									icon: 'success'
								});
								this.entrust_list.splice(index,1);
							}
						})
					}
				}
			})
		},
		contactUser(user){
			let name = user.app_name || user.name;
			let phone = user.app_phone || user.phone;
			uni.showModal({
				title: '操作提示',
				content: '即将拨打用户名为：'+name+'，手机号为：'+phone+' 的用户',
				success: res => {
					if(res.confirm){
						uni.makePhoneCall({
							phoneNumber: phone
						});
					}
				},
			});
		},
		showPicture(pics){
			this.chosed_pictures = pics.split(',').map(el=>{
				return this.ImgUrl + el;
			})
			uni.previewImage({
				urls: this.chosed_pictures
			});
			// this.is_show_pictures = true;
		}
	}
}
</script>

<style>
.entrust_box{
	position: relative;
	margin: 20upx;
	padding: 10px;
	background: #FFFFFF;
	border-radius: 12px;
	box-shadow: 0 0 12px rgba(0,0,0,0.2);
}
.entrust_box .borderY{
	margin: 10px 0;
}
.entrust_title{
	font-size: 16px;
	color: #000000;
}
.entrust_title{
	position: relative;
	padding-left: 28px;
	line-height: 40px;
}
.entrust_title image{
	width: 24px;
	height: 24px;
	right: auto;
}
.entrust_content{
	text-align: justify;
	font-size: 14px;
	text-indent: 28px;
}
.entrust_type{
	position: absolute;
	top: 14px;
	right: 0;
	background: #ccb17e;
	border-radius: 26px 0 0 26px;
	line-height: 26px;
	text-align: center;
	width: 80px;
	color: #FFFFFF;
	padding-left: 4px;
}

.entrust_detail{
	display: flex;
	align-items: center;
	height: 26px;
}
.entrust_detail image{
	width: 20px;
	height: 20px;
}
.entrust_btn_box{
	margin-top: 10px;
	display: flex;
	justify-content: space-between;
}

.picture_box{
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0,0,0,0.4);
	z-index: 99;
}
.swiper{
	height: 100%;
}
.picture_flex{
	display: flex;
	align-items: center;
	justify-content: center;
}
.picture_flex image{
	display: block;
	width: 480upx;
}
</style>
