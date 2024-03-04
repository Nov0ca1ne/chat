import $C from "./config.js";
export default {
	// 获取存储列表数据
	getStorage(key) {
		let data = null;
		if ($C.env === "dev") {
			data = window.sessionStorage.getItem(key);
		} else {
			data = uni.getStorageSync(key);
		}
		return data;
	},
	// 设置存储
	setStorage(key, data) {
		if ($C.env === "dev") {
			return window.sessionStorage.setItem(key, data);
		} else {
			return uni.setStorageSync(key, data);
		}
	},
	// 删除存储
	removeStorage(key) {
		if ($C.env === "dev") {
			return window.sessionStorage.removeItem(key);
		} else {
			return uni.removeStorageSync(key);
		}
	},
};