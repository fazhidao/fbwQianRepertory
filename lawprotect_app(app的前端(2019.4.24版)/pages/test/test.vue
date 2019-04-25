<template>
	<view>
		<view style="height: 100px;background: #535353;">
			<input-box classes="test" v-model="test" type="number"></input-box>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				test: '',
			};
		},
		watch:{
			test(to){
				console.log(to+'--')
			}
		}
	}
</script>

<style>
.test{
	background: #98732D;
}
</style>
