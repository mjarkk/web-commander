import Vue from 'vue'

import get from './components/networkHandeler'

import './../style/style.styl'
import './../style/buttons.styl'

import App from './App.vue'
new Vue({
  el: '#app',
  render: h => h(App)
})