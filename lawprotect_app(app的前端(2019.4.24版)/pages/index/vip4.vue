<template>
<view style="background: #FFFFFF;">
	<image class="vip_bg" src="../../static/vip/top_bg2.png" mode=""></image>
	
	<view class="vip2_box" v-if="vip_list">
		<view class="ip2_left_box">
			<image class="vip_icon" src="../../static/vip/start.png" mode=""></image>
			<view class="vip_item1_title">{{vip_list[0].title}}</view>
			<view class="vip_price">￥{{vip_list[0].new_price}}/年</view>
			<view class="vip_btn" @click="goPayment(0)">
				<image class="vip_btn_bg absolute_center" src="../../static/vip/btn_bg.png" mode=""></image>
				<text>立即购买</text>
			</view>
		</view>
		<view class="vip2_right_box">
			<view>文库合同下载免费 {{vip_list[0].contract_download_times}} 份，后享 {{vip_list[0].contract_download_discount}} 折</view>
			<view>法务在线咨询免费 {{vip_list[0].ask_help_times}} 问，后享 {{vip_list[0].ask_help_discount}} 折</view>
			<view>企业合同审核免费 {{vip_list[0].contract_audit_times}} 份，后享 {{vip_list[0].contract_audit_discount}} 折</view>
			<view>企业合同定制免费 {{vip_list[0].contract_make_times}} 份，后享 {{vip_list[0].contract_make_discount}} 折</view>
			<view>企业法律讲座免费邀请一场 2 人</view>
			<view>企业综合风险评估免费 1 次</view>
			<view>案件委托享 {{vip_list[0].ask_entrust_discount}} 折</view>
			<view>诉讼垫资享 {{vip_list[0].ask_advance_discount}} 折</view>
		</view>
	</view>
	
	<view class="vip2_box" v-if="vip_list">
		<view class="ip2_left_box">
			<image class="vip_icon" src="../../static/vip/demon.png" mode=""></image>
			<view class="vip_item1_title">{{vip_list[1].title}}</view>
			<view class="vip_price">￥{{vip_list[1].new_price}}/年</view>
			<view class="vip_btn" @click="goPayment(1)">
				<image class="vip_btn_bg absolute_center" src="../../static/vip/btn_bg.png" mode=""></image>
				<text>立即购买</text>
			</view>
		</view>
		<view class="vip2_right_box">
			<view>文库合同下载免费 {{vip_list[1].contract_download_times}} 份，后享 {{vip_list[1].contract_download_discount}} 折</view>
			<view>法务在线咨询免费 {{vip_list[1].ask_help_times}} 问，后享 {{vip_list[1].ask_help_discount}} 折</view>
			<view>企业合同审核免费 {{vip_list[1].contract_audit_times}} 份，后享 {{vip_list[1].contract_audit_discount}} 折</view>
			<view>企业合同定制免费 {{vip_list[1].contract_make_times}} 份，后享 {{vip_list[1].contract_make_discount}} 折</view>
			<view>企业法律讲座免费邀请一场 2 人</view>
			<view>企业综合风险评估免费 1 次</view>
			<view>案件委托享 {{vip_list[1].ask_entrust_discount}} 折</view>
			<view>诉讼垫资享 {{vip_list[1].ask_advance_discount}} 折</view>
		</view>
	</view>
	
	<view class="vip2_box" v-if="vip_list">
		<view class="ip2_left_box">
			<image class="vip_icon" src="../../static/vip/crown.png" mode=""></image>
			<view class="vip_item1_title">{{vip_list[2].title}}</view>
			<view class="vip_price">￥{{vip_list[2].new_price}}/年</view>
			<view class="vip_btn" @click="goPayment(2)">
				<image class="vip_btn_bg absolute_center" src="../../static/vip/btn_bg.png" mode=""></image>
				<text>立即购买</text>
			</view>
		</view>
		<view class="vip2_right_box">
			<view>文库合同下载全部免费</view>
			<view>法务在线咨询全部免费</view>
			<view>企业合同审核免费 {{vip_list[2].contract_audit_times}} 份，后享 {{vip_list[2].contract_audit_discount}} 折</view>
			<view>企业合同定制免费 {{vip_list[2].contract_make_times}} 份，后享 {{vip_list[2].contract_make_discount}} 折</view>
			<view>企业法律讲座免费邀请一场 2 人</view>
			<view>企业综合风险评估免费 1 次</view>
			<view>案件委托全部免费</view>
			<view>诉讼垫资全部免费</view>
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
			vip_list: false,
		}
	},
	onLoad() {
		this.vip_list = global.vip_list;
	},
	methods: {
		goPayment(index){
			if(!global.user_info){
				this.goView('/pages/login/login');
				return 0;
			}
			global.passback_params = '{"buy_vip":"1"}';
			global.payment_title = '开通'+this.vip_list[index].title;
			global.price_to_pay = this.vip_list[index].new_price;
			global.vip_id_to_buy = this.vip_list[index].id;
			this.goView('/pages/payment/chose_type?goods_type=vip');
		},
	}
}
</script>

<style>
body{
	background: #FFFFFF;
}
</style>
