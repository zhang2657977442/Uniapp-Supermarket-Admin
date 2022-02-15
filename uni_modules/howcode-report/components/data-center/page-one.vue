<template>
	<view class="content">
		<scroll-view v-if="true" scroll-y class="data_body" :style="{height:scrollHeight}" @scroll="toScroll">
			<!--数据进度条-->
			<view class="progress" v-if="newCategoriesProgress.length > 0">
				<progress-bar :isPC="isPC" :content="newCategoriesProgress" @updateRanking="updateRanking" />
			</view>
			<view class="split_line"></view>

			<!-- 新闻板块分析-->
			<view class="friend_operate">
				<view class="title">新闻板块分析</view>
				<text-block :isPC="isPC" :content="textBlock1"></text-block>
				<view class="trend_title">新闻分类&各板块文章数量</view>
				<view class="charts-box">
					<qiun-data-charts type="pie" collection="opendb-news-categories" 
						groupby="name as text,article_count as value" :resshow="delayload" :canvas2d="isCanvas2d"
						:reload="reloadOneA" @complete="completeOneA" :inScrollView="true" :pageScrollTop="pageScrollTop" :ontouch="true" canvasId="one_a" />
				</view>
			</view>
			<view class="split_line"></view>

			<!-- 阅读指数-->
			<view class="friend_operate">
				<view class="title">阅读指数</view>
				<text-block :isPC="isPC" :content="textBlock2"></text-block>
				<view style="display: flex;justify-content: space-around;">
					<view v-for="(item,index) in panelData" :key="index" class="charts-box"
						style="width: 45%;height: 200px;">
						<qiun-data-charts type="gauge"
							:opts="{title:{name: item.series[0].data * 100 + '%',color: '#24ABFD',offsetY:30},subtitle: {name: item.series[0].name,color: '#666666',fontSize: 15,offsetY:70},extra:{gauge:{type:'progress',width:20,splitLine:{fixRadius:-10,width:15,},}}}"
							:chartData="item" :resshow="delayload" :canvas2d="isCanvas2d" :inScrollView="true"
							:pageScrollTop="pageScrollTop" :ontouch="true" :canvasId="'one_c_' + index" />
					</view>
				</view>
				<view class="trend_title">新增人群&阅读人数趋势</view>
				<view v-if="delayload" class="charts-box" style="height: 300px;">
					<qiun-data-charts type="column" collection="opendb-news-categories"
						groupby="name as text,article_count as value" :resshow="delayload" :canvas2d="isCanvas2d"
						:reload="reloadOneB" @complete="completeOneB" canvasId="one_b" :inScrollView="true" :pageScrollTop="pageScrollTop" :ontouch="true"
						:opts="{color:['#3EB2F5','#9374F7'],extra:{column:{linearType:'custom',seriesGap:5,linearOpacity:0.8,barBorderCircle:true,customColor:['#9374F7','#EB88E2']}}}" />
				</view>
			</view>
			<view class="split_line"></view>

			<!-- 文章数据分析-->
			<view class="friend_operate">
				<view class="title">文章数据分析</view>
				<senior-table v-if="!isPC" :headers="dataTable.headers" :contents="dataTable.contents"
					:urlCol="dataTable.urlCol" :firstLineFixed="true" :sortCol="dataTable.sortCol" />
				<senior-table v-else :headers="dataTable.headers" :contents="dataTable.contents"
					:urlCol="dataTable.urlCol" :firstLineFixed="true" :sortCol="dataTable.sortCol"
					default-col-width="400" :min-height="seniorHeightInPc" :font-size="seniorFontSizeInPc" />
			</view>
			
			<view class="update_data" @click="update_data" :animation="animationData">刷新</view>
		</scroll-view>
		<view v-else class="container padding_stand-big normal_color">
			<li class="iconfont icon-cry cry"></li>暂无数据
		</view>
	</view>
</template>

