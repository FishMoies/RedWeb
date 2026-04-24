---
name: vue-refactor
description: 当用户要求对 Vue 页面、模块或整个项目进行重构时，使用此skill
---

# Vue Refactor

## Instructions

一、拆分规则（必须执行）

当满足任意条件时，必须拆分组件：

单个文件超过 200 行
同时包含 UI 与逻辑
动画逻辑与 UI 混合
必须进行的分离：
UI（template / 布局）
逻辑（状态、计算、生命周期）
动画（GSAP / CSS）
二、Template 拆分原则
按“语义内容块”拆分，而不是按 <div> 结构拆分
同一视觉单元的内容，禁止拆分到不同文件
避免无意义碎片化组件
三、目录结构（强制规范）

所有拆分后的文件必须遵循：

/pages → 页面级组件
/components → 布局组件 / 可复用组件
/composables → 逻辑模块（必须使用 useXxx 命名）
/animations → 动画模块
四、组件分类（必须明确）

所有拆分内容必须属于以下之一：

1. 布局组件（Layout Components）
仅负责结构与展示
禁止包含业务逻辑
2. 逻辑组件（Composables）
负责状态、计算、副作用
必须可复用
不包含 template
3. 动画模块（Animation Modules）
专门处理动画行为
与 UI 解耦

禁止使用“其他组件”等模糊分类

五、命名规范（严格执行）
布局组件
页面专属组件：页面名 + 组件名
示例：HomepageMainTitle
全局复用组件：组件名
示例：RotationText
逻辑组件
必须使用 useXxx 命名
示例：useEasingAnimation
动画模块
使用 {功能}Animation 命名
示例：easingAnimation
六、禁止事项（强约束）
禁止改变原有功能或视觉效果
禁止新增功能
禁止过度拆分（避免过小组件）
禁止逻辑重复
七、输出要求（必须提供）

重构完成后，必须输出：

完整文件结构（目录树）
核心拆分后的代码示例
各模块之间的关系说明
确保代码可运行，无缺失依赖
---