<template>
	<view
		:class="item.istop ? 'bg-top border-bottom-light' : ''"
		hover-class="message-hover"
		class="flex align-center rounded ml-2 mr-2"
		style="height: 150rpx"
		@click="onClick"
		@longpress="onLong"
	>
		<!-- 头像 -->
		<view class="flex align-center justify-center ml-2" style="width: 120rpx; height: 120rpx">
			<u-avatar :shape="item.chat_type === 'user' ? 'circle' : 'square'" :src="item.avatar" size="50"></u-avatar>
		</view>
		<!-- 信息 -->
		<view class="flex flex-column flex-1 py-3 pr-1 pl-2 mr-2" style="">
			<!-- 昵称 时间 -->
			<view class="flex align-center justify-between">
				<text class="font-md text-ellipsis font-weight-bold" style="width: 340rpx;">{{ item.name }}</text>
				<text class="font-sm text-light-muted">{{ item.update_time | formatTime }}</text>
			</view>
			<!-- 消息 徽标 -->
			<view class="flex align-center justify-between" style="">
				<text class="font text-ellipsis text-light-muted mt-2" style="width: 440rpx">{{ item.data }}</text>
				<!-- 免打扰 -->
				<text v-if="item.nowarn" class="iconfont text-ellipsis text-light-muted">&#xe83c;</text>
				<u-badge :bg-color="item.nowarn? '#bababa':'#eb2f22'" max="99" :value="item.noreadnum"></u-badge>
			</view>
		
		</view>
	</view>
</template>

<script>
import mixin from '@/common/mixin/base.js';
import { mapState } from 'vuex';
export default {
	mixins: [mixin],
	data() {
		return {};
	},
	props: {
		item: Object,
		index: Number
	},
	computed: {
		...mapState({
			chat: (state) => state.user.chat
		})
	},
	methods: {
		onClick() {
			uni.navigateTo({
				url: `/pages/privateChat/privateChat?params=${encodeURIComponent(
					JSON.stringify({
						id: this.item.id,
						name: this.item.name,
						avatar: this.item.avatar,
						chat_type: this.item.chat_type
					})
				)}`
			});

			// 已读
			this.chat.readChatItem(this.item.id, this.item.chat_type);
		},
		onLong(e) {
			let x = 0;
			let y = 0;
			if (Array.isArray(e.changedTouches) && e.changedTouches.length > 0) {
				x = e.changedTouches[0].screenX;
				y = e.changedTouches[0].screenY;
			}

			this.$emit('longpress', { x, y, index: this.index });
		}
	}
};
</script>

<style></style>
