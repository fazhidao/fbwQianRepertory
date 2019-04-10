<template>
	<div>
		<view class="contract_pic_box" @click="is_show_pic=true">
			<image v-if="contract.picture" :src="contract.picture" mode="aspectFill"></image>
		</view>
		
		<view class="contract_content_box">
			<view class="contract_content_title">
				<text>合同简介</text>
				<view class="contract_content_downloads">
					<image src="../../static/contracts/downloads2.png" class="absolute_center"></image>
					<text>已下载 {{contract.downloads}}</text>
				</view>
			</view>
			<view class="contract_content_abstract">
				<text class="font_bold">合同类别</text> : {{contract.type_name}}
			</view>
			<view class="contract_content_abstract">
				<text class="font_bold">合同行业</text> : {{contract.industry_name}}
			</view>
			<view class="contract_content_abstract">
				<text class="font_bold">合同关键字</text> : {{contract.keywords}}
			</view>
			<view class="contract_content_abstract">
				<text class="font_bold">上传时间</text> : {{contract.create_time}}
			</view>
			<view class="contract_content_abstract">
				<text class="font_bold">下载价格</text> : {{contract.price || ''}}元
			</view>
			<view class="contract_content_title">
				<text>服务流程</text>
			</view>
			<view class="contract_content_flow">
				<view class="contract_content_flow_icon_box">
					<view class="contract_content_flow_icon absolute_center">1</view>
					<view class="contract_content_flow_text">购买支付</view>
				</view>
				<view class="contract_content_flow_line"></view>
				<view class="contract_content_flow_icon_box">
					<view class="contract_content_flow_icon absolute_center">2</view>
					<view class="contract_content_flow_text">打开文档</view>
				</view>
				<view class="contract_content_flow_line"></view>
				<view class="contract_content_flow_icon_box">
					<view class="contract_content_flow_icon absolute_center">3</view>
					<view class="contract_content_flow_text">分享到其他设备</view>
				</view>
			</view>
		</view>
		
		<view class="split_line"></view>
		<view class="contract_content_box">
			<view class="contract_content_title">
				<text>相关合同</text>
			</view>
			<view class="other_contract_box">
				<view class="other_contract_item">夫妻财产合同</view>
			</view>
		</view>
		<view class="split_line"></view>
		<view style="height: 90upx;"></view>
		
		<view v-if="is_show_pic" class="large_picture_box" @click="is_show_pic=false">
			<image :src="contract.picture" mode="widthFix"></image>
		</view>
		
		<view v-if="!contract.is_owned && vip_id!=3" class="pay_bar">
			<view class="pay_bar_text">
				<view v-if="contract_download_times!=0">剩余免费合同下载 {{contract_download_times}} 次</view>
				<view v-else>支付金额：￥{{contract.price ? (contract.price*contract_download_discount/10) : ''}}</view>
				<view v-if="vip_id == 0" class="pay_bar_text_alert">加入会员免费下载</view>
				<view v-if="contract_download_discount<10" class="pay_bar_text_alert">当前会员尊享 {{contract_download_discount}} 折</view>
			</view>
			<view v-if="contract_download_times==0" class="pay_bar_btn vip" @click="goView('/pages/index/vip')">开通会员</view>
			<view class="pay_bar_btn pay" @click="buyContract()">立即购买</view>
		</view>
		<view v-else class="download_bar" @click="downloadConstract()">打开合同</view>
	</div>
</template>

