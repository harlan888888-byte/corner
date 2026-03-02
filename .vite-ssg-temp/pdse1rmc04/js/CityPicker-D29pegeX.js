import { ref, computed, onMounted, mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderTeleport, ssrRenderClass, ssrRenderList, ssrInterpolate, ssrRenderAttr } from "vue/server-renderer";
import { _ as _export_sfc } from "../main.mjs";
const _sfc_main = {
  __name: "CityPicker",
  __ssrInlineRender: true,
  emits: ["select", "close"],
  setup(__props, { emit: __emit }) {
    const isEnterActive = ref(false);
    const isLeaveActive = ref(false);
    const cities = ref([
      { id: 1, name: "北京", letter: "B" },
      { id: 2, name: "上海", letter: "S" },
      { id: 3, name: "广州", letter: "G" },
      { id: 4, name: "深圳", letter: "S" },
      { id: 5, name: "杭州", letter: "H" },
      { id: 6, name: "成都", letter: "C" },
      { id: 7, name: "武汉", letter: "W" },
      { id: 8, name: "西安", letter: "X" },
      { id: 9, name: "南京", letter: "N" },
      { id: 10, name: "重庆", letter: "C" },
      { id: 11, name: "天津", letter: "T" },
      { id: 12, name: "苏州", letter: "S" },
      { id: 13, name: "郑州", letter: "Z" },
      { id: 14, name: "长沙", letter: "C" },
      { id: 15, name: "青岛", letter: "Q" },
      { id: 16, name: "宁波", letter: "N" },
      { id: 17, name: "东莞", letter: "D" },
      { id: 18, name: "佛山", letter: "F" },
      { id: 19, name: "厦门", letter: "X" },
      { id: 20, name: "济南", letter: "J" },
      { id: 21, name: "大连", letter: "D" },
      { id: 22, name: "哈尔滨", letter: "H" },
      { id: 23, name: "福州", letter: "F" },
      { id: 24, name: "昆明", letter: "K" },
      { id: 25, name: "南宁", letter: "N" },
      { id: 26, name: "贵阳", letter: "G" },
      { id: 27, name: "南昌", letter: "N" },
      { id: 28, name: "合肥", letter: "H" },
      { id: 29, name: "太原", letter: "T" },
      { id: 30, name: "石家庄", letter: "S" }
    ]);
    const hotCities = ref([
      { id: 0, name: "所有城市" },
      { id: 1, name: "佛山" },
      { id: 2, name: "北京" },
      { id: 3, name: "上海" },
      { id: 4, name: "广州" },
      { id: 5, name: "深圳" },
      { id: 6, name: "杭州" },
      { id: 7, name: "成都" },
      { id: 8, name: "武汉" },
      { id: 9, name: "西安" }
    ]);
    const groupedCities = computed(() => {
      const groups = {};
      cities.value.forEach((city) => {
        if (!groups[city.letter]) {
          groups[city.letter] = [];
        }
        groups[city.letter].push(city);
      });
      return groups;
    });
    const indexLetters = computed(() => {
      return Object.keys(groupedCities.value).sort();
    });
    ref(null);
    ref(null);
    const currentLetter = ref("");
    ref(false);
    onMounted(() => {
      setTimeout(() => {
        isEnterActive.value = true;
      }, 10);
    });
    return (_ctx, _push, _parent, _attrs) => {
      {
        _push(`<div${ssrRenderAttrs(mergeProps({ style: { "display": "none" } }, _attrs))} data-v-7f960051>`);
        ssrRenderTeleport(_push, (_push2) => {
          _push2(`<div class="${ssrRenderClass([{
            "enter-active": isEnterActive.value,
            "leave-active": isLeaveActive.value
          }, "city-picker-container"])}" data-v-7f960051><div class="city-picker-header" data-v-7f960051><h2 data-v-7f960051>选择城市</h2><button class="close-btn" data-v-7f960051>取消</button></div><div class="city-picker-content" data-v-7f960051><div class="city-section" data-v-7f960051><div class="city-section-title" data-v-7f960051>热门</div><div class="city-list hot-city-list" data-v-7f960051><!--[-->`);
          ssrRenderList(hotCities.value, (city) => {
            _push2(`<div class="city-item" data-v-7f960051>${ssrInterpolate(city.name)}</div>`);
          });
          _push2(`<!--]--></div></div><!--[-->`);
          ssrRenderList(indexLetters.value, (letter) => {
            _push2(`<div class="city-section"${ssrRenderAttr("id", `letter-${letter}`)} data-v-7f960051><div class="city-section-title" data-v-7f960051>${ssrInterpolate(letter)}</div><div class="city-list" data-v-7f960051><!--[-->`);
            ssrRenderList(groupedCities.value[letter], (city) => {
              _push2(`<div class="city-item" data-v-7f960051>${ssrInterpolate(city.name)}</div>`);
            });
            _push2(`<!--]--></div></div>`);
          });
          _push2(`<!--]--></div><div class="city-picker-index" data-v-7f960051><!--[-->`);
          ssrRenderList(indexLetters.value, (letter) => {
            _push2(`<div class="${ssrRenderClass([{ active: currentLetter.value === letter }, "index-item"])}" data-v-7f960051>${ssrInterpolate(letter)}</div>`);
          });
          _push2(`<!--]--></div></div>`);
        }, "body", false, _parent);
        _push(`</div>`);
      }
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/business/CityPicker.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const CityPicker = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-7f960051"]]);
export {
  CityPicker as C
};
