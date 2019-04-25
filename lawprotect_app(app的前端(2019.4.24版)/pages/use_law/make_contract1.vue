<template>
<div>
	<view class="anjianweituo_box">
		<view class="icon_row" @click="is_show_select=true">
			<image class="absolute_center icon_row_icon" src="../../static/ask_law/fenlei.png"></image>
			<text>合同类型</text>
			<text class="tab_row_right">{{selected_type.title}}</text>
			<image class="absolute_center right_arrow icon_row_arrow" src="../../static/arrow_right.png"></image>
		</view>
		<view class="borderY"></view>
		<view style="min-height: 200upx;" @click="focusTextarea()">
			<textarea class="anjianweituo_textarea" v-model="content" placeholder="请详细描述合同具体内容" :auto-height="true" :focus="focus" @blur="focus=false" />
		</view>
	</view>
	<view class="split_line"></view>
	<view style="background: #FFFFFF;padding: 10px;">
		<view>定制完成的合同会将送到此email：</view>
		<view class="borderY" style="width: 80px;margin: 10px 0;"></view>
		<input type="text" v-model="email" placeholder="点击输入 email 地址" />
	</view>
	<view class="split_line"></view>
	<view class="icon_row">
		<image class="absolute_center icon_row_icon" src="../../static/ask_law/fuwufei.png"></image>
		<text>定制价格</text>
		<text class="fuwufei">￥{{price}}</text>
	</view>
	
	<view class="pay_bar">
		<view class="pay_bar_text">
			<view v-if="contract_make_times!=0">剩余免费定制 {{contract_make_times}} 次</view>
			<view v-else>支付金额：￥{{price * contract_make_discount / 10}}</view>
			<view v-if="vip_id == 0" class="pay_bar_text_alert">加入会员免费定制</view>
			<view v-if="contract_make_discount<10" class="pay_bar_text_alert">当前会员尊享 {{contract_make_discount}} 折</view>
		</view>
		<view v-if="vip_id == 0" class="pay_bar_btn vip" @click="goView('/pages/index/vip')">开通会员</view>
		<view class="pay_bar_btn pay" @click="submitSave()">立即发布</view>
	</view>
	
	<view v-show="is_show_select" class="select_bg" @click="is_show_select=false"></view>
	<view v-show="is_show_select" class="select_box absolute_center">
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
	</view>
</div>
</template>

<script>
export default{
	data(){
		return {
			type_list:[],
			is_show_select: false,
			selected_type: '',
			focus: false,
			price: 0,
			content: '',
			contract_make_times: 0,
			contract_make_discount: 10,
			vip_id: 0,
			email: ''
		}
	},
	onLoad() {
		if(global.user_info.email != null){
			this.email = global.user_info.email;
		}
		if(global.vip_info){
			this.contract_make_times = global.vip_info.contract_make_times;
			this.contract_make_discount = global.vip_info.contract_make_discount;
			this.vip_id = global.user_info.vip_id;
		}
		this.getBaseInfo();
	},
	onShow() {
		if(global.contract_make_success){
			global.contract_make_success = false;
			this.showSuccess();
		}
	},
	methods: {
		choseType(item){
			if(!item.chosed){
				if(this.selected_type.title){
					this.selected_type.chosed = false;
				}
				item.chosed = true;
				this.selected_type = item;
			}
			this.is_show_select = false;
		},
		getBaseInfo(){
			this.requestApi({
				url: 'getTypeAndIndustry',
				success: res=>{
					console.log(res)
					this.type_list = res.type_list.map(el=>{el.chosed=false;return el;})
				}
			});
			this.requestApi({
				url: 'make_contract/getPrice',
				success: res=>{
					this.price = res.price/100;
				}
			})
		},
		focusTextarea(){
			this.focus = !this.focus;
		},
		submitSave(){
			console.log(global.user_info)
			if(this.selected_type ==''){
				uni.showToast({
					title: '请填选择合同类型',
					icon: 'none'
				})
				return 0;
			}
			if(this.content ==''){
				uni.showToast({
					title: '请填写具体内容',
					icon: 'none'
				})
				return 0;
			}
			if(this.email != ''){
				let reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
				if (!reg.test(this.email)) {
					uni.showToast({
						title: '请填写正确的email格式',
						icon: 'none'
					})
					return 0;
				}
			}
			if(this.contract_make_times > 0){
				uni.showModal({
					title: '操作提示',
					content: '确定消耗一次免费次数?',
					success: res => {
						if(res.confirm){
							this.requestData();
						}
					},
				});
			}else{
				this.requestData();
			}
		},
		requestData(){
			let request_data = {
				content: this.content,
				type_id: this.selected_type.id,
				email: this.email,
			}
			if(global.user_info.email == null && this.email != ''){
				request_data.set_email = 1;
			}
			this.requestApi({
				url: 'make_contract/save',
				data: request_data,
				success: res=>{
					if(global.user_info.email == null && this.email != ''){
						global.user_info.email = this.email;
					}
					if(res.has_free_time == 1){
						this.showSuccess();
					}else{
						this.showPayment(res.contract_custom_id);
					}
				}
			})
		},
		showPayment(id){
			let passback_params = JSON.stringify({ make_contract: 1, id });
			global.passback_params = passback_params;
			global.goods_id = 11;  //商品表id
			global.price_to_pay = this.price * this.contract_make_discount / 10;
			global.payment_title = '合同定制';
			
			this.goView('/pages/payment/chose_type?goods_type=contract_make');
		},
		showSuccess(){
			this.content = '';
			this.selected_type = '';
			this.contract_make_times --;
			global.vip_info.contract_make_times --;
			uni.showToast({
				title: '提交成功',
				icon: 'success'
			})
		},
	}
}
</script>

<style>
	.anjianweituo_box{
		padding: 0 20upx;
		background: #FFFFFF;
		font-size: 26upx;
	}
	.anjianweituo_textarea{
		width: 100%;
		padding: 20upx 0;
	}
	.fuwufei{
		float: right;
		color: #db2222;
		padding-right: 20upx;
	}
	
	.tab_row_right{
		float: right;
		margin-right: 80upx;
	}
</style>
