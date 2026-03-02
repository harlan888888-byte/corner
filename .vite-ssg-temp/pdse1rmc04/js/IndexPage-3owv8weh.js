import { mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderList, ssrInterpolate } from "vue/server-renderer";
import { _ as _export_sfc } from "../main.mjs";
import "vue-router";
import "pinia";
import "pinia-plugin-persistedstate";
const _sfc_main = {
  __name: "IndexPage",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "home-container" }, _attrs))} data-v-6e931d12><h1 data-v-6e931d12>首页</h1><p data-v-6e931d12>欢迎来到首页</p><div data-v-6e931d12><h2 data-v-6e931d12>TypeScript 示例</h2><!--[-->`);
      ssrRenderList(50, (i) => {
        _push(`<p data-v-6e931d12>这是第 ${ssrInterpolate(i)} 行内容，用于测试滚动功能</p>`);
      });
      _push(`<!--]--></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/views/home/IndexPage.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const IndexPage = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-6e931d12"]]);
export {
  IndexPage as default
};
