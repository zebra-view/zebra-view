<template>
  <div id="app">
    <!-- <zr-title title="阿迪沙发上巅峰">
      <div>1211112</div>
    </zr-title>
    <zr-link href="/test">点击下载</zr-link>
    <zr-table v-model="query"
      :data="tableList.list" :columns="columns"
     :loading="loading" :page.sync="query.page" :size.sync="query.size" :total="tableList.total" >
      <template v-slot:edit="{ row }">
        <zr-link :href="`/test/admin/downloadFile?id=${row.id}`">下载数据</zr-link>
      </template>
    </zr-table> -->
    <!-- <div class="upload-box">
      <zr-upload
        :action="action"
        @update="update"
      ></zr-upload>
    </div> -->
    <div class="virtual-box">
      <zr-virtual-list :size="90" :remain="5" :list="virtualList" :variable="true">
        <div class="virtual-list" slot-scope="{ item }" :item="{item}"  v-html="item.item"></div>
      </zr-virtual-list>
    </div>
  </div>
</template>

<script>
const list = Array.from(Array(1000), (_, i) => ({
  id: i,
  value: `${i} <br/> ${Array(Math.floor(Math.random() * 5)).join('<br/>------')}<br/>1212个`,
}));

export default {
  name: 'App',
  components: {
  },
  data() {
    return {
      loading: false,
      action: {
        partUpload: '/api/file/partUpload',
        uploadedList: '/api/file/getUploadedList',
        upload: '/api/file/upload',
      },
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
          prop: 'create_at',
          width: 120,
        },
        {
          prop: 'edit',
          label: '下载',
          slotName: 'edit',
        },
      ],
      virtualList: list,
    };
  },
  methods: {
    update() {
      console.log('全部上传成功, 刷新表格');
    },
  },
};
</script>

<style lang="scss" scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  .virtual-box,
  .upload-box {
    padding: 20px;
    width: 900px;
    margin: 0 auto;
    border: 1px solid #dfdfdf;
    height: 600px;
    overflow: hidden;
    text-align: left;
  }
  .virtual-list {
    // height: 50px;
    // padding:20px;
    border-bottom: 1px solid #efefef;
    width: 100%;
  }
}

</style>
