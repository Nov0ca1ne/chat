<script>
import { backstage } from '@/api/chat.js';
export default {
	onLaunch: function () {
		// #ifdef APP-PLUS-NVUE
		const domModule = weex.requireModule('dom');
		domModule.addRule('fontFace', {
			fontFamily: 'iconfont',
			src: "url('/static/iconfont.ttf')"
		});
		// #endif
		console.log('App Launch');
		//注册全局录音器
		this.$store.commit('audio/initRecord');
		// 初始化登录状态
		this.$store.dispatch('user/initLogin');
	},
	onShow: function () {
		backstage({ backstage: false });
		console.log('App Show');
	},
	onHide: function () {
		backstage({ backstage: true });
		console.log('App Hide');
	},
	onUnload:function(){
		console.log('App Unload');
		backstage({ backstage: true }).then().catch(err => {
			console.log(err)
		});
	}
};
</script>

<style lang="scss">
/*每个页面公共css */
@import '@/uni_modules/uview-ui/index.scss';
@import 'common/free.css';
@import 'common/common.css';
/* #ifndef APP-PLUS-NVUE */
@import './static/free-icon.css';
/* #endif */
</style>
