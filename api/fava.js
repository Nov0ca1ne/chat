import $H from '@/common/lib/request.js'

// 创建收藏
export function favaCreate(data) {
	return $H.post(`/favorite/create`, data, {
		token: true
	})
}
// 收藏列表
export function getList() {
	return $H.get('/favorite/get_list', {}, {
		token: true
	})
}

// 删除收藏
export function destroy(data) {
	return $H.post(`/favorite/destroy`, data, {
		token: true
	})
}

