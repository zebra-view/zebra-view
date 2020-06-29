<template>
  <div>
    <el-upload
      class="upload-wrap"
      :multiple="true"
      :action="action.partUpload"
      ref="upload"
      name="file"
      :show-file-list="false"
      :file-list="fileList"
      :on-change="handlerChange"
      :auto-upload="false"
      >
      <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
      <div slot="tip" class="el-upload__tip">{{tips}}</div>
    </el-upload>
    <div class="file-container">
      <el-row :gutter="24">
        <el-col :span="12" v-if="fileList.length > 0">
          <el-button size="mini" icon="el-icon-upload" :loading="loading" @click="upload">开始上传</el-button>
          <el-button size="mini" icon="el-icon-delete" @click="handlerRemoveAll" :disabled="loading">删除</el-button>
        </el-col>
      </el-row>
      <div class="file-item" v-for="(file, index) in fileList" :key="file.name">
        <el-row :gutter="24">
          <el-col :span="8">
            <el-popover
              placement="bottom-start"
              title="分片信息"
              width="600"
              trigger="hover"
            >
             <el-row class="file-popover-container" :gutter="24">
                <el-col :span="12">
                  <div class="file-item__filename">hash进度</div>
                </el-col>
                <el-col :span="12">
                  <div class="file-item__filename"><el-progress :percentage="file.hashPercent || 0"></el-progress></div>
                </el-col>
              </el-row>
              <el-row class="file-popover-container" :gutter="24" v-for="item in file.partList" :key="item.name">
                <el-col :span="12">
                  <div class="file-item__filename" :title="item.chunk_name + item.size" >{{item.chunk_name}} -- {{item.size}}</div>
                </el-col>
                <el-col :span="12">
                  <div class="file-item__filename"><el-progress :percentage="item.percent||0"></el-progress></div>
                </el-col>
              </el-row>
              <div slot="reference" class="file-item__filename">
                <el-col :span="6">
                  <el-link :underline="false" type="primary" style="font-size: 12px">{{stateText[file.state]}}</el-link>
                </el-col>
                <el-col :span="18" class="file-item__filename">
                 {{file.name}}
                </el-col>
              </div>
            </el-popover>
          </el-col>
          <el-col :span="12">
            <el-progress :color="file.state === 'pause'? '#cccc': '#409EFF'" :percentage="totalPercent(file.partList)"></el-progress>
          </el-col>
          <el-col :span="4">
            <i class="el-icon-video-pause" v-if="file.state === 'uploading'" @click="pauseItem(index)"></i>
            <i class="el-icon-video-play" v-if="file.state === 'pause'" @click="resumeItem(index)"></i>
            <i class="el-icon-delete" @click="handleRemoveItem(index)"></i>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
import request from './utils';

const INIT = 'init';
const PAUSE = 'pause';
const UPLOADING = 'uploading';
const PART = 'part';

