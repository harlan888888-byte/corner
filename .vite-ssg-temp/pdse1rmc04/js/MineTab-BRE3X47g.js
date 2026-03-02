import { ref, onMounted, watch, onUnmounted, mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs } from "vue/server-renderer";
import { useRoute, useRouter } from "vue-router";
import { u as useBackButton } from "./useBackButton-Bl8j8FnM.js";
import { _ as _export_sfc } from "../main.mjs";
import "pinia";
import "pinia-plugin-persistedstate";
const _sfc_main = {
  __name: "MineTab",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const router = useRouter();
    const showDialog1 = ref(false);
    const showDialog2 = ref(false);
    const {
      popHistory,
      resetHistoryCount,
      getAddedHistoryCount,
      handlePopState,
      resetRouteState
    } = useBackButton();
    const popStateHandler = handlePopState(router, route);
    onMounted(() => {
      window.addEventListener("popstate", popStateHandler);
    });
    watch(
      () => route.path,
      (newPath, oldPath) => {
        const currentRouteKey = route.name || route.path || "default";
        const isCurrentRoute = currentRouteKey.includes("/mine");
        if (isCurrentRoute) {
          resetRouteState(currentRouteKey);
        }
      }
    );
    onUnmounted(() => {
      window.removeEventListener("popstate", popStateHandler);
      while (getAddedHistoryCount() > 0) {
        popHistory(router, route);
      }
      resetHistoryCount();
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "mine-tab-container" }, _attrs))} data-v-cdb511b3><h1 data-v-cdb511b3>个人中心</h1><button class="open-dialog-btn" data-v-cdb511b3>打开弹窗1</button>`);
      if (showDialog1.value) {
        _push(`<div class="dialog-overlay" data-v-cdb511b3><div class="dialog-content" data-v-cdb511b3><h2 data-v-cdb511b3>弹窗1</h2><p data-v-cdb511b3>这是弹窗1的内容</p><button class="dialog-btn" data-v-cdb511b3>打开弹窗2</button><button class="dialog-btn" data-v-cdb511b3>关闭</button></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (showDialog2.value) {
        _push(`<div class="dialog-overlay" data-v-cdb511b3><div class="dialog-content" data-v-cdb511b3><h2 data-v-cdb511b3>弹窗2</h2><p data-v-cdb511b3>这是弹窗2的内容</p><button class="dialog-btn" data-v-cdb511b3>关闭</button></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/views/layout/MineTab.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const MineTab = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-cdb511b3"]]);
export {
  MineTab as default
};
