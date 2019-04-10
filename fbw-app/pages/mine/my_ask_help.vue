<template>
<div>
	<view class="mine_top_tab_box">
		<view class="mine_top_tab_item" @click="choseTab(0)">
			<text>正在申请</text>
			<view v-show="chosed_tab==0" class="mine_top_tab_border absolute_center"></view>
		</view>
		<view class="mine_top_tab_item" @click="choseTab(1)">
			<text>已处理完成</text>
			<view v-show="chosed_tab==1" class="mine_top_tab_border absolute_center"></view>
		</view>
	</view>
	
	<view class="mine_content_box">
		<view class="mine_item" v-for="(item,index) in mine_list" :key="item.create_time">
			<view class="mine_item_title">最新提问：{{item.content}}</view>
			<view class="mine_item_detail">发布时间：{{item.create_time}}</view>
			<block v-if="item.status==2||item.status==6">
				<view class="borderY" style="margin: 6px 0;"></view>
				<view class="mine_item_title">最新回复：{{item.reply}}</view>
				<view class="mine_item_detail">回复时间：{{item.reply_time}}</view>
			</block>
			<view v-if="item.status==1||item.status==5" class="mine_item_tag tag_wait">待回复</view>
			<view v-if="item.status==2||item.status==6" class="mine_item_tag tag_reply">已回复</view>
			<view v-if="item.status==3" class="mine_item_tag tag_finish">已完成</view>
			<view class="mine_item_btn_box">
				<text v-if="item.status==2||item.status==6" class="mine_item_btn_main" @click="finishItem(index,item.id)">确认完成</text>
				<text class="mine_item_btn_main" @click="goDetail(item)">查看详情</text>
				<text class="mine_item_btn" @click="deleteItem(index,item.id)">删除</text>
			</view>
		</view>
	</view>
	
	<image v-show="mine_list.length == 0" class="empty_icon" src="../../static/contracts/empty.png" mode=""></image>
	<view v-show="mine_list.length == 0" class="empty_text">还没有任何内容，快去咨询吧~</view>
	<view v-show="mine_list.length > 0" class="end_tip">{{is_end?"- 已经到底啦 -":"加载中..."}}</view>
</div>
</template>

<script>
import './mine_list.css';
export default{
	data(){
		return {
			chosed_tab: 0,
			mine_list: [],
			is_end: false,
			is_loading: false,
			page_size: 10,
			page: 1,
		}
	},
	onLoad() {
		this.getMineList();
	},
	onShow() {
		if(global.need_refresh_ask_help){
			global.need_refresh_ask_help = undefined;
			this.getMineList('new_arr');
		}
	},
	onPullDownRefresh() {
		this.getMineList('new_arr');
	},
	onReachBottom(){
		this.getMineList();
	},
	methods: {
		getMineList(){
			if(this.is_loading || (this.is_end&&!arguments[0])){
				return 0;
			}
			arguments[0] && (this.page = 1);
			this.is_loading = true;
			let tab = this.chosed_tab ? 'f' : 'w';
			this.requestApi({
				url: 'ask_law/mine_ask_help_'+tab,
				data: {
					page_size: this.page_size,
					page: this.page
				},
				success: res=>{
					uni.stopPullDownRefresh();
					this.is_loading = false;
					res.data = res.data.map(el=>{
						el.content = el.talks[el.talks.length-1].ask_content;
						el.create_time = el.talks[el.talks.length-1].create_time;
						el.reply = el.talks[el.talks.length-1].reply_content;
						el.reply_time = el.talks[el.talks.length-1].reply_time;
						return el;
					})
					if(arguments[0]==undefined){
						this.mine_list.push(...res.data);
						this.page ++;
					}else{
						this.mine_list = res.data;
						this.page = 2;
					}
					if(this.mine_list.length >= res.total){
						this.is_end = true;
					}else{
						this.is_end = false;
					}
				}
			})
		},
		choseTab(index){
			this.chosed_tab = index;
			this.getMineList('new_arr');
		},
		deleteItem(index,id){
			uni.showModal({
				title: '操作提示',
				content: '删除后将不再显示在列表中，确定删除?',
				success: res => {
					if(res.confirm){
						this.requestApi({
							url: 'ask_law/delete_ask_help',
							data: {id},
							success: ()=>{
								uni.showToast({
									title: '删除成功',
									icon: 'success'
								})
								this.mine_list.splice(index,1);
							}
						})
					}
				},
			});
		},
		finishItem(index,id){
			uni.showModal({
				title: '操作提示',
				content: '确定设置此咨询状态为已完成?',
				success: res => {
					if(res.confirm){
						this.requestApi({
							url: 'ask_law/finish_ask_help',
							data: {id},
							success: ()=>{
								uni.showToast({
									title: '操作成功',
									icon: 'success'
								})
								this.mine_list.splice(index,1);
							}
						})
					}
				},
			});
		},
		goDetail(item){
			global.chosed_help = item;
			this.goView('my_ask_help_detail');
		}
	}
}
</script>

<style>
</style>
