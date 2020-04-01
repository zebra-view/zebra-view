import Title from './title/index';
import Link from './link/index';
import Table from './table/index';
import Upload from './upload/index';

const install = (Vue) => {
  Vue.component(Title.name, Title);
  Vue.component(Link.name, Link);
  Vue.component(Upload.name, Upload);
  Vue.component(Table.name, Table);
};

// if (window && typeof window.Vue !== 'undefined') {
//   install(window.Vue);
// }

export default {
  install,
  Title,
  Link,
  Upload,
  Table,
};
