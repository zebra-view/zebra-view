import Link from './src/index.vue';

Link.install = (Vue) => {
  Vue.component(Link.name, Link);
};

export default Link;
