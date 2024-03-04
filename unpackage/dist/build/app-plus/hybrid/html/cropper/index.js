
function init() {
	window.getInitData = (arg) => {
		const data = jsonly(arg)
		const url = data.imageUrl
		var simpleCrop = new SimpleCrop({
		
		  src: url, //裁剪图片地址
	
		  size: {
		    //裁剪尺寸
		    width: 800,
		    height: 600,
		  },
		  
		  cropSizePercent: 0.9, //裁剪框显示比例
		  cropCallback: function($resultCanvas) {
		    //图片裁剪完成回调函数
		    console.log("cropCallback");
			const postData = {
			  data: {
			    type: "croppedData",
			    dataUrl: $resultCanvas.toDataURL(),
			
			  },
			};
			uni.postMessage(postData);
		    // $resultCanvas.style.marginRight = "10px";
		    // $resultCanvas.style.width = "50%";
		    // document.body.appendChild($resultCanvas);
		  },
		  uploadCallback: function(src) {
		    //上传裁剪图片成功回调函数
		    console.log("uploadCallback " + src);
			
		  },
		  closeCallback: function() {
		    //关闭组件回调函数
		    console.log("closeCallback");
			const postData = {
			  data: {
			    type: "close",
			  },
			};
			uni.postMessage(postData);
		  },
		});
	}
}