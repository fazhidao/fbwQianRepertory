<template>
<div>
	<view class="navbar_common navbar_constract">
		<div class="navbar_common_back" @click="goView(-1)">
			<image class="navbar_common_back_icon" src="../../static/arrow_back.png"></image>
		</div>
		<div class="navbar_constract_box">
			<input-box classes="navbar_search_input" v-model="keywords" placeholder="搜索合同关键字" @confirm="getContracts('new_arr','no_filter')" confirmtype="search" @clear="keywords=''"></input-box>
			<image class="navbar_search absolute_center" src="../../static/search.png" mode=""></image>
		</div> 
	</view>
	<view class="filter_box">
		<view class="filter_item" @click="showFilter(1)">
			<view :class="'filter_item_text'+(filter_show_index==1?' active':'')">
				<text v-show="chosed_type_amount == 0">类型</text>
				<text v-show="chosed_type_amount == 1">{{chosed_type_title}}</text>
				<text v-show="chosed_type_amount > 1">已选{{chosed_type_amount}}项</text>
				<image v-if="filter_show_index==1" class="filter_icon absolute_center" src="../../static/contracts/up.png"></image>
				<image v-else class="filter_icon absolute_center" src="../../static/contracts/down.png"></image>
			</view>
		</view>
		<view class="filter_item" @click="showFilter(2)">
			<view :class="'filter_item_text'+(filter_show_index==2?' active':'')">
				<text v-show="chosed_industry_amount == 0">行业</text>
				<text v-show="chosed_industry_amount == 1">{{chosed_industry_title}}</text>
				<text v-show="chosed_industry_amount > 1">已选{{chosed_industry_amount}}项</text>
				<image v-if="filter_show_index==2" class="filter_icon absolute_center" src="../../static/contracts/up.png"></image>
				<image v-else class="filter_icon absolute_center" src="../../static/contracts/down.png"></image>
			</view>
		</view>
	</view>
	<view :class="'filter_content_box'+(is_show_filter?' active':'')">
		<view class="filter_content_item_box" v-if="filter_show_index==1">
			<view :class="'filter_content_item'+(item.chosed?' active':'')" v-for="item in type_list" :key="item.title" @click="choseFilter(item)">
				<text>{{item.title}}</text>
			</view>
		</view>
		<view class="filter_content_item_box" v-if="filter_show_index==2">
			<view :class="'filter_content_item'+(item.chosed?' active':'')" v-for="item in industry_list" :key="item.title" @click="choseFilter(item)">
				<text>{{item.title}}</text>
			</view>
		</view>
		<view class="filter_content_btn_box">
			<button type="default" size="mini" @click="resetFilter()">重 置</button>
			<button type="primary" size="mini" @click="getContracts('new_arr')">确 定</button>
		</view>
		<view class="borderY"></view>
	</view>
	
	<view class="scroll_view_constract view_f3f3f3">
		<view class="contract_list_box" @touchend="hideFilter()">
			<view class="contract_box" v-for="(item,index) in contract_list" :key="index" @click="goDetail(item.id)">
				<image class="contract_pic" :src="img_url+item.picture" mode="aspectFill"></image>
				<view class="contract_info_box">
					<view class="contract_info_title_box">
						<view>{{item.industry_name}}</view>
						<view class="contract_info_downloads">{{item.downloads}}<image src="../../static/contracts/downloads.png" class="contract_info_downloads_icon absolute_center"></image></view>
					</view>
					<view style="min-height: 72upx;word-break: break-all;">{{item.keywords}}</view>
					<view style="text-align: center;font-weight: 600;">￥{{item.price/100}}</view>
				</view>
			</view>
		</view>
		<image v-show="contract_list.length == 0" class="empty_icon" src="../../static/contracts/empty.png" mode=""></image>
		<view v-show="contract_list.length == 0" class="empty_text">暂无搜索结果，<text class="link_to_all" @click="linkToAll()">返回所有</text></view>
		<view v-show="contract_list.length > 0" class="end_tip">{{is_end?"- 已经到底啦 -":"加载中..."}}</view>
	</view>
