import { Swipe, SwipeItem, Tabbar, TabbarItem } from "vant/es/index.mjs";
import "vant/es/tabbar-item/style/index.mjs";
import "vant/es/tabbar/style/index.mjs";
import "vant/es/swipe-item/style/index.mjs";
import "vant/es/swipe/style/index.mjs";
import { ref, watch, onMounted, nextTick, mergeProps, withCtx, createVNode, resolveDynamicComponent, openBlock, createBlock, KeepAlive, createCommentVNode, Fragment, renderList, useSSRContext, defineAsyncComponent, resolveComponent, isRef, unref, createTextVNode, toDisplayString, Transition } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderVNode, ssrInterpolate } from "vue/server-renderer";
import { useRouter, useRoute } from "vue-router";
import { _ as _export_sfc } from "../main.mjs";
import "pinia";
import "pinia-plugin-persistedstate";
const _sfc_main$1 = {
  __name: "SwipeTabs",
  __ssrInlineRender: true,
  props: {
    tabs: {
      type: Array,
      required: true,
      default: () => []
    },
    activeTab: {
      type: Number,
      default: 0
    },
    if_click: {
      type: Boolean,
      default: false
    }
  },
  emits: ["update:activeTab", "tabChange"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const router = useRouter();
    const route = useRoute();
    const swipeRef = ref(null);
    const activeTab = ref(props.activeTab);
    const pageRefs = ref([]);
    const scrollPositions = ref([]);
    const loadedTabs = ref([]);
    const trackElement = ref(null);
    const initScrollPositions = () => {
      scrollPositions.value = new Array(props.tabs.length).fill(0);
    };
    const syncRouteWithTab = () => {
      const path = route.path;
      const tabIndex = props.tabs.findIndex((tab) => tab.path === path);
      if (tabIndex !== -1) {
        activeTab.value = tabIndex;
      }
    };
    const saveScrollPosition = (index2, event) => {
      event.stopPropagation();
      scrollPositions.value[index2] = event.target.scrollTop;
    };
    const restoreScrollPosition = (index2) => {
      if (pageRefs[index2]) {
        pageRefs[index2].scrollTop = scrollPositions.value[index2];
      }
    };
    const handleSwipeChange = (index2) => {
      activeTab.value = index2;
      emit("update:activeTab", index2);
      emit("tabChange", index2);
      const tab = props.tabs[index2];
      if (tab && tab.path && route.path !== tab.path) {
        setTimeout(() => {
          router.push(tab.path);
        }, 50);
      }
      if (!loadedTabs.value.includes(index2)) {
        loadedTabs.value.push(index2);
      }
      restoreScrollPosition(index2);
    };
    watch(
      () => route.path,
      () => {
        syncRouteWithTab();
        if (swipeRef.value) {
          swipeRef.value.swipeTo(activeTab.value, { immediate: props.if_click });
        }
        restoreScrollPosition(activeTab.value);
      }
    );
    watch(
      () => props.tabs,
      () => {
        initScrollPositions();
        syncRouteWithTab();
      },
      { deep: true }
    );
    onMounted(async () => {
      initScrollPositions();
      await nextTick();
      trackElement.value = document.querySelector(".page-swipe .van-swipe__track");
      syncRouteWithTab();
      const currentIndex = activeTab.value;
      if (!loadedTabs.value.includes(currentIndex)) {
        loadedTabs.value.push(currentIndex);
      }
      if (swipeRef.value) {
        swipeRef.value.swipeTo(activeTab.value, { immediate: true });
      }
      restoreScrollPosition(activeTab.value);
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_van_swipe = Swipe;
      const _component_van_swipe_item = SwipeItem;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "swipe-tabs-container" }, _attrs))} data-v-11b4f035><div class="main-content" data-v-11b4f035>`);
      _push(ssrRenderComponent(_component_van_swipe, {
        ref_key: "swipeRef",
        ref: swipeRef,
        modelValue: activeTab.value,
        "onUpdate:modelValue": ($event) => activeTab.value = $event,
        loop: false,
        "show-indicators": false,
        onChange: handleSwipeChange,
        duration: 300,
        class: "page-swipe",
        "auto-play": false,
        "stop-propagation": true,
        "touch-move-prevent-default": false,
        "touch-angle": 45
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<!--[-->`);
            ssrRenderList(__props.tabs, (tab, index2) => {
              _push2(ssrRenderComponent(_component_van_swipe_item, {
                key: index2,
                class: "swipe-item"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="page-container" data-v-11b4f035${_scopeId2}>`);
                    if (index2 === activeTab.value || loadedTabs.value.includes(index2)) {
                      ssrRenderVNode(_push3, createVNode(resolveDynamicComponent(tab.component), null, null), _parent3, _scopeId2);
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(`</div>`);
                  } else {
                    return [
                      createVNode("div", {
                        ref_for: true,
                        ref: "(el) => { if (el) pageRefs[index] = el }",
                        class: "page-container",
                        onScroll: ($event) => saveScrollPosition(index2, $event)
                      }, [
                        index2 === activeTab.value || loadedTabs.value.includes(index2) ? (openBlock(), createBlock(KeepAlive, { key: 0 }, [
                          (openBlock(), createBlock(resolveDynamicComponent(tab.component)))
                        ], 1024)) : createCommentVNode("", true)
                      ], 40, ["onScroll"])
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            });
            _push2(`<!--]-->`);
          } else {
            return [
              (openBlock(true), createBlock(Fragment, null, renderList(__props.tabs, (tab, index2) => {
                return openBlock(), createBlock(_component_van_swipe_item, {
                  key: index2,
                  class: "swipe-item"
                }, {
                  default: withCtx(() => [
                    createVNode("div", {
                      ref_for: true,
                      ref: "(el) => { if (el) pageRefs[index] = el }",
                      class: "page-container",
                      onScroll: ($event) => saveScrollPosition(index2, $event)
                    }, [
                      index2 === activeTab.value || loadedTabs.value.includes(index2) ? (openBlock(), createBlock(KeepAlive, { key: 0 }, [
                        (openBlock(), createBlock(resolveDynamicComponent(tab.component)))
                      ], 1024)) : createCommentVNode("", true)
                    ], 40, ["onScroll"])
                  ]),
                  _: 2
                }, 1024);
              }), 128))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/base/SwipeTabs.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __unplugin_components_0 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-11b4f035"]]);
const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const HomeTab = defineAsyncComponent(() => import("./HomeTab-D86wNsuC.js"));
    const FootPrintTab = defineAsyncComponent(() => import("./FootPrintTab-Bmusy2e4.js"));
    const PlanTab = defineAsyncComponent(() => import("./PlanTab-BNz3pw1y.js"));
    const MineTab = defineAsyncComponent(() => import("./MineTab-BRE3X47g.js"));
    const router = useRouter();
    const route = useRoute();
    const tabbarRef = ref(null);
    const activeTab = ref(0);
    const if_click = ref(false);
    const tabs = [
      {
        path: "/hometab",
        title: "首页",
        icon: "wap-home-o",
        component: HomeTab
      },
      {
        path: "/footprint",
        title: "足迹",
        icon: "eye-o",
        component: FootPrintTab
      },
      {
        path: "/plan",
        title: "计划",
        icon: "star-o",
        component: PlanTab
      },
      {
        path: "/mine",
        title: "我的",
        icon: "user-o",
        component: MineTab
      }
    ];
    const clickTab = () => {
      if_click.value = true;
    };
    const handleTabChange = (index2) => {
      activeTab.value = index2;
    };
    const handleTabbarChange = (index2) => {
      activeTab.value = index2;
      const paths = ["/hometab", "/footprint", "/plan", "/mine"];
      router.push(paths[index2]);
    };
    watch(
      () => route.path,
      () => {
        const path = route.path;
        const tabIndex = tabs.findIndex((tab) => tab.path === path);
        if (tabIndex !== -1) {
          activeTab.value = tabIndex;
        }
      }
    );
    onMounted(() => {
      const path = route.path;
      if (path !== "/hometab") {
        if_click.value = true;
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SwipeTabs = __unplugin_components_0;
      const _component_van_tabbar = Tabbar;
      const _component_van_tabbar_item = TabbarItem;
      const _component_router_view = resolveComponent("router-view");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "layout-container" }, _attrs))} data-v-a029c52b>`);
      _push(ssrRenderComponent(_component_SwipeTabs, {
        tabs,
        if_click: unref(if_click),
        activeTab: unref(activeTab),
        "onUpdate:activeTab": ($event) => isRef(activeTab) ? activeTab.value = $event : null,
        onTabChange: handleTabChange
      }, null, _parent));
      _push(ssrRenderComponent(_component_van_tabbar, {
        ref_key: "tabbarRef",
        ref: tabbarRef,
        modelValue: unref(activeTab),
        "onUpdate:modelValue": ($event) => isRef(activeTab) ? activeTab.value = $event : null,
        "active-color": "#b44bc6",
        "inactive-color": "#000",
        onChange: handleTabbarChange
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<!--[-->`);
            ssrRenderList(tabs, (tab, index2) => {
              _push2(ssrRenderComponent(_component_van_tabbar_item, {
                key: index2,
                icon: tab.icon,
                onClick: clickTab
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(tab.title)}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(tab.title), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            });
            _push2(`<!--]-->`);
          } else {
            return [
              (openBlock(), createBlock(Fragment, null, renderList(tabs, (tab, index2) => {
                return createVNode(_component_van_tabbar_item, {
                  key: index2,
                  icon: tab.icon,
                  onClick: clickTab
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(tab.title), 1)
                  ]),
                  _: 2
                }, 1032, ["icon"]);
              }), 64))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_router_view, null, {
        default: withCtx(({ Component }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(``);
            if (!["/hometab", "/footprint", "/plan", "/mine"].includes(unref(route).path)) {
              ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(Component), null, null), _parent2, _scopeId);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createVNode(Transition, {
                name: "slide-fade",
                mode: "out-in"
              }, {
                default: withCtx(() => [
                  !["/hometab", "/footprint", "/plan", "/mine"].includes(unref(route).path) ? (openBlock(), createBlock(resolveDynamicComponent(Component), { key: 0 })) : createCommentVNode("", true)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/views/layout/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-a029c52b"]]);
export {
  index as default
};