<script>
	import Api from "../../static/api/news/index.js"

	import ProgressBar from "../progress-bar/progress-bar.vue"
	import TextBlock from "../text-block/text-block.vue"
	import SeniorTable from "../data-table/senior-table.vue"

	import panelData from '../../static/json/wechat/3.json';

	export default {
		name: 'wechat',
		props: {
			currentTab: {
				type: String,
				default: ""
			},
			isPC: {
				type: Boolean,
				default: false
			},
			isCanvas2d: {
				type: Boolean,
				default: true
			},
			scrollHeight: {
				type: String,
				default: "600px"
			}
		},
		components: {
			ProgressBar,
			TextBlock,
			SeniorTable,
		},
		data() {
			return {
				newCategoriesProgress: [],
				textBlock1: [],
				textBlock2: [],
				panelData,
				dataTable: {},
				seniorHeightInPc: [150, , 150],
				seniorFontSizeInPc: [30, 30],
				delayload: false, //延时加载图表，否则会出现图表加载完后定位错乱
				pageScrollTop: 0,
				animationData: {},
				off: false, //判断是否开启动画
				reloadOneA:false,
				reloadOneB:false
			}
		},
		mounted() {
			this.getData();
			// 初始化一个动画
			var animation = uni.createAnimation({
				duration: 1000,
				timingFunction: 'ease',
			})
			this.animation = animation
		},
		methods: {
			//开启动画事件
			declick() {
				if (!this.off) {
					this.rotateAndScale()
					this.off = true;
				}
			},
			// 定义动画内容
			rotateAndScale() {
				// 定义动画内容
				this.animation.translateX(-80).step();
				// 导出动画数据传递给data层
				this.animationData = this.animation.export();
				var timer = setTimeout(() => {
					this.off = false;
					this.norotateAndScale();
				}, 3000)
			},
			norotateAndScale() {
				this.animation.translateX(0).step()
				this.animationData = this.animation.export()
			},
			update_data() {
				this.newCategoriesProgress = null;
				this.textBlock1 = null;
				this.textBlock2 = null;
				this.dataTable = null;
				this.reloadOneA = true;
				this.reloadOneB = true;
				this.getData();
			},
			completeOneA(){
				this.reloadOneA = false
			},
			completeOneB(){
				this.reloadOneB = false
			},
			toScroll(e) {
				this.pageScrollTop = e.detail.scrollTop + 85
				this.declick();
			},
			updateRanking(nVal) {
				this.newCategoriesProgress = nVal;
			},
			async getData() {
				uni.showLoading();
				await Api.getNewsProgressBar({
					name: "getNewsProgressBar"
				}).then((res) => {
					this.newCategoriesProgress = res
				})
				this.delayload = true;
				await Api.getNewsTextBlock({
					name: "getNewsTextBlock",
					data: {
						type: "one"
					}
				}).then((res) => {
					this.textBlock1 = res
				})
				await Api.getNewsTextBlock({
					name: "getNewsTextBlock",
					data: {
						type: "two"
					}
				}).then((res) => {
					this.textBlock2 = res
				})
				await Api.getNewsTable({
					name: "getNewsTable"
				}).then((res) => {
					this.dataTable = res
				})
				await uni.hideLoading();
			}
		}
	}
</script>

<style scoped lang="scss">
	@import "../../static/css/common.wxss";

	.content {
		padding-top: 10rpx;

		.data_body {
			height: 100%;
		}

		.progress,
		.firend_operate {
			padding: 0 10rpx;
		}

		.progress {
			margin-bottom: 20rpx;
		}

		.friend_operate {
			padding: 30rpx 20rpx;

			.title {
				text-align: left;
				margin-bottom: 30rpx;
				font-size: 40rpx;
			}

			.trend_title {
				text-align: right;
				font-size: 22rpx;
				color: #ff9900;
				margin-top: 50rpx;
			}
		}
	}
</style>
