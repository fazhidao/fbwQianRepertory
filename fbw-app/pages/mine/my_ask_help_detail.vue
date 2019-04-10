<template>
<div>
	<view v-if="chosed_help.status != 3" style="padding: 10px 20upx;background: #FFFFFF;min-height: 120upx;" @click="focusTextarea('tab2')">
		<textarea class="anjianweituo_textarea" v-model="content_tab1" placeholder="您可以继续追问" :auto-height="true" :focus="focus.tab2" @blur="focus.tab2=false" />
	</view>
	<view v-if="chosed_help.status != 3" class="main_btn" style="margin: 10px auto;" @click="submitAskAgain()">提交追问</view>
	
	<view style="text-align: center;font-size: 14px;color: #999999;margin: 20px 0;">聊天记录</view>
	<view class="talks_box">
		<block v-for="item in chosed_help.talks" :key="item.id">
            <div class="user_title">{{chosed_help.name}} {{item.create_time}}：</div>
            <div class="user_content">{{item.ask_content}}</div>
			<block v-if="item.reply_time==null">
				<div class="servant_title">等待客服回复...</div>
			</block>
			<block v-else>
				<div class="servant_title">客服回复 {{item.reply_time}}：</div>
				<div class="servant_content">{{item.reply_content}}</div>
			</block>
            <div style="height: 1px;background: #eee;margin: 10px 0;"></div>
        </block>
	</view>
	
</div>
</template>

<script>
import './mine_list.css';
export default{
	data(){
		return {
			focus: {tab2: false},
			content_tab1: '',
			chosed_help: { talks: [] }
		}
	},
	onLoad() {
		this.chosed_help = global.chosed_help;
		console.log(this.chosed_help)
	},
	methods: {
		focusTextarea(key){ //点击周围自动聚焦
			this.focus[key] = !this.focus[key];
		},
		submitAskAgain(){
			if(this.content_tab1 == ''){
				uni.showToast({
					title: '请输入追问内容',
					icon: 'none',
					duration: 1500
				});return 0;
			}
			if(this.chosed_help.status == 1 || this.chosed_help.status == 5){
				uni.showToast({
					title: '客服回复前无法继续追问',
					icon: 'none',
					duration: 1500
				});return 0;
			}
			this.requestApi({
				url: 'ask_law/save_help_again',
				data: {
					id: this.chosed_help.id,
					content: this.content_tab1
				},
				success: res=>{
					uni.showToast({
						title: '提交成功',
						icon: 'success',
						duration: 1500
					});
					global.need_refresh_ask_help = true;
					setTimeout(()=>{
						uni.navigateBack()
					},1500)
				}
			})
		}
	}
}
</script>

<style>
.talks_box{
	background: #FFFFFF;
	padding: 10px;
}
.user_title{
    color: #000000;
}
.servant_title{
    color: #000000;
    text-align: right;
}
.user_content{
    margin-right: 60px;
    color: #999999;
}
.servant_content{
    margin-left: 60px;
    color: #999999;
    text-align: right;
}
</style>
