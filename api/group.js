import $H from '@/common/lib/request.js'
import $C from '@/common/lib/config.js'
// 创建群聊
export function createGroup(data) {
	return $H.post('/group/create', data, {
		token: true
	})
}

//获取群聊列表
export function getGroupList() {
	return $H.get('/group/get_list', {}, {
		token: true
	})
}
// 获取群聊人数
export function getGroupNum(id) {
	return $H.get(`/group/get_num/${id}`, {}, {
		token: true
	})
}

//修改群名称
export function rename(data) {
	return $H.post(`/group/rename`, data, {
		token: true
	})
}

//修改在群聊的昵称
export function updateNickname(data) {
	return $H.post(`/group/update_nickname`, data, {
		token: true
	})
}
// 获取群聊信息
export function getGroupInfo(id) {
	return $H.get(`/group/get_info/${id}`, {}, {
		token: true
	})
}

// 获取群聊信息（扫码）
export function getGroupInfoByCode(id) {
	return $H.get(`/group/get_info_code/${id}`, {}, {
		token: true
	})
}
// 修改群名称
export function quitGroup(data) {
	return $H.post(`/group/quit_group`, data, {
		token: true
	})
}

// 获取群二维码
export function groupQrcode(id,token) {
	return `${$C.baseUrl}/group/qrcode/${id}?token=${token}`
}

//加入群聊
export function joinGroup(data) {
	return $H.post(`/group/join_group`, data, {
		token: true
	})
}