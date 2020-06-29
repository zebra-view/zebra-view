import { expect } from 'chai';
import { mount, shallowMount } from '@vue/test-utils';
import Upload from '@/packages/upload/index';

describe('Upload', () => {
  let uploader;
  // let handlers;
  beforeEach(async () => {
    uploader = await mount({
      template: `<zr-upload ref="upload></zr-upload>`
    });
    // uploader = await render(Upload).vm.$refs
  });

  it('upload 上传文件', async () => {
    // const file = new Blob([JSON.stringify({}, null, 2)], {
    //   type: 'application/json'
    // });
    // file.name = 'success.png';
    // const files = [file];

    // handlers.onSuccess = (res, file, fileList) => {
    //   expect(file.name).to.equal('success.png');
    //   expect(fileList.length).to.equal(1);
    //   expect(res).to.equal('success.png');
    //   done();
    // };
    // console.log(uploader.props('fileList'))
    // console.log(uploader.props())
    // uploader.$refs['upload-inner'].handleChange(file, uploader.props('fileList'));
  });
});
