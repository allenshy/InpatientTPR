import Vue from 'vue'
import VeLine from 'v-charts/lib/line.common'
import App from './App.vue'

Vue.component(VeLine.name, VeLine)

new Vue({
    el: '#app',
    render: h => h(App)
})