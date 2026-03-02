import { Loading } from "vant/es/index.mjs";
import "vant/es/loading/style/index.mjs";
import { ref, onMounted, mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate } from "vue/server-renderer";
import { useRouter } from "vue-router";
import { _ as _export_sfc } from "../main.mjs";
import "pinia";
import "pinia-plugin-persistedstate";
const _sfc_main = {
  __name: "FootPrintTab",
  __ssrInlineRender: true,
  setup(__props) {
    const footprintList = ref([]);
    const isLoaded = ref(false);
    const rawFootprintList = [
      {
        title: "转角咖啡",
        date: "2026-02-15",
        description: "今天和朋友一起来到了这家咖啡店，环境非常好，咖啡也很美味。店内的装修风格很温馨，让人感觉很放松。服务员的态度也很好，推荐了他们的特色咖啡，味道确实不错。",
        location: "北京市朝阳区建国路88号",
        time: "14:30"
      },
      {
        title: "三里屯太古里",
        date: "2026-02-14",
        description: "情人节和女朋友一起来到了三里屯太古里，这里的人真的很多。我们逛了很多店，买了一些礼物，还吃了一顿浪漫的晚餐。虽然人很多，但是很开心。",
        location: "北京市朝阳区三里屯路19号",
        time: "18:00"
      },
      {
        title: "故宫博物院",
        date: "2026-02-13",
        description: "第一次来故宫，真的被震撼到了。故宫的建筑非常宏伟，历史文化底蕴深厚。我们参观了很多宫殿，了解了很多历史知识。虽然人很多，但是很值得一来。",
        location: "北京市东城区景山前街4号",
        time: "10:00"
      },
      {
        title: "颐和园",
        date: "2026-02-12",
        description: "颐和园的风景真的很美，湖水清澈，绿树成荫。我们租了一艘船在湖上游览，感觉非常惬意。园内的建筑也很有特色，体现了中国传统园林的美学。",
        location: "北京市海淀区新建宫门路19号",
        time: "09:30"
      },
      {
        title: "北京大学",
        date: "2026-02-11",
        description: "来到了北京大学，感受了一下中国顶尖学府的氛围。校园环境非常优美，建筑风格独特。我们参观了图书馆、教学楼等地方，感受到了浓厚的学术氛围。",
        location: "北京市海淀区颐和园路5号",
        time: "13:00"
      },
      {
        title: "798艺术区",
        date: "2026-02-10",
        description: "798艺术区是一个非常有特色的地方，充满了艺术气息。这里有很多艺术展览、咖啡馆和创意店铺。我们参观了几个展览，感受到了现代艺术的魅力。",
        location: "北京市朝阳区酒仙桥路4号",
        time: "15:00"
      },
      {
        title: "簋街",
        date: "2026-02-09",
        description: "簋街的美食真的很多，我们尝试了很多特色小吃，比如麻辣小龙虾、烤串等。这里的夜市非常热闹，人来人往，充满了烟火气。",
        location: "北京市东城区东直门内大街",
        time: "20:00"
      },
      {
        title: "长城",
        date: "2026-02-08",
        description: "不到长城非好汉，今天终于来到了长城。长城的雄伟壮观真的无法用言语形容，站在长城上，可以看到远处的山脉和云海，非常震撼。",
        location: "北京市怀柔区G111",
        time: "08:00"
      }
    ];
    useRouter();
    onMounted(() => {
      setTimeout(() => {
        footprintList.value = rawFootprintList;
        isLoaded.value = true;
      }, 1e3);
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_van_loading = Loading;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "foot-print-tab-container" }, _attrs))} data-v-e78ec582><div class="tab-top-item" data-v-e78ec582><h1 data-v-e78ec582>我的足迹</h1></div>`);
      if (!isLoaded.value) {
        _push(ssrRenderComponent(_component_van_loading, {
          type: "spinner",
          size: "24px",
          class: "van-loading"
        }, null, _parent));
      } else {
        _push(`<div class="footprint-list" data-v-e78ec582><!--[-->`);
        ssrRenderList(footprintList.value, (item, index) => {
          _push(`<div class="footprint-item" data-v-e78ec582><div class="footprint-header" data-v-e78ec582><h3 data-v-e78ec582>${ssrInterpolate(item.title)}</h3><span class="footprint-date" data-v-e78ec582>${ssrInterpolate(item.date)}</span></div><div class="footprint-content" data-v-e78ec582><p data-v-e78ec582>${ssrInterpolate(item.description)}</p></div><div class="footprint-footer" data-v-e78ec582><span class="footprint-location" data-v-e78ec582>${ssrInterpolate(item.location)}</span><span class="footprint-time" data-v-e78ec582>${ssrInterpolate(item.time)}</span></div></div>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/views/layout/FootPrintTab.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const FootPrintTab = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-e78ec582"]]);
export {
  FootPrintTab as default
};
