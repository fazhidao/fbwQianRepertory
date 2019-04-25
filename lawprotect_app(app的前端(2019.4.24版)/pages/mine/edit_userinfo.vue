<template>
<div>
	<view class="split_line"></view>
	<view class="edit_row_box">
		<view class="edit_row" style="height: 150upx;" @click="choseAvatar()">
			<text class="edit_row_left">头像</text>
			<image v-if="!avatar" class="edit_row_avatar" src="../../static/mine/default_avatar.png" mode=""></image>
			<image v-else class="edit_row_avatar" :src="avatar" mode="aspectFill"></image>
			<image class="edit_row_arrow right_arrow" src="../../static/arrow_right.png" mode=""></image>
		</view>
		<view class="borderY"></view>
		<view class="edit_row">
			<text class="edit_row_left">昵称</text>
			<input class="edit_row_input" type="text" v-model="user_info.name">
			<!-- <text class="edit_row_right">{{user_info.name || '未填写'}}</text> -->
		</view>
		<view class="borderY"></view>
		<view class="edit_row" @click="showChoseGender()">
			<text class="edit_row_left">性别</text>
			<text class="edit_row_right">{{user_info.gender?'女':'男'}}</text>
		</view>
	</view>
	<view class="split_line"></view>
	<view class="edit_row_box">
		<view class="edit_row">
			<text class="edit_row_left">邮件</text>
			<input class="edit_row_input" type="text" v-model="user_info.email" placeholder="未填写">
		</view>
		<view class="borderY"></view>
		<view class="edit_row" @click="is_show_select_area = true">
			<text class="edit_row_left">所在地</text>
			<text class="edit_row_right">{{user_info.area_name}}</text>
		</view>
	</view>
	<view class="split_line"></view>
	<view class="edit_row_box">
		<view class="edit_row" @click="changeClass()">
			<text class="edit_row_left">更换用户类别</text>
			<image class="edit_row_arrow right_arrow" src="../../static/arrow_right.png" mode=""></image>
		</view>
	</view>
	
	<view class="main_btn edit_btn" @click="clickEdit()">提交更改</view>
	
	<view v-if="is_show_select_area" class="select_bg" @click="is_show_select_area=false"></view>
	<view v-if="is_show_select_area" class="select_box absolute_center">
		<view class="select_title">根据市名检索地区</view>
		<view style="padding-left: 20upx;">
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
	
</div>
</template>

<script>
export default{
	data(){
		return {
			user_info: {},
			is_show_select_area: false,
			self_city_name: '定位中...',
			area_list: [],
			avatar: false,
			new_avatar: false, //时候修改了头像
			new_area: false,
		}
	},
	onLoad() {
		this.getDetailInfo();
	},
	methods:{
		getDetailInfo(){
			this.requestApi({
				url: 'users/getDetailInfo',
				success: res=>{
					res.area_name = res.province_name + ' ' + (res.province_name==res.city_name?'':res.city_name) + ' ' + (res.district_name||'');
					this.user_info = res;
					this.avatar = res.avatar ? this.ImgUrl + res.avatar : false;
				}
			})
		},
		choseArea(item){
			this.new_area = true;
			this.chosed_area = item;
			this.is_show_select_area = false;
			this.user_info.area_name = item.province_name + ' ' + (item.province_name==item.city_name?'':item.city_name);
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
		showChoseGender(){
			uni.showActionSheet({
				itemList: ['男', '女'],
				success: (res)=> {
					this.user_info.gender = res.tapIndex;
				},
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
					this.new_avatar = true;
				}
			})
		},
		clickEdit(){
			if(!this.user_info.email || this.user_info.email==''){
				uni.showToast({
					title: "请填写email",
					icon: 'none'
				});return 0;
			}
			if(!this.user_info.email.match(/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/)){
				uni.showToast({
					title: "请填写正确的email",
					icon: 'none'
				});return 0;
			}
			if(this.new_avatar){
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
				name: this.user_info.name,
				gender: this.user_info.gender,
				email: this.user_info.email
			};
			if(this.new_area){
				request_data.province_id = this.chosed_area.province_id;
				request_data.city_id = this.chosed_area.id;
			}else{
				request_data.province_id = this.user_info.province_id;
				request_data.city_id = this.user_info.city_id;
			}
			if(arguments[0]){
				request_data.avatar = arguments[0];
			}
			this.requestApi({
				url: 'users/editInfo',
				data: request_data,
				success: res=>{
					uni.showToast({
						mask: true,
						title: "更改成功",
						icon: "success",
						duration: 1500,
						success: ()=>{
							global.user_info.name = this.user_info.name;
							if(this.new_avatar){
								global.user_info.avatar = this.ImgUrl + request_data.avatar;
							}
							setTimeout(()=>{
								uni.navigateBack()
							},1500)
						}
					})
				}
			})
		},
		changeClass(){
			uni.showModal({
				title: '提示',
				content: '更改用户类别将重新审核，确定执行此操作？',
				success: res => {
					if(res.confirm){
						this.goView('/pages/login/chose_class')
					}
				},
			});
		}
	}
}
</script>

<style>
.edit_row_box{
	background: #FFFFFF;
}
.edit_row{
	padding: 0 40upx;
	height: 110upx;
	display: flex;
	align-items: center;
}
.edit_row_left{
	flex: 1;
	font-size: 32upx;
	color: #000;
}
.edit_row_right{
	font-size: 28upx;
	color: grey;
}
.edit_row_avatar{
	flex: none;
	width: 90upx;
	height: 90upx;
	box-shadow: 0 0 2px #ECECEC;
	border-radius: 50%;
}
.edit_row_arrow{
	flex: none;
	margin-left: 20upx;
}
.edit_row_input{
	text-align: right;
	color: grey;
}
.edit_btn{
	margin: 80upx auto;
}
</style>
