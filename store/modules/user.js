import $U from '@/common/lib/util.js'
import {
	applyList,
} from '@/api/apply.js'
import {
	getFriendList,
} from '@/api/friend.js'
import $C from '@/common/lib/config.js'
import Chat from '@/common/lib/chat.js'
import DB from '@/common/lib/sqLite.js'
export default {
	namespaced: true,
	state: {
		user: null,
		apply: {
			list: [],
			count: 0
		},
		friendList: [], //好友列表
		chat: null,
		chatList: [], //会话列表
		totalNoreadnum: 0, //总未读数
	},
	mutations:{
		// 修改用户信息
		updateUser(state, {k,v}){
			if(state.user){
				state.user[k] = v
				$U.setStorage('user',JSON.stringify(state.user))
			}
		}
	},
	actions: {
		// 登陆后处理
		login({
			state,
			dispatch
		}, user) {
			state.user = user
			// 存储在本地
			$U.setStorage('token', user.token)
			$U.setStorage('user', JSON.stringify(user))
			$U.setStorage('user_id', user.id)
			$U.setStorage('isCurrentChat', false)

			// 连接socket
			state.chat = new Chat({
				url: $C.socketUrl
			})
			
			//打开本地sqlite数据库
			const open = DB.isOpen()
			if(!open){
				DB.openSqlite()
			}
			
			dispatch('getApply')

			dispatch('getChatList')
		},
		// 退出登录
		logout({
			state
		}) {
			state.user = null
			$U.removeStorage('token');
			$U.removeStorage('user');
			$U.removeStorage('user_id');

			// 关闭socket连接
			state.chat.close()
			state.chat = null

			// 跳转到登录页
			uni.reLaunch({
				url: '/pages/login/login'
			})
		},
		// 初始化登录状态
		initLogin({
			state,
			dispatch
		}) {
			let user = $U.getStorage('user')
			if (user) {
				user = JSON.parse(user)
				state.user = user

				// 连接socket
				state.chat = new Chat({
					url: $C.socketUrl
				})
				dispatch('getApply')
				dispatch('getChatList')
				// 打开本地sqlite数据库
				const open = DB.isOpen()
				if (!open) {
					DB.openSqlite()
				}
			}
		},
		// 获取好友申请列表
		getApply({
			state,
			dispatch
		}, page = 1) {
			applyList({
				page
			}).then(res => {

				if (page === 1) {
					state.apply = res
				} else {
					state.apply.list = [...state.apply.list, ...res.list]
					state.apply.count = res.count
				}
				dispatch('updateApplyBadge')
			})
		},

		// 更新角标
		updateApplyBadge({
			state
		}) {
			let count = state.apply.count > 99 ? '99+' : state.apply.count.toString()
			if (state.apply.count > 0) {
				return uni.setTabBarBadge({
					index: 1,
					text: count
				})
			}

			// 移除
			uni.removeTabBarBadge({
				index: 1
			})
		},
		//获取好友列表
		getFriendList({
			state
		}) {
			getFriendList().then(res => {

				state.friendList = res.rows.newList ? res.rows.newList : []
			})
		},
		// 获取会话列表
		getChatList({
			state
		}) {
			state.chatList = state.chat.getChatList()
			console.log(state.chatList)
			uni.$on('onUpdateChatList', (list) => {
				state.chatList = list
			})
		},

		// 初始化总未读数
		updateBadge({
			state
		}) {
			uni.$on('totalNoreadnum', (num) => {
				state.totalNoreadnum = num
			})
			state.chat.updateBadge()
		},
		// 更新用户信息
		updateUser({state}){
			state.chat.updateUser()
		}


	}
}