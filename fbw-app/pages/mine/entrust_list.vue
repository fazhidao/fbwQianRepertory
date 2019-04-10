<template>
<div style="padding: 1px 0;">
	<view class="chose_position_box" @click="showSelectArea()">
		<text v-if="!chosed_area">点击选择地区</text>
		<text v-else>已选择 {{chosed_area.province_name}} {{chosed_area.city_name}} </text>
	</view>
	
	<view v-if="is_show_select_area" class="select_bg" @click="is_show_select_area=false"></view>
	<view v-if="is_show_select_area" class="select_box absolute_center">
		<view class="select_title">根据市名检索地区</view>
		<view style="padding-left: 20upx;">
			<input class="select_input" placeholder="输入所在市的关键字" @input="getAreaList"/>
		</view>
		<view class="borderY"></view>
		<view class="select_position_info">
			系统定位：<text :class="self_city_name=='定位中...'?'':'select_position_btn'" @click="selectPosition()">{{self_city_name}}</text>
		</view>
		<view class="borderY"></view>
		<scroll-view class="select_content_box" scroll-y>
			<view v-show="area_list.length==0" class="end_tip">暂无搜索结果</view>
			<view v-for="item in area_list" :key="item.id">
				<view class="select_row" @click="choseArea(item)">
					<text>{{item.province_name}} {{item.city_name}}</text>
					<image v-if="item.chosed" src="../../static/gou.png" class="select_icon absolute_center"></image>
				</view>
				<view class="borderY"></view>
			</view>
		</scroll-view>
	</view>
	
	<view class="entrust_box" v-for="item in entrust_list" :key="item.id">
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
			<button type="primary" @click="takeEntrust(item.id)">立即代理</button>
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
			is_show_select_area: false,
			area_list: [],
			self_city_name: '定位中...',
			chosed_area: false,
			chosed_pictures: [],
			is_show_pictures: false,
		}
	},
	onLoad() {
		uni.getStorage({
			key: 'entrust_list_area',
			success: (res) => {
				this.chosed_area = JSON.parse(res.data)
				this.getDataList();
			},
			fail: () => {
				this.getDataList();
			}
		})
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
			arguments[0] && (this.page = 1);
			this.is_loading = true;
			let request_data = {
				page: this.page,
				page_size: this.page_size
			}
			if(this.chosed_area){
				request_data.city_id = this.chosed_area.id;
			}
			this.requestApi({
				url: 'ask_law/get_entrustList',
				hide_loading: arguments[1] ? true : false,
				data: request_data,
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
		takeEntrust(id){
			uni.showModal({
				title: '操作提示',
				content: '确定代理此委托?',
				success: (res) => {
					if(res.confirm){
						this.requestApi({
							url: 'ask_law/take_entrust',
							data: { id },
							success: res=>{
								uni.showToast({
									title: '代理成功',
									icon: 'success',
									mask: true
								});
								setTimeout(()=>{
									this.getDataList('new_arr');
								},1000)
							}
						})
					}
				}
			})
		},
		getAreaList(event){
			if(event.target.value == ''){
				return 0;
			}
			this.requestApi({
				url: 'areas/getList',
				data: {name: event.target.value},
				success: res=>{
					this.area_list = res;
				}
			})
		},
		selectPosition(){
			this.requestApi({
				url: 'areas/getList',
				data: {name: this.self_city_name},
				success: res=>{
					this.area_list = res;
				}
			})
		},
		choseArea(item){
			this.chosed_area = item;
			this.is_show_select_area = false;
			this.getDataList('new_arr');
			uni.setStorage({
				key: 'entrust_list_area',
				data: JSON.stringify(item)
			})
		},
		showSelectArea(){
			this.is_show_select_area = true;
			//self_city_name缓存系统定位
			if(global.self_city_name == undefined){
				uni.getLocation({
					success: (res) => {
						let location = res.latitude+','+res.longitude;
						this.requestApi({
							url: 'getCityByLocation',
							data: {location},
							success: res=>{
								if(res.fail){
								}else{
									this.self_city_name = res.city_name;
									global.self_city_name = res.city_name;
								}
							}
						})
					}
				})
			}else{
				this.self_city_name = global.self_city_name;
			}
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
.chose_position_box{
	line-height: 40px;
	text-align: center;
	background: #ccb17e;
	color: #FFFFFF;
}
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
