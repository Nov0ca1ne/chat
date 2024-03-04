<template>
	<view>
		<view @click="$emit('click')" :hover-class="!noHover ? 'message-hover' : ''" class="bg-white border-bottom flex mx-4 px-3 pt-3 pb-3 justify-between" :class="itemClass">
			<view class="flex align-center">
				<text class="" :class="{ 'text-danger': isDanger }">{{ text }}</text>

				<view class="flex">
					<slot></slot>
				</view>
			</view>

			<slot name="right">
				<view class="flex align-center">
					<text v-if="extra" style="width: 300rpx;" class="text-right font text-muted text-ellipsis">{{ extra }}</text>
					<text v-if="extraIcon" class="iconfont text-muted font-lg ">{{ extraIcon }}</text>
					<text v-if="isShowRight" :style="iconStyle" class="iconfont text-muted">{{ icon }}</text>
				</view>
			</slot>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		icon: {
			type: String,
			default: '\ue6a3'
		},
		extraIcon: {
			type: String,
			default: ''
		},
		isDanger: {
			type: Boolean,
			default: false
		},
		text: {
			type: String,
			default: ''
		},
		extra: {
			type: String,
			default: ''
		},
		value: {
			type: Boolean,
			default: false
		},
		isShowRight: {
			type: Boolean,
			default: false
		},
		noHover: {
			type: Boolean,
			default: false
		},
		//是否是第一个元素
		isTopItem: {
			type: Boolean,
			default: false
		},
		isSingleItem: {
			type: Boolean,
			default: false
		},
		//是否是最后一个元素
		isBottomItem: {
			type: Boolean,
			default: false
		},
		iconColor: {
			type: String,
			default: ''
		}
	},
	data() {
		return {};
	},
	methods: {},
	computed: {
		itemClass() {
			if (this.isTopItem && !this.isBottomItem) {
				return 'rounded-top';
			}
			if (this.isBottomItem && !this.isTopItem) {
				return 'rounded-bottom';
			}
			if (this.isBottomItem && this.isTopItem) {
				return 'rounded';
			}
			if (this.isSingleItem) {
				return 'rounded';
			}
		},
		iconStyle() {
			return `color:${this.iconColor}`;
		}
	}
};
</script>

<style></style>
