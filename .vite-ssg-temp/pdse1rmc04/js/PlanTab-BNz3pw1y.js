import { ref, mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent } from "vue/server-renderer";
import { C as CityPicker } from "./CityPicker-D29pegeX.js";
import { _ as _export_sfc } from "../main.mjs";
import "vue-router";
import "pinia";
import "pinia-plugin-persistedstate";
const _sfc_main = {
  __name: "PlanTab",
  __ssrInlineRender: true,
  setup(__props) {
    const showCityPicker = ref(false);
    const selectedCity = ref(null);
    const handleCitySelect = (city) => {
      selectedCity.value = city;
      showCityPicker.value = false;
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "plan-tab-container" }, _attrs))} data-v-7db2b61c><div class="tab-top-item" data-v-7db2b61c><h1 data-v-7db2b61c>计划</h1></div><div class="plan-content" data-v-7db2b61c><div class="city-selector" data-v-7db2b61c><button class="select-city-btn" data-v-7db2b61c>${ssrInterpolate(selectedCity.value ? selectedCity.value.name : "选择城市")}</button>`);
      if (showCityPicker.value) {
        _push(`<div class="city-picker-modal" data-v-7db2b61c>`);
        _push(ssrRenderComponent(CityPicker, { onSelect: handleCitySelect }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="plan-info" data-v-7db2b61c><h2 data-v-7db2b61c>计划-开发中...</h2></div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/views/layout/PlanTab.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const PlanTab = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-7db2b61c"]]);
export {
  PlanTab as default
};
