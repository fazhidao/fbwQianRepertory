<template>
<div>
	<view class="form_box">
		<view class="form_row">
			<view class="form_row_title" @click="is_show.type=true">案件类型</view>
			<view class="form_row_right_box" @click="is_show.type=true">
				<text class="form_row_text">{{selected_type.title?selected_type.title:"点击选择"}}</text>
				<image src="../../static/arrow_right.png" class="form_row_select_icon absolute_center"></image>
			</view>
		</view>
		<view class="borderY"></view>
		<view class="form_row">
			<view class="form_row_title">诉讼请求金额或价额</view>
			<input class="form_row_input" type="number" v-model="money" placeholder="请输入" />
		</view>
		<view class="borderY"></view>
	</view>
	<view class="btn_group">
		<button type="default" size="mini" @click="resetCalculate()">重 置</button>
		<button type="primary" size="mini" @click="submitCalculate()">确 定</button>
	</view>
	
	<view v-show="result.length > 0" class="result_box">
		<view v-for="item in result" :key="item[0]">{{item[0]}} ： {{item[1]}} 元</view>
		<view class="borderY"></view>
		<view class="tip">依据最新《诉讼费用交纳办法》文件计算，结果仅供参考</view>
	</view>
	
	<view v-show="is_show.type" class="select_bg" @click="is_show.type=false"></view>
	<view v-show="is_show.type" class="select_box absolute_center">
		<view class="select_title">选择案件类型</view>
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
					{ title: '财产案件', chosed: false },
					{ title: '普通非财产案件', chosed: false },
					{ title: '离婚案件', chosed: false },
					{ title: '人格权案件', chosed: false },
					{ title: '知识产权民事案件', chosed: false },
					{ title: '劳动争议案件', chosed: false },
					{ title: '商标、专利、海市行政案件', chosed: false },
					{ title: '其他行政案件', chosed: false },
					{ title: '管辖权异议不成立案件', chosed: false },
				],
				money: '',
				result: [],
				selected_type: {},
			}
		},
		onLoad() {
			console.log('--',global.appid)
		},
		methods:{
			submitCalculate(){
				if(!this.selected_type.title){
					uni.showToast({
						title: "请选择案件类型",
						icon: "none"
					})
					return 0;
				}else if(this.money == ''){
					uni.showToast({
						title: "请输入金额",
						icon: "none"
					})
					return 0;
				}
				this.requestApi({
					url: 'calculate_susong/财产案件',
					data: {money: this.money},
					success: res=>{
						this.result = res;
					}
				})
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
			}
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
