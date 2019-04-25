import Vue from 'vue'
import App from './App'

import inputBox from './components/input_box/input_box.vue'
Vue.component('input-box',inputBox)

Vue.config.productionTip = false

App.mpType = 'app'

Vue.prototype.appid = null;
// Vue.prototype.ServerUrl = 'http://116.62.208.170/index.php/api/app/';
// Vue.prototype.SmsUrl = 'http://116.62.208.170/index.php/api/SMS/';
// Vue.prototype.ImgUrl = 'http://116.62.208.170/uploads/';
Vue.prototype.ServerUrl = 'http://192.168.124.22/server/public/index.php/api/app/';
 Vue.prototype.SmsUrl = 'http://192.168.124.22/server/public/index.php/api/SMS/';
 Vue.prototype.ImgUrl = 'http://192.168.124.22/server/public/uploads/';
// Vue.prototype.ServerUrl = 'http://localhost/fabao/index.php/api/app/';
// Vue.prototype.SmsUrl = 'http://localhost/fabao/index.php/api/SMS/';
// Vue.prototype.ImgUrl = 'http://localhost/fabao/uploads/';

Vue.prototype.requestApi = function(options) {
	options.hide_loading || uni.showToast({ title: '加载中...', mask: true, icon: 'loading', duration: 10000 })
	options.url && (options.url = this.ServerUrl + options.url);
	options.sms && (options.url = this.SmsUrl + options.sms);
	options.data || (options.data = {});
	global.appid && (options.data.appid = global.appid);
	if(options.upload_file){
		uni.uploadFile({
			url: options.url,
			filePath: options.file_path,
			name: 'file',
			formData: options.data,
			success: (res) => {
				options.success && options.success.call(this, res.data);
			}
		})
	}else{
		uni.request({
			method: 'POST',
			url: options.url,
			data: options.data,
			header: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			fail: () => {
				uni.hideToast();
				uni.showToast({
					title: '无法连接服务器',
					icon: 'none'
				})
			},
			success: (res) => {
				global.updating || options.manually_hide_loading || uni.hideToast();
				if (res.data.status == 1) {
					options.success && options.success.call(this, res.data.data);
				} else if (res.data.status == 2) {
					this.clearUserData();
					uni.showModal({
						title: "提示",
						content: "当前操作需要登录，是否前往登录？",
						success: (res) => {
							if (res.confirm) {
								uni.navigateTo({
									url: '/pages/login/login'
								})
							}
						}
					})
				} else {
					options.fail && options.fail.call(this);
					uni.showToast({
						title: res.data.data==null ? '服务器错误' : res.data.data,
						icon: "none"
					})
				}
			}
		});
	}
}
Vue.prototype.goView = function(url) {
	if (url == -1) {
		uni.navigateBack()
	} else if(arguments[1] && arguments[1]=='tab'){
		uni.switchTab({
			url
		})
	} else {
		uni.navigateTo({
			url
		})
	}
}
Vue.prototype.clearUserData = function() {
	global.user_info = undefined;
	global.appid = undefined;
	global.vip_info = undefined;
	uni.removeStorage({key: 'appid'});
}
Vue.prototype.loginByAppid = function() {
	uni.getStorage({
		key: 'appid',
		success: (res)=>{
			global.appid = res.data;
			this.requestApi({
				url: 'users/getUserInfo',
				hide_loading: true,
				success: res=>{
					uni.stopPullDownRefresh();
					if(res){
						res.avatar && (res.avatar = this.ImgUrl+res.avatar);
						global.user_info = res;
						global.vip_info = JSON.parse(res.vip_info);
					}else{
						this.clearUserData();
						uni.showToast({
							title: '之前的登录信息已失效',
							icon: 'none'
						})
					}
				}
			})
		}
	})
}


const app = new Vue({
	...App
})
app.$mount()
