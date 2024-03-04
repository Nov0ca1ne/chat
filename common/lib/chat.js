import $U from "./util.js";
import $H from './request.js';
import DB from '@/common/lib/sqLite.js'
import $T from '@/common/lib/time.js';
import $store from '@/store/index.js'
import {
	sendMessage,
	getOfflineMessage,
	backstage,
	upload
} from '../../api/chat.js'

class chat {
	constructor(arg) {
		this.url = arg.url
		this.isOnline = false
		this.socket = null
		// 获取当前用户相关信息
		let user = $U.getStorage('user');
		this.user = user ? JSON.parse(user) : {},
			// 初始化聊天对象
			this.TO = false;
		// 连接和监听
		if (this.user.token) {
			this.connectSocket()
		}
	}
	// 连接socket
	connectSocket() {

		this.socket = uni.connectSocket({
			url: this.url + '?token=' + this.user.token,
			complete: () => {}
		})
		// 监听连接成功
		this.socket.onOpen(() => this.onOpen())
		// 监听接收信息
		this.socket.onMessage((res) => this.onMessage(res))
		// 监听断开
		this.socket.onClose(() => this.onClose())
		// 监听错误
		this.socket.onError(() => this.onError())
	}
	// 监听打开
	onOpen() {
		// 用户状态上线
		this.isOnline = true;
		console.log('socket连接成功');

		// 获取用户离线消息
		getOfflineMessage()
	}
	// 监听关闭
	onClose() {
		// 用户下线
		this.isOnline = false;
		this.socket = null;


		console.log('socket连接关闭');
	}
	// 监听消息
	onMessage(data) {
		let res = JSON.parse(data.data)
		console.log('监听消息', res);
		switch (res.msg) {
			case 'fail':
				// 用户下线
				this.isOnline = false;
				this.socket = null;
				// 账号在其他地方登录
				uni.showModal({
					title: res.data,
					showCancel: false,
					success: (res) => {
						if (res.confirm) {
							$U.removeStorage('token');
							$U.removeStorage('user');
							$U.removeStorage('user_id');
							// 跳转到登录页
							uni.reLaunch({
								url: '/pages/login/login'
							})
						}
					}
				})
				break;
			case 'offline_message': //离线消息
				this.handleOfflineMessage(res.data)
				break;
			case 'updateApplyList': //新好友申请
				$store.dispatch('user/getApply')
				break;
			default:
				this.handleOnMessage(res.data)
				break;
		}


	}
	// 监听连接错误
	onError() {
		// 用户下线
		this.isOnline = false;
		this.socket = null;
		console.log('socket连接错误');
	}
	// 关闭连接
	close() {
		if (this.socket) {
			this.socket.close()

		}
	}

	async handleOfflineMessage(message) {
		// 因为是接收者,所以都是to_id
		const id = message.to_id
		const table = `chat_${this.user.id}_${message.chat_type}_${id}`
		// message.options = JSON.stringify(message.options)
		// 通过message_id来查询该消息是否存在
		const message_id = message.message_id
		const sql = `SELECT * FROM ${table} WHERE message_id = '${message_id}'`
		try {
			const data = await DB.selectSql(sql)
		} catch (err) {
			// 如果没查到
			console.log(err)
			this.handleOnMessage(message)

		}


	}
	// 查询当前聊天对象
	getChatObject() {
		return this.TO
	}
	// 创建聊天对象
	createChatObject(detail) {
		this.TO = detail;

	}
	// 销毁聊天对象
	destoryChatObject() {
		this.TO = false
	}

	//接收消息
	async handleOnMessage(message, isSend = false) {
		message.send_status = 'success'
		if (message.from_id === this.user.id) {
			isSend = true
		}
		// 添加消息历史记录
		await this.addChatHistory(message, isSend)


		this.updateChatList(message, isSend)
		// 全局通知
		uni.$emit('onMessage', message)
	}
	// 组织发送信息格式
	formatSendData(params) {
		return {
			message_id: 0, // 唯一id，后端生成，用于撤回指定消息
			from_avatar: this.user.avatar, // 发送者头像
			from_name: this.user.nickname || this.user.username, // 发送者昵称
			from_id: this.user.id, // 发送者id
			to_id: params.to_id || this.TO.id, // 接收人/群 id
			to_name: params.to_name || this.TO.name, // 接收人/群 名称
			to_avatar: params.to_avatar || this.TO.avatar, // 接收人/群 头像
			chat_type: params.chat_type || this.TO.chat_type, // 接收类型
			type: params.type, // 消息类型
			data: params.data, // 消息内容
			options: JSON.stringify(params.options) || '{}', // 其他参数
			create_time: (new Date()).getTime() / 1000, // 创建时间
			isremove: 0, // 是否撤回
			send_status: params.send_status ? params.send_status : "pending" // 发送状态，success发送成功,fail发送失败,pending发送中
		}
	}

	checkOnline() {
		if (!this.isOnline) {
			this.reconnectConfirm()
			return false
		}
		return true
	}

	reconnectConfirm() {
		this.reconnectTime = 0
		uni.showModal({
			content: '你已断线，是否重新连接？',
			confirmText: '重新连接',
			success: (res) => {
				if (res.confirm) {
					this.connectSocket()
				}
				if (res.cancel) {
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
				}
			},


		})
	}


	// 发送信息
	async send(message, onProgress = false) {
		try {

			if (!this.checkOnline()) throw '未上线'
			// 上传文件
			let isUpload = (message.type !== 'text' && message.type !== 'emoji' && message.type !== 'card' &&
				message.type !== 'position' && !message.data.startsWith('http'))
			let uploadResult = ''
			if (isUpload) {
				uploadResult = await upload({
					filePath: message.data
				}, onProgress)
			}
			// 提交到后端
			let data = isUpload ? uploadResult.url : message.data
			message.data = data
			// 视频封面
			if (message.type === 'video') {

				message.options = JSON.parse(message.options)
				message.options = JSON.parse(message.options)
				console.log(typeof message.options)
				message.options.poster = uploadResult.cover
				message.options = JSON.stringify(message.options)
			}
			// message.options = JSON.stringify(message.options)
			console.log('发送成功', message.options)
			const res = await sendMessage({
				to_id: this.TO.id,
				type: message.type,
				chat_type: this.TO.chat_type,
				data: message.data,
				options: message.options,
			})
			// 发送成功
			message.message_id = res.message_id
			message.send_status = 'success'

			// 添加消息历史记录
			await this.addChatHistory(message)

			// 更新会话列表
			this.updateChatList(message)
			return res
		} catch (err) {
			console.log('发送失败', err)
			// 发送失败
			message.send_status = 'fail'


			// 添加消息历史记录
			await this.addChatHistory(message)
			// 断线重连
			throw err
		}


	}
	// 添加消息历史记录
	async addChatHistory(message, isSend = true) {
		// 如果是发送者 接收id就是to_id 否则就是from_id(对方id)
		const id = message.chat_type === 'user' ? (isSend ? message.to_id : message.from_id) : message.to_id
		const table = `chat_${this.user.id}_${message.chat_type}_${id}`
		message.options = JSON.stringify(message.options)
		const {column,values} = this.createInsertData(message)
		await this.createTable(table)
		const sql = `INSERT INTO ${table} (${column}) VALUES(${values})`
		await DB.executeSql(sql)
	}
	// 生成插入数据
	createInsertData(message) {
		const column =
			'message_id,from_avatar,from_name,from_id,to_id,to_name,to_avatar,chat_type,type,data,options,create_time,isremove,send_status'
		const values =
			`'${message.message_id}','${message.from_avatar}','${message.from_name}','${message.from_id}','${message.to_id}','${message.to_name}','${message.to_avatar}','${message.chat_type}','${message.type}','${message.data}','${message.options}','${message.create_time}','${message.isremove}','${message.send_status}'`
		return {
			column,
			values
		}

	}


	// 创建表结构
	async createTable(table) {
		const open = DB.isOpen()
		if (open) {
			const sql =
				`"id" INTEGER PRIMARY KEY AUTOINCREMENT,"message_id" INTEGER,"from_avatar" text,"from_name" text,"from_id" INTEGER,"to_id" INTEGER,"to_name" text,"to_avatar" text,"chat_type" text,"type" text,"data" text,"options" text,"create_time" INTEGER,"isremove" INTEGER,"send_status" text`
			try {
				//创建表DB.createTable(表名，列)
				await DB.createTable(table, sql)
			} catch (error) {
				throw error
			}
		} else {
			console.log('sqlite未打开')
		}
	}


	getChatListItem(id, chat_type) {
		// 获取所有会话列表
		let list = this.getChatList()
		// 找到当前会话
		let index = list.findIndex(item => item.id === id && item.chat_type === chat_type)
		if (index !== -1) {
			return list[index]
		}
		return false
	}


