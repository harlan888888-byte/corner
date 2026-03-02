import { _ as __unplugin_components_0, d as defaultImgSrc$1, a as __unplugin_components_2, b as _imports_1, c as __unplugin_components_2$1, g as getStoreInfo } from "./store-D-vP3179.js";
import { mergeProps, unref, withCtx, createVNode, useSSRContext, ref, onMounted, onUnmounted, watch } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderList, ssrRenderSlot } from "vue/server-renderer";
import { useRouter, useRoute } from "vue-router";
import { _ as _export_sfc } from "../main.mjs";
import { C as CityPicker } from "./CityPicker-D29pegeX.js";
import { u as useBackButton } from "./useBackButton-Bl8j8FnM.js";
import "vant/es/index.mjs";
import "vant/es/loading/style/index.mjs";
import "axios";
import "element-plus";
import "pinia";
import "pinia-plugin-persistedstate";
const _sfc_main$5 = {
  __name: "StoreItem",
  __ssrInlineRender: true,
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  setup(__props) {
    useRouter();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_LazyImage = __unplugin_components_0;
      const _component_TargetMap = __unplugin_components_2;
      _push(`<li${ssrRenderAttrs(mergeProps({ class: "store-item-box" }, _attrs))} data-v-c5f864c4><div class="store-item" data-v-c5f864c4><div class="left-item" data-v-c5f864c4><div class="store-img" data-v-c5f864c4>`);
      _push(ssrRenderComponent(_component_LazyImage, {
        src: __props.item.store_img || unref(defaultImgSrc$1),
        alt: "店铺"
      }, null, _parent));
      _push(`</div></div><div class="right-item" data-v-c5f864c4><div class="store-name text-item" data-v-c5f864c4><span data-v-c5f864c4>${ssrInterpolate(__props.item.name)}</span></div><div class="store-rat-ave text-item" data-v-c5f864c4><div class="store-rating" data-v-c5f864c4><span data-v-c5f864c4>${ssrInterpolate(__props.item.rating)}分</span></div><div class="store-average-cost text-item" data-v-c5f864c4><span data-v-c5f864c4>￥${ssrInterpolate(__props.item.average_cost)}/人</span></div></div><div class="store-title text-item" data-v-c5f864c4><span data-v-c5f864c4>${ssrInterpolate(__props.item.title)}</span></div><div class="store-address text-item" data-v-c5f864c4><div class="target-map" data-v-c5f864c4>`);
      _push(ssrRenderComponent(_component_TargetMap, {
        address: (__props.item.province || "") + (__props.item.city || "") + (__props.item.name || "") + (__props.item.address || "")
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<img class="map-icon"${ssrRenderAttr("src", _imports_1)} alt="位置" data-v-c5f864c4${_scopeId}>`);
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
      _push(`</div><span data-v-c5f864c4>${ssrInterpolate(__props.item.address)}</span></div></div></div></li>`);
    };
  }
};
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/page/home/StoreItem.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const __unplugin_components_5 = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__scopeId", "data-v-c5f864c4"]]);
const _sfc_main$4 = {
  __name: "LoadMore",
  __ssrInlineRender: true,
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    hasMore: {
      type: Boolean,
      default: true
    },
    loadingText: {
      type: String,
      default: "加载中..."
    },
    noMoreText: {
      type: String,
      default: "已加载全部数据"
    }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "load-more" }, _attrs))} data-v-d3cc79ad>`);
      if (__props.loading) {
        _push(`<span data-v-d3cc79ad>${ssrInterpolate(__props.loadingText)}</span>`);
      } else if (!__props.hasMore) {
        _push(`<span data-v-d3cc79ad>${ssrInterpolate(__props.noMoreText)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/base/LoadMore.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const LoadMore = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-d3cc79ad"]]);
const _sfc_main$3 = {
  __name: "StoreList",
  __ssrInlineRender: true,
  props: {
    storeList: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    },
    hasMore: {
      type: Boolean,
      default: true
    },
    loadingText: {
      type: String,
      default: "加载中..."
    },
    noMoreText: {
      type: String,
      default: "滑到底啦！暂无更多数据~"
    }
  },
  emits: ["loadMore"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const scrollContainer = ref(null);
    const storeListRef = ref(null);
    const handleScroll = (event) => {
      const target = event.target === window ? window : event.target;
      const scrollTop = target.scrollTop || document.documentElement.scrollTop || document.body.scrollTop;
      const scrollHeight = target.scrollHeight || document.documentElement.scrollHeight || document.body.scrollHeight;
      const clientHeight = target.clientHeight || document.documentElement.clientHeight || document.body.clientHeight;
      if (scrollTop + clientHeight >= scrollHeight - 30) {
        emit("loadMore");
      }
    };
    onMounted(() => {
      setTimeout(() => {
        let container = storeListRef.value;
        while (container && !container.classList.contains("page-container")) {
          container = container.parentElement;
        }
        if (container) {
          scrollContainer.value = container;
          container.addEventListener("scroll", handleScroll);
        }
      }, 100);
    });
    onUnmounted(() => {
      if (scrollContainer.value) {
        scrollContainer.value.removeEventListener("scroll", handleScroll);
      }
      window.removeEventListener("scroll", handleScroll);
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "store-list-container" }, _attrs))} data-v-423ad3ef><ul class="store-list" data-v-423ad3ef><!--[-->`);
      ssrRenderList(__props.storeList, (item) => {
        ssrRenderSlot(_ctx.$slots, "default", {
          key: item.id,
          item
        }, null, _push, _parent);
      });
      _push(`<!--]-->`);
      if (__props.storeList.length > 0) {
        _push(`<li class="load-more-item" data-v-423ad3ef>`);
        _push(ssrRenderComponent(LoadMore, {
          loading: __props.loading,
          hasMore: __props.hasMore,
          loadingText: __props.loadingText,
          noMoreText: __props.noMoreText
        }, null, _parent));
        _push(`</li>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</ul></div>`);
    };
  }
};
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/business/StoreList.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __unplugin_components_4 = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-423ad3ef"]]);
const defaultImgSrc = "/images/miss_data-BQPm0Dy2.svg";
const _sfc_main$2 = {
  __name: "EmptyState",
  __ssrInlineRender: true,
  props: {
    imgSrc: {
      type: String,
      default: ""
    },
    altText: {
      type: String,
      default: "无数据"
    },
    text: {
      type: String,
      default: "暂无数据"
    }
  },
  setup(__props) {
    const defaultImg = ref(defaultImgSrc);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "empty-state" }, _attrs))} data-v-031ec368><img${ssrRenderAttr("src", __props.imgSrc || defaultImg.value)}${ssrRenderAttr("alt", __props.altText)} class="empty-state-img" data-v-031ec368><p class="empty-state-text" data-v-031ec368>${ssrInterpolate(__props.text)}</p></div>`);
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/base/EmptyState.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __unplugin_components_3 = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-031ec368"]]);
const _sfc_main$1 = {
  __name: "SearchBar",
  __ssrInlineRender: true,
  props: {
    placeholder: {
      type: String,
      default: "请输入搜索关键词"
    },
    value: {
      type: String,
      default: ""
    }
  },
  emits: ["input", "search", "clear"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const searchValue = ref(props.value);
    ref("");
    const searchHistory = ref([]);
    const showHistory = ref(false);
    const searchWrapperRef = ref(null);
    const historyRef = ref(null);
    const initSearchHistory = () => {
      const history = localStorage.getItem("searchHistory");
      if (history) {
        searchHistory.value = JSON.parse(history);
      }
    };
    const handleClickOutside = (event) => {
      if (showHistory.value) {
        const searchWrapper = searchWrapperRef.value;
        historyRef.value;
        if (searchWrapper && !searchWrapper.contains(event.target)) {
          showHistory.value = false;
        }
      }
    };
    initSearchHistory();
    onMounted(() => {
      document.addEventListener("click", handleClickOutside);
    });
    onUnmounted(() => {
      document.removeEventListener("click", handleClickOutside);
    });
    watch(
      () => props.value,
      (newValue) => {
        searchValue.value = newValue;
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        ref_key: "searchWrapperRef",
        ref: searchWrapperRef,
        class: "custom-search-wrapper"
      }, _attrs))} data-v-ce0abf89><div class="custom-search-container" data-v-ce0abf89><input type="text"${ssrRenderAttr("value", searchValue.value)}${ssrRenderAttr("placeholder", __props.placeholder)} class="custom-search-input" data-v-ce0abf89><div class="custom-search-actions" data-v-ce0abf89>`);
      if (searchValue.value) {
        _push(`<span class="custom-search-clear" data-v-ce0abf89> ✕ </span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button class="custom-search-btn" data-v-ce0abf89>搜索</button></div></div>`);
      if (showHistory.value && searchHistory.value.length > 0) {
        _push(`<div class="custom-search-history" data-v-ce0abf89><div class="custom-search-history-header" data-v-ce0abf89><span data-v-ce0abf89>搜索历史</span><button class="custom-search-history-clear" data-v-ce0abf89> 清空 </button></div><ul class="custom-search-history-list" data-v-ce0abf89><!--[-->`);
        ssrRenderList(searchHistory.value, (item, index) => {
          _push(`<li class="custom-search-history-item" data-v-ce0abf89><span class="custom-search-history-text" data-v-ce0abf89>${ssrInterpolate(item)}</span><span class="custom-search-history-delete" data-v-ce0abf89> ✕ </span></li>`);
        });
        _push(`<!--]--></ul></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/base/SearchBar.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __unplugin_components_1 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-ce0abf89"]]);
const _sfc_main = {
  __name: "HomeTab",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const router = useRouter();
    const showCityPicker = ref(false);
    const selectedCity = ref(null);
    const {
      pushHistory,
      popHistory,
      resetHistoryCount,
      getAddedHistoryCount,
      handlePopState,
      pushDialog,
      resetRouteState
    } = useBackButton();
    const popStateHandler = handlePopState(router, route);
    const btnLoading = ref(false);
    const btnLoadingText = ref("正在加载...");
    const loadingText = ref("加载中...");
    const noMoreText = ref("滑到底啦！暂无更多数据~");
    const searchValue = ref("");
    const storeInfoList = ref([]);
    const currentPage = ref(1);
    const pageSize = ref(8);
    const hasMoreData = ref(true);
    const total = ref(0);
    ref(route.query.storeid || "");
    ref(false);
    const isMounted = ref(false);
    const closeCityPicker = () => {
      popHistory(router, route);
    };
    watch(showCityPicker, (newValue) => {
      if (newValue) {
        pushHistory(router, route);
        pushDialog(route, () => {
          showCityPicker.value = false;
        });
      }
    });
    const initSelectedCity = () => {
      try {
        const city = localStorage.getItem("selectedCity");
        if (city) {
          selectedCity.value = JSON.parse(city);
        }
      } catch (error) {
        console.error("初始化城市失败：", error);
        selectedCity.value = null;
      }
    };
    const saveSelectedCity = (city) => {
      try {
        if (city && city.name !== "所有城市") {
          localStorage.setItem("selectedCity", JSON.stringify(city));
        } else {
          localStorage.removeItem("selectedCity");
        }
      } catch (error) {
        console.error("保存城市失败：", error);
      }
    };
    const handleCitySelect = (city) => {
      try {
        if (city.name === "所有城市") {
          selectedCity.value = null;
        } else {
          selectedCity.value = city;
        }
        saveSelectedCity(selectedCity.value);
        closeCityPicker();
        resetPaginationAndFetchData();
      } catch (error) {
        console.error("选择城市失败：", error);
      }
    };
    const onSearch = (val) => {
      searchValue.value = val;
      resetPaginationAndFetchData();
    };
    const handleInput = (val) => {
      searchValue.value = val;
    };
    const resetPaginationAndFetchData = () => {
      try {
        currentPage.value = 1;
        hasMoreData.value = true;
        storeInfoList.value = [];
        getStoreInfoList();
        const scrollContainer = document.querySelector(".page-container");
        if (scrollContainer) {
          scrollContainer.scrollTop = 0;
        }
      } catch (error) {
        console.error("重置分页失败：", error);
      }
    };
    const getStoreInfoList = async () => {
      if (!hasMoreData.value || btnLoading.value) return;
      btnLoading.value = true;
      try {
        const params = {
          page: currentPage.value,
          pageSize: pageSize.value,
          keyword: searchValue.value
        };
        if (selectedCity.value && selectedCity.value.name !== "所有城市") {
          params.city = selectedCity.value.name;
        }
        const res = await getStoreInfo(params);
        if (res && res.data && res.data.code === 200) {
          if (currentPage.value === 1) {
            storeInfoList.value = res.data.data || [];
          } else {
            storeInfoList.value = [...storeInfoList.value, ...res.data.data || []];
          }
          total.value = res.data.count || 0;
          hasMoreData.value = storeInfoList.value.length < total.value;
          currentPage.value++;
        }
      } catch (error) {
        console.error("获取店铺列表失败：", error);
        hasMoreData.value = false;
      } finally {
        btnLoading.value = false;
      }
    };
    onMounted(() => {
      try {
        isMounted.value = true;
        initSelectedCity();
        getStoreInfoList();
        window.addEventListener("popstate", popStateHandler);
      } catch (error) {
        console.error("组件挂载失败：", error);
      }
    });
    watch(
      () => route.path,
      (newPath, oldPath) => {
        const currentRouteKey = route.name || route.path || "default";
        const isCurrentRoute = currentRouteKey.includes("/hometab");
        if (isCurrentRoute) {
          resetRouteState(currentRouteKey);
        }
      }
    );
    onUnmounted(() => {
      try {
        window.removeEventListener("popstate", popStateHandler);
        while (getAddedHistoryCount() > 0) {
          popHistory(router, route);
        }
        resetHistoryCount();
      } catch (error) {
        console.error("组件卸载失败：", error);
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_CityPicker = CityPicker;
      const _component_SearchBar = __unplugin_components_1;
      const _component_LoadingToast = __unplugin_components_2$1;
      const _component_EmptyState = __unplugin_components_3;
      const _component_StoreList = __unplugin_components_4;
      const _component_StoreItem = __unplugin_components_5;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "home-tab-container" }, _attrs))} data-v-371b69bb><div class="tab-top-item" data-v-371b69bb><div class="top-item" data-v-371b69bb><div class="title-item" data-v-371b69bb><h1 data-v-371b69bb>街角</h1></div><div class="city-selector" data-v-371b69bb><button class="select-city-btn" data-v-371b69bb>${ssrInterpolate(selectedCity.value ? selectedCity.value.name : "选择城市")}</button>`);
      if (showCityPicker.value) {
        _push(ssrRenderComponent(_component_CityPicker, {
          onSelect: handleCitySelect,
          onClose: closeCityPicker
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
      _push(ssrRenderComponent(_component_SearchBar, {
        placeholder: "请输入店名关键词",
        value: searchValue.value,
        onInput: handleInput,
        onSearch
      }, null, _parent));
      _push(`</div>`);
      if (btnLoading.value) {
        _push(ssrRenderComponent(_component_LoadingToast, { text: btnLoadingText.value }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (!btnLoading.value && storeInfoList.value.length === 0) {
        _push(ssrRenderComponent(_component_EmptyState, null, null, _parent));
      } else {
        _push(ssrRenderComponent(_component_StoreList, {
          storeList: storeInfoList.value,
          loading: btnLoading.value,
          hasMore: hasMoreData.value,
          loadingText: loadingText.value,
          noMoreText: noMoreText.value,
          onLoadMore: getStoreInfoList
        }, {
          default: withCtx(({ item }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_StoreItem, { item }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_StoreItem, { item }, null, 8, ["item"])
              ];
            }
          }),
          _: 1
        }, _parent));
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/views/layout/HomeTab.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const HomeTab = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-371b69bb"]]);
export {
  HomeTab as default
};
