

# ReportPro 云端数据报表中心

## 该小程序基于uniCloudAdmin框架开发，主要使用了ucharts和wyb-table两插件实现的数据报表功能，感谢作者秋云和SirW的优秀开源项目

## 下载地址
- [码云Gitee开源](https://gitee.com/ureport/ReportPro)
- [Dcloud插件市场](https://ext.dcloud.net.cn/plugin?id=4651)

## `无偿供大家使用！你们的star是我的动力`

## 快速体验

![体验码](https://img-blog.csdnimg.cn/20210405143212517.jpg?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80MjAwMDgxNg==,size_16,color_FFFFFF,t_70#pic_center)


## 特点
- 前身为[ReportPro插件](https://ext.dcloud.net.cn/plugin?id=4373)，与`ReportPro`最大不同的：此插件是`ReportPro`的升级版，采取了[uniCloud](https://uniapp.dcloud.io/uniCloud/README)云函数开发实现数据中心报表功能。

- 采用[admin](https://uniapp.dcloud.io/uniCloud/admin?id=admin-%E6%8F%92%E4%BB%B6%E5%BC%80%E5%8F%91)插件开发，管理员可配置不同用户的权限来浏览对应的页面，自由实现数据的增删改查

- 是一款真正的[uniCloud Admin](https://uniapp.dcloud.io/uniCloud/admin?id=unicloud-admin-%E6%A1%86%E6%9E%B6) 数据报表插件

- 结合了最新的`qiun-data-charts`插件完成开发，其作者是开发ucharts的大神秋云，他一直致力于精美、灵活的图表插件开发，故无须担心图表方面的问题

## ReportPro各端展示
- 小程序
- ![小程序](https://img-blog.csdnimg.cn/20210406153611149.gif#pic_center)

- H5
- ![H5](https://img-blog.csdnimg.cn/20210406153633832.gif#pic_center)


- PC端
- ![PC](https://img-blog.csdnimg.cn/20210406153848741.gif#pic_center)

## howcode-report 云端数据报表插件说明

采用全端兼容的uCharts图表等插件完成的云端数据报表中心，用户只需要专注数据业务，即可打造出属于自己的数据报表中心，组件页面精美，使用起来灵活便捷，不仅如此，下载完整示例可搭配admin权限系统实现权限分配查看，最重要的是：`无偿供大家学习，无偿！`

## 推出云端数据报表中心初衷

howcode-report模拟了生活中各行业的数据分析，让不懂数据业务的小白也能尽快的上手数据表设计、数据分析、操作等流程，即使熟悉这些操作，数据报表的页面开发也是一件令人头疼的事，如今插件市场关于数据报表的插件寥寥无几，而howcode-report就提供了很多数据分析的报表案例，还原了真实场景下的数据报表中心开发，让用户在短时间内也可打造属于自己的高颜值报表中心

- 内嵌高度封装的各种数据插件，调用简便
- 支持H5、PC端，并且图表、字体大小完全适配PC端
- 采用uniCloud云端数据开发，真实还原数据报表的场景
- 图表生成使用了uCharts，其文档丰富，2.0升级后更是丰富了图表的开发

## 使用说明
- 到[uniCloud控制台](https://unicloud.dcloud.net.cn)下创建一个属于自己的服务空间。注意：该步骤需要实名认证，并且确保账号与HBuilder登陆的账号一致，否则项目关联不上云服务空间

- 回到项目中选中uniCloud云空间，右键选中关联云服务空间，选择关联之前创建的服务空间

- 展开uniCloud文件，选中database目录下的db_init.json文件，右键选择`初始化云数据库`

- 选中cloudfunctions文件，右键选择`上传所有云函数、公共模块及action`

- 到此项目即可运行起来，如果想将图表放到自己的项目中运行，可查看[howcode-report插件](https://gitee.com/howcode/ReportPro/tree/master/uni_modules/howcode-report)说明文档

## 注意事项
- 项目运行起来时，打开微信开发者工具->右上角详情->本地设置->调试基础库，选择最新版本2.16.0或以上
- 发布到小程序时，在微信公众号平台的开发管理中，配置request合法域名：[https://api.bspapp.com];[https://wthrcdn.etouch.cn];此两项为uniCloud云函数的发起接口api



## 常见问题
### 问题一：图表偶尔加载不出或直接显示报错页面
- 原因：canvasId重复导致图表加载不出；canvasId丢失导致无法获得dom；
- 解决方法：请务必在组件上定义canvasId，不能为纯数字、不能为变量、不能重复、尽量长一些;请检查微信小程序的基础库，修改至2.16.0或者最新版本的基础库;请检查父元素或父组件是否用v-if来控制显示，如有请改为v-show，并将v-show的逻辑绑定至组件。

### 问题二：图表点击显示不出提示信息或点击位置不精准
- 原因：组件内嵌套组件 + 开启2d模式 + 组件中使用scroll-view标签，使得获取图表的定位不准
- 解决方法：组价内加入属性 :inScrollView="true" :pageScrollTop="pageScrollTop" :ontouch="true" ，其中pageScrollTop为当前滚动距离顶部的高度

### 更多问题查看：[秋云图表组件工具](https://demo.ucharts.cn/#/) -> 常见问题

## 后期计划

- 新增更多报表页面
- 探索qiun-data-charts下datacom的高阶用法

## 使用手册
[uchart官网](https://demo.ucharts.cn/#/)
[table插件使用说明](https://ext.dcloud.net.cn/plugin?id=2667)

## QQ群
- 群号：878946748 （进群备注）

