<template>
	<view>
		<view class="" :style="Style"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		props:{
			height:{
				type:Number,
				default:30
			}
		},
		methods: {
			
		},
		computed:{
			Style(){
				return `height:${this.height}rpx`
			}
		}
	}
</script>

<style>

</style>
