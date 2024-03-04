<template>
	<view>
		<!-- 时间 -->
		<view v-if="item.isShowTime" class="flex align-center justify-center" :class="!isShowAvatar ? 'pt-2 pb-3' : 'pb-1 pt-2'">
			<text class="font-sm text-light-muted">{{ item.payload.text }}</text>
		</view>

		<!-- 撤回消息 -->
		<view v-if="item.isRemove" ref="isRemove" class="flex align-center justify-center chat-animate" :class="!isShowAvatar ? 'pt-2 pb-3' : 'pb-1 pt-2'">
			<text class="font-sm text-light-muted">{{ isSelf ? '你' : '对方' }}撤回了一条消息</text>
		</view>
		<!-- 系统消息 -->
		<view v-if="item.type === 'system'" ref="isRemove" class="flex align-center justify-center" :class="!isShowAvatar ? 'pt-2 pb-3' : 'pb-1 pt-2'">
			<text class="font-sm text-light-muted">{{ item.data }}</text>
		</view>

		<view v-if="!item.isremove && item.type !== 'system'" class="flex align-start mb-1" :style="!isShowAvatar ? '' : 'margin-top: 30rpx;'" :class="isSelf ? 'justify-end' : ''">
			<!-- 好友头像 -->
			<template v-if="!isSelf">
				<u-avatar @click="toDetail" :class="!isShowAvatar && !item.isShowTime ? 'opacity' : ''" :src="item.from_avatar"></u-avatar>
			</template>

			<view class="flex flex-column">
				<!-- 群聊用户昵称 -->
				<view v-if="!isSelf && item.chat_type === 'group' && isShowAvatar" class="flex ml-3 mb-1" style="max-width: 500rpx">
					<text class="font -sm text-muted">{{ item.from_name }}</text>
				</view>

				<!-- 文字 -->
				<view
					v-if="item.type === 'text'"
					@longpress="onLong"
					@touchend="touchEnd"
					class="rounded-0 pl-3 pt-2 pb-2 pr-3"
					:class="isSelf ? 'bg-primary mr-3' : 'bg-input ml-3'"
					style="max-width: 535rpx"
				>
					<text class="font-md" :class="isSelf ? 'text-white' : ''">{{ item.data }}</text>
				</view>
				<!-- 表情包 or 图片-->
				<view
					v-if="item.type === 'emoji' || item.type === 'image'"
					hover-class="img-hover"
					@touchend="touchEnd"
					@longpress="onLong"
					class="rounded"
					:class="isSelf ? 'mr-3' : 'ml-3'"
					style=""
				>
					<my-image :type="item.type" imageClass="rounded" @click="preview(item.data)" :src="item.data"></my-image>
				</view>

				<!-- 语音 -->
				<view
					v-if="item.type === 'audio'"
					@longpress="onLong"
					@touchend="touchEnd"
					@click="playAudio"
					class="flex justify-center align-center rounded-0 pl-3 pt-2 pb-2 pr-3"
					:class="isSelf ? 'bg-primary mr-3' : 'bg-input ml-3'"
					style=""
					hover-class="img-hover"
				>
					<text class="iconfont" :class="isSelf ? 'text-white' : ''">{{ isAudioPlay ? '&#xe7cb;' : '&#xe7cd;' }}</text>
					<u-line-progress
						class="ml-2"
						:inactiveColor="isSelf ? '#ececec' : '#aaaaaa'"
						:style="percentWidth"
						height="10rpx"
						:showText="false"
						:percentage="currentPercentage"
					/>
					<text class="font ml-2" :class="isSelf ? 'text-white' : ''">{{ JSON.parse(item.options).time }} "</text>
				</view>
				<!-- 视频 -->
				<view
					v-if="item.type === 'video'"
					hover-class="img-hover"
					@longpress="onLong"
					@touchend="touchEnd"
					@click="playVideo()"
					class="rounded position-relative"
					:class="isSelf ? 'mr-3' : 'ml-3'"
					style=""
				>
					<my-image :type="item.type" imageClass="rounded" @load="loadPoster" :src="JSON.parse(item.options).poster"></my-image>
					<text class="iconfont font-super text-white position-absolute" :style="posterStyle">&#xe602;</text>
				</view>

				<!-- 位置 -->
				<view
					v-if="item.type === 'position'"
					@longpress="onLong"
					@click="openLocation(item)"
					@touchend="touchEnd"
					hover-class="text-hover"
					:class="isSelf ? 'mr-3' : 'ml-3'"
					class="bg-input rounded"
					style="width: 480rpx"
				>
					<image
						class="rounded-top"
						:src="`https://restapi.amap.com/v3/staticmap?markers=-1,
				https://a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png,0:${JSON.parse(item.data).longitude},${
							JSON.parse(item.data).latitude
						}&zoom=16&scale=2&size=240*150&key=08f55fd85ca048f63dfd4280a6a269af`"
						style="width: 480rpx; height: 300rpx"
					></image>
					<view class="flex px-2 pt-2 pb-2 flex-column align-center">
						<text class="font-lg font-weight-bold text-ellipsis">{{ JSON.parse(item.data).name }}</text>
						<text class="font-md text-muted text-ellipsis">{{ JSON.parse(item.data).address }}</text>
					</view>
				</view>
				<!-- 名片 -->
				<view
					v-if="item.type === 'card'"
					@longpress="onLong"
					@touchend="touchEnd"
					@click="openCard"
					hover-class="text-hover"
					:class="isSelf ? 'mr-3' : 'ml-3'"
					class="bg-input rounded"
					style="width: 450rpx"
				>
					<view class="flex px-2 pt-2 pb-2 align-center">
						<u-avatar :src="JSON.parse(item.options).avatar"></u-avatar>
						<text class="font-md ml-2 text-ellipsis">{{ item.data }}</text>
					</view>
					<view class="px-2 py-1 border-top">
						<text class="font-sm">个人名片</text>
					</view>
				</view>
			</view>
			<!-- 本人头像 -->
			<template v-if="isSelf">
				<u-avatar :class="!isShowAvatar && !item.isShowTime ? 'opacity' : ''" :src="item.from_avatar"></u-avatar>
			</template>
		</view>

		<!-- 发送状态 -->
		<view v-if="item.send_status && item.send_status !== 'success'" class="flex align-center justify-end" style="margin-right: 117rpx">
			<text class="font-sm" :class="item.send_status === 'fail' ? 'text-danger' : 'text-muted'">{{ item.send_status === 'fail' ? '发送失败' : '发送中' }}</text>
		</view>
	</view>
</template>

<script>
import $T from '@/common/lib/time.js';
import MyImage from '@/components/my-ui/my-image.vue';
import { mapState, mapActions } from 'vuex';
const animation = weex.requireModule('animation');

export default {
	components: {
		MyImage
	},
	data() {
		return {
			innerAudioContext: null,
			isAudioPlay: false, //是否播放
			currentPercentage: 0, //当前进度
			x: 0,
			y: 0,
			poster: {
				width: 100,
				height: 100
			},
			isLongPress: false
		};
	},
	props: {
		item: {
			type: Object,
			default: {}
		},
		index: {
			type: Number,
			default: -1
		},
		// 如果重复就不显示头像
		isShowAvatar: {
			type: Boolean,
			default: true
		},
		// 上一条消息时间
		preTime: {
			type: [String, Number],
			default: 0
		}
	},
	// 离开页面销毁音频
	beforeDestroy() {
		// 注销事件
		if (this.item.type === 'audio') {
			this.audioOff(this.onPlayAudio);
		}

		if (this.innerAudioContext) {
			this.innerAudioContext.destroy();
			this.innerAudioContext = null;
		}
	},
	mounted() {
		// 注册全局事件onPlayAudio
		if (this.item.type === 'audio') {
			this.audioOn(this.onPlayAudio);
		}
	},
	methods: {
		...mapActions('audio', ['audioOn', 'audioEmit', 'audioOff']),
		// 打开名片
		openCard(){
			uni.navigateTo({
				url: '/pages/tabbar/friend/user-detail/user-detail?from=card&user_id=' + JSON.parse(this.item.options).id
			});
		},
		touchEnd() {
			setTimeout(() => {
				this.isLongPress = false;
			}, 300);
		},
		toDetail() {
			uni.navigateTo({
				url: `/pages/tabbar/friend/user-detail/user-detail?user_id=${this.item.from_id}`
			});
		},
		// 播放音频
		playAudio() {
			if (this.isLongPress) return;
			this.isAudioPlay = !this.isAudioPlay;
			this.audioEmit(this.index);
			//初始化音频
			if (!this.innerAudioContext && this.isAudioPlay) {
				console.log('第一次播放');
				this.innerAudioContext = uni.createInnerAudioContext();
				this.innerAudioContext.src = this.item.data;
				this.innerAudioContext.play();
				this.playProgress();
				return;
			}

			// 暂停重新播放
			if (this.innerAudioContext && this.isAudioPlay) {
				console.log('重新播放');
				this.innerAudioContext.play();
			}

			// 暂停音频
			if (this.innerAudioContext && !this.isAudioPlay) {
				console.log('暂停');
				this.isAudioPlay = false;
				this.innerAudioContext.pause();
			}
		},

		onLong(e) {
			this.isLongPress = true;
			let x = 0;
			let y = 0;
			if (Array.isArray(e.changedTouches) && e.changedTouches.length > 0) {
				x = e.changedTouches[0].screenX;
				y = e.changedTouches[0].screenY;
			}

			this.$emit('longpress', { x, y, index: this.index });
		},
		// 预览图片
		preview(url) {
			if (this.isLongPress) return;
			this.$emit('preview', url);
		},
		// 播放进度
		playProgress() {
			this.innerAudioContext.onTimeUpdate(() => {
				this.x = this.innerAudioContext.currentTime;

				this.currentPercentage = (this.x / this.y) * 100;
				this.currentPercentage = Math.floor(this.currentPercentage);
			}),
				this.innerAudioContext.onCanplay(() => {
					this.y = this.innerAudioContext.duration;
				});
			this.innerAudioContext.onEnded(() => {
				console.log('播放完毕');
				this.isAudioPlay = false;
				this.currentPercentage = 0;
			});
		},
		//播放音频全局事件
		onPlayAudio(index) {
			if (this.innerAudioContext) {
				// 如果执行的index不是自己的index 暂停播放
				if (this.index !== index) {
					this.innerAudioContext.stop();
					this.isAudioPlay = false;
					this.currentPercentage = 0;
				}
			}
		},
		// 预览视频
		playVideo() {
			if (this.isLongPress) return;
			uni.navigateTo({
				url: '/pages/privateChat/video/video?url=' + encodeURIComponent(this.item.data)
			});
		},
		//获取图片宽高
		loadPoster({ width, height }) {
			this.poster.height = height;
			this.poster.width = width;
		},
		//打开地图
		openLocation(item) {
			if (this.isLongPress) return;

			uni.openLocation({
				latitude: JSON.parse(item.data).latitude,
				longitude: JSON.parse(item.data).longitude,
				name: JSON.parse(item.data).name,
				success: () => {}
			});
		}
	},
	watch: {
		'item.isRemove': {
			handler(newVal, oldVal) {
				if (newVal) {
					this.$nextTick(() => {
						animation.transition(
							this.$refs.isRemove,
							{
								styles: {
									transform: 'scale(1,1)',
									opacity: 1
								},
								duration: 300, //ms
								timingFunction: 'ease'
							},
							function () {}
						);
					});
				}
			}
		}
	},
	computed: {
		...mapState('audio', ['sum']),
		...mapState({
			user: (state) => state.user.user
		}),
		//是否是本人
		isSelf() {
			const id = this.user.id ? this.user.id : 0;
			return this.item.from_id === id;
		},
		//时间格式化
		// formatTime() {

		// 	return $T.getChatTime(this.preTime,this.item.create_time)
		// },
		// 进度条长度
		percentWidth() {
			if (this.item.type === 'audio') {
				const time = this.item.options.time || 0;
				let width = time * (245 / 60);
				width = width < 50 ? 50 : width;
				return `width:${width}rpx`;
			}
		},
		//视频封面图标位置
		posterStyle() {
			const left = this.poster.width / 2 - uni.upx2px(25);
			const top = this.poster.height / 2 - uni.upx2px(25);
			return `left:${left};top:${top}`;
		}
	}
};
</script>

<style scoped>
.chat-animate {
	transform: scale(0.5, 0.5);
	opacity: 0;
}
</style>
