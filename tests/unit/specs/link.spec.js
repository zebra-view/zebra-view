import { expect } from 'chai';
import { mount, shallowMount } from '@vue/test-utils';
import Link from '@/packages/link/index';

describe('Link', () => {
  it('href', () => {
    const href = '/test/api/getList';
    const wrapper = shallowMount(Link, {
      propsData: {
        href,
      },
    });
    expect(wrapper.attributes('href')).to.equal(href);
  });
  it('router-link', () => {
    const to = '/home';
    const wrapper = shallowMount(Link, {
      stubs: ['router-link'],
      attachToDocument: true,
      propsData: {
        router: true,
        to,
      },
    });
    expect(wrapper.attributes('to')).to.equal(to);
  });
  it('disabled', () => {
    const wrapper = shallowMount(Link, {
      propsData: {
        disabled: true,
      },
    });
    expect(wrapper.attributes('disabled')).to.equal('disabled');
    expect(wrapper.classes()).contain('is-disabled');
  });
  it('query', () => {
    const href = '/api';
    const query = { page: 1, size: 10 };
    const wrapper = shallowMount(Link, {
      propsData: {
        href,
        query,
      },
    });
    expect(wrapper.attributes('href')).to.equal(`${href}?page=1&size=10`);
  });
  it('type', () => {
    const wrapper = shallowMount(Link, {
      propsData: {
        type: 'success',
      },
    });
    expect(wrapper.classes()).contain('base-link--success');
  });
  it('click', async () => {
    let result;
    const wrapper = mount({
      template: "<zr-link @click='handleClick'></zr-link>",
      methods: {
        handleClick(evt) {
          result = evt;
        },
      },
    });
    wrapper.vm.$el.click();
    await wrapper.vm.$nextTick();
    expect(result).to.exist;
  });
});
