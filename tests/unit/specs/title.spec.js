import { expect } from 'chai';
import { shallowMount } from '@vue/test-utils';
import Title from '@/packages/title/src/index.vue';

describe('Title', () => {
  it('title', () => {
    const title = '测试标题1';
    const wrapper = shallowMount(Title, {
      propsData: {
        title,
      },
    });
    expect(wrapper.text()).to.equal(title);
  });
  it('slot default', () => {
    const content = '新增';
    const wrapper = shallowMount(Title, {
      slots: {
        default: content,
      },
    });
    const ele = wrapper.vm.$el.querySelector('.zr-title__right');
    expect(ele.innerText).to.equal(content);
  });
});
