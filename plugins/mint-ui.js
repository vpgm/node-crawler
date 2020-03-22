import Vue from "vue";
import MintUI, {
  Header,
  Button,
  TabContainer,
  TabContainerItem,
  Tabbar,
  TabItem,
  Cell,
  Search,
  Spinner,
  InfiniteScroll
} from "mint-ui";

// 使用mint-ui
Vue.use(MintUI);
Vue.use(InfiniteScroll);

// 注册全局组件
let components = [
  Header,
  Button,
  TabContainer,
  TabContainerItem,
  Tabbar,
  TabItem,
  Cell,
  Search,
  Spinner
];

components.forEach(item => {
  Vue.component(item.name, item);
});
