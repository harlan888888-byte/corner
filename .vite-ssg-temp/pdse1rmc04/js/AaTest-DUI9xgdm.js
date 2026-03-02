import { ssrRenderTeleport, ssrRenderClass, ssrRenderStyle, ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrRenderAttrs, ssrRenderComponent, ssrRenderVNode } from "vue/server-renderer";
import { ref, watch, reactive, computed, onMounted, useSSRContext, resolveComponent, mergeProps, unref, withCtx, createVNode, resolveDynamicComponent, Transition, openBlock, createBlock } from "vue";
import { _ as _export_sfc } from "../main.mjs";
import { useRouter } from "vue-router";
import "pinia";
import "pinia-plugin-persistedstate";
const _sfc_main$1 = {
  __name: "ImagePreview",
  __ssrInlineRender: true,
  props: {
    images: {
      type: Array,
      required: true,
      default: () => []
    },
    currentIndex: {
      type: Number,
      default: 0
    },
    isModalShow: {
      type: Boolean,
      default: false
    }
  },
  emits: ["closePreview"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const localIsModalShow = ref(false);
    watch(
      () => props.isModalShow,
      (newValue) => {
        localIsModalShow.value = newValue;
      },
      { immediate: true }
    );
    const sliderWrapper = ref(null);
    ref([]);
    const state = reactive({
      // 基础配置常量 - 图片交互的核心参数
      BASE_SCALE: 1,
      // 默认缩放比例（原始大小）
      MAX_SCALE: 2.2,
      // 最大缩放比例
      SCALE_SENSITIVITY: 0.12,
      // 双指缩放的灵敏度
      SLIDE_THRESHOLD: 30,
      // 滑动切换图片的阈值（像素）
      CLICK_MAX_MOVE: 10,
      // 判断是否为点击的最大移动距离（超过则视为滑动）
      DOUBLE_TAP_DELAY: 300,
      // 双击判断的延迟时间（毫秒）
      // 运行时动态状态 - 交互过程中实时变化的参数
      currentIndex: props.currentIndex,
      // 当前预览图片的索引
      currentScale: 1,
      // 当前图片的缩放比例
      offsetX: 0,
      // 当前图片的水平偏移量（像素）
      offsetY: 0,
      // 当前图片的垂直偏移量（像素）
      img_lock: false,
      // 图片是否锁定（贴边后禁止图片移动，允许滑块滑动）
      img_state: "center",
      // 图片状态（center：居中/未贴边；left：贴左边界；right：贴右边界）
      startTouches: [],
      // 触摸开始时的触摸点信息数组
      startX: 0,
      // 触摸开始时的水平坐标
      startY: 0,
      // 触摸开始时的垂直坐标
      lastX: 0,
      // 上一次触摸移动时的水平坐标
      lastY: 0,
      // 上一次触摸移动时的垂直坐标
      hasMoved: false,
      // 是否发生了有效滑动（用于区分点击和滑动）
      isSingle: false,
      // 是否为单指触摸
      wrapperBaseX: 0,
      // 滑块的基础水平偏移量（基于当前图片索引）
      clickTimer: null,
      // 单击/双击判断的定时器
      isDoubleTap: false,
      // 是否为双击操作
      containerW: 0,
      // 容器（窗口）宽度
      containerH: 0,
      // 容器（窗口）高度
      imgNaturalW: 0,
      // 当前图片的自然宽度（原始尺寸）
      imgNaturalH: 0,
      // 当前图片的自然高度（原始尺寸）
      this_offsetX: 0
      // 图片贴边时的水平偏移量备份（用于恢复图片位置）
    });
    watch(
      () => props.currentIndex,
      (newIndex) => {
        if (sliderWrapper.value) {
          sliderWrapper.value.style.transition = "none";
        }
        state.currentIndex = newIndex;
        state.currentScale = state.BASE_SCALE;
        state.offsetX = 0;
        state.offsetY = 0;
        if (sliderWrapper.value) {
          sliderWrapper.value.style.transform = `translateX(${-state.currentIndex * 100}vw)`;
        }
        setTimeout(() => {
          if (sliderWrapper.value) {
            sliderWrapper.value.style.transition = "transform 0.32s cubic-bezier(0.25, 0.8, 0.25, 1)";
          }
        }, 100);
      }
    );
    const getSliderTransform = computed(() => {
      return `translateX(${-state.currentIndex * 100}vw)`;
    });
    function getWrapTransform(idx) {
      if (idx !== state.currentIndex) {
        return "translate(0, 0) scale(1)";
      }
      return `translate(${state.offsetX}px, ${state.offsetY}px) scale(${state.currentScale})`;
    }
    onMounted(() => {
      state.containerW = window.innerWidth;
      state.containerH = window.innerHeight;
    });
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderTeleport(_push, (_push2) => {
        _push2(`<div class="${ssrRenderClass([{ show: localIsModalShow.value }, "preview-modal"])}" data-v-c041fbc5><div class="slider-wrapper" style="${ssrRenderStyle({ transform: getSliderTransform.value })}" data-v-c041fbc5><!--[-->`);
        ssrRenderList(__props.images, (src, idx) => {
          _push2(`<div class="slide-item" data-v-c041fbc5><div class="img-scale-wrap" style="${ssrRenderStyle({ transform: getWrapTransform(idx) })}" data-v-c041fbc5><img class="preview-img"${ssrRenderAttr("src", src)} data-v-c041fbc5></div></div>`);
        });
        _push2(`<!--]--></div><div class="page-indicator" data-v-c041fbc5>${ssrInterpolate(state.currentIndex + 1)} / ${ssrInterpolate(__props.images.length)}</div></div>`);
      }, "body", false, _parent);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/base/ImagePreview.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __unplugin_components_0 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-c041fbc5"]]);
const _sfc_main = {
  __name: "AaTest",
  __ssrInlineRender: true,
  setup(__props) {
    useRouter();
    const images = [
      "http://192.168.0.183:82/static/xiashusousiguicheng.png",
      "http://192.168.0.183:82/static/xiashusousiguicheng.png",
      "http://192.168.0.183:82/static/xiashusousiguicheng.png",
      "http://192.168.0.183:82/static/xiashusousiguicheng.png"
    ];
    const isModalShow = ref(false);
    const currentIndex = ref(0);
    ref(false);
    ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ImagePreview = __unplugin_components_0;
      const _component_router_view = resolveComponent("router-view");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "aatest-container" }, _attrs))} data-v-4ab6b19c><div class="box" data-v-4ab6b19c><h1 data-v-4ab6b19c>测试组件</h1></div>`);
      _push(ssrRenderComponent(_component_ImagePreview, {
        images,
        "current-index": unref(currentIndex),
        "is-modal-show": unref(isModalShow)
      }, null, _parent));
      _push(ssrRenderComponent(_component_router_view, null, {
        default: withCtx(({ Component }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(``);
            ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(Component), null, null), _parent2, _scopeId);
          } else {
            return [
              createVNode(Transition, {
                name: "slide-fade",
                mode: "out-in"
              }, {
                default: withCtx(() => [
                  (openBlock(), createBlock(resolveDynamicComponent(Component)))
                ]),
                _: 2
              }, 1024)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/views/home/AaTest.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const AaTest = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-4ab6b19c"]]);
export {
  AaTest as default
};
