<template>
<view :class="'input_box '+(classes||'')" @click="clickBox()">
	<input class="input_box_input"
		:value="value" :placeholder="placeholder"
		:focus="is_focus" :type="type||'text'" :confirm-type="confirmtype||'done'"
		@blur="blurAction" @input="inputAction" @focus="focusAction" @confirm="confirmAction"
	/>
	<view class="clear_btn_box" @click="clearAction">
		<image v-show="is_show_clear" class="clear_btn" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDE0IDc5LjE1Njc5NywgMjAxNC8wOC8yMC0wOTo1MzowMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MzA2RDU0NDIxQjM5MTFFOUE4NUNGMDQ4QjhCODlGNDQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MzA2RDU0NDMxQjM5MTFFOUE4NUNGMDQ4QjhCODlGNDQiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo5MTM3MTE3RjFCMzYxMUU5QTg1Q0YwNDhCOEI4OUY0NCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo5MTM3MTE4MDFCMzYxMUU5QTg1Q0YwNDhCOEI4OUY0NCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PuzZJwgAAAI6SURBVHjatJfNSkJBFMfH68dCBBNLRREhqPZBj5DuW/TxCFpYbxD0BCVpj9DHon32CFFr4UIgbsSSUtzoRemcy5kYJ6935mp/+MvFOXN+jnfmcMZnmiZTUBBcAO+Cd8Dr4BUa+wa/g1/Az+AnsOWW0OcCxuRn4BJ4janpE1wFX9KPmiljToJDcAN8rgFFrdKcBuVQBvvBNfAtOMm8K0k5apRzLhgDHsBFtjwVKad/Hhjfyx5bvjDnlRP4AHzyO2AYLJfLsXg8rk1Jp9O2JR0TYwqMu7ciRmUyGRYMBlksFtOCIzAcDttOpVLycIUfQw7GI5MQI9rtNptMJvazKpxDUZZl2TkkJYhlg0N0TqeEE1utljJchjabTadQZIUQnHc6p6pwDSgjVp6DHeUG14RyFQLwse0WxeHZbNbe7Qi3CzhsPg4dDod2jKK2ccWbKpGzVh6JRLxAURsIjqpGc7jbdwqKGroz5M2Ff7eXIoPgnk5x4H8vrlT3nAvqIdjUqUji7tU555JMBL96gXopMoLeEFz3AvVa4Uh1Du4uUgY14R/YlyF4BL5esAzqwLEjGRlCA9ARRweDgW4ZnIKj+/3+rNUiiwWEFrUMvuMROAkn8x/gpcjgs6Qy7zzFAnJPbemfVesKgTOgVXFhcuU6BT/+Q8/1SLkdm70xeB98s0ToDeUcu/XVY+oSjuQNp6kO5SjJULebBL6PLfCF0zl3UJfmbInvVPfuJF/a8sKlLUZjX8KlrU4euSX8EWAAbxYwdvq7OzAAAAAASUVORK5CYII="></image>
	</view>
</view>
</template>

<script>
	export default{
		props: ['value','classes','placeholder','type','confirmtype'],
		data(){
			return {
				is_focus: false,
				is_show_clear: false,
			}
		},
		methods:{
			clickBox(){
				this.is_focus = true;
				setTimeout(()=>{this.is_focus = false;},100)
			},
			inputAction(event){
				this.$emit('input', event.target.value);
			},
			focusAction(event){
				this.is_show_clear = true;
				this.$emit('focus', event.target.value);
			},
			blurAction(event){
				this.is_show_clear = false;
				this.is_focus = false;
				this.$emit('blur', event.target.value);
			},
			clearAction(){
				this.$emit('clear');
			},
			confirmAction(){
				this.$emit('confirm');
			},
		}
	}
</script>

<style>
	.input_box{
		display: flex;
		align-items: center;
	}
	.input_box_input{
		flex: 1;
	}
	.clear_btn_box{
		position: relative;
		flex: none;
		width: 50upx;
		height: 100%;
	}
	.clear_btn{
		position: absolute;
		margin: auto;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		width: 30upx;
		height: 30upx;
	}
</style>
