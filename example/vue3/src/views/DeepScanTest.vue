<template>
  <div class="deep-scan-test">
    <h1>DeepScan 模版字符串测试</h1>
    
    <section class="test-section">
      <h2>场景 1: HTML + 换行符 (应触发 deepScan)</h2>
      <div class="demo-box">
        <p>{{ htmlWithNewlines }}</p>
      </div>
    </section>

    <section class="test-section">
      <h2>场景 2: 多行文本 (应触发 deepScan)</h2>
      <div class="demo-box">
        <pre>{{ multilineText }}</pre>
      </div>
    </section>

    <section class="test-section">
      <h2>场景 3: 简单模版 (不触发 deepScan)</h2>
      <div class="demo-box">
        <p>{{ simpleTemplate }}</p>
      </div>
    </section>

    <section class="test-section">
      <h2>场景 4: 表格结构 (应触发 deepScan)</h2>
      <div class="demo-box" v-html="tableStructure"></div>
    </section>

    <section class="test-section">
      <h2>场景 5: 复杂混合 (应触发 deepScan)</h2>
      <div class="demo-box" v-html="complexWithExpressions"></div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const username = ref('张三')
const age = ref(25)
const city = ref('北京')

// 场景 1: 包含 HTML 标签和换行符 - 应该触发 deepScan
const htmlWithNewlines = computed(() => {
  return `<div>
  <p>你好</p>
  ${username.value}
  <p>世界</p>
</div>`
})

// 场景 2: 纯多行文本 - 应该触发 deepScan
const multilineText = computed(() => {
  return `第一行：欢迎使用
第二行：这是测试
第三行：深度扫描`
})

// 场景 3: 简单模版字符串 - 不应该触发 deepScan (没有 \n, <, >)
const simpleTemplate = computed(() => {
  return `你好 ${username.value} 欢迎来到 ${city.value}`
})

// 场景 4: 表格结构 - 应该触发 deepScan
const tableStructure = computed(() => {
  return `<table border="1">
  <tr>
    <th>姓名</th>
    <th>年龄</th>
    <th>城市</th>
  </tr>
  <tr>
    <td>${username.value}</td>
    <td>${age.value}</td>
    <td>${city.value}</td>
  </tr>
</table>`
})

// 场景 5: 复杂用户卡片 - 应该触发 deepScan
const complexWithExpressions = computed(() => {
  return `<div class="card">
  <h3>用户信息</h3>
  <p>姓名：<strong>${username.value}</strong></p>
  <p>年龄：<strong>${age.value}</strong> 岁</p>
  <p>城市：<strong>${city.value}</strong></p>
</div>`
})

// 对比：普通字符串字面量也会被 deepScan 处理
const stringLiteralTest = "<div>\n  <h1>标题</h1>\n  <p>段落</p>\n</div>"
console.log('字符串字面量测试:', stringLiteralTest)
</script>

<style scoped>
.deep-scan-test {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  color: #333;
  border-bottom: 3px solid #007bff;
  padding-bottom: 1rem;
  margin-bottom: 2rem;
}

.test-section {
  margin-bottom: 2rem;
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
}

.test-section h2 {
  color: #007bff;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.demo-box {
  background: white;
  padding: 1rem;
  border: 2px solid #dee2e6;
  border-radius: 4px;
  min-height: 60px;
}

.demo-box table {
  width: 100%;
  border-collapse: collapse;
}

.demo-box th,
.demo-box td {
  padding: 0.5rem;
  text-align: left;
}

.card {
  background: #f0f8ff;
  padding: 1rem;
  border-radius: 8px;
}
</style>
