<template>
<div>
	<image class="indentify_bg" src="../../static/login/identify_bg.jpg"></image>
	<view class="indentify_form_box">
		<image v-if="!avatar" class="avatar_btn absolute_center" @click="choseAvatar()" src="../../static/login/avatar_btn.png"></image>
		<image v-else class="avatar_btn absolute_center" @click="choseAvatar()" :src="avatar" mode="aspectFill"></image>
		<view class="indentify_row">
			<view class="indentify_row_title">姓名：</view>
			<input-box classes="indentify_row_input" v-model="name" placeholder="请输入姓名" @clear="name=''"></input-box>
		</view>
		<view class="borderY"></view>
		
		<view class="indentify_row" @click="showSelectArea()">
			<view class="indentify_row_title">所在地区：</view>
			<view class="indentify_row_right_box">
				{{chosed_area.province_name}} {{chosed_area.city_name}}
			</view>
			<image src="../../static/arrow_right.png" class="indentify_row_select_icon absolute_center"></image>
		</view>
		<view class="borderY"></view>
		
		<view class="indentify_row">
			<view class="indentify_row_title">擅长领域：</view>
			<input-box classes="indentify_row_input" v-model="good_at" placeholder="请输入擅长领域" @clear="good_at=''"></input-box>
		</view>
		<view class="borderY"></view>
		
		<view class="indentify_row">
			<view class="indentify_row_title">从业年数：</view>
			<input-box classes="indentify_row_input" type="number" v-model="years" placeholder="请输入从业年数" @clear="years=''"></input-box>
		</view>
		<view class="borderY"></view>
		
		<view class="indentify_row">
			<view class="indentify_row_title">律师执照：</view>
		</view>
		<scroll-view scroll-x>
			<view class="zixun_picture_box">
				<image class="zixun_picture" v-for="item in license_pic_list" :key="item" :src="item"></image>
				<image v-show="license_pic_list.length==0" class="zixun_picture" src="../../static/ask_law/upload_btn.png" @click="choseLicense()"></image>
			</view>
			<view v-show="license_pic_list.length>0" style="padding: 0 10upx;"> <button type="default" size="mini" @click="choseLicense()">重新上传</button> </view>
		</scroll-view>
	</view>
	
	<view v-show="is_show_select" class="select_bg" @click="is_show_select=false"></view>
	<view v-show="is_show_select" class="select_box absolute_center">
		<view class="select_title">根据市名检索地区</view>
		<view>
			<input class="select_input" placeholder="输入所在市的关键字" @input="getAreaList"/>
		</view>
		<view class="borderY"></view>
		<view class="select_position_info">
			系统定位：<text :class="self_city_name=='定位中...'?'':'select_position_btn'" @click="selectPosition()">{{self_city_name}}</text>
		</view>
		<view class="borderY"></view>
		<scroll-view class="select_content_box" scroll-y>
			<view v-show="area_list.length==0" class="end_tip">暂无搜索结果</view>
			<view v-for="item in area_list" :key="item.id">
				<view class="select_row" @click="choseArea(item)">
					<text>{{item.province_name}} {{item.city_name}}</text>
					<image v-if="item.chosed" src="../../static/gou.png" class="select_icon absolute_center"></image>
				</view>
				<view class="borderY"></view>
			</view>
		</scroll-view>
	</view>
	
	<view class="agreement_row" @click="goAgreement()">
		<view v-if="checked==0" class="uncheck"></view>
		<image v-if="checked==1" src="../../static/login/checked.png" class="docheck"></image>
		<view class="agreement_text">《法保网入驻律师管理办法》</view>
	</view>
	
	<view class="main_btn confirm_btn" @click="checkInfo()" style="margin: 10px auto 20px auto;">提交</view>
</div>
</template>

<script>
	import './identify.css';
	export default{
		data(){
			return {
				name: '',
				good_at: '',
				years: '',
				uploaded_license: '',
				license_pic_list: [],
				avatar: false,
				is_show_select: false,
				area_list: [],
				chosed_area: {},
				self_city_name: '定位中...',
				checked: false
			}
		},
		methods:{
			goAgreement(){
				this.checked = !this.checked;
				if(this.checked)
					this.goView('/pages/mine/lawyer_manage_web');
			},
			choseLicense(){
				uni.chooseImage({
					success: res=>{
						this.license_pic_list = res.tempFilePaths
					}
				})
			},
			choseAvatar(){
				uni.chooseImage({
					count: 1,
					success: res=>{
						if(res.tempFiles[0].size > 200000){
							uni.showToast({
								title: "请选择小于200KB的图片",
								icon: "none"
							})
							return 0;
						}
						this.avatar = res.tempFilePaths[0];
					}
				})
			},
			getAreaList(event){
				if(event.target.value == ''){
					return 0;
				}
				this.requestApi({
					url: 'areas/getList',
					data: {name: event.target.value},
					success: res=>{
						this.area_list = res;
					}
				})
			},
			choseArea(item){
				this.chosed_area = item;
				this.is_show_select = false;
			},
			selectPosition(){
				this.requestApi({
					url: 'areas/getList',
					data: {name: this.self_city_name},
					success: res=>{
						this.area_list = res;
					}
				})
			},
			showSelectArea(){
				this.is_show_select = true;
				//self_city_name缓存系统定位
				if(global.self_city_name == undefined){
					setTimeout(()=>{
						if(this.self_city_name == '定位中...'){
							this.self_city_name = '定位失败，可能未授予相关权限';
						}
					},3000)
					uni.getLocation({
						success: (res) => {
							let location = res.latitude+','+res.longitude;
							this.requestApi({
								url: 'getCityByLocation',
								data: {location},
								success: res=>{
									if(res.fail){
									}else{
										this.self_city_name = res.city_name;
										global.self_city_name = res.city_name;
									}
								}
							})
						}
					})
				}else{
					this.self_city_name = global.self_city_name;
				}
			},
			checkInfo(){
				if(!this.checked){
					uni.showToast({
						icon: 'none',
						title: '请同意入驻律师管理办法'
					});
					return 0;
				}
				if(this.name == ''){
					uni.showToast({
						title: "请输入姓名",
						icon: "none"
					})
					return 0;
				}
				if(this.good_at == ''){
					uni.showToast({
						title: "请输入擅长领域",
						icon: "none"
					})
					return 0;
				}
				if(this.good_at == ''){
					uni.showToast({
						title: "请输入从业年数",
						icon: "none"
					})
					return 0;
				}
				if(!this.chosed_area.id){
					uni.showToast({
						title: "请输选择地区",
						icon: "none"
					})
					return 0;
				}
				if(this.license_pic_list.length == 0){
					uni.showToast({
						title: "请上传律师执照",
						icon: "none"
					})
					return 0;
				}
				uni.uploadFile({
					url: this.ServerUrl+'users/lawyer_license',
					filePath: this.license_pic_list[0],
					name: 'file',
					success: (res) => {
						this.uploaded_license = res.data;
						if(this.avatar){
							uni.uploadFile({
								url: this.ServerUrl+'users/avatar',
								filePath: this.avatar,
								name: 'file',
								success: (res) => {
									this.submitInfo(res.data);
								}
							})
						}else{
							this.submitInfo();
						}
					}
				})
			},
			submitInfo(){
				let request_data = {
					name: this.name,
					good_at: this.good_at,
					years: this.years,
					license: this.uploaded_license,
					province_id: this.chosed_area.province_id,
					city_id: this.chosed_area.id,
					user_class: 'lawyer'
				};
				if(arguments[0]){
					request_data.avatar = arguments[0];
				}
				this.requestApi({
					url: 'users/saveInfo',
					data: request_data,
					success: res=>{
						uni.showToast({
							mask: true,
							title: "认证成功",
							icon: "success",
							duration: 1500,
							success: ()=>{
								global.user_info = {
									name: this.name,
									user_class: 3,
									avatar: request_data.avatar
								};
								setTimeout(()=>{
									uni.switchTab({
										url: '/pages/mine/mine'
									})
								},1500)
							}
						})
					}
				})
			},
		}
	}
</script>

<style>
	body{
		background: #FFFFFF;
	}
</style>