export default {
  name: 'zr-upload',
  props: {
    action: {
      type: Object,
      default: () => (
        {
          partUpload: '/api/file/partUpload',
          uploadedList: '/api/file/getUploadedList',
          upload: '/api/file/upload',
        }
      ),
    },
  },
  data() {
    return {
      loading: false,
      fileList: [],
      fileLen: 0,
      stateText: {
        init: '',
        pause: '已暂停',
        uploading: '上传中...',
        part: '分片中...',
      },
      tips: '大文件上传支持xls、pdf、zip 且单文件不能超过 2G',
      allow: ['.xls', '.xlsx', '.csv', '.png', '.pdf', '.jpeg', '.jpg', '.zip'],
      limit: 1024 * 1024 * 1024,
      totalTime: 0,
      partSize: 1024 * 1024 * 10,
    };
  },
  methods: {
    totalPercent(partList = []) {
      const percent = partList.length > 0
        ? Math.round(partList.reduce((acc, curr) => acc + curr.percent, 0) / (partList.length * 100) * 100) : 0;
      return percent;
    },
    setHashPercent(percent, fileIndex) {
      this.$set(this.fileList, fileIndex, {
        ...this.fileList[fileIndex],
        hashPercent: percent,
      });
    },
    handlerRemoveAll() {
      this.fileList = [];
    },
    handleRemoveItem(index) {
      const { state } = this.fileList[index];
      if (state === PART) {
        this.$message.info('分片中...');
        return;
      }
      if (state !== INIT) {
        this.$confirm('确定删除正在上传的文件?', '删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!',
          });
          this.pauseItem(index);
          this.fileList.splice(index, 1);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          });
        });
      } else {
        this.fileList.splice(index, 1);
      }
    },
    handleSuccess(fileIndex, flag) {
      this.loading = false;
      this.fileList[fileIndex].state = INIT;
      const { name } = this.fileList[fileIndex];
      console.log(`${name} 时间:${(new Date() - this.totalTime) / 1000}秒`);
      this.$message.success(flag ? `${name}秒传成功` : `${name}上传成功`);
      this.fileLen++;
      if (this.fileLen === this.fileList.length) {
        this.handlerRemoveAll();
        this.$emit('update');
      }
    },
    handlerFileAccept(file) {
      const isAllow = this.allow.includes(file.name.slice(file.name.lastIndexOf('.')).toLowerCase());
      if (!isAllow) {
        this.$message.error(this.tips);
        return false;
      }
      return true;
    },
    handlerChange(file, fileList) {
      if (fileList.length <= 0) {
        return false;
      }
      if (!this.handlerFileAccept(file)) {
        this.fileList = fileList.slice(0, fileList.length - 1);
        return false;
      }
      const isLt2G = file.size / 1024 / 1024 < this.limit;
      if (!isLt2G) {
        this.fileList = fileList.slice(0, fileList.length - 1);
        this.$message.error('上传的文件不能大于2G');
        return false;
      }
      file.state = INIT;
      this.fileList.push(file);
      return true;
    },
    createChunks(file) {
      let current = 0;
      const partList = [];
      while (current < file.size) {
        const chunk = file.raw.slice(current, current + this.partSize);
        partList.push({ chunk, size: chunk.size });
        current += this.partSize;
      }
      return partList;
    },
    calculateHash(partList, fileIndex) {
      this.fileList[fileIndex].state = PART;
      return new Promise((resolve) => {
        const worker = new Worker('/hash.js');
        worker.postMessage({ partList });
        worker.onmessage = (event) => {
          const { percent, hash } = event.data;
          this.setHashPercent(percent, fileIndex);
          if (hash) {
            resolve(hash);
          }
        };
      });
    },
    async beforeUpload(file, fileIndex) {
      let partList = this.createChunks(file);
      this.fileList[fileIndex].state = INIT;
      const fileHash = await this.calculateHash(partList, fileIndex);
      const lastDotIndex = file.name.lastIndexOf('.');
      const extName = file.name.slice(lastDotIndex);
      const filename = `${fileHash}${extName}`;
      partList = partList.map((part, index) => ({
        filename,
        chunk_name: `${filename}-${index}`,
        chunk: part.chunk,
        size: part.chunk.size,
        percent: 0,
        loaded: 0,
        xhr: null,
      }));
      file.partList = partList;
      this.$set(this.fileList, fileIndex, {
        hashName: filename,
        partList,
        ...this.fileList[fileIndex],
        state: UPLOADING,
      });
      await this.uploadParts(partList, filename, fileIndex);
    },
    createRequests(partList, uploadedList) {
      const partLists = partList.filter((part) => {
        const uploadedFile = uploadedList.find((item) => item.filename === part.chunk_name);
        if (!uploadedFile) {
          part.loaded = 0;
          part.percent = 0;
          return true;
        }
        if (uploadedFile.size < part.chunk.size) {
          part.loaded = uploadedFile.size;
          part.percent = parseInt(Number((Number(part.loaded) / part.chunk.size * 100)), 10);
          return true;
        }
        if (uploadedFile.size >= part.chunk.size) {
          part.percent = 100;
          return false;
        }
        return false;
      });
      return partLists.map((part) => {
        const formData = new FormData();
        formData.append(part.filename, part.chunk.slice(part.loaded), part.filename);
        return request({
          url: `${this.action.partUpload}/${part.filename}/${part.chunk_name}/${part.loaded}`,
          method: 'POST',
          data: formData,
          setXHR: (xhr) => {
            part.xhr = xhr;
          },
          onProgress: (event) => {
            const percent = parseInt(Number((Number(part.loaded + event.loaded) / part.chunk.size * 100)), 10);
            part.percent = percent > 100 ? 100 : percent;
          },
        });
      });
    },
    async uploadParts(partList, filename, fileIndex) {
      if (!filename) return;
      const { needUpload = true, uploadedList = [] } = await this.getUploadedList(filename);
      if (!needUpload) {
        partList.forEach((item) => {
          item.percent = 100;
        });
        this.handleSuccess(fileIndex, true);
        return;
      }
      const requests = this.createRequests(partList, uploadedList);
      await Promise.all(requests);
      const res = await request({
        url: this.action.upload,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data: JSON.stringify({ filename }),
      });
      if (res.success) {
        this.handleSuccess(fileIndex);
        return;
      }
      this.$message.error('发生未知异常错误，请重新上传!');
    },
    async getUploadedList(filename) {
      const res = await request({
        url: this.action.uploadedList,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data: JSON.stringify({ filename }),
      });
      return res;
    },
    async upload() {
      if (!this.fileList.length) {
        this.$message('请选择上传文件');
        return;
      }
      this.loading = true;
      this.fileLen = 0;
      this.totalTime = new Date();
      this.fileList.forEach((item, index) => {
        item.state = UPLOADING;
        this.beforeUpload(item, index);
      });
    },
    async resumeItem(index) {
      const { partList = [], hashName } = this.fileList[index];
      this.fileList[index].state = UPLOADING;
      this.uploadParts(partList || [], hashName, index);
    },
    pauseItem(index) {
      const { partList = [] } = this.fileList[index];
      this.fileList[index].state = PAUSE;
      partList.forEach((part) => part.xhr && part.xhr.abort());
    },
  },
};
</script>
<style lang="scss">
$-border-color: #efefef;
.file-container{
  border-radius: 4px;
  padding: 20px;
}
.file-popover-container {
  padding: 4px;
  border-bottom: 1px solid $-border-color;
}
.file-item {
  padding: 6px 4px 2px 4px;
  border-bottom: 1px dashed $-border-color;
  &__filename {
    font-size: 13px;
    text-align: right;
    line-height: 20px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  [class*="el-icon-"] {
    padding: 0 4px;
    cursor: pointer;
    color: #afafaf;
  }
}
</style>
