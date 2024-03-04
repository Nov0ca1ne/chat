export default{
	namespaced:true,
	state:{
		sum:0,
		// 全局事件
		events:[],
		Record:null,      //全局录音管理
		RecordTime:0,
		RecordTimer:null,
		sendVoice: null, //发送语音
	},
	actions:{
		//分发注册全局事件
		audioOn({commit},event){
			commit('regEvent',event)
		},
		//分发执行全局事件
		audioEmit({commit},params){
			commit('doEvent',params)
		},
		//分发注销全局事件
		audioOff({commit},event){
			commit('removeEvent',event)
		}
	},
	mutations:{
		//注册全局录音器
		initRecord(state){
				state.Record = uni.getRecorderManager();
				// 录音计时
				state.Record.onStart(() => {
					state.RecordTime = 0
					state.RecordTimer = setInterval(()=>{
						state.RecordTime ++
					},1000)
				});
				
				// 获取录音
				state.Record.onStop((e) => {
					if(state.RecordTimer){
						clearInterval(state.RecordTimer)
						state.RecordTimer = null
						
					}
					
					if(typeof state.sendVoice === 'function'){
						//执行发送
						state.sendVoice(e.tempFilePath)
					}
					
				
				});
		},
		//注册发送语音事件
		regSendVoiceEvent(state,event){
			state.sendVoice = event
		},
		//注册全局事件
		regEvent(state,event){
			state.events.push(event)
		},
		//执行全局事件
		doEvent(state,params){
			state.events.forEach(e=>{
				e(params)
			})
		},
		//注销事件
		removeEvent(state,event){
			let index = state.events.findIndex(item =>{
				return item === event
			})
			if(index !== -1){
				state.events.splice(index,1)
			}
		}
	}
}