<script>
	export default {
		data(){
			return {
				contract: {
					is_owned: false
				},
				is_show_pic: false,
				contract_download_times: 0,
				contract_download_discount: 10,
				vip_id: 0,
			}
		},
		onLoad(option) {
			if(global.vip_info){
				this.contract_download_times = global.vip_info.contract_download_times;
				this.contract_download_discount = global.vip_info.contract_download_discount;
				this.vip_id = global.user_info.vip_id;
			}
			
			this.getDetail(option.id);
		},
		onShow() {
			if(global.contract_download_success){
				global.contract_download_success = false;
				this.contract.is_owned = true;
			}
		},
		methods: {
			getDetail(id){
				this.requestApi({
					url: 'contracts/getDetail',
					data: {id},
					success: res=>{
						res.create_time = res.create_time.split(' ')[0];
						res.picture = this.ImgUrl + res.picture;
						res.price = res.price/100;
						this.contract = res;
					}
				})
			},
			buyContract(){
				if(!global.user_info){
					this.goView('/pages/login/login');
					return 0;
				}
				if(this.contract_download_times==0){
					this.goPayment();
				}else{
					uni.showModal({
						title: '操作提示',
						content: '确定消耗一次免费次数?',
						success: res => {
							if(res.confirm){
								this.requestApi({
									url: 'contracts/VipPayment',
									data: {
										contract_id: this.contract.id
									},
									success: ()=>{
										uni.showToast({
											title: '购买成功',
											icon: 'success'
										});
										this.contract.is_owned = true;
									}
								})
							}
						},
					})
				}
			},
			goPayment(){
				global.passback_params = '{"buy_contract":"1"}';
				global.payment_title = '合同下载';
				global.price_to_pay = this.contract.price * this.contract_download_discount / 10;
				global.contract_id_to_buy = this.contract.id;
				this.goView('/pages/payment/chose_type?goods_type=contract');
			},
			downloadConstract(){
				this.requestApi({
					url: 'contracts/checkOwner',
					manually_hide_loading: true,
					data: { contract_id: this.contract.id },
					success: res=>{
						if(res){
							this.requestApi({
								url: 'contracts/addDownloads',
								data: { contract_id: this.contract.id }
							})
							uni.downloadFile({
								url: this.ImgUrl + res.file_path,
								success: res=>{
									if (res.statusCode === 200) {
										uni.openDocument({
											filePath: res.tempFilePath,
											success: function (res) {
												console.log('打开文档成功');
											},
											complete: ()=>{
												uni.hideToast();
											}
										});
									}
								}
							})
						}else{
							uni.showToast({
								title: '没有下载权限',
								icon: 'none'
							})
						}
					}
				});
			}
		}
	}
</script>

<style>
	.contract_pic_box{
		padding: 20upx 0;
	}
	.contract_pic_box image{
		display: block;
		width: 300upx;
		height: 320upx;
		margin: 0 auto;
		border-radius: 8upx;
	}
	.contract_content_box{
		background: #FFFFFF;
		padding: 40upx 40upx 80upx 40upx;
	}
	.contract_content_title{
		position: relative;
		line-height: 40upx;
		padding-left: 20upx;
		font-size: 36upx;
	}
	.contract_content_title:after{
		content: '';
		display: block;
		position: absolute;
		margin: auto;
		left: 0;
		top: 2upx;
		height: 36upx;
		width: 8upx;
		background: #ccb17e;
	}
	.contract_content_downloads{
		position: absolute;
		right: 0;
		top: 0;
		color: #ccb17e;
		font-size: 26upx;
		padding-left: 8upx;
		height: 40upx;
	}
	.contract_content_downloads image{
		width: 30upx;
		height: 30upx;
		right: 100%;
		left: auto;
	}
	.contract_content_abstract{
		color: #737373;
		margin: 40upx 0 40upx 30upx;
		line-height: 30upx;
	}
	.contract_content_flow{
		display: flex;
		margin: 20upx 0;
	}
	.contract_content_flow_icon_box{
		position: relative;
		flex: none;
		width: 100upx;
		height: 100upx;
	}
	.contract_content_flow_icon{
		width: 70upx;
		height: 70upx;
		line-height: 70upx;
		text-align: center;
		color: #FFFFFF;
		border-radius: 50%;
		background: #ccb17e;
		font-size: 36upx;
	}
	.contract_content_flow_line{
		flex: 1;
		height: 4upx;
		background: #ccb17e;
		align-self: center;
	}
	.contract_content_flow_text{
		position: absolute;
		top: 100%;
		left: -20upx;
		right: -20upx;
		text-align: center;
	}
	.other_contract_box{
		padding: 40upx 0 0 0;
		display: flex;
	}
	.other_contract_item{
		flex: none;
		margin: 0 40upx 20upx 0;
		text-align: center;
		border: 1px solid #727272;
		text-align: center;
		width: 200upx;
		line-height: 60upx;
		border-radius: 60upx;
	}
	.large_picture_box{
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0,0,0,0.4);
		z-index: 99;
		padding: 40upx;
		box-sizing: border-box;
	}
	.large_picture_box image{
		width: 100%;
		margin-top: 40upx;
		border-radius: 12upx;
	}
	
	.download_bar{
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: 90upx;
		line-height: 90upx;
		background: #ccb17e;
		text-align: center;
		color: #FFFFFF;
		letter-spacing: 10upx;
		font-size: 36upx;
	}
	
	.pay_bar_btn.coupon{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		line-height: 16px;
		background: #efdcba;
	}
	.coupon_text{
		font-size: 12px;
	}
</style>
