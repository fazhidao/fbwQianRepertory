<template>
<div>
	<view class="three_tab_box">
		<view class="three_tab_item" @click="choseTab(1)">
			<view :class="'three_tab_border'+(tab_index==1?' active':'')">
				<image v-if="tab_index==1" class="three_tab_icon" src="../../static/ask_law/new_wenfa.png" mode=""></image>
				<image v-if="tab_index!=1" class="three_tab_icon" src="../../static/ask_law/new_wenfa2.png" mode=""></image>
				<text :class="'three_tab_title'+(tab_index==1?' active':'')">法律咨询</text>
			</view>
		</view>
		<view class="three_tab_item" @click="choseTab(2)">
			<view :class="'three_tab_border'+(tab_index==2?' active':'')">
				<image v-if="tab_index==2" class="three_tab_icon" src="../../static/ask_law/new_weituo.png" mode=""></image>
				<image v-if="tab_index!=2" class="three_tab_icon" src="../../static/ask_law/new_weituo2.png" mode=""></image>
				<text>案件委托</text>
			</view>
		</view>
		<view class="three_tab_item" @click="choseTab(3)">
			<view :class="'three_tab_border'+(tab_index==3?' active':'')">
				<image v-if="tab_index==3" class="three_tab_icon" src="../../static/ask_law/new_dianzi.png" mode=""></image>
				<image v-if="tab_index!=3" class="three_tab_icon" src="../../static/ask_law/new_dianzi2.png" mode=""></image>
				<text :class="'three_tab_title'+(tab_index==3?' active':'')">诉讼垫资</text>
			</view>
		</view>
		<view class="three_tab_item" @click="goChat()">
			<view :class="'three_tab_border'+(tab_index==4?' active':'')">
				<image class="three_tab_icon" src="../../static/ask_law/new_kefu.png" mode=""></image>
				<text :class="'three_tab_title'+(tab_index==4?' active':'')">在线客服</text>
			</view>
		</view>
	</view>
	
	<view class="three_tab_box_height"></view>
	<view class="scroll_view_ask_law view_f3f3f3">
		<view class="split_line"></view>
		
		<!-- 案件委托 -->
		<block v-if="tab_index==2">
			<view class="anjianweituo_box">
				<view class="icon_row" @click="is_show_select_type=true">
					<image class="absolute_center icon_row_icon" src="../../static/ask_law/fenlei.png"></image>
					<text>委托类型</text>
					<text class="tab_row_right">{{chosed_type.title}}</text>
					<image class="absolute_center right_arrow icon_row_arrow" src="../../static/arrow_right.png"></image>
				</view>
				<view class="borderY"></view>
				<view class="icon_row" @click="showSelectArea()">
					<image class="absolute_center icon_row_icon" src="../../static/ask_law/didian.png"></image>
					<text>委托地点</text>
					<text class="tab_row_right">{{chosed_area.province_name}} {{chosed_area.city_name}}</text>
					<image class="absolute_center right_arrow icon_row_arrow" src="../../static/arrow_right.png"></image>
				</view>
				<view class="borderY"></view>
				<view style="min-height: 200upx;" @click="focusTextarea('tab1')">
					<textarea class="anjianweituo_textarea" v-model="content_tab2" placeholder="请详细描述您的委托内容" :auto-height="true" :focus="focus.tab1" @blur="focus.tab1=false" />
				</view>
			</view>
			<view class="split_line"></view>
			<view class="icon_row">
				<image class="absolute_center icon_row_icon" src="../../static/ask_law/upload.png"></image>
				<text>附件上传（图片选传）</text>
			</view>
			<scroll-view scroll-x style="background: #FFFFFF;">
				<view class="zixun_picture_box">
					<image class="zixun_picture" v-for="item in chosed_pic_list2" :key="item" :src="item"></image>
					<image v-show="chosed_pic_list2.length==0" class="zixun_picture" src="../../static/ask_law/upload_btn.png" @click="choseImage2()"></image>
				</view>
				<view v-show="chosed_pic_list2.length>0" style="padding: 0 10upx;"> <button type="default" size="mini" @click="choseImage2()">重新上传</button> </view>
			</scroll-view>
			<view class="split_line"></view>
			<view class="anjianweituo_box">
				<view class="icon_row">
					<image class="absolute_center icon_row_icon" src="../../static/ask_law/baojia.png"></image>
					<text>委托报价</text>
					<view class="baojia_input_box">
						<view class="baojia_input_item">
							<input class="baojia_input" v-model="offer_min" type="number" @blur="(offer_min < 300)&&(offer_min=300)" placeholder="最低￥300" />
							<view class="borderY"></view>
						</view>
						<view class="borderY baojia_split"></view>
						<view class="baojia_input_item">
							<input class="baojia_input" v-model="offer_max" type="number" placeholder="最高价" />
							<view class="borderY"></view>
						</view>
					</view>
				</view>
				<view class="borderY"></view>
				<view class="icon_row">
					<image class="absolute_center icon_row_icon" src="../../static/ask_law/fuwufei.png"></image>
					<text>委托服务费</text>
					<text class="fuwufei">￥{{offer.tab2}}</text>
				</view>
			</view>
		</block>
		
		<!-- 法律咨询 -->
		<view v-if="tab_index==1" class="zixun_box">
			<view style="padding: 0 20upx;min-height: 200upx;" @click="focusTextarea('tab2')">
				<textarea class="anjianweituo_textarea" v-model="content_tab1" placeholder="请详细描述您的问题" :auto-height="true" :focus="focus.tab2" @blur="focus.tab2=false" />
			</view>
			<view class="split_line"></view>
			<view class="icon_row">
				<image class="absolute_center icon_row_icon" src="../../static/ask_law/upload.png"></image>
				<text>附件上传（图片选传）</text>
			</view>
			<scroll-view scroll-x>
				<view class="zixun_picture_box">
					<image class="zixun_picture" v-for="item in chosed_pic_list" :key="item" :src="item"></image>
					<image v-show="chosed_pic_list.length==0" class="zixun_picture" src="../../static/ask_law/upload_btn.png" @click="choseImage()"></image>
				</view>
				<view v-show="chosed_pic_list.length>0" style="padding: 0 10upx;"> <button type="default" size="mini" @click="choseImage()">重新上传</button> </view>
			</scroll-view>
			<view class="split_line"></view>
			<view class="icon_row">
				<image class="absolute_center icon_row_icon" src="../../static/ask_law/fuwufei.png"></image>
				<text>咨询费</text>
				<text class="fuwufei">￥{{offer.tab1}}</text>
			</view>
		</view>
		
		<!-- 诉讼垫资 -->
		<view v-if="tab_index==3" class="zixun_box">
			<view style="padding: 0 20upx;min-height: 200upx;" @click="focusTextarea('tab3')">
				<textarea class="anjianweituo_textarea" v-model="content_tab3" placeholder="请详细描述垫资案件情况" :auto-height="true" :focus="focus.tab3" @blur="focus.tab3=false" />
			</view>
			<view class="split_line"></view>
			<view class="icon_row">
				<image class="absolute_center icon_row_icon" src="../../static/ask_law/fuwufei.png"></image>
				<text>垫资保证金</text>
				<text class="fuwufei">￥{{offer.tab3}}</text>
			</view>
		</view>
		
		<!-- 专业律师 -->
		<view class="zhuanyelvshi_box">
			<image class="zhuanyelvshi_title" src="../../static/ask_law/zhuanyejingying.png"></image>
			<scroll-view scroll-x>
				<view class="zhuanyelvshi_item_box">
					<view class="zhuanyelvshi_item" v-for="(item,index) in lawyer_list" :key="item.id">
						<image class="zhuanyelvshi_item_avatar absolute_center" :src="item.avatar" mode="aspectFill"></image>
						<view class="zhuanyelvshi_item_name">{{item.name}}</view>
						<view class="zhuanyelvshi_item_year">{{item.sub_name}}</view>
						<view class="zhuanyelvshi_item_abstract" style="text-align: center;">执照编号: {{item.license_no}}</view>
						<view class="zhuanyelvshi_item_tag">
							<view class="zhuanyelvshi_item_tag_item" v-for="(tag,index2) in item.tag_list" :key="tag">{{tag}}</view>
						</view>
						<view class="zhuanyelvshi_item_abstract">{{item.abstract}}</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
	
	<view class="pay_bar">
		<view class="pay_bar_text">
			<block  v-if="tab_index==1">
				<text v-if="ask_help_times!=0 && ask_help_times !=9999">剩余免费咨询 {{ask_help_times}} 次</text>
				<text v-else>支付金额：￥{{offer.tab1 * ask_help_discount / 10}}</text>
				<view v-if="vip_id == 0" class="pay_bar_text_alert">加入会员免费咨询</view>
				<view v-if="ask_help_discount<10 && ask_help_discount > 0" class="pay_bar_text_alert">当前会员尊享 {{ask_help_discount}} 折</view>
				<view v-if="ask_help_discount == 0" class="pay_bar_text_alert">当前会员尊享免费法律咨询</view>
			</block>
			
			<block  v-if="tab_index==2">
				<text v-if="ask_entrust_times!=0 && ask_entrust_times !=9999">剩余免费委托 {{ask_entrust_times}} 次</text>
				<text v-else>支付金额：￥{{offer.tab2 * ask_entrust_discount / 10}}</text>
				<view v-if="vip_id == 0" class="pay_bar_text_alert">加入会员免费咨询</view>
				<view v-if="ask_entrust_discount<10 && ask_entrust_discount > 0" class="pay_bar_text_alert">当前会员尊享 {{ask_entrust_discount}} 折</view>
				<view v-if="ask_entrust_discount == 0" class="pay_bar_text_alert">当前会员尊享免费案件委托</view>
			</block>
			
			<block  v-if="tab_index==3">
				<text v-if="ask_advance_times!=0 && ask_advance_times !=9999">剩余免费垫资 {{ask_advance_times}} 次</text>
				<text v-else>支付金额：￥{{offer.tab3 * ask_advance_discount / 10}}</text>
				<view v-if="vip_id == 0" class="pay_bar_text_alert">加入会员免费咨询</view>
				<view v-if="ask_advance_discount<10 && ask_advance_discount > 0" class="pay_bar_text_alert">当前会员尊享 {{ask_advance_discount}} 折</view>
				<view v-if="ask_advance_discount == 0" class="pay_bar_text_alert">当前会员尊享免费诉讼垫资</view>
			</block>
		</view>
		<view v-if="vip_id == 0" class="pay_bar_btn vip" @click="goView('/pages/index/vip')">开通会员</view>
		<view v-if="vip_id != 3 && vip_id != 0" class="pay_bar_btn vip" @click="goView('/pages/index/vip')">升级会员</view>
		<view class="pay_bar_btn pay" @click="submitAsk()">立即发布</view>
	</view>
	
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
	
	<view v-if="is_show_select_type" class="select_bg" @click="is_show_select_type=false"></view>
	<view v-if="is_show_select_type" class="select_box absolute_center">
		<view class="select_title">选择委托类型</view>
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
				//1咨询 2案件委托 3诉讼垫资
				tab_index: 2,
				focus:{
					tab1: false,
					tab2: false,
					tab3: false,
				},
				offer:{
					tab1: 20,
					tab2: 20,
					tab3: 20,
				},
				ask_help_times: 0,
				ask_advance_times: 0,
				ask_entrust_times: 0,
				ask_help_discount: 10,
				ask_advance_discount: 10,
				ask_entrust_discount: 10,
				vip_id: 0,
				chosed_pic_list: [],
				chosed_pic_list2: [],
				is_show_select_area: false,
				is_show_select_type: false,
				area_list: [],
				type_list: [],
				lawyer_list: [],
				content_tab1: '',
				content_tab2: '',
				chosed_area: {},
				chosed_type: '',
				offer_min: '',
				offer_max: '',
				content_tab3: '',
				self_city_name: '定位中...',
			}
		},
		onLoad() {
			this.getPrices();
			this.getTypeList();
			this.getLawyers();
			setTimeout(()=>{ //过一秒再加载全部数据
				this.getLawyers('all');
			},1000)
			// this.getLocationPermission();
		},
		onShow() {
			this.ask_help_times = global.vip_info ? global.vip_info.ask_help_times : 0;
			this.ask_advance_times = global.vip_info ? global.vip_info.ask_advance_times : 0;
			this.ask_entrust_times = global.vip_info ? global.vip_info.ask_entrust_times : 0;
			this.ask_help_discount = global.vip_info ? global.vip_info.ask_help_discount : 10;
			this.ask_advance_discount = global.vip_info ? global.vip_info.ask_advance_discount : 10;
			this.ask_entrust_discount = global.vip_info ? global.vip_info.ask_entrust_discount : 10;
			this.vip_id = global.vip_info ? global.user_info.vip_id : 0;
			
			if(global.ask_law_index){
				this.tab_index = global.ask_law_index;
				global.ask_law_index = undefined;
			}
			//购买会员后刷新次数
			if(global.update_times_info){
				global.update_times_info = undefined;
				this.ask_help_times = global.vip_info.ask_help_times;
				this.ask_advance_times = global.vip_info.ask_advance_times;
				this.ask_entrust_times = global.vip_info.ask_entrust_times;
				this.vip_id = global.user_info.vip_id;
			}
			if(global.clear_ask_law_index){
				switch(global.clear_ask_law_index){
					case 2:
						this.chosed_type = '';
						this.chosed_area = {};
						this.content_tab2 = '';
						this.offer_min = '';
						this.offer_max = '';
					break;
					case 3:
						this.content_tab3 = '';
					break;
					case 1:
						this.content_tab1 = '';
						this.chosed_pic_list = [];
					break;
				}
				global.clear_ask_law_index = undefined;
			}
		},
		methods:{
			getLawyers(){
				this.requestApi({
					url: arguments[0]?'getLawyers2':'getLawyers',
					success: res=>{
						this.lawyer_list = res.map(el=>{
							el.avatar = this.ImgUrl + el.avatar;
							el.tag_list = el.keywords.split(',');
							return el;
						});
					}
				})
			},
			getPrices(){
				this.requestApi({
					url: 'ask_law/getPrices',
					success: res=>{
						this.offer.tab1 = res[0].price/100;
						this.offer.tab2 = res[1].price/100;
						this.offer.tab3 = res[2].price/100;
					}
				})
			},
			choseTab(index){
				this.tab_index = index;
			},
			focusTextarea(key){ //点击周围自动聚焦
				this.focus[key] = !this.focus[key];
			},
			choseImage(){
				uni.chooseImage({
					success: res=>{
						this.chosed_pic_list = res.tempFilePaths
					}
				})
			},
			choseImage2(){
				uni.chooseImage({
					success: res=>{
						this.chosed_pic_list2 = res.tempFilePaths
					}
				})
			},
			getTypeList(){
				//案件委托类型列表
				this.requestApi({
					url: 'ask_law/getTypeList',
					success: res=>{
						this.type_list = res.map(el=>{
							el.chosed = false;
							return el;
						});
					}
				})
			},
			choseType(item){
				if(!item.chosed){
					if(this.chosed_type.title){
						this.chosed_type.chosed = false;
					}
					item.chosed = true;
					this.chosed_type = item;
				}
				this.is_show_select_type = false;
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
			selectPosition(){
				this.requestApi({
					url: 'areas/getList',
					data: {name: this.self_city_name},
					success: res=>{
						this.area_list = res;
					}
				})
			},
			choseArea(item){
				this.chosed_area = item;
				this.is_show_select_area = false;
			},
			showSelectArea(){
				this.is_show_select_area = true;
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
			submitAsk(){
				if(!global.appid){
					this.goView('/pages/login/login');
					return 0;
				}
				switch(this.tab_index){
					case 2:
						if(this.chosed_type==''){
							uni.showToast({
								title: '请选择委托类型',
								icon: 'none'
							})
							return 0;
						}
						if(!this.chosed_area.id){
							uni.showToast({
								title: '请选择委托地点',
								icon: 'none'
							})
							return 0;
						}
						if(this.content_tab2 == ''){
							uni.showToast({
								title: '请输入委托内容',
								icon: 'none'
							})
							return 0;
						}
						if(this.offer_min==''||this.offer_max==''){
							uni.showToast({
								title: '请填写委托报价',
								icon: 'none'
							})
							return 0;
						}
						if(this.offer_min < 300){
							this.offer_min = 300
						}
						uni.showModal({
							title: "操作提示",
							content: "确定提交当前内容吗？",
							success: (res) => {
								if(res.confirm){
									let total_pic = this.chosed_pic_list2.length;
									if(total_pic > 0){
										let uploaded_pic = 0;
										let pictrues = [];
										this.chosed_pic_list2.forEach(el=>{
											this.requestApi({
												upload_file: true,
												url: 'ask_law/entrust_contracts',
												file_path: el,
												success: (res) => {
													uploaded_pic++;
													pictrues.push(res);
													if(uploaded_pic == total_pic){
														this.uploadEntrustPicFinish(pictrues.join(','));
													}
												}
											})
										})
									}else{
										this.uploadEntrustPicFinish();
									}
								}
							},
						})
					break;
					case 3:
						if(this.content_tab3 == ''){
							uni.showToast({
								title: '请填写案件情况',
								icon: 'none'
							})
							return 0;
						}
						uni.showModal({
							title: "操作提示",
							content: "确定提交当前内容吗？",
							success: (res) => {
								if(res.confirm){
									this.requestApi({
										url: 'ask_law/save_advance',
										data: {
											content: this.content_tab3,
										},
										success: res=>{
											if(res.has_free_time == 1){
												this.showSuccess();
											}else{
												this.showPayment('advance',res.ask_advance_id);
											}
										}
									})
								}
							},
						})
					break;
					case 1:
						if(this.content_tab1 == ''){
							uni.showToast({
								title: '请填写咨询详情',
								icon: 'none'
							})
							return 0;
						}
						uni.showModal({
							title: "操作提示",
							content: "确定提交当前内容吗？",
							success: (res) => {
								if(res.confirm){
									let total_pic = this.chosed_pic_list.length;
									if(total_pic > 0){
										let uploaded_pic = 0;
										let pictrues = [];
										this.chosed_pic_list.forEach(el=>{
											this.requestApi({
												upload_file: true,
												url: 'ask_law/ask_help_picture',
												file_path: el,
												success: (res) => {
													uploaded_pic++;
													pictrues.push(res);
													if(uploaded_pic == total_pic){
														this.uploadHelpPicFinish(pictrues.join(','));
													}
												}
											})
										})
									}else{
										this.uploadHelpPicFinish();
									}
								}
							},
						})
					break;
				}
			},
			uploadHelpPicFinish(){  //上传完图片后添加订单
				let request_data = {
					content: this.content_tab1,
					pictures: arguments[0] || '',
				}
				this.requestApi({
					url: 'ask_law/save_help',
					data: request_data,
					success: res=>{
						if(res.has_free_time == 1){
							this.showSuccess();
						}else{
							this.showPayment('help',res.ask_help_id);
						}
					}
				})
			},
			uploadEntrustPicFinish(){  //上传完图片后添加订单
				let request_data = {
					province_id: this.chosed_area.province_id,
					city_id: this.chosed_area.id,
					type_id: this.chosed_type.id,
					content: this.content_tab2,
					offer_min: this.offer_min,
					offer_max: this.offer_max,
					pictures: arguments[0] || '',
				}
				this.requestApi({
					url: 'ask_law/save_entrust',
					data: request_data,
					success: res=>{
						if(res.has_free_time == 1){
							this.showSuccess();
						}else{
							this.showPayment('entrust',res.ask_entrust_id);
						}
					}
				})
			},
			showSuccess(){
				uni.showToast({
					title: '发布成功',
					icon: 'success',
				})
				switch(this.tab_index){
					case 2:
						this.chosed_type = '';
						this.chosed_area = {};
						this.content_tab2 = '';
						this.offer_min = '';
						this.offer_max = '';
						this.ask_entrust_times --;
						this.chosed_pic_list2 = [];
						global.vip_info.ask_entrust_times --;
						uni.showModal({
							title: '提交成功',
							content: '是否立即前往我的委托查看',
							success: res => {
								if(res.confirm){
									this.goView('/pages/mine/my_ask_entrust');
								}
							},
						});
					break;
					case 3:
						this.content_tab3 = '';
						this.ask_advance_times --;
						global.vip_info.ask_advance_times --;
						uni.showModal({
							title: '提交成功',
							content: '是否立即前往我的诉讼垫资查看',
							success: res => {
								if(res.confirm){
									this.goView('/pages/mine/my_ask_advance');
								}
							},
						});
					break;
					case 1:
						this.content_tab1 = '';
						this.chosed_pic_list = [];
						this.ask_help_times --;
						global.vip_info.ask_help_times --;
						uni.showModal({
							title: '提交成功',
							content: '是否立即前往我的咨询查看',
							success: res => {
								if(res.confirm){
									this.goView('/pages/mine/my_ask_help');
								}
							},
						});
					break;
				}
			},
			showPayment(ask_type,ask_id){
				global.passback_params = JSON.stringify({ ask_type, ask_id });
				
				global.goods_id = 12;
				global.price_to_pay = this.offer.tab1 * this.ask_help_discount / 10;
				global.payment_title = '法律咨询';
				if(this.tab_index == 2){
					global.payment_title = '案件委托';
					global.goods_id = 13;
					global.price_to_pay = this.offer.tab2 * this.ask_entrust_discount / 10;
				}else if(this.tab_index == 3){
					global.payment_title = '诉讼垫资';
					global.goods_id = 14;
					global.price_to_pay = this.offer.tab3 * this.ask_advance_discount / 10;
				}
				global.wait_clear_ask_law_index = this.tab_index;
				
				this.goView('/pages/payment/chose_type?goods_type=ask_law');
			},
			goChat(){
				if(!global.user_info){
					this.goView('/pages/login/login');
					return 0;
				}
				this.goView('/pages/mine/chat_webview?from=1');
			},
			getLocationPermission(){
			  let main = plus.android.runtimeMainActivity();  
			  let Build = plus.android.importClass("android.os.Build");  
			  let Manifest = plus.android.importClass("android.Manifest");  
			  let PackageManager = plus.android.importClass("android.content.pm.PackageManager");  
			  let Permission = Manifest.permission;  
			  let VERSION = Build.VERSION;  
			  let VERSION_CODES = Build.VERSION_CODES;  
			  let isCheck = Permission.ACCESS_FINE_LOCATION;  
			  let pkName = main.getPackageName();  
			  let packageManager = main.getPackageManager();  
			  console.log(isCheck);  
			  let GRANTED = '';  
			  if (VERSION.SDK_INT >= VERSION_CODES.M) {  
				GRANTED = plus.android.invoke(main, 'checkSelfPermission', isCheck);  
				if (GRANTED == PackageManager.PERMISSION_DENIED) {  
				  console.log('没开启定位权限');  
				} else {  
				  console.log('启定位权限');  
				}  
			  } else {  
				GRANTED = plus.android.invoke(packageManager, 'checkPermission', isCheck, pkName);  
				if (GRANTED == PackageManager.PERMISSION_DENIED) {  
				  console.log('没开启定位权限');  
				} else {  
				  console.log('启定位权限');
				}  
			  }  
			}
		}
	}
</script>

<style>
	.scroll_view_ask_law{
		padding: 0 0 80upx 0;
	}
	.three_tab_box_height{
		height: 150upx;
		background: #FFFFFF;
	}
	.three_tab_box{
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		display: flex;
		font-size: 26upx;
		background: #FFFFFF;
		padding-top: 80upx;
		height: 70upx;
		box-shadow: 0 0 1px #AEAEAE;
		z-index: 99;
	}
	.three_tab_item{
		flex: 1;
		display: flex;
		justify-content: center;
	}
	.three_tab_border{
		flex: none;
		display: flex;
		border-bottom: 2px solid #FFFFFF;
		justify-content: center;
		align-items: center;
	}
	.three_tab_border.active{
		color: #ccb17e;
		border-bottom: 2px solid #ccb17e;
	}
	.three_tab_icon{
		display: block;
		width: 40upx;
		height: 40upx;
		margin-right: 4px;
	}
	.three_tab_title{
		box-sizing: border-box;
	}
	.anjianweituo_box{
		padding: 0 20upx;
		background: #FFFFFF;
		font-size: 26upx;
	}
	.anjianweituo_textarea{
		width: 100%;
		padding: 20upx 0;
	}
	.baojia_input_box{
		display: flex;
		float: right;
		height: 80upx;
	}
	.baojia_input_item{
		flex: 0 0 auto;
		padding-top: 16upx;
		height: 48upx;
		width: 140upx;
	}
	.baojia_input{
		line-height: 48upx;
		width: 100%;
		text-align: center;
	}
	.baojia_split{
		width: 30upx;
		margin: 40upx 16upx 0 16upx;
		background: #9E9E9E;
	}
	
	.fuwufei{
		float: right;
		color: #db2222;
		padding-right: 20upx;
	}
	
	.zhuanyelvshi_box{
		padding: 24upx 20upx 24upx 0;
	}
	.zhuanyelvshi_title{
		display: block;
		width: 375upx;
		height: 25upx;
		margin: 0 auto;
	}
	.zhuanyelvshi_item_box{
		display: flex;
		flex-wrap: nowrap;
	}
	.zhuanyelvshi_item{
		position: relative;
		flex: 0 0 auto;
		background: #FFFFFF;
		width: 260upx;
		/* height: 280upx; */
		border-radius: 10upx;
		margin: 80upx 20upx 0 20upx;
		font-size: 24upx;
		text-align: center;
	}
	.zhuanyelvshi_item_avatar{
		top: -60upx;
		bottom: auto;
		width: 120upx;
		height: 120upx;
		border-radius: 50%;
	}
	.zhuanyelvshi_item_name{
		padding-top: 70upx;
		text-align: center;
		font-weight: 600;
		font-size: 26upx;
	}
	.zhuanyelvshi_item_tag{
		display: flex;
		font-size: 20upx;
		flex-wrap: wrap;
		justify-content: center;
	}
	.zhuanyelvshi_item_tag_item{
		flex: 0 0 auto;
		background: #dbf1fc;
		border-radius: 6upx;
		text-align: center;
		color: #616161;
		padding: 4upx 6upx;
		margin: 6upx 10upx;
	}
	.zhuanyelvshi_item_abstract{
		font-size: 20upx;
		color: #989797;
		text-align: justify;
		margin: 8upx;
		word-break: break-all;
	}
	
	.zixun_box{
		background: #FFFFFF;
	}
	.zixun_picture_box{
		display: flex;
		padding-bottom: 20upx;
	}
	.zixun_picture{
		flex: 0 0 auto;
		width: 200upx;
		height: 240upx;
		margin: 0 20upx;
	}
	
	.tab_row_right{
		float: right;
		margin-right: 80upx;
	}
</style>