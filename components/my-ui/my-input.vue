<template>
	<view>
		<view class="bg-white border-bottom align-center rounded flex mx-4 px-3  justify-between">
			<view class="pt-3 pb-3 pr-3 border-right-2">
				<text class="">{{text}}</text>
			</view>
			
			<view class="flex align-center justify-center px-3">
				<input @input="change" :value="value" placeholder="" class="" type="text" style="width: 470rpx;">
			</view>
		</view>
	</view>
</template>

<script>
export default {
	props:{
		text: {
			type: String,
			default: ''
		},
		value:{
			type: String,
			default: ''
		}
	},
	data() {
		return {};
	},
	methods: {
		change(e){
			
			let val = e.detail.value;
			this.$emit("input",val)
			
		}
	}
};
</script>

<style></style>
