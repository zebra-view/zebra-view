import Upload from './src/index.vue';

Upload.install = (Vue) => {
  Vue.component(Upload.name, Upload);
};

export default Upload;
