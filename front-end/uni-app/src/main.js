import Vue from 'vue'
import App from './App'
//引入vuex
import store from './store'
Vue.prototype.$store = store


Vue.config.productionTip = false

const msg = (title, duration=1500, mask=false, icon='none')=>{
	//统一提示方便全局修改
	if(Boolean(title) === false){
		return;
	}
	uni.showToast({
		title,
		duration,
		mask,
		icon
	});
}
Vue.prototype.$api = {msg};

App.mpType = 'app'

const app = new Vue({
    ...App,
	store
})
app.$mount()