	setStorage(key, value) {
		return $U.setStorage(key, JSON.stringify(value))
	}
	// 获取本地存储会话列表
	getChatList() {
		let key = `chatlist_${this.user.id}`
		return this.getStorage(key)
	}
	getChatListKey() {
		return `chatlist_${this.user.id}`
	}
	getStorage(key) {
		let list = $U.getStorage(key)
		return list ? JSON.parse(list) : []
	}

	getChatListKey(params = {}) {
		let {
			table = '', page = 1, pageSize = 15
		} = params
		table = table ? table : `chat_${this.user.id}_${this.TO.chat_type}_${this.TO.id}`
		const offset = (page - 1) * pageSize

	}


	// 格式化会话最后一条消息展示
	formatChatItemData(message, isSend) {
		let data = message.data
		switch (message.type) {
			case 'emoji':
				data = '[动画表情]'
				break;
			case 'image':
				data = '[图片]'
				break;
			case 'audio':
				data = '[语音]'
				break;
			case 'video':
				data = '[视频]'
				break;
			case 'card':
				data = '[个人名片] ' + message.data
				break;
			case 'position':
				data = '[位置]'
				break;
		}
		data = isSend || message.chat_type === 'user' || message.type === 'system' ? data :
			`${message.from_name}: ${data}`
		return data
	}


	// 更新会话列表
	updateChatList(message, isSend = true) {
		let list = this.getChatList()
		// 是否处于当前聊天中
		let isCurrentChat = $U.getStorage('isCurrentChat') || false

		// 接收人/群 id 头像 昵称
		let id = 0
		let avatar = ''
		let name = ''
		// 判断私聊还是群聊  会话id是对方id
		if (message.chat_type === 'user') {
			id = isSend ? message.to_id : message.from_id
			avatar = isSend ? message.to_avatar : message.from_avatar
			name = isSend ? message.to_name : message.from_name

		} else {
			id = message.to_id
			avatar = message.to_avatar
			name = message.to_name

		}
		if (isCurrentChat) {
			isCurrentChat = isCurrentChat.id === id && isCurrentChat.chat_type === message.chat_type ? true : false
		}
		// 会话是否存在
		let index = list.findIndex(item => {
			return item.chat_type === message.chat_type && item.id === id
		})
		// 最后一条消息展现形式
		let data = this.formatChatItemData(message, isSend)
		// 未读数是否 +1
		let noreadnum = isCurrentChat ? 0 : 1;

		// 会话不存在 创建会话
		if (index === -1) {
			let chatItem = {
				id, // 接收人/群 id
				chat_type: message.chat_type, // 接收类型 user 单聊 group群聊
				name, // 接收人/群 昵称
				avatar, // 接收人/群 头像
				update_time: (new Date()).getTime() / 1000, // 最后发送的时间
				data, // 最后一条消息的内容
				type: message.type,
				noreadnum, // 未读数
				istop: false, // 是否置顶
				shownickname: 0, // 是否显示昵称
				nowarn: 0, // 是否免打扰
			}
			// 单聊
			if (message.chat_type === 'user') {
				const avatarList = [{
						user_id: message.from_id,
						avatar: message.from_avatar
					},
					{
						user_id: message.to_id,
						avatar: message.to_avatar
					},
				]
				chatItem.avatarList = avatarList
			}
			// 群聊
			if (message.chat_type === 'group' && message.group) {
				chatItem.shownickname = true
				chatItem.name = name
				chatItem = {
					...chatItem,
					user_id: message.group.user_id, // 管理员id
					remark: '', // 群公告
					invite_confirm: 1 // 邀请确认
				}
			}
			list.unshift(chatItem)
		} else {
			// 存在，更新会话
			// 拿到当前会话
			let item = list[index]
			// 更新改会话最后一条消息时间，内容，类型
			item.update_time = (new Date()).getTime() / 1000;
			item.name = name
			item.data = data;
			item.avatar = avatar
			item.type = message.type;
			// 未读数更新
			item.noreadnum += noreadnum
			// 置顶会话
			list = this.listToFirst(list, index);
		}
		// 存储
		let key = `chatlist_${this.user.id}`;
		this.setStorage(key, list);
		// 更新未读数
		this.updateBadge()
		// 更新vuex中的聊天会话列表
		uni.$emit('onUpdateChatList', list);
		return list;
	}
	// 更新指定会话
	async updateChatItem(where, data) {
		// 获取所有会话列表
		let list = this.getChatList()
		// 找到当前会话
		let index = list.findIndex(item => item.id === where.id && item.chat_type === where.chat_type)
		if (index === -1) return;
		// 更新数据
		if (typeof data === 'function') {
			list[index] = data(list[index])
		} else {
			list[index] = data
		}
		let key = `chatlist_${this.user.id}`
		this.setStorage(key, list)

		// 更新会话列表状态
		uni.$emit('onUpdateChatList', list)
	}
	// 删除指定会话
	async removeChatItem(id, chat_type) {
		try {
			// 获取所有会话列表
			let list = this.getChatList()

			// 找到当前会话
			let index = list.findIndex(item => item.id === id && item.chat_type === chat_type)

			if (index === -1) return;

			list.splice(index, 1)
			let key = `chatlist_${this.user.id}`
			// 删除当前聊天记录表
			this.deleteChatTable(id, chat_type)
			this.setStorage(key, list)
			// 重新获取未读数
			this.updateBadge()

			// 更新会话列表状态
			uni.$emit('onUpdateChatList', list)
		} catch (err) {
			console.log(err)
		}




	}
	// 获取聊天记录
	async getChatHistory(params = {}) {
		try {
			let {
				table = '', page = 1, pageSize = 15
			} = params
			table = table ? table : `chat_${this.user.id}_${this.TO.chat_type}_${this.TO.id}`
			const offset = (page - 1) * pageSize
			// 查询最新的100条
			const sql = `SELECT * from ${table} ORDER BY create_time DESC LIMIT ${pageSize} OFFSET ${offset}`

			const data = await DB.selectSql(sql)


			return this.msgTimeFormat1(data)
		} catch (err) {
			return []
		}


	}

