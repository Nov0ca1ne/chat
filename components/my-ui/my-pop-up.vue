<template>
	<!-- 弹出层 -->
	<view v-if="status" class="" style="z-index: 9999; overflow: hidden">
		<!-- 遮罩 -->
		<view @click="hide" class="position-fixed top-0 right-0 left-0 bottom-0" :style="getMaskColor">
			<!-- 内容 -->
			<view ref="mypopup" class="position-fixed bg-dark my-animation" :style="getBodyStyle" :class="getBodyClass">
				<slot></slot>
			</view>
		</view>
	</view>
</template>

<script>
const animation = weex.requireModule('animation');
export default {
	data() {
		return {
			status: false,
			x: -1,
			y: -1,
			maxX: 0,
			maxY: 0,
			transformOrigin: '' //动画开始位置
		};
	},
	mounted() {
		const res = uni.getSystemInfoSync();
		this.maxX = res.windowWidth - uni.upx2px(this.bodyWidth);
		this.maxY = res.windowHeight - uni.upx2px(this.bodyHeight) + 10 - uni.upx2px(this.tabbarHeight);
	},

	props: {
		maskColor: {
			type: Boolean,
			default: false
		},
		// 是否处于底部
		fixBottom: {
			type: Boolean,
			default: false
		},
		// 弹出层内容高度
		bodyHeight: {
			type: Number,
			default: 0
		},
		// 弹出层内容宽度
		bodyWidth: {
			type: Number,
			default: 0
		},
		tabbarHeight: {
			type: Number,
			default: 0
		},
	
	},
	computed: {
		getMaskColor() {
			let color = this.maskColor ? 0.5 : 0;
			return `background-color: rgba(0,0,0,${color}); z-index: 999`;
		},
		getBodyClass() {
			let fixBottom = this.fixBottom ? 'left-0 right-0 bottom-0' : 'rounded';
			return fixBottom;
		},
		// 设置弹窗位置
		getBodyStyle() {
			let left = this.x > -1 ? `left:${this.x}px;` : '';
			let top = this.y > -1 ? `top:${this.y + 10}px;` : '';

			return `${left}${top}`;
		}
	},
	methods: {
		show(x, y) {
			let transformOrigin = '';
			if (x > this.maxX) {
				this.x = x - uni.upx2px(this.bodyWidth);
				this.transformOrigin += 'right';
			} else {
				this.x = x;
				this.transformOrigin += 'left';
			}
			if (y > this.maxY) {
				this.y = y - uni.upx2px(this.bodyHeight) - 10;
				this.transformOrigin += ' bottom';
			} else {
				this.y = y;
				this.transformOrigin += ' top';
			}

			this.status = true;
			this.$nextTick(() => {
				// 菜单动画
				// console.log(this.transformOrigin);
				animation.transition(
					this.$refs.mypopup,
					{
						styles: {
							transform: 'scale(1,1)',
							transformOrigin: `${this.transformOrigin}`,
							opacity: 1
						},
						duration: 300, //ms
						timingFunction: 'ease-in-out',
						needLayout: false,
						delay: 0 //ms
					},
					function () {}
				);
			});
		},
	
		hide() {
			// 菜单动画

			animation.transition(
				this.$refs.mypopup,
				{
					styles: {
						transform: 'scale(0,0)',
						transformOrigin: `${this.transformOrigin}`,
						opacity: 0
					},
					duration: 200, //ms
					timingFunction: 'ease-in',
					needLayout: false,
					delay: 0 //ms
				},
				() => {
					this.status = false;
					this.transformOrigin = '';
				}
			);

			this.$emit('hide');
		}
	}
};
</script>

<style scoped>
.my-animation {
	transform: scale(0, 0);
	opacity: 0;
}
</style>
