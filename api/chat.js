import $H from '@/common/lib/request.js'

// 发送消息
export function sendMessage(data) {
	return $H.post('/chat/send', data, {
		token: true
	})
}

// 获取离线消息
export function getOfflineMessage() {
	return $H.post('/chat/getmessage', {}, {
		token: true
	})
}

// 用户进入后台
export function backstage(data) {
	return $H.post('/chat/backstage', data, {
		token: true
	})
}

// 文件上传
export function upload(data) {
	return $H.upload('/upload', data)
}

// 文件上传base64
export function uploadBase64(data) {
	return $H.post('/upload_base64', data, {
		token: true
	})
}