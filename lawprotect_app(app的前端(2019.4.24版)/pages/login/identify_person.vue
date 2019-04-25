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
		<view class="indentify_row">
			<view class="indentify_row_title">性别：</view>
			<view class="indentify_row_check_box" @click="choseGender(0)">
				<view v-if="gender==1" class="uncheck"></view>
				<image v-if="gender==0" src="../../static/login/checked.png" class="docheck"></image>
			</view>
			<view class="indentify_row_check_text" @click="choseGender(0)">
				男
			</view>
			<view class="indentify_row_check_box" @click="choseGender(1)">
				<view v-if="gender==0" class="uncheck"></view>
				<image v-if="gender==1" src="../../static/login/checked.png" class="docheck"></image>
			</view>
			<view class="indentify_row_check_text" @click="choseGender(1)">
				女
			</view>
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
	
	<view class="main_btn confirm_btn" @click="checkInfo()">提交</view>
</div>
</template>

<script>
	import './identify.css';
	export default{
		data(){
			return {
				name: '',
				gender: 0,
				avatar: false,
				is_show_select: false,
				area_list: [],
				chosed_area: {},
				self_city_name: '定位中...',
			}
		},
		methods:{
			choseGender(gender){
				this.gender = gender;
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
				if(this.name == ''){
					uni.showToast({
						title: "请输入姓名",
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
				if(this.avatar){
					this.requestApi({
						upload_file: true,
						url: 'users/avatar',
						file_path: this.avatar,
						success: (res) => {
							this.submitInfo(res);
						}
					})
				}else{
					this.submitInfo();
				}
			},
			submitInfo(){
				let request_data = {
					name: this.name,
					gender: this.gender,
					province_id: this.chosed_area.province_id,
					city_id: this.chosed_area.id,
					user_class: 'person'
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
									user_class: 1,
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