</div>
</template>

<script>
	export default{
		data(){
			return {
				img_url: '',
				is_show_filter: false,
				filter_show_index: 0,
				type_list: [],
				industry_list: [],
				chosed_type_title: '',
				chosed_type_amount: 0,
				chosed_industry_title: '',
				chosed_industry_amount: 0,
				keywords: '',
				page_size: 10,
				page: 1,
				is_end: false,
				is_loading: false,
				contract_list: [],
			}
		},
		onLoad() {
			this.img_url = this.ImgUrl;
			this.getBaseInfo();
			this.getContracts();
		},
		onReachBottom(){
			this.getContracts();
		},
		methods:{
			getContracts(){
				if(this.is_loading || (this.is_end&&!arguments[0])){
					return 0;
				}
				arguments[0] && (this.page = 1);
				this.is_loading = true;
				let request_data = {
					page_size: this.page_size,
					page: this.page
				};
				if(!arguments[1]){ //no_filter
					let type_list = [];
					let industry_list = [];
					this.type_list.forEach(el=>{
						if(el.chosed){
							type_list.push(el.id);
						}
					})
					this.industry_list.forEach(el=>{
						if(el.chosed){
							industry_list.push(el.id);
						}
					})
					if(type_list.length){
						request_data.type_id = type_list.join(',');
					}
					if(industry_list.length){
						request_data.industry_id = industry_list.join(',');
					}
				}
				if(this.keywords != ''){
					request_data.keywords = this.keywords;
				}
				this.requestApi({
					url: 'contracts/getList',
					data: request_data,
					success: res=>{
						this.is_loading = false;
						this.hideFilter();
						if(arguments[0]==undefined){
							this.contract_list.push(...res.data);
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
			getBaseInfo(){
				this.requestApi({
					url: 'getTypeAndIndustry',
					success: res=>{
						this.type_list = res.type_list.map(el=>{el.chosed=false;return el;})
						this.industry_list = res.industry_list.map(el=>{el.chosed=false;return el;})
					}
				})
			},
			showFilter(index){
				if(this.is_closing_filter){
					return 0;
				}
				if(this.is_show_filter){
					if(index == this.filter_show_index){
						this.is_show_filter = false;
						this.is_closing_filter = true;
						setTimeout(()=>{this.filter_show_index=0;this.is_closing_filter=false;},500)
					}else{
						this.filter_show_index = index;
					}
				}else{
					this.is_show_filter = true;
					this.filter_show_index = index;
				}
			},
			hideFilter(){
				this.is_show_filter = false;
				setTimeout(()=>{this.filter_show_index=0;},500) //防止点击过快
			},
			choseFilter(item){
				item.chosed = !item.chosed;
				if(item.chosed){
					if(this.filter_show_index == 1){
						this.chosed_type_title = item.title;
						this.chosed_type_amount ++;
					}else{
						this.chosed_industry_title = item.title;
						this.chosed_industry_amount ++;
					}
				}else{
					if(this.filter_show_index == 1){
						this.chosed_type_amount --;
					}else{
						this.chosed_industry_amount --;
					}
				}
			},
			resetFilter(){
				if(this.filter_show_index == 1){
					this.chosed_type_amount = 0;
					this.type_list = this.type_list.map(el=>{
						el.chosed = false;return el;
					})
				}else{
					this.chosed_industry_amount = 0;
					this.industry_list = this.industry_list.map(el=>{
						el.chosed = false;return el;
					})
				}
			},
			linkToAll(){
				this.keywords = '';
				this.is_end = false;
				this.page = 1;
				this.getContracts();
			},
			goDetail(id){
				if(this.filter_show_index){
					return 0;
				}
				uni.navigateTo({
					url: '/pages/contract/contract_detail?id='+id
				})
			}
		}
	}
</script>

<style>
	.navbar_constract{
		box-shadow: none;
		z-index: 100;
	}
	.navbar_constract_box{
		position: relative;
		margin-left: 100upx;
		padding: 6upx 0;
	}
	.navbar_search_input{
		text-align: left;
		color: #535353;
		background: #F3F3F3;
		border-radius: 90upx;
		padding-left: 60upx;
		margin: 0 40upx 0 0;
		height: 90upx;
	}
	.navbar_search{
		width: 30upx;
		height: 30upx;
		right: auto;
		left: 20upx;
	}
	.filter_box{
		position: fixed;
		z-index: 99;
		background: #FFFFFF;
		top: 128upx;
		left: 0;
		right: 0;
		display: flex;
		height: 90upx;
		line-height: 90upx;
		text-align: center;
	}
	.filter_item{
		flex: 1;
		display: flex;
		justify-content: center;
		color: #737373;
	}
	.filter_item_text{
		position: relative;
		font-size: 28upx;
		flex: none;
	}
	.filter_item_text.active{
		color: #CCB17E;
	}
	.filter_icon{
		left: 100%;
		right: auto;
		width: 30upx;
		height: 30upx;
	}
	.filter_item_text.active .filter_icon{
		transform: rotate(180deg);
	}
	.scroll_view_constract{
		/* position: fixed;
		top: 212upx;
		bottom: 0;
		left: 0;
		right: 0; */
		padding: 220upx 0 0 26upx;
		box-sizing: border-box;
	}
	.contract_list_box{
		display: flex;
		flex-wrap: wrap;
		padding-top: 26upx;
	}
	.contract_box{
		position: relative;
		flex: none;
		margin: 0 26upx 26upx 0;
		width: 336upx;
		height: 500upx;
		background: #FFFFFF;
		border-radius: 16upx;
		overflow: hidden;
	}
	.contract_pic{
		width: 100%;
		height: 100%;
	}
	.contract_info_box{
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		background: rgba(0,0,0,0.6);
		color: #FFFFFF;
		padding: 10upx 20upx;
	}
	.contract_info_title_box{
		display: flex;
		justify-content: space-between;
	}
	.contract_info_downloads{
		float: right;
		position: relative;
		padding-left: 4upx;
	}
	.contract_info_downloads_icon{
		left: auto;
		right: 100%;
		width: 24upx;
		height: 24upx;
	}
	
	.filter_content_box{
		position: fixed;
		top: 200upx;
		left: 0;
		right: 0;
		transition: all 0.5s;
		background: #FFFFFF;
		overflow: hidden;
		z-index: 98;
		box-shadow: 0 1px 1px #CECECE;
		transform: translateY(-100%);
	}
	.filter_content_box.active{
		transform: translateY(0)
	}
	.filter_content_btn_box{
		display: flex;
		justify-content: space-between;
		padding: 20upx 40upx;
	}
	.filter_content_btn_box button{
		width: 300upx;
		margin-left: 0;
		margin-right: 0;
	}
	.filter_content_item_box{
		padding: 40upx 0 0 38upx;
		display: flex;
		flex-wrap: wrap;
		max-height: 800upx;
		overflow: auto;
	}
	.filter_content_item{
		flex: none;
		background: #F3F3F3;
		border-radius: 8upx;
		height: 60upx;
		font-size: 24upx;
		margin: 0 38upx 20upx 0;
		color: #727272;
		width: 136upx;
		border: 1px solid #F3F3F3;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.filter_content_item text{
		text-align: center;
	}
	.filter_content_item.active{
		border: 1px solid #c2e6c2;
		background: #e0ffe0;
		/* color: #5fca5f; */
	}
	.link_to_all{
		text-decoration: underline;
		color: #282828;
	}
</style>
