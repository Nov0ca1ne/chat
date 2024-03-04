<template>
	<view class="">
		<!-- 导航栏 -->
		<view class="fixed-top" :style="navBarStyle">
			<!-- 状态栏 -->
			<view :style="'height:' + statusBarHeight + 'px'"></view>
			<!-- 导航 -->
			<view class="w-100 flex justify-center position-relative align-center" style="height: 150rpx">
				<u-avatar ref="avatar" class="animate-avatar" src="/static/images/2.jpg"></u-avatar>
				<text @click="$emit('clickAdd')" :class="changeOpacity == 1? '':'text-white'" class="iconfont font-super position-absolute" style="right: 40rpx;">&#xe6d9;</text>
			</view>
		
		</view>
	</view>
</template>

<script>
import MyIconButton from '@/components/my-ui/my-icon-button.vue';
const animation = weex.requireModule('animation');
export default {
	components: {
		MyIconButton
	},
	props: {
		// 是否固定
		fixed: {
			type: Boolean,
			default: true
		},

		scrollTop: {
			type: Number,
			default: 0
		}
	},
	data() {
		return {
			statusBarHeight: 0,
			navBarHeight: 0
			// border: false
		};
	},
	computed: {
		changeOpacity() {
			let start = uni.upx2px(140);
			let end = uni.upx2px(200);
			let H = end - start;
			let opacity = 0;
			if (this.scrollTop > start) {
				opacity = (this.scrollTop - start) / H;
			}
			if (opacity >= 1) {
				// this.border = true
				this.$nextTick(() => {
					animation.transition(
						this.$refs.avatar,
						{
							styles: {
								transform: 'translateY(0rpx)'
							},

							duration: 300, //ms
							timingFunction: 'ease-out'
						},
						() => {}
					);
				});
			} else {
				// this.border = false
				animation.transition(
					this.$refs.avatar,
					{
						styles: {
							transform: 'translateY(120rpx)'
						},

						duration: 300, //ms
						timingFunction: 'ease-in'
					},
					() => {}
				);
			}
			return opacity > 1 ? 1 : opacity;
		},
		navBarStyle() {
			return `background-color: rgba(255,255,255,${this.changeOpacity})`;
		}
	},
	methods: {
		back() {
			uni.navigateBack({
				delta: 1
			});
		},
		navToDetail() {
			uni.navigateTo({
				url: this.detailUrl
			});
		}
	},
	created() {
		this.statusBarHeight = plus.navigator.getStatusbarHeight();
		this.navBarHeight = this.isCover ? this.statusBarHeight : this.statusBarHeight + uni.upx2px(150);
	}
};
</script>

<style scoped>
.animate-avatar {
	transform: translateY(120rpx);
}
</style>
