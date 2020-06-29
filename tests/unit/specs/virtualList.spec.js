import { expect } from 'chai';
import { mount, shallowMount } from '@vue/test-utils';
import VirtualList from '@/packages/virtualList/index';

describe('VirtualList', () => {
  it('组件渲染数量是否正常', async () => {
    const remain = 5;
    const wrapper = mount({
      data() {
        return {
          remain,
          virtualList: Array.from(Array(1000), (_, i) => ({ id: i, value: i })),
        };
      },
      template: `
        <zr-virtual-list :size="90" :remain="remain" :list="virtualList" :variable="true">
          <div class="virtual-list" slot-scope="{ item }" :item="{item}" :id="item.item.id" v-html="item.item"></div>
        </zr-virtual-list>
      `,
    });
    await wrapper.vm.$nextTick();
    const items = wrapper.vm.$el.querySelectorAll('.virtual-list');
    expect(items.length).to.equal(remain * 2);
  });
  it('viewport scroll 高度是否正常', () => {
    const size = 10;
    const remain = 5;
    const list = Array.from(Array(1000), (_, i) => ({ id: i, value: i }));
    const wrapper = shallowMount(VirtualList, {
      propsData: {
        remain,
        size,
        list,
      },
    });
    const viewport = wrapper.vm.$el;
    const scroll = wrapper.vm.$el.querySelector('.zr-virtual-scroll');
    expect(viewport.style.height).to.include(size * remain);
    expect(scroll.style.height).to.include(size * list.length);
  });
  it('virtual list 数量长度是否正常', async () => {
    const size = 10;
    const remain = 5;
    const list = Array.from(Array(1000), (_, i) => ({ id: i, value: i }));
    const wrapper = shallowMount(VirtualList, {
      propsData: {
        remain,
        size,
        list,
      },
    });
    expect(wrapper.vm.$refs.list.length).to.equal(remain * 2);
  });
});
