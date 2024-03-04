import Vue from 'vue'

import Vuex from 'vuex'
import audio from './modules/audio.js'
import user from './modules/user.js'
Vue.use(Vuex)

export default new Vuex.Store({
	modules:{
		audio,
		user
	}
})