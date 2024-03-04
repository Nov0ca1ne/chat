<template>
	<view>
		<image lazy-load class="rounded" @load="loadImage" @click="$emit('click')" :src="src" mode="widthFix" :style="imageStyle"></image>
	</view>
</template>

<script>
export default {
	data() {
		return {
			h: 100,
			w: 100
		};
	},
	props: {
		src: {
			type: String,
			default: ''
		},
		imageClass: {
			type: String,
			default: ''
		},
		maxH: {
			type: Number,
			default: 400
		},
		maxW: {
			type: Number,
			default: 400
		},
		type: {
			type: String,
			default: ''
		}
	},
	methods: {
		//加载图片
		loadImage(res) {
			const w = res.detail.width;
			const h = res.detail.height;

			const maxW = uni.upx2px(this.maxW);
			const maxH = uni.upx2px(this.maxH);

			// 长的图按照长自适应
			if (w < h) {
				if (h <= maxH) {
					this.w = w <= maxW ? w : maxW;
					this.h = h;
					return;
				}

				this.h = maxH;
				const w2 = maxH * (w / h);
				this.w = w2 < w ? w2 : maxW;
			} else {
				// 宽的图按照宽自适应
				if (w <= maxW) {
					this.w = w;
					this.h = h;
					return;
				}
				this.w = maxW;
				this.h = maxW * (h / w);
			}

			if (this.type === 'emoji') {
				this.w -= 50;
				this.h -= 50;
			}
			this.$emit('load', { width: this.w, height: this.h });
		}
	},
	computed: {
		//自适应图片大小
		imageStyle() {
			const height = this.h;
			const width = this.w;
			return `height:${height}px;width:${width}px`;
		}
	},

};
</script>

<style></style>
