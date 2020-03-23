import Title from './title/title.vue';
import Link from './link/link.vue';

const install = (Vue) => {
  Vue.component(Title.name, Title);
  Vue.component(Link.name, Link);
};

if (window && typeof window.Vue !== 'undefined') {
  install(window.Vue);
}

export default {
  install,
};
