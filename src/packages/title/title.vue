<template>
  <div
    :class="wrapClasses"
    :style="{ fontSize }"
  >
    <div :class="['zr-title__left', sizeName]">
      <span
        v-if="$slots.title"
        class="zr-title__left-content"
      >
        <slot name="title"/>
      </span>
      <span
        v-else
        class="zr-title__left-content"
      >{{ title }}</span>
      <el-tooltip
        v-if="$slots.tooltip"
        effect="light"
        placement="right-start"
        :visible-arrow="false"
      >
        <div
          slot="content"
          class="tips__content"
        >
          <slot name="tooltip"/>
        </div>
        <slot name="icon">
          <i class="bp-icon-info tips-info"/>
        </slot>
      </el-tooltip>
    </div>
    <div
      v-if="content || $slots.default"
      class="zr-title__right"
    >
      <div class="zr-title__right-content">
        <slot>{{ content }}</slot>
      </div>
    </div>
  </div>
</template>
<script>
const themes = ['default'];
export default {
  name: 'zr-title',

  props: {
    title: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      default: '',
    },
    circle: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: 'large',
    },
    theme: {
      type: String,
      default: '',
      validator(value) {
        return value === '' || themes.includes(value);
      },
    },
    border: {
      type: Boolean,
      default: false,
    },
    fontSize: {
      type: String,
      default: '',
    },
    hideline: Boolean,
  },

  computed: {
    sizeName() {
      return `zr-title--${this.size}`;
    },
    wrapClasses() {
      return [
        'zr-title',
        this.circle ? 'zr-title--circle' : '',
        this.theme,
        {
          'border--visible': this.border,
          hideline: this.hideline,
        },
      ];
    },
  },
};
</script>
<style lang="scss">
@import '@/styles/variables.scss';
@import '@/styles/mixins.scss';

  @mixin before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    background-color: $--color-primary;
    transform: translateY(-50%);
  }
  .zr-title {
    padding-right: 23px;
    width: 100%;
    font-size: 16px;
    line-height: 1;
    border-bottom: 1px solid transparent;
    margin-top: 17px;
    @include clearfix;
  }
  .zr-title__left {
    position: relative;
    float: left;
    padding-left: 1.5em;
    vertical-align: middle;
  }
  .zr-title.hideline .zr-title__left {
    padding-left: 0;
    &:before {
      display: none;
    }
  }
  .zr-title__left-content {
    white-space: nowrap;
    color: $--font-primary;
  }
  .zr-title__left:before {
    @include before;
    width: 3px;
    height: 22px;
    border-radius:10px;
    overflow: hidden;
    background-color: $--color-primary;
  }
  .zr-title.border--visible {
    border-color: #e6ebf5;
  }
  .zr-title__right {
    float: right;
    vertical-align: middle;
    text-align: right;
    font-size: initial;
  }
  .zr-title__right-content {
    display: inline-block;
    text-align: left;
  }
  .zr-title--circle {
    .zr-title__left {
      position: relative;
      &:before {
        @include before;
        width: 10px;
        height: 10px;
        border-radius: 100%;
      }
    }
  }
  .zr-title--large {
    font-size: 1em;
  }
  .zr-title--large.zr-title--circle {
    .zr-title__left {
      padding-left: 35px;
      &:before {
        width: 3px;
        height: 23px;
      }
    }
  }
  .zr-title--small {
    font-size: (14 / 16) em;
  }
  .zr-title--small.zr-title--circle {
    .zr-title__left:before {
      width: 0.6em;
      height: 0.6em;
    }
  }
  .zr-title--mini {
    font-size: (12 / 16) em;
  }
  .zr-title--mini.zr-title--circle {
    .zr-title__left:before {
      width: 0.5em;
      height: 0.5em;
    }
  }
</style>
