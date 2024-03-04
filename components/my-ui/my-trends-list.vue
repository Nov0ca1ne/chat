<template>
	<view>
		<!-- 动态列表 -->
		<view class="p-4 flex flex-column bg-white" style="">
			<view class="flex justify-between" style="width: 690rpx">
				<!-- 头像 昵称 -->
				<view class="flex">
					<u-avatar :src="item.avatar"></u-avatar>
					<view class="flex flex-column">
						<u--text class="pl-2" bold :text="item.username" lines="1"></u--text>
						<u--text class="pl-2" color="#A9A5A0" :text="item.create_time | formatTime" lines="1"></u--text>
					</view>
				</view>
				<!-- 操作 -->
				<view class="mr-2" hover-class="icon-hover">
					<text @touchend="openMore" class="iconfont">&#xe684;</text>
				</view>
			</view>
			<!-- 内容 -->
			<view class="flex flex-column mt-4" style="width: 690rpx">
				<!-- 文字 -->
				<u--text :text="item.content"></u--text>
				<!-- 图片 -->
				<view v-if="item.image.length" class="flex mt-3 flex-wrap">
					<!-- 单图 -->
					<my-image
						v-if="item.image.length === 1"
						v-for="(image, imageIndex) in item.image"
						:key="imageIndex"
						@click="preview(image.src)"
						:src="image.src"
						imageClass="rounded"
						:maxH="350"
						:maxW="670"
					></my-image>

					<!-- 多图 -->
					<image
						v-if="item.image.length > 1"
						v-for="(image, imageIndex) in item.image"
						:key="imageIndex"
						@click="preview(image.src)"
						class="mr-1 my-1 rounded"
						style="width: 215rpx; height: 215rpx"
						:src="image.src"
						mode="aspectFill"
					></image>
				</view>
				<!-- 视频 -->
				<view v-if="item.video" hover-class="img-hover" @click="openVideo" class="mt-3 rounded position-relative" style="">
					<my-image @load="loadPoster" :maxH="350" :maxW="670" imageClass="rounded" :src="item.video.poster"></my-image>
					<text class="iconfont font-super text-white position-absolute" :style="posterIconStyle">&#xe602;</text>
				</view>
			</view>
			<!-- 点赞 -->
			<view class="flex mt-2 align-center">
				<text class="iconfont text-danger font-super">&#xe6a4;</text>
				<u-avatar-group class="ml-2" :urls="avatarUrls" size="30" gap="0.4"></u-avatar-group>
			</view>

			<!-- 评论 -->
			<view class="mt-2" v-if="item.comments.length">
				<block v-for="(comment, ci) in item.comments" :key="ci" class="flex mt-1">
					<text class="font text-hover-primary">{{ comment.username }}:</text>
					<text class="ml-2 font text-dark" style="width: 600rpx">{{ comment.content }}</text>
				</block>
			</view>
		</view>

		<!-- 弹窗气泡 -->
		<my-pop-up ref="action" tabbar-height="150" body-height="100" body-width="200">
			<view class="flex flex-wrap" style="width: 200rpx; height: 100rpx">
				<view
					v-for="(item, index) in menu"
					@click="click(item.event)"
					:key="index"
					class="flex flex-column align-center justify-center"
					:class="item.Class"
					hover-class="text-hover"
					style="width: 100rpx; height: 100rpx"
				>
					<text class="iconfont text-white">{{ item.icon }}</text>
					<text class="font-sm text-white mt-1">{{ item.name }}</text>
				</view>
			</view>
		</my-pop-up>
	</view>
</template>

<script>
import MyImage from '@/components/my-ui/my-image.vue';
import mixin from '@/common/mixin/base.js';
import MyPopUp from '@/components/my-ui/my-pop-up.vue';
export default {
	components: {
		MyImage,
		MyPopUp
	},
	mixins: [mixin],
	data() {
		return {
			poster: {
				w: 100,
				h: 100
			},
			menu: [
				{
					name: '点赞',
					event: 'like',
					icon: '\ue653'
				},
				{
					name: '评论',
					event: 'comment',
					icon: '\ue836'
				}
			]
		};
	},
	mounted() {},
	props: {
		item: {
			type: Object,
			default: () => {}
		},
		index: {
			type: Number,
			default: 0
		}
	},
	computed: {
		urls() {
			return this.item.image.map((item) => item.src);
		},
		avatarUrls() {
			return this.item.like.map((item) => item.avatar);
		},
		//视频封面图标位置
		posterIconStyle() {
			const left = this.poster.w / 2 - uni.upx2px(25);
			const top = this.poster.h / 2 - uni.upx2px(25);
			return `left:${left};top:${top}`;
		}
	},
	methods: {
		// 加载封面
		loadPoster(e) {
			this.poster.h = e.height;
			this.poster.w = e.width;
		},
		preview(url) {
			uni.previewImage({
				current: url,
				urls: this.urls
			});
		},
		openVideo() {
			uni.navigateTo({
				url: '/pages/privateChat/video/video?url=' + this.item.video.src
			});
		},
		openMore(e) {
			
			const x = e.changedTouches[0].screenX;
			const y = e.changedTouches[0].screenY;

			this.$refs.action.show(x, y);
		},
		// 菜单事件
		click(event) {
			let item = this.item
			let index = this.index
			this.$emit('action',{item,index,event})
		
		}
	}
};
</script>

<style></style>
