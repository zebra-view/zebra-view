<template>
  <div>
    <input type="file" @change="handlerChange"/>
    {{percent}}
    <button @click="uplaod">上传</button>
    <img style="max-width: 150; max-height: 150 " :src="objectUrl" />
  </div>
</template>
<script>
import request from './utils';

const SIZE = 1024 * 1024 * 10;
export default {
  name: 'zr-upload',
  data() {
    return {
      currentFile: '',
      type: ['image/jpeg', 'image/png', 'application/pdf', 'video/mp4'],
      limit: 1024 * 1024 * 1024,
      objectUrl: '',
      percent: 0,
    };
  },
  methods: {
    handlerChange(event) {
      const file = event.target.files[0];
      this.currentFile = file;
      const { URL } = window;
      const objectUrl = URL.createObjectURL(this.currentFile);
      this.objectUrl = objectUrl;
      console.log(objectUrl);
    },
    createChunks(file) {
      let current = 0;
      const partList = [];
      while (current < file.size) {
        const chunk = file.slice(current, current + SIZE);
        partList.push({ chunk, size: chunk.size });
        current += SIZE;
      }
      return partList;
    },
    setHashPercent(percent) {
      console.log('setHashPercent', percent);
      setTimeout(() => {
        this.percent = percent;
      });
    },
    calculateHash(partList) {
      return new Promise((resolve) => {
        const worker = new Worker('/hash.js');
        // setWorker(worker);
        worker.postMessage({ partList });
        worker.onmessage = (event) => {
          const { percent, hash } = event.data;
          this.setHashPercent(percent);
          if (hash) {
            resolve(hash);
          }
        };
      });
    },
    async beforeUpload(file) {
      const isValidFileType = this.type.includes(file.type);
      if (!isValidFileType) {
        console.error('不支持此文件类型!');
      }
      const isLt2G = file.size / 1024 / 1024 < this.limit;
      if (!isLt2G) {
        console.error('上传的图片不能大于2MB!');
      }
      let partList = this.createChunks(file);
      const fileHash = await this.calculateHash(partList);
      const lastDotIndex = file.name.lastIndexOf('.');
      const extName = file.name.slice(lastDotIndex);
      const filename = `${fileHash}${extName}`;
      partList = partList.map((part, index) => ({
        filename,
        chunk_name: `${filename}-${index}`,
        chunk: part.chunk,
        size: part.chunk.size,
        percent: 0,
      }));
      console.log(partList);
      await this.uploadParts(partList, filename);
      // return isValidFileType && isLt2G;
    },
    createRequests(partList) {
      return partList.map((part) => (
        request({
          url: `/upload/${part.filename}/${part.chunk_name}`,
          method: 'POST',
          header: { 'Content-Type': 'application/octet-stream' },
          data: part.chunk,
          onProgress: (event) => {
            console.log(event.loaded);
            part.percent = event.loaded / part.chunk.size * 100;
          },
        })
      ));
    },
    async uploadParts(partList, filename) {
      const requests = this.createRequests(partList);
      await Promise.all(requests);
      await request({
        url: '/merge',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data: JSON.stringify({ filename }),
      });
      console.info('上传成功!');
    },
    async uplaod() {
      if (!this.currentFile) {
        console.log('请选择上传文件');
        return;
      }
      if (!this.beforeUpload(this.currentFile)) {
        console.log('error');
        return;
      }
      console.log('ok');
      // const formData = new FormData();
      // formData.append('chunk', this.currentFile);
      // formData.append('filename', this.currentFile.name);
      // const result = await request({
      //   url: '/upload',
      //   method: 'POST',
      //   data: formData,
      // });
      // console.log('上传结果', result);
    },
  },
  beforeDestroy() {
    window.URL.revokeObjectURL(this.objectUrl);
  },
};
</script>
