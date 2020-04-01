<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <zr-title title="阿迪沙发上巅峰">
      <div>1211112</div>
    </zr-title>
    <zr-link href="/test">点击下载</zr-link>
    <zr-table v-model="query" :data="tableList.list" :columns="columns" :loading="loading" :page.sync="query.page" :size.sync="query.size" :total="tableList.total" >
      <template v-slot:edit="{ row }">
        <zr-link :href="`/test/admin/downloadFile?id=${row.id}`">下载数据</zr-link>
      </template>
    </zr-table>
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {
  },
  data() {
    return {
      loading: false,
      tableList: {
        total: 0,
        list: [
          {
            id: 1,
            year: 2020,
            month: 9,
            filename: 'test',
            upload_at: '2020-04-01',
          },
          {
            id: 2,
            year: 2019,
            month: 11,
            filename: '文件名',
            upload_at: '2019-11-01',
          },
        ],
      },
      query: {
        page: 1,
        size: 10,
        year: '',
        month: '',
      },
      columns: [
        {
          label: '年度',
          prop: 'year',
        },
        {
          label: '月份',
          prop: 'month',
        },
        {
          label: '文件名',
          prop: 'filename',
          width: 220,
        },
        {
          label: '上传账号',
          prop: 'upload_at',
          width: 100,
        },
        {
          label: '上传时间',
          prop: 'upload_at',
          width: 120,
        },
        {
          prop: 'edit',
          label: '下载',
          slotName: 'edit',
        },
      ],

    };
  },
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
