<template>
  <div class="zr-virtual-viewport" ref="viewport" :style="viewPortHeight" @scroll="throttleScroll">
    <div class="zr-virtual-scroll" ref="scroll" :style="scrollHeight">
    </div>
    <div class="zr-virtual-content" ref="content">
      <div v-for="(item, index) in virtualList"  ref="list" :key="index" :id="item.id">
        <slot :item="{item}"></slot>
      </div>
    </div>
  </div>
</template>
<script>
import throttle from 'lodash/throttle';

export default {
  name: 'zr-virtual-list',
  props: {
    size: {
      type: Number,
      default: 0,
    },
    remain: {
      type: Number,
      default: 0,
    },
    list: {
      type: Array,
      default: () => [],
    },
    variable: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    prev() {
      return Math.min(this.start, this.remain); // 0 10 -> 0
    },
    next() {
      return Math.min(this.remain, this.list.length - this.end); // 10, 90000
    },
    viewPortHeight() {
      return `height: ${this.remain * this.size}px`;
    },
    scrollHeight() {
      return `height: ${this.list.length * this.size}px`;
    },
    virtualList() {
      const start = this.start - this.prev;
      const end = this.end + this.next;
      return this.list.slice(start, end);
    },
  },
  data() {
    return {
      start: 0,
      end: this.remain,
    };
  },
  updated() {
    this.$nextTick(() => {
      const nodes = this.$refs.list;
      if (!(nodes && nodes.length > 0)) {
        return;
      }
      nodes.forEach((item) => {
        const { height } = item.getBoundingClientRect();
        const id = item.getAttribute('id') - 0;
        const oldHeight = this.position[id].height;
        const val = oldHeight - height;
        if (val) {
          this.position[id].height = height;
          this.position[id].bottom = this.position[id].bottom - val;
          for (let i = id + 1; i < this.list.length; i++) {
            this.position[i].top = this.position[i - 1].bottom;
            this.position[i].bottom = this.position[i].bottom - val;
          }
        }
      });
      this.$refs.scroll.style.height = `${this.position[this.position.length - 1].bottom}px`; // 重新计算滚动条高度
    });
  },
  methods: {
    cacheList() {
      this.position = this.list.map((item, index) => ({
        height: this.size,
        top: index * this.size,
        bottom: (index + 1) * this.size,
      }));
    },
    getStartIndex(top) {
      let start = 0;
      let end = this.list.length - 1;
      let temp = null;
      while (start <= end) {
        const middleIndex = parseInt((end + start) / 2);
        const middleValue = this.position[middleIndex].bottom;
        if (middleValue === top) {
          return middleIndex + 1;
        } else if (middleValue < top) { // 右边
          start = middleIndex + 1;
        } else if (middleValue > top) { // 左边
          if (temp === null || temp > middleIndex) {
            temp = middleIndex;
          }
          end = middleIndex - 1;
        }
      }
      return temp;
    },
    handlerScroll() {
      const top = this.$refs.viewport.scrollTop;
      if (this.variable) {
        this.start = this.getStartIndex(top);
        this.end = this.start + this.remain;
        this.$refs.content.style.top = this.position[this.start - this.prev] ? `${this.position[this.start - this.prev].top}px` : 0;
      } else {
        // 固定高度列表
        this.start = Math.floor(top / this.size);
        this.end = this.start + this.remain;
        this.$refs.content.style.top = `${(this.start - this.prev) * this.size}px`;
      }
    },
  },
  mounted() {
    this.cacheList();
  },
  created() {
    this.throttleScroll = throttle(this.handlerScroll, 300, { leading: false });
  },
};
</script>
<style lang="scss">
$-border-color: #efefef;

.zr-virtual-viewport {
  position: relative;
  overflow-y: scroll;
  border: 1px solid #efefef;
  .zr-virtual-content {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
  }
}
</style>
