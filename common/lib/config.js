export default {
	emojiUrl: [{
			url: "http://192.168.0.107:3000/images/emoji/",
			total: 20,
			isActive: false, //是否选中
		},
		{
			url: "http://192.168.0.107:3000/images/ggb/",
			total: 32,
			isActive: false, //是否选中
		},
		{
			url: "http://192.168.0.107:3000/images/like/",
			total: 1,
			isActive: false, //是否选中
		}
	],

	baseUrl: "http://192.168.0.107:7001",
	socketUrl: "ws://192.168.0.107:7001/ws",
	env: "",
}