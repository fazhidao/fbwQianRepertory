<template>
<div>
	<view class="form_box">
		<view class="form_row">
			<view class="form_row_title">标的金额</view>
			<input class="form_row_input" type="number" v-model="money" placeholder="请输入" />
			<text class="form_row_right_text">元</text>
		</view>
		<view class="borderY"></view>
		<view class="form_row">
			<view class="form_row_title">起算日期</view>
			<view class="form_row_right_box">
				<picker class="form_row_picker" mode="date" :value="date_start" @change="bindDateChange">
					<view class="form_row_picker_text">{{date_start}}</view>
				</picker>
				<image src="../../static/arrow_right.png" class="form_row_select_icon absolute_center"></image>
			</view>
		</view>
		<view class="borderY"></view>
		<view class="form_row">
			<view class="form_row_title">截止日期</view>
			<view class="form_row_right_box">
				<picker class="form_row_picker" mode="date" :value="date_end" :start="date_start" @change="bindDateChange2">
					<view class="uni-input">{{date_end}}</view>
				</picker>
				<image src="../../static/arrow_right.png" class="form_row_select_icon absolute_center"></image>
			</view>
		</view>
		<view class="borderY"></view>
		<view class="form_row">
			<view class="form_row_title">利率计算方式</view>
			<view class="form_row_right_box" @click="is_show.type=true">
				<text class="form_row_text">{{selected_type.title?selected_type.title:"点击选择"}}</text>
				<image src="../../static/arrow_right.png" class="form_row_select_icon absolute_center"></image>
			</view>
		</view>
		<view class="borderY"></view>
		<view class="form_row">
			<view class="form_row_title">约定利率</view>
			<input class="form_row_input" type="number" v-model="rate" placeholder="请输入" />
			<text class="form_row_right_text">%</text>
		</view>
		<view class="borderY"></view>
	</view>
	<view class="btn_group">
		<button type="default" size="mini" @click="resetCalculate()">重 置</button>
		<button type="primary" size="mini" @click="submitCalculate()">确 定</button>
	</view>
	
	<view v-show="result.length > 0" class="result_box">
		<view v-for="item in result" :key="item[0]">{{item[0]}} ： {{item[1]}}</view>
		<view class="borderY"></view>
		<view class="tip">违约金 = 债务 * 逾期期间 * 日利率或月利率或年利率</view>
		<view class="tip">年利率 = 12 * 月利率 = 360 * 日利率</view>
	</view>
	
	<view v-show="is_show.type" class="select_bg" @click="is_show.type=false"></view>
	<view v-show="is_show.type" class="select_box absolute_center">
		<view class="select_title">选择利率计算方式</view>
		<scroll-view class="select_content_box" scroll-y>
			<view v-for="item in type_list" :key="item.title">
				<view class="select_row" @click="choseType(item)">
					<text>{{item.title}}</text>
					<image v-if="item.chosed" src="../../static/gou.png" class="select_icon absolute_center"></image>
				</view>
				<view class="borderY"></view>
			</view>
		</scroll-view>
		<!-- <view class="btn_group select_btn_group">
			<button type="default" size="mini" @click="closeChose()">取 消</button>
			<button type="primary" size="mini" @click="is_show.type=false">确 定</button>
		</view> -->
	</view>
</div>
</template>

<script>
	export default{
		data(){
			return {
				is_show:{
					type: false,
				},
				type_list:[
					{ title: '年利率', chosed: false },
					{ title: '月利率', chosed: false },
					{ title: '日利率', chosed: false },
				],
				money: '',
				result: [],
				selected_type: {},
				date_start: '选择日期',
				date_end: '选择日期',
				rate: '',
			}
		},
		onLoad() {
		},
		methods:{
			submitCalculate(){
				if(this.money == ''){
					uni.showToast({
						title: "请输入标的金额",
						icon: "none"
					})
					return 0;
				}else if(this.date_start == '选择日期'){
					uni.showToast({
						title: "请选择起算日期",
						icon: "none"
					})
					return 0;
				}else if(this.date_end == '选择日期'){
					uni.showToast({
						title: "请选择截止日期",
						icon: "none"
					})
					return 0;
				}else if(!this.selected_type.title){
					uni.showToast({
						title: "请选利率计算方式",
						icon: "none"
					})
					return 0;
				}else if(this.rate == ''){
					uni.showToast({
						title: "请输入利率",
						icon: "none"
					})
					return 0;
				}
				let duration_sec = (new Date(this.date_end)).valueOf() - (new Date(this.date_start)).valueOf();
				let duration_day = parseInt(duration_sec / 1000 / 60 / 60 / 24) + 1;
				let rate_day = this.rate / 100;
				if(this.selected_type.title == '月利率'){
					rate_day = rate_day / 30;
				}else if(this.selected_type.title == '年利率'){
					rate_day = rate_day / 360;
				}
				this.result = [[
					'逾期天数', duration_day+' 天'
				],[
					'违约金额', (this.money*duration_day*rate_day).toFixed(2)+' 元'
				]]
			},
			choseType(item){
				if(!item.chosed){
					if(this.selected_type.title){
						this.selected_type.chosed = false;
					}
					item.chosed = true;
					this.selected_type = item;
				}
				this.is_show.type = false;
			},
			resetCalculate(){
				this.result = [];
				this.money = '';
				this.date_start = '选择日期';
				this.date_end = '选择日期';
				this.selected_type = {};
				this.rate = '';
			},
			bindDateChange(e){
				this.date_start = e.target.value
			},
			bindDateChange2(e){
				this.date_end = e.target.value
			},
		}
	}
</script>

<style>
	body{
		background: #FFFFFF;
	}
	.result_box{
		margin: 40upx;
		padding: 20upx;
		background: #ddebec;
		border-radius: 8upx;
	}
	.result_box .borderY{
		margin: 20upx 0;
	}
	.tip{
		color: #9E9E9E;
		font-size: 24upx;
	}
</style>
