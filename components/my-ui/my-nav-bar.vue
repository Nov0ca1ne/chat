<template>
	<view class="">
		<!-- 导航栏 -->
		<view :class="getClass">
			<!-- 状态栏 -->
			<view :style="'height:' + statusBarHeight + 'px'" style="background-color: #ffffff"></view>
			<!-- 导航 -->
			<view class="w-100 flex justify-between align-center" style="height: 150rpx" :style="bgColor">
				<!-- 左侧 -->
				<view class="flex align-center">
					<!-- 返回 -->
					<my-icon-button :fontClass="leftClass" @click="back" v-if="isShowBack" :icon="'\ue679'"></my-icon-button>
					<slot>
						<!-- 用户信息 -->
						<view class="flex align-center ml-2" style="width: 550rpx" v-if="isShowUser">
							<u-avatar :shape="chat_type === 'user' ? 'circle' : 'square'" :src="avatar" @click="navToDetail"></u-avatar>
							<u--text class="pl-2" bold :text="name" lines="1"></u--text>
						</view>
						<!-- 标题 -->
						<view v-if="title" class="mt-3">
							<text class="font-super ml-5 font-weight-bold">{{ title }}</text>
						</view>
					</slot>
				</view>
				<!-- 右侧 -->

				<slot name="right">
					<view v-if="isShowRight" class="flex align-center">
						<!-- 搜索 -->
						<!-- <view
							@click="search"
							hover-class="icon-hover"
							class="flex justify-center align-center rounded-circle"
							style="height: 70rpx; width: 190rpx; background-color: #ececec"
						>
							<text class="iconfont font-lg font-weight-bold">&#xeafe;</text>
							<text class="font-sm text-secondary pl-1">搜一下</text>
						</view> -->
						<!-- 更多 -->
						<my-icon-button fontClass="font-super" @click="openMore" :icon="'\ue62a'"></my-icon-button>
					</view>
				</slot>
			</view>
		</view>
		<!-- 占位 -->
		<view v-if="fixed" class="" :style="fixedStyle" style="background-color: #ffffff"></view>

		<!-- 更多菜单 -->
		<!-- 弹窗气泡 -->
		<my-pop-up ref="more" :body-height="getMenuHeight" :body-width="250">
			<view class="" style="width: 250rpx" :style="getMenuStyle">
				<view
					v-for="(item, index) in more"
					@click="action(item.event, item.url)"
					:key="index"
					class="flex-1 flex-row align-center border-bottom pl-1"
					:class="item.Class"
					hover-class="bg-hover-light"
				>
					<text class="iconfont text-white font-lg pl-2">{{ item.icon }}</text>
					<text class="iconfont text-white font-sm ml-2">{{ item.name }}</text>
				</view>
			</view>
		</my-pop-up>
	</view>
	
</template>

<script>
import MyIconButton from '@/components/my-ui/my-icon-button.vue';
import MyPopUp from '@/components/my-ui/my-pop-up.vue';
export default {
	components: {
		MyIconButton,
		MyPopUp
	},
	props: {
		// 群聊人数
		num: {
			type: Number,
			default: 0
		},
		chat_type: {
			type: String,
			default: 'user'
		},
		avatar: {
			type: String,
			default: ''
		},
		nickname: {
			type: String,
			default: ''
		},
		// 是否显示右边按钮
		isShowRight: {
			type: Boolean,
			default: true
		},
		isShowUser: {
			type: Boolean,
			default: false
		},
		isShowBack: {
			type: Boolean,
			default: false
		},
		title: {
			type: [String, Boolean],
			default: false
		},
		// 是否固定
		fixed: {
			type: Boolean,
			default: true
		},
		//占位
		isCover: {
			type: Boolean,
			default: false
		},
		bgColor: {
			type: String,
			default: ''
		},
		noReadNum: {
			type: Number,
			default: 0
		},
		leftClass: {
			type: String,
			default: ''
		},
		user_id: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			statusBarHeight: 0,
			navBarHeight: 0,
			more: [
				{
					name: '发起群聊',
					event: 'navigateTo',
					Class: '',
					url: '/pages/tabbar/friend/user-detail/send-card/more-friends/more-friends?type=createGroup',
					icon: '\ue618'
				},
				{
					name: '添加好友',
					event: 'navigateTo',
					Class: '',
					url: '/pages/search/search?searchType=user',
					icon: '\ue6ca'
				},
				{
					name: '扫一扫',
					event: 'scanCode',
					Class: '',
					url: '',
					icon: '\ue607'
				}
			]
		};
	},
	computed: {
		name() {
			if (this.chat_type === 'group') return this.nickname + `  (${this.num})`;

			return this.nickname;
		},
		//占位高度
		fixedStyle() {
			return `height:${this.navBarHeight}px`;
		},
		// 获取菜单高度
		getMenuHeight() {
			let height = 75;
			return this.more.length * height;
		},
		//返回菜单高度样式
		getMenuStyle() {
			return `height:${this.getMenuHeight}rpx`;
		},
		getClass() {
			let fixed = this.fixed ? 'fixed-top' : '';
			return `${this.bgColor} ${fixed}`;
		}
	},
	methods: {
		action(event, url) {
			switch (event) {
				case 'navigateTo':
					uni.navigateTo({
						url: url
					});
					break;
				case 'scanCode':
				// uni.navigateTo({
				// 	url:'/pages/scanCode/scanCode'
				// })
					uni.scanCode({
						success: function (res) {
							res.result = JSON.parse(res.result)
							console.log(res.result)
							if (res.result.type === 'user') {
								uni.navigateTo({
									url: '/pages/tabbar/friend/user-detail/user-detail?from=scanCode&user_id=' + res.result.id
								});
							} else if (res.result.type === 'group') {
							uni.navigateTo({
								url: '/pages/joinGroup/joinGroup?id=' + res.result.id
							});
							}
						}
					});
					break;
				default:
					break;
			}
		},
		search() {
			uni.navigateTo({
				url: '/pages/search/search',
				animationType: 'slide-in-top'
			});
		},
		openMore(e) {
			this.$refs.more.show(339, 70);
		},

		back() {
			uni.navigateBack({
				delta: 1
			});
		},
		navToDetail() {
			if (this.chat_type !== 'group') {
				return uni.navigateTo({
					url: `/pages/tabbar/friend/user-detail/user-detail?user_id=${this.user_id}`
				});
			}

			uni.navigateTo({
				url: `/pages/privateChat/chat-set/chat-set?params=${JSON.stringify({
					id: this.user_id,
					chat_type: this.chat_type
				})}`
			});
		}
	},
	created() {
		this.statusBarHeight = plus.navigator.getStatusbarHeight();
		this.navBarHeight = this.isCover ? this.statusBarHeight : this.statusBarHeight + uni.upx2px(150);
	}
};
</script>

<style></style>
