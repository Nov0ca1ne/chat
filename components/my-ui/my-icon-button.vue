<template>
	<view class="flex justify-center align-center" :class="iconClass" hover-class="icon-hover" :style="getSize" @click="$emit('click')">
		<text class="iconfont" :class="fontClass" :style="fontStyle">{{ icon }}</text>
	</view>
</template>

<script>
export default {
	data() {
		return {};
	},
	props: {
		icon: {
			type: String,
			default: ''
		},
		fontClass: {
			type: String,
			default: 'font-lg'
		},
		fontStyle: {
			type: String,
			default: ''
		},
		height: {
			type: Number,
			default: '90'
		},
		width: {
			type: Number,
			default: '90'
		},
		iconClass:{
			type: String,
			default: ''
		}
	},
	computed: {
		getSize() {
			return `height:${this.height}rpx;width:${this.width}rpx`;
		}
	},
	methods: {}
};
</script>

<style></style>
