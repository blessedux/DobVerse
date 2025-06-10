import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import { addIcons } from "oh-vue-icons"
import { 
  MdDragindicator, 
  HiTrash, 
  HiPlus, 
  HiSolidSearch, 
  BiTextLeft, 
  BiTypeH1, 
  BiTypeH2, 
  BiTypeH3, 
  BiHr, 
  BiQuote 
} from "oh-vue-icons/icons"

addIcons(
  MdDragindicator, 
  HiTrash, 
  HiPlus, 
  HiSolidSearch, 
  BiTextLeft, 
  BiTypeH1, 
  BiTypeH2, 
  BiTypeH3, 
  BiHr, 
  BiQuote
)

const app = createApp(App)
app.mount('#app')
