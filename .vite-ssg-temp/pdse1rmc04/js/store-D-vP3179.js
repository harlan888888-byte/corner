import { Loading } from "vant/es/index.mjs";
import "vant/es/loading/style/index.mjs";
import { mergeProps, withCtx, createTextVNode, toDisplayString, useSSRContext, ref, watch, onMounted } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderSlot, ssrRenderAttr } from "vue/server-renderer";
import { _ as _export_sfc, a as useUserStore, r as router } from "../main.mjs";
import axios from "axios";
import { ElMessage } from "element-plus";
const _sfc_main$2 = {
  __name: "LoadingToast",
  __ssrInlineRender: true,
  props: {
    // 加载提示文本
    text: {
      type: String,
      default: ""
    },
    textSize: {
      type: String,
      default: "18px"
    },
    // 加载图标类型：spinner | circular
    type: {
      type: String,
      default: "circular"
    },
    // 加载图标颜色
    color: {
      type: String,
      default: "#c8c9cc"
    },
    // 加载图标大小
    size: {
      type: String,
      default: "40px"
    }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_van_loading = Loading;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "loading-wrapper" }, _attrs))} data-v-08dd724b><div class="loading-container" data-v-08dd724b>`);
      _push(ssrRenderComponent(_component_van_loading, {
        vertical: "",
        type: __props.type,
        color: __props.color,
        "text-size": __props.textSize,
        size: __props.size
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(__props.text || "加载中...")}`);
          } else {
            return [
              createTextVNode(toDisplayString(__props.text || "加载中..."), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/base/LoadingToast.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __unplugin_components_2$1 = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-08dd724b"]]);
const _sfc_main$1 = {
  __name: "TargetMap",
  __ssrInlineRender: true,
  props: {
    // 外部传入要导航的地址（必传）
    address: {
      type: String,
      required: true
    }
  },
  setup(__props) {
    const btnLoading = ref(false);
    const btnLoadingText = ref("尝试打开高德地图...");
    const props = __props;
    const targetAddress = ref(props.address);
    watch(
      () => props.address,
      (newVal) => {
        targetAddress.value = newVal;
      },
      { immediate: true }
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_LoadingToast = __unplugin_components_2$1;
      _push(`<!--[--><div class="map-icon-trigger" title="打开高德地图查看地址" data-v-8564754f>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, () => {
        _push(`<i class="icon-map" data-v-8564754f>🗺️</i>`);
      }, _push, _parent);
      _push(`</div>`);
      if (btnLoading.value) {
        _push(ssrRenderComponent(_component_LoadingToast, { text: btnLoadingText.value }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/base/TargetMap.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __unplugin_components_2 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-8564754f"]]);
const _imports_0 = "data:image/svg+xml,%3c?xml%20version='1.0'%20standalone='no'?%3e%3c!DOCTYPE%20svg%20PUBLIC%20'-//W3C//DTD%20SVG%201.1//EN'%20'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3e%3csvg%20t='1771113156489'%20class='icon'%20viewBox='0%200%201024%201024'%20version='1.1'%20xmlns='http://www.w3.org/2000/svg'%20p-id='8562'%20xmlns:xlink='http://www.w3.org/1999/xlink'%20width='200'%20height='200'%3e%3cpath%20d='M512%20972.8C260.266667%20972.8%2051.2%20763.733333%2051.2%20512c0-17.066667%2012.8-34.133333%2034.133333-34.133333s34.133333%2012.8%2034.133334%2034.133333c0%20217.6%20174.933333%20392.533333%20392.533333%20392.533333s392.533333-174.933333%20392.533333-392.533333-174.933333-392.533333-392.533333-392.533333c-17.066667%200-34.133333-12.8-34.133333-34.133334s12.8-34.133333%2034.133333-34.133333C763.733333%2051.2%20972.8%20256%20972.8%20512S763.733333%20972.8%20512%20972.8z'%20fill='%23bfbfbf'%20p-id='8563'%3e%3c/path%3e%3c/svg%3e";
const defaultImgSrc = "/images/miss_store-XMv_3vmV.svg";
const _sfc_main = {
  __name: "LazyImage",
  __ssrInlineRender: true,
  props: {
    src: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      default: ""
    }
  },
  emits: ["load", "error"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const imgLoaded = ref(false);
    const lazyImg = ref(null);
    const handleImgError = () => {
      if (lazyImg.value) {
        lazyImg.value.src = defaultImgSrc;
        emit("error");
      }
    };
    const handleImgLoad = () => {
      imgLoaded.value = true;
      emit("load");
    };
    const initLazyLoad = () => {
      if (!lazyImg.value) {
        return;
      }
      if (lazyImg.value._lazyObserved) {
        return;
      }
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target;
              const realSrc = img.dataset.src || img.getAttribute("data-src");
              if (realSrc) {
                img.src = realSrc;
                img.addEventListener("load", handleImgLoad);
                img.addEventListener("error", handleImgError);
              } else {
                handleImgError();
              }
              observer.unobserve(img);
              img._lazyObserved = true;
            }
          });
        },
        {
          rootMargin: "100px 0px"
          // 提前100px加载
        }
      );
      observer.observe(lazyImg.value);
    };
    watch(
      () => props.src,
      () => {
        imgLoaded.value = false;
        initLazyLoad();
      },
      { immediate: true }
    );
    onMounted(() => {
      initLazyLoad();
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "lazy-image-container" }, _attrs))} data-v-b6d08e6d>`);
      if (!imgLoaded.value) {
        _push(`<div class="img-placeholder" data-v-b6d08e6d><span class="loading-icon" data-v-b6d08e6d><img${ssrRenderAttr("src", _imports_0)} alt="" data-v-b6d08e6d></span></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<img loading="lazy" class="lazy"${ssrRenderAttr("data-src", __props.src)}${ssrRenderAttr("src", __props.src)}${ssrRenderAttr("alt", __props.alt)} data-v-b6d08e6d></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/base/LazyImage.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __unplugin_components_0 = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-b6d08e6d"]]);
const _imports_1 = "/images/map-DWdajjr0.svg";
const getBaseURL = () => {
  {
    return "https://corner.ntotl.cn/api";
  }
};
const baseURL = getBaseURL();
const instance = axios.create({
  baseURL,
  timeout: 1e4
});
instance.interceptors.request.use(
  (config) => {
    const useStore = useUserStore();
    if (useStore.token) {
      config.headers.Authorization = useStore.token;
    }
    return config;
  },
  (err) => Promise.reject(err)
);
instance.interceptors.response.use(
  (res) => {
    if (res.data.code === 200) {
      return res;
    }
    ElMessage.error(res.data.message || "服务异常");
    return Promise.reject(res.data);
  },
  (err) => {
    if (err.response?.status === 401) {
      router.push("/login");
    }
    ElMessage.error(err.response?.data?.message || "服务异常");
    return Promise.reject(err);
  }
);
const getStoreInfo = (params) => instance.get("/home/get_store_info", { params });
const getStoreDetail = (storeid) => instance.get("/home/get_store_detail", { params: { storeid } });
export {
  __unplugin_components_0 as _,
  __unplugin_components_2 as a,
  _imports_1 as b,
  __unplugin_components_2$1 as c,
  defaultImgSrc as d,
  getStoreDetail as e,
  getStoreInfo as g
};