	msgTimeFormat1(list) {

		return $T.msgTimeFormat(list.reverse(), 0, 0).reverse()
	}


	// 更新未读数
	async updateBadge(list = false) {
		// 获取所有会话列表
		list = list ? list : this.getChatList()
		let total = 0

		list.forEach(item => {
			total += item.noreadnum
		})
		// 设置导航栏未读数
		if (total > 0) {
			uni.setTabBarBadge({
				index: 0,
				text: total <= 99 ? total.toString() : '99+'
			})
		} else {
			uni.removeTabBarBadge({
				index: 0
			})
		}

		uni.$emit('totalNoreadnum', total)
	}

	// 读取会话
	async readChatItem(id, chat_type) {
		// 获取所有会话列表
		let list = this.getChatList()
		// 找到当前会话
		let index = list.findIndex(item => item.id === id && item.chat_type === chat_type)
		if (index !== -1) {
			list[index].noreadnum = 0
			let key = `chatlist_${this.user.id}`
			this.setStorage(key, list)
			// 重新获取总未读数
			this.updateBadge()
			// 更新会话列表状态
			uni.$emit('onUpdateChatList', list)
		}

	}
	// 删除聊天记录表
	async deleteChatTable(id, chat_type) {

		const table = `chat_${this.user.id}_${chat_type}_${id}`
		await DB.dropTable(table)
		// 获取所有会话列表
		let list = this.getChatList()

		// 找到当前会话
		let index = list.findIndex(item => item.id === id && item.chat_type === chat_type)

		if (index === -1) return;

		list[index].data = ''
		let key = `chatlist_${this.user.id}`
		this.setStorage(key, list)
		// 更新会话列表状态
		uni.$emit('onUpdateChatList', list)
	}

	async deleteChatMessage(message, isSend = true) {
		// 如果是发送者 接收id就是to_id 否则就是from_id(对方id)
		const id = message.chat_type === 'user' ? (isSend ? message.to_id : message.from_id) : message.to_id
		const table = `chat_${this.user.id}_${message.chat_type}_${id}`
		await this.createTable(table);
		const sql = `DELETE FROM ${table} WHERE message_id = '${message.message_id}'`

		await DB.executeSql(sql)
	}

	// 数组置顶
	listToFirst(arr, index) {
		if (index != 0) {
			arr.unshift(arr.splice(index, 1)[0])
		}
		return arr
	}
	// 更新用户信息
	updateUser() {
		// 获取当前用户相关信息
		let user = $U.getStorage('user')
		this.user = user ? JSON.parse(user) : {}
	}
}

export default chat