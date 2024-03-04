export default {


	msgTimeFormat(currentMessageList, sort, type) {
		
		const newMessageList = []
		const currentFilterList = currentMessageList
		
		currentFilterList.forEach((item, index) => {
			const date = item.create_time
			let showTime
			if (index === 0) {
			
				// 第一条显示时间
				showTime = this.formatTime(date)
				item.payload = {
					text: showTime
				}
				item.isShowTime = true
				newMessageList.push({
					payload: {
						text: showTime
					},
					isShowTime: true,
					time: item.create_time
				})

			} else if (index <= currentFilterList.length - 1) {
				const current = currentFilterList[index].create_time
				let minutes
				const showTimeList = newMessageList.filter(item => {
					return item.isShowTime === true
				})
				const lastShowTime = showTimeList[showTimeList.length - 1].time
				if (type) {
					const prev = currentFilterList[index - 1].create_time
					minutes = (current - prev) / 60 
				}
				if (!sort) {
					minutes = (current - lastShowTime) / 60 
				} else {
					minutes = (lastShowTime - current) / 60 
				}

				if (minutes > 5) {
					
					showTime = this.formatTime(date)
					item.payload = {
						text: showTime
					}
					item.isShowTime = true
					newMessageList.push({
						payload: {
							text: showTime
						},
						isShowTime: true,
						time: item.create_time
					})
				}
			}
		})

		return currentFilterList
	},



	// 计算当前日期星座
	getHoroscope(date) {
		let c = ['摩羯', '水瓶', '双鱼', '白羊', '金牛', '双子', '巨蟹', '狮子', '处女', '天秤', '天蝎', '射手', '摩羯']
		date = new Date(date);
		let month = date.getMonth() + 1;
		let day = date.getDate();
		let startMonth = month - (day - 14 < '865778999988'.charAt(month));
		return c[startMonth] + '座';
	},
	// 计算指定时间与当前的时间差
	sumAge(data) {
		let dateBegin = new Date(data.replace(/-/g, "/"));
		let dateEnd = new Date(); //获取当前时间
		let dateDiff = dateEnd.getTime() - dateBegin.getTime(); //时间差的毫秒数
		let dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000)); //计算出相差天数
		let leave1 = dateDiff % (24 * 3600 * 1000) //计算天数后剩余的毫秒数
		let hours = Math.floor(leave1 / (3600 * 1000)) //计算出小时数
		//计算相差分钟数
		let leave2 = leave1 % (3600 * 1000) //计算小时数后剩余的毫秒数
		let minutes = Math.floor(leave2 / (60 * 1000)) //计算相差分钟数
		//计算相差秒数
		let leave3 = leave2 % (60 * 1000) //计算分钟数后剩余的毫秒数
		let seconds = Math.round(leave3 / 1000)
		return dayDiff + "天 " + hours + "小时 ";
	},
	// 获取聊天时间（相差300s内的信息不会显示时间）
	getChatTime(v1, v2) {

		if (parseInt(v1) - parseInt(v2) > 300) {
			return this.formatTime(v1);
		}


	},
	// 人性化时间格式
	formatTime(timestamp) {
		function zeroize(num) {
			return (String(num).length == 1 ? '0' : '') + num;
		}

		var curTimestamp = parseInt(new Date().getTime() / 1000); //当前时间戳
		var timestampDiff = curTimestamp - timestamp; // 参数时间戳与当前时间戳相差秒数

		var curDate = new Date(curTimestamp * 1000); // 当前时间日期对象
		var tmDate = new Date(timestamp * 1000); // 参数时间戳转换成的日期对象

		var Y = tmDate.getFullYear(),
			m = tmDate.getMonth() + 1,
			d = tmDate.getDate();
		var H = tmDate.getHours(),
			i = tmDate.getMinutes(),
			s = tmDate.getSeconds();
		// 本周一开始时间戳
		let curMonday = parseInt((curDate.setHours(0, 0, 0) - (curDate.getDay() - 1) * 24 * 60 * 60 * 1000) / 1000)
		// 下周一开始时间戳
		let nextMonday = parseInt((curDate.setHours(0, 0, 0) + (7 - curDate.getDay()) * 24 * 60 * 60 * 1000) / 1000)

		if (timestampDiff < 60) { // 一分钟以内
			return "刚刚";
		} else if (timestampDiff < 3600) { // 一小时前之内
			return Math.floor(timestampDiff / 60) + "分钟前";
		} else if (curDate.getFullYear() == Y && curDate.getMonth() + 1 == m && curDate.getDate() == d) {
			return zeroize(H) + ':' + zeroize(i); //今天
		} else {
			var newDate = new Date((curTimestamp - 86400) * 1000); // 参数中的时间戳加一天转换成的日期对象
			if (newDate.getFullYear() == Y && newDate.getMonth() + 1 == m && newDate.getDate() == d) {
				return '昨天' + zeroize(H) + ':' + zeroize(i);
			} else if (curMonday <= timestamp && timestamp < nextMonday) { //本周
				const weekDays = ["日", "一", "二", "三", "四", "五", "六"];
				return '星期' + weekDays[tmDate.getDay()];
			} else if (curDate.getFullYear() == Y) {

				return zeroize(m) + '月' + zeroize(d) + '日 ' + zeroize(H) + ':' + zeroize(i);
			} else {
				return Y + '年' + zeroize(m) + '月' + zeroize(d) + '日 ';
			}
		}
	},


	parseNumber(num) {
		return num < 10 ? "0" + num : num;
	},

	dateFormat(date, formatStr) {
		let dateObj = {},
			rStr = /\{([^}]+)\}/,
			mons = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

		dateObj["Y"] = date.getFullYear();
		dateObj["M"] = date.getMonth() + 1;
		dateObj["MM"] = this.parseNumber(dateObj["M"]);
		dateObj["Mon"] = mons[dateObj['M'] - 1];
		dateObj["D"] = date.getDate();
		dateObj["DD"] = this.parseNumber(dateObj["D"]);
		dateObj["h"] = date.getHours();
		dateObj["hh"] = this.parseNumber(dateObj["h"]);
		dateObj["t"] = dateObj["h"] > 12 ? dateObj["h"] - 12 : dateObj["h"];
		dateObj["tt"] = this.parseNumber(dateObj["t"]);
		dateObj["A"] = dateObj["h"] > 12 ? '下午' : '上午';
		dateObj["i"] = date.getMinutes();
		dateObj["ii"] = this.parseNumber(dateObj["i"]);
		dateObj["s"] = date.getSeconds();
		dateObj["ss"] = this.parseNumber(dateObj["s"]);

		while (rStr.test(formatStr)) {
			formatStr = formatStr.replace(rStr, dateObj[RegExp.$1]);
		}
		return formatStr;
	},
	// 获取年龄
	getAgeByBirthday(data) {
		let birthday = new Date(data.replace(/-/g, "\/"));
		let d = new Date();
		return d.getFullYear() - birthday.getFullYear() - ((d.getMonth() < birthday.getMonth() || d.getMonth() ==
			birthday.getMonth() && d.getDate() < birthday.getDate()) ? 1 : 0);
	}
}