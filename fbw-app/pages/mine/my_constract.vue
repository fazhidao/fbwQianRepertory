<template>
<div>
	<view class="my_contract_box" v-for="item in contract_list" :key="item.id">
		<view class="my_contract_top">
			<image src="../../static/mine/hetong_icon.png" mode=""></image>
			<text>法保网</text>
		</view>
		<view class="my_contract_content_box">
			<image class="my_contract_picture" src="../../static/contracts/example.png" mode="aspectFill"></image>
			<view class="my_contract_content_right">
				<view class="my_contract_title">合同名称：{{item.keywords}}</view>
				<view class="my_contract_info">下载时间：{{item.buy_time}}</view>
				<view class="my_contract_price">下载价格：{{item.buy_price}}</view>
			</view>
		</view>
		<view class="borderY" style="margin: 20upx 0;"></view>
		<view class="my_contract_btn_box">
			<view class="my_contract_download_btn" @click="goDetail(item.id)">查看详情</view>
		</view>
	</view>
	
	<image v-show="contract_list.length == 0" class="empty_icon" src="../../static/contracts/empty.png" mode=""></image>
	<view v-show="contract_list.length == 0" class="empty_text">还没有任何内容，快去选购吧~</view>
	<view v-show="contract_list.length > 0" class="end_tip">{{is_end?"- 已经到底啦 -":"加载中..."}}</view>
</div>
</template>

<script>
export default{
	data(){
		return {
			contract_list: [],
			is_end: false,
			is_loading: false,
			page_size: 10,
			page: 1,
		}
	},
	onLoad() {
		this.getDataList();
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
				url: 'contracts/getMineList',
				data: {
					page: this.page,
					page_size: this.page_size
				},
				success: res=>{
					this.is_loading = false;
					if(arguments[0]==undefined){
						this.contract_list.push(...res.data.map(el=>{
							el.picture = this.ImgUrl + el.picture;
							return el;
						}));
						this.page ++;
					}else{
						this.contract_list = res.data;
						this.page = 2;
					}
					if(this.contract_list.length >= res.total){
						this.is_end = true;
					}else{
						this.is_end = false;
					}
				}
			})
		},
		goDetail(id){
			uni.navigateTo({
				url: '/pages/contract/contract_detail?id='+id
			})
		}
	}
}
</script>

<style>
.my_contract_box{
	background: #FFFFFF;
	padding: 20upx;
	border-radius: 16upx;
	margin: 20upx;
	box-shadow: 1px 1px 8px #ECECEC;
}
.my_contract_top{
	display: flex;
	align-items: center;
	height: 50upx;
	font-size: 28upx;
	margin-bottom: 10upx;
}
.my_contract_top image{
	width: 30upx;
	height: 30upx;
	margin-right: 12upx;
}
.my_contract_content_box{
	display: flex;
}
.my_contract_picture{
	width: 190upx;
	height: 240upx;
	border-radius: 8upx;
	border: 1px solid #ECECEC;
	margin-right: 20upx;
}
.my_contract_content_right{
	position: relative;
	flex: 1;
}
.my_contract_title{
	color: #000000;
	font-size: 30upx;
}
.my_contract_info{
	color: #595959;
	font-size: 26upx;
	line-height: 40upx;
	margin-top: 4px;
	color: #AEAEAE;
}
.my_contract_price{
	position: absolute;
	left: 0;
	right: 0;
	bottom: 0;
	text-align: right;
}
.my_contract_price text{
	font-size: 32upx;
	color: #000000;
}
.my_contract_btn_box{
	display: flex;
	justify-content: flex-end;
}
.my_contract_download_btn{
	height: 54upx;
	line-height: 54upx;
	border-radius: 54upx;
	width: 150upx;
	text-align: center;
	color: #d82020;
	border: 1px solid #d82020;
}
</style>
