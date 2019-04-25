<template>
<view>
	<view class="split_line"></view>
	<view class="info_row top_row">
		<text class="font_bold">订单金额</text>
		<text class="price"><text class="price_icon">￥</text>{{price}}</text>
	</view>
	<view class="info_row top_row">
		<text class="font_bold"></text>
		<text class="payment_title">{{payment_title}}</text>
	</view>
	<view class="split_line"></view>
	<view class="pay_type_box">
		<view class="info_row">选择支付方式</view>
		<block v-if="coupon_amount>0&&goods_type=='contract'">
			<view class="borderY"></view>
			<view class="info_row" @click="choseType(3)">
				<image class="type_icon absolute_center" src="../../static/payment/coupon.png"></image>
				<text class="type_name">下载券（剩余 {{coupon_amount}} 张）</text>
				<view class="info_row_right">
					<view v-show="chosed_type!=3" class="type_uncheck_icon absolute_center"></view>
					<image v-show="chosed_type==3" class="type_check_icon absolute_center" src="../../static/payment/check.png"></image>
				</view>
			</view>
		</block>
		<view class="borderY"></view>
		<view class="info_row" @click="choseType(1)">
			<image class="type_icon absolute_center" src="../../static/payment/weixin.png"></image>
			<text class="type_name">微信支付</text>
			<view class="info_row_right">
				<view v-show="chosed_type!=1" class="type_uncheck_icon absolute_center"></view>
				<image v-show="chosed_type==1" class="type_check_icon absolute_center" src="../../static/payment/check.png"></image>
			</view>
		</view>
		<view class="borderY"></view>
		<view class="info_row" @click="choseType(2)">
			<image class="type_icon absolute_center" src="../../static/payment/alipay.png"></image>
			<text class="type_name">支付宝支付</text>
			<view class="info_row_right">
				<view v-show="chosed_type!=2" class="type_uncheck_icon absolute_center"></view>
				<image v-show="chosed_type==2" class="type_check_icon absolute_center" src="../../static/payment/check.png"></image>
			</view>
		</view>
	</view>
	<view class="main_btn pay_type_btn" @click="chosePayment()">确认支付</view>
</view>
</template>

<script>
	export default {
		data() {
			return {
				chosed_type: 1,
				price: 0,
				payment_title: '',
				goods_type: '',
				coupon_amount: 1,
			};
		},
		onLoad(options) {
			this.price = global.price_to_pay;
			this.payment_title = global.payment_title;
			this.goods_type = options.goods_type;
			if(this.goods_type == 'contract'){
				this.coupon_amount = global.user_info.coupon_amount;
				this.chosed_type = this.coupon_amount ? 3 : 1;
			}
		},
		methods:{
			choseType(index){
				this.chosed_type = index;
			},
			chosePayment(){
				switch(this.chosed_type){
					case 1:
						global.pay_type_name = '微信支付';
						this.showPayment('wxpay');
						break;
					case 2:
						global.pay_type_name = '支付宝';
						this.showPayment('alipay');
						break;
					case 3:
						global.pay_type_name = '下载券';
						this.showPayment('coupon');
						break;
				}
			},
			showPayment(pay_type){
				let request_data = {
					pay_type: pay_type,
					passback_params: global.passback_params
				}
				switch(this.goods_type){
					case 'ask_law':case 'contract_make':
						request_data.goods_id = global.goods_id;
						break;
					case 'vip':
						request_data.vip_id = global.vip_id_to_buy;
						break;
					case 'contract':
						request_data.contract_id = global.contract_id_to_buy;
						break;
				}
				this.requestApi({
					url: 'createOrder',
					manually_hide_loading: true,
					data: request_data,
					success: orderStr=>{
						if(this.chosed_type == 3){
							uni.hideToast();
							uni.showToast({
								title: '购买成功',
								icon: 'success',
								mask: true
							});
							global.user_info.coupon_amount--;
							global.contract_download_success = true;
							global.contract_download_success = true;
							setTimeout(()=>{this.goView(-1)},2000);
							return 0;
						}
						uni.requestPayment({
							provider: pay_type,
							orderInfo: orderStr,
							success: (res)=>{
								switch(this.goods_type){
									case 'ask_law':
										global.clear_ask_law_index = global.wait_clear_ask_law_index;
										break;
									case 'vip':
										global.buy_vip_success = true;
										break;
									case 'contract':
										global.contract_download_success = true;
										break;
									case 'contract_make':
										global.contract_make_success = true;
										break;
								}
								uni.redirectTo({
									url: '/pages/payment/success'
								})
							},
							complete: () => {
								uni.hideToast();
							}
						});
					}
				})
			}
		}
	}
</script>

<style>
.info_row{
	position: relative;
	display: flex;
	justify-content: space-between;
	height: 90upx;
	line-height: 90upx;
	background: #FFFFFF;
	font-size: 32upx;
	color: #666666;
}
.top_row{
	padding: 0 40upx;
}
.price{
	color: #ff5767;
	font-size: 40upx;
}
.price_icon{
	font-size: 26upx;
}
.pay_type_box{
	background: #FFFFFF;
	padding-left: 40upx;
}

.payment_title{
	color: #AEAEAE;
}

.type_icon{
	right: auto;
	height: 50upx;
	width: 50upx;
	border-radius: 50%;
}
.type_name{
	margin-left: 70upx;
}
.info_row_right{
	position: relative;
	width: 120upx;
}
.type_uncheck_icon,.type_check_icon{
	width: 40upx;
	height: 40upx;
	border-radius: 50%;
}
.type_uncheck_icon{
	box-sizing: border-box;
	border: 1px solid #9b9b9b;
}
.pay_type_btn{
	margin: 120upx auto 0 auto;
}
</style>
