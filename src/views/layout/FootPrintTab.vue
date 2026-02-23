<template>
  <div class="foot-print-tab-container">
    <div class="tab-top-item">
      <h1>我的足迹</h1>
    </div>

    <!-- 1. 加载中提示（可选，提升体验） -->
    <van-loading
      v-if="!isLoaded"
      type="spinner"
      size="24px"
      class="van-loading"
    />

    <!-- 2. 延迟渲染列表：isLoaded 为 true 才显示 -->
    <div class="footprint-list" v-else>
      <div
        class="footprint-item"
        v-for="(item, index) in footprintList"
        :key="index"
      >
        <div class="footprint-header">
          <h3>{{ item.title }}</h3>
          <span class="footprint-date">{{ item.date }}</span>
        </div>
        <div class="footprint-content">
          <p>{{ item.description }}</p>
        </div>
        <div class="footprint-footer">
          <span class="footprint-location">{{ item.location }}</span>
          <span class="footprint-time">{{ item.time }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 1. 初始化数据为空，通过 ref 声明响应式变量
const footprintList = ref([])
// 2. 标记是否加载完成（控制渲染）
const isLoaded = ref(false)

// 模拟足迹原始数据（先定义，不直接赋值）
const rawFootprintList = [
  {
    title: '转角咖啡',
    date: '2026-02-15',
    description:
      '今天和朋友一起来到了这家咖啡店，环境非常好，咖啡也很美味。店内的装修风格很温馨，让人感觉很放松。服务员的态度也很好，推荐了他们的特色咖啡，味道确实不错。',
    location: '北京市朝阳区建国路88号',
    time: '14:30'
  },
  {
    title: '三里屯太古里',
    date: '2026-02-14',
    description:
      '情人节和女朋友一起来到了三里屯太古里，这里的人真的很多。我们逛了很多店，买了一些礼物，还吃了一顿浪漫的晚餐。虽然人很多，但是很开心。',
    location: '北京市朝阳区三里屯路19号',
    time: '18:00'
  },
  {
    title: '故宫博物院',
    date: '2026-02-13',
    description:
      '第一次来故宫，真的被震撼到了。故宫的建筑非常宏伟，历史文化底蕴深厚。我们参观了很多宫殿，了解了很多历史知识。虽然人很多，但是很值得一来。',
    location: '北京市东城区景山前街4号',
    time: '10:00'
  },
  {
    title: '颐和园',
    date: '2026-02-12',
    description:
      '颐和园的风景真的很美，湖水清澈，绿树成荫。我们租了一艘船在湖上游览，感觉非常惬意。园内的建筑也很有特色，体现了中国传统园林的美学。',
    location: '北京市海淀区新建宫门路19号',
    time: '09:30'
  },
  {
    title: '北京大学',
    date: '2026-02-11',
    description:
      '来到了北京大学，感受了一下中国顶尖学府的氛围。校园环境非常优美，建筑风格独特。我们参观了图书馆、教学楼等地方，感受到了浓厚的学术氛围。',
    location: '北京市海淀区颐和园路5号',
    time: '13:00'
  },
  {
    title: '798艺术区',
    date: '2026-02-10',
    description:
      '798艺术区是一个非常有特色的地方，充满了艺术气息。这里有很多艺术展览、咖啡馆和创意店铺。我们参观了几个展览，感受到了现代艺术的魅力。',
    location: '北京市朝阳区酒仙桥路4号',
    time: '15:00'
  },
  {
    title: '簋街',
    date: '2026-02-09',
    description:
      '簋街的美食真的很多，我们尝试了很多特色小吃，比如麻辣小龙虾、烤串等。这里的夜市非常热闹，人来人往，充满了烟火气。',
    location: '北京市东城区东直门内大街',
    time: '20:00'
  },
  {
    title: '长城',
    date: '2026-02-08',
    description:
      '不到长城非好汉，今天终于来到了长城。长城的雄伟壮观真的无法用言语形容，站在长城上，可以看到远处的山脉和云海，非常震撼。',
    location: '北京市怀柔区G111',
    time: '08:00'
  }
]

// 3. 组件挂载后启动定时器，2秒后赋值并标记加载完成
onMounted(() => {
  setTimeout(() => {
    // 赋值数据
    footprintList.value = rawFootprintList
    // 标记加载完成，触发列表渲染
    isLoaded.value = true
  }, 1000) // 2000毫秒 = 2秒
})
</script>

<style scoped>
.foot-print-tab-container {
  padding-bottom: 20px;
}

.tab-top-item {
  padding: 20px;
  text-align: center;
  background-color: #f5f5f5;
  margin-bottom: 20px;
}

.tab-top-item h1 {
  font-size: 24px;
  margin: 0;
  color: #333;
}

/* 加载中提示样式（可选） */
.loading-tip {
  text-align: center;
  padding: 50px 0;
  color: #999;
  font-size: 16px;
}

.footprint-list {
  padding: 0 20px;
}

.footprint-item {
  background-color: #fff;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.footprint-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.footprint-header h3 {
  font-size: 18px;
  margin: 0;
  color: #333;
}

.footprint-date {
  font-size: 14px;
  color: #999;
}

.footprint-content {
  margin-bottom: 10px;
}

.footprint-content p {
  font-size: 16px;
  line-height: 1.5;
  color: #666;
  margin: 0;
}

.footprint-footer {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #999;
}

.footprint-location {
  display: flex;
  align-items: center;
}

.footprint-time {
  display: flex;
  align-items: center;
}

@media (max-width: 768px) {
  .footprint-item {
    padding: 12px;
  }

  .footprint-header h3 {
    font-size: 16px;
  }

  .footprint-content p {
    font-size: 14px;
  }

  .footprint-footer {
    font-size: 12px;
  }
}
</style>
