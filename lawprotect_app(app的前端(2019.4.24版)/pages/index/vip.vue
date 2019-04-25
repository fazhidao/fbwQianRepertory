<template>
<view style="background: #FFFFFF;">
	<image class="vip_bg" src="../../static/vip/top_bg1.png" mode=""></image>
	
	<view class="vip_title">企业服务套餐</view>
	
	<view class="vip_list_box" v-if="vip_list">
		<view class="vip_item1">
			<image class="vip_icon" src="../../static/vip/start.png" mode=""></image>
			<view class="vip_item1_title">{{vip_list[0].title}}</view>
			<view class="vip_price">￥{{vip_list[0].new_price}}/年</view>
			<view class="vip_btn" @click="goView('vip2')">
				<image class="vip_btn_bg absolute_center" src="../../static/vip/btn_bg.png" mode=""></image>
				<text>查看详情</text>
			</view>
		</view>
		<view class="vip_item1">
			<image class="vip_icon" src="../../static/vip/demon.png" mode=""></image>
			<view class="vip_item1_title">{{vip_list[1].title}}</view>
			<view class="vip_price">￥{{vip_list[1].new_price}}/年</view>
			<view class="vip_btn" @click="goView('vip2')">
				<image class="vip_btn_bg absolute_center" src="../../static/vip/btn_bg.png" mode=""></image>
				<text>查看详情</text>
			</view>
		</view>
		<view class="vip_item1">
			<image class="vip_icon" src="../../static/vip/crown.png" mode=""></image>
			<view class="vip_item1_title">{{vip_list[2].title}}</view>
			<view class="vip_price">￥{{vip_list[2].new_price}}/年</view>
			<view class="vip_btn" @click="goView('vip2')">
				<image class="vip_btn_bg absolute_center" src="../../static/vip/btn_bg.png" mode=""></image>
				<text>查看详情</text>
			</view>
		</view>
	</view>
	
	<view class="vip_title">法务咨询VIP</view>
	
	<view class="vip_list_box" v-if="vip_list">
		<view class="vip_item2">
			<text class="vip_price">￥{{vip_list[4].new_price}}/{{vip_list[4].ask_help_times}}次</text>
			<view class="vip_btn" @click="goPayment(4)">
				<image class="vip_btn_bg absolute_center" src="../../static/vip/btn_bg.png" mode=""></image>
				<text>立即购买</text>
			</view>
		</view>
		<view class="vip_item2">
			<text class="vip_price">￥{{vip_list[5].new_price}}/{{vip_list[5].ask_help_times}}次</text>
			<view class="vip_btn" @click="goPayment(5)">
				<image class="vip_btn_bg absolute_center" src="../../static/vip/btn_bg.png" mode=""></image>
				<text>立即购买</text>
			</view>
		</view>
	</view>
	
	<view class="vip_title">合同下载VIP</view>
	
	<view class="vip_list_box" v-if="vip_list">
		<view class="vip_item2">
			<text class="vip_price">￥{{vip_list[6].new_price}}/{{vip_list[6].contract_download_times}}次</text>
			<view class="vip_btn" @click="goPayment(6)">
				<image class="vip_btn_bg absolute_center" src="../../static/vip/btn_bg.png" mode=""></image>
				<text>立即购买</text>
			</view>
		</view>
		<view class="vip_item2">
			<text class="vip_price">￥{{vip_list[7].new_price}}/{{vip_list[7].contract_download_times}}次</text>
			<view class="vip_btn" @click="goPayment(7)">
				<image class="vip_btn_bg absolute_center" src="../../static/vip/btn_bg.png" mode=""></image>
				<text>立即购买</text>
			</view>
		</view>
	</view>
	
	<view class="vip_title">合同定制VIP</view>
	
	<view class="vip_list_box" v-if="vip_list">
		<view class="vip_item2">
			<text class="vip_price">￥{{vip_list[8].new_price}}/{{vip_list[8].contract_make_times}}次</text>
			<view class="vip_btn" @click="goPayment(8)">
				<image class="vip_btn_bg absolute_center" src="../../static/vip/btn_bg.png" mode=""></image>
				<text>立即购买</text>
			</view>
		</view>
		<view class="vip_item2">
			<text class="vip_price">￥{{vip_list[9].new_price}}/{{vip_list[9].contract_make_times}}次</text>
			<view class="vip_btn" @click="goPayment(9)">
				<image class="vip_btn_bg absolute_center" src="../../static/vip/btn_bg.png" mode=""></image>
				<text>立即购买</text>
			</view>
		</view>
	</view>
	<view style="height: 1px;"></view>
</view>
</template>

<script>
import './vip.css'
export default{
	data(){
		return {
			chosed_item: {},
			vip_list: false,
			has_read: false,
		}
	},
	onLoad() {
		this.getVipList();
	},
	methods: {
		getVipList(){
			this.requestApi({
				url: 'vip/getList',
				success: res=>{
					this.vip_list = res.map(el=>{
						el.initial_price = el.initial_price/100;
						el.new_price = el.new_price/100;
						return el;
					});
					global.vip_list = this.vip_list;
					this.chosed_item = this.vip_list[0];
				}
			})
		},
		goPayment(index){
			if(!global.user_info){
				this.goView('/pages/login/login');
				return 0;
			}
			global.passback_params = '{"buy_vip":"1"}';
			global.price_to_pay = this.vip_list[index].new_price;
			global.vip_id_to_buy = this.vip_list[index].id;
			global.payment_title = '开通'+this.vip_list[index].title;
			this.goView('/pages/payment/chose_type?goods_type=vip');
		},
		chose(item){
			this.chosed_item = item;
		}
	}
}
</script>

<style>
body{
	background: #FFFFFF;
}
</style>
