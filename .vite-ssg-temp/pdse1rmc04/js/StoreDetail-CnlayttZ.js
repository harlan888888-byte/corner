import { _ as __unplugin_components_0$1, d as defaultImgSrc, a as __unplugin_components_2, b as _imports_1, e as getStoreDetail } from "./store-D-vP3179.js";
import { ImagePreview } from "vant/es/index.mjs";
import "vant/es/image-preview/style/index.mjs";
import { ref, mergeProps, unref, isRef, useSSRContext, onMounted, withCtx, createVNode } from "vue";
import { ssrRenderAttrs, ssrRenderList, ssrRenderComponent, ssrRenderAttr, ssrInterpolate } from "vue/server-renderer";
import { _ as _export_sfc } from "../main.mjs";
import { useRoute, useRouter } from "vue-router";
import "vant/es/loading/style/index.mjs";
import "axios";
import "element-plus";
import "pinia";
import "pinia-plugin-persistedstate";
function useVanImagePreview() {
  const vanImageModalShow = ref(false);
  const vanImageCurrentIndex = ref(0);
  const vanImageHandleClick = (idx) => {
    vanImageCurrentIndex.value = idx;
    vanImageModalShow.value = true;
  };
  const vanImageHandleDblClick = (idx) => {
    vanImageCurrentIndex.value = idx;
    vanImageModalShow.value = true;
  };
  const vanImageClose = () => {
    vanImageModalShow.value = false;
  };
  return {
    vanImageModalShow,
    vanImageCurrentIndex,
    vanImageHandleClick,
    vanImageHandleDblClick,
    vanImageClose
  };
}
const _sfc_main$1 = {
  __name: "ImageCard",
  __ssrInlineRender: true,
  props: {
    images: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  setup(__props) {
    const props = __props;
    const {
      vanImageModalShow,
      vanImageCurrentIndex,
      vanImageHandleClick,
      vanImageHandleDblClick,
      vanImageClose
    } = useVanImagePreview();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_LazyImage = __unplugin_components_0$1;
      const _component_van_image_preview = ImagePreview;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "img-preview-container" }, _attrs))} data-v-2699d477><div class="moment-card" data-v-2699d477><div class="img-grid" data-v-2699d477><!--[-->`);
      ssrRenderList(props.images, (src, idx) => {
        _push(ssrRenderComponent(_component_LazyImage, {
          class: "grid-img",
          key: idx,
          src,
          onClick: ($event) => unref(vanImageHandleClick)(idx),
          onDblclick: ($event) => unref(vanImageHandleDblClick)(idx)
        }, null, _parent));
      });
      _push(`<!--]--></div></div>`);
      if (unref(vanImageModalShow)) {
        _push(ssrRenderComponent(_component_van_image_preview, {
          show: unref(vanImageModalShow),
          "onUpdate:show": ($event) => isRef(vanImageModalShow) ? vanImageModalShow.value = $event : null,
          images: props.images,
          "start-position": unref(vanImageCurrentIndex),
          onClose: unref(vanImageClose),
          teleport: "body",
          "show-indicators": "",
          "show-index": false
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/business/ImageCard.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __unplugin_components_0 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-2699d477"]]);
const _imports_0 = "data:image/svg+xml,%3c?xml%20version='1.0'%20standalone='no'?%3e%3c!DOCTYPE%20svg%20PUBLIC%20'-//W3C//DTD%20SVG%201.1//EN'%20'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3e%3csvg%20t='1771878637723'%20class='icon'%20viewBox='0%200%201024%201024'%20version='1.1'%20xmlns='http://www.w3.org/2000/svg'%20p-id='2734'%20xmlns:xlink='http://www.w3.org/1999/xlink'%20width='200'%20height='200'%3e%3cpath%20d='M408.576%20515.697778l316.302222%20316.302222a50.176%2050.176%200%201%201-70.997333%2070.940444L316.529778%20565.475556a50.005333%2050.005333%200%200%201-31.971556-49.834667%2050.062222%2050.062222%200%200%201%2031.914667-49.834667l337.408-337.351111a50.176%2050.176%200%200%201%2070.997333%2070.940445l-316.302222%20316.302222z'%20fill='%23ffffff'%20p-id='2735'%3e%3c/path%3e%3c/svg%3e";
const _sfc_main = {
  __name: "StoreDetail",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    useRouter();
    const images = ref([]);
    const {
      vanImageModalShow,
      vanImageCurrentIndex,
      vanImageClose
    } = useVanImagePreview();
    const storeInfo = ref({});
    const loading = ref(true);
    const error = ref("");
    const hasGoods = ref(false);
    const getStoreDetailInfo = async () => {
      const storeid = route.params.storeid;
      if (!storeid) {
        error.value = "店铺 ID 不存在";
        loading.value = false;
        return;
      }
      try {
        loading.value = true;
        error.value = "";
        const res = await getStoreDetail(storeid);
        if (res.data.code === 200) {
          storeInfo.value = res.data.data;
          if (storeInfo.value.goods.length > 0) {
            images.value = [...storeInfo.value.goods.map((good) => good.goods_img)];
            hasGoods.value = true;
          } else {
            hasGoods.value = false;
            images.value = [storeInfo.value.store_img];
          }
        } else {
          error.value = res.data.message || "获取店铺详情失败";
        }
      } catch (err) {
        console.error("获取店铺详情失败:", err);
        error.value = "获取店铺详情失败";
      } finally {
        loading.value = false;
      }
    };
    onMounted(() => {
      getStoreDetailInfo();
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ImageCard = __unplugin_components_0;
      const _component_van_image_preview = ImagePreview;
      const _component_TargetMap = __unplugin_components_2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "store-detail-container" }, _attrs))} data-v-388bdcfa><div class="nav-bar" data-v-388bdcfa><button class="back-btn" data-v-388bdcfa><img${ssrRenderAttr("src", _imports_0)} alt="返回" class="back-icon" data-v-388bdcfa></button><span class="nav-title" data-v-388bdcfa>${ssrInterpolate(storeInfo.value.name)}</span></div><div class="store-detail-content" data-v-388bdcfa><div class="img-preview-box" data-v-388bdcfa>`);
      if (hasGoods.value) {
        _push(ssrRenderComponent(_component_ImageCard, { images: images.value }, null, _parent));
      } else {
        _push(`<div class="store-image" data-v-388bdcfa><img${ssrRenderAttr("src", storeInfo.value.store_img || unref(defaultImgSrc))}${ssrRenderAttr("alt", storeInfo.value.name)}${ssrRenderAttr("images", images.value)} data-v-388bdcfa></div>`);
      }
      if (unref(vanImageModalShow)) {
        _push(ssrRenderComponent(_component_van_image_preview, {
          show: unref(vanImageModalShow),
          "onUpdate:show": ($event) => isRef(vanImageModalShow) ? vanImageModalShow.value = $event : null,
          images: images.value,
          "start-position": unref(vanImageCurrentIndex),
          onClose: unref(vanImageClose),
          teleport: "body",
          "show-indicators": "",
          "show-index": false
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="store-info" data-v-388bdcfa><h2 class="store-name" data-v-388bdcfa>${ssrInterpolate(storeInfo.value.name)}</h2>`);
      if (storeInfo.value.business_hours) {
        _push(`<div class="store-hours" data-v-388bdcfa><p class="hours-content" data-v-388bdcfa>${ssrInterpolate(storeInfo.value.business_hours)}</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="store-rating-average" data-v-388bdcfa><span class="rating" data-v-388bdcfa>${ssrInterpolate(storeInfo.value.rating)}分</span><span class="average-cost" data-v-388bdcfa>￥${ssrInterpolate(storeInfo.value.average_cost)}/人</span></div>`);
      if (storeInfo.value.title) {
        _push(`<div class="store-title" data-v-388bdcfa><span data-v-388bdcfa>${ssrInterpolate(storeInfo.value.title)}</span></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="store-address" data-v-388bdcfa>`);
      _push(ssrRenderComponent(_component_TargetMap, {
        address: (storeInfo.value.province || "") + (storeInfo.value.city || "") + (storeInfo.value.name || "") + (storeInfo.value.address || "")
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<img class="map-icon"${ssrRenderAttr("src", _imports_1)} alt="位置" data-v-388bdcfa${_scopeId}>`);
          } else {
            return [
              createVNode("img", {
                class: "map-icon",
                src: _imports_1,
                alt: "位置"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<span data-v-388bdcfa>${ssrInterpolate(storeInfo.value.address)}</span></div>`);
      if (storeInfo.value.province || storeInfo.value.city) {
        _push(`<div class="store-location" data-v-388bdcfa><span data-v-388bdcfa>${ssrInterpolate(storeInfo.value.province)}${ssrInterpolate(storeInfo.value.city)}</span></div>`);
      } else {
        _push(`<!---->`);
      }
      if (storeInfo.value.description) {
        _push(`<div class="store-description" data-v-388bdcfa><h3 class="description-title" data-v-388bdcfa>${ssrInterpolate(storeInfo.value.description_title || "店铺描述")}</h3><p class="description-content" data-v-388bdcfa>${storeInfo.value.description ?? ""}</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/views/home/StoreDetail.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const StoreDetail = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-388bdcfa"]]);
export {
  StoreDetail as default
};
