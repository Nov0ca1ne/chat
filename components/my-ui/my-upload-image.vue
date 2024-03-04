<template>
	<!-- 图文 -->
	<view class="flex flex-wrap mx-4 mt-2">
		<!-- image -->
		<view v-for="(item, index) in imageList" :key="index" class="py-1 position-relative flex align-center justify-center mb-1" style="width: 223rpx">
			<image @longpress="onlong" @click="preview(item)" class="rounded" style="height: 210rpx; width: 210rpx" :src="item" mode="aspectFill"></image>
			<!-- 删除 -->
			<view
			v-if="isDel"
				class=""
				@click="deleteImage(index)"
				class="flex align-center justify-center position-absolute rounded-circle"
				style="top: 0; right: 0;"
			>
			<text class="iconfont font-lg" style="color: rgba(235, 90, 86, 0.9);">&#xe658;</text></view>
		</view>
		<!-- 添加 -->
		<view v-if="imageList.length < 9" @click="addImage" class="flex align-center justify-center" style="width: 223rpx">
			<view class="flex align-center justify-center bg-white rounded" style="width: 210rpx; height: 210rpx">
				<text class="iconfont font-70 font-weight-bold">&#xe6da;</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			imageList: [],
			isDel:false
		};
	},
	methods: {
		onlong(){
			this.isDel = true
		},
		// 预览图片
		preview(url) {
			uni.previewImage({
				urls: this.imageList,
				current: url
			});
		},
		addImage() {
			uni.chooseImage({
				count: 9 - this.imageList.length,
				success: (res) => {
					this.imageList = [...this.imageList, ...res.tempFilePaths];
					this.$emit('updateImage', this.imageList);
				}
			});
		},
		// 删除图片
		deleteImage(index) {
			this.imageList.splice(index, 1);
			this.$emit('updateImage', this.imageList);
		}
	}
};
</script>

<style></style>
