<template>
	<view class="content">
		<scroll-view v-if="true" scroll-y class="data_body" :style="{height:scrollHeight}" @scroll="toScroll">
			<!--数据进度条-->
			<view class="progress">
				<data-progress :isPC="isPC" :content="userHealthyLineBar" :borderRadius="20" padMiddle="true" />
			</view>
			<view class="split_line"></view>

			<!-- 新增小程序会员趋势-->
			<view class="friend_operate">
				<text-block :isPC="isPC" :content="baseData"></text-block>
				<view class="trend_title">新增小程序会员趋势</view>
				<view class="charts-box" style="height: 300px;">
					<qiun-data-charts 
						type="mix" 
						canvasId="three_a" 
						:canvas2d="isCanvas2d" 
						:resshow="delayload"
						:opts="{yAxis:{data:[{position: 'left',title: '销售额/万',max:20},{position: 'right',title: '',min:0,max:200,unit:'%'}]}}"
						:chartData="userTrand" />
				</view>
			</view>
			<view class="split_line"></view>

			<!-- 会员扫码率趋势-->
			<view class="friend_operate">
				<text-block :isPC="isPC" :content="scanTrand"></text-block>
				<view class="trend_title">会员扫码率趋势</view>
				<view class="charts-box" style="height: 300px;">
					<qiun-data-charts 
						type="mix" 
						canvasId="three_b" 
						:canvas2d="isCanvas2d" 
						:resshow="delayload"
						:opts="{enableScroll:true,xAxis:{scrollShow:true,itemCount:4,disableGrid:true},yAxis:{data:[{position: 'left',title: '',min:0,max:60,unit:'%'}]},extra:{markLine:{data:[{value:scanTrandPrecent.markLine.value,LineColor:scanTrandPrecent.markLine.LineColor,showLabel:true}]}}}" 
						:inScrollView="true" 
						:pageScrollTop="pageScrollTop"
						:ontouch="true"
						:chartData="scanTrandPrecent"
					 />
				</view>
			</view>
			<view class="split_line"></view>

			<!-- 小程序活跃会员占比-->
			<view class="friend_operate">
				<text-block :isPC="isPC" :content="miniActive"></text-block>
				<view class="charts-box" style="height: 300px;">
					<qiun-data-charts 
						type="mix" 
						canvasId="three_c" 
						:canvas2d="isCanvas2d" 
						:resshow="delayload"
						:opts="{yAxis:{data:[{position: 'left',title: '单位万',min:0,max:20},{position: 'right',title: '',min:0,max:200,unit:'%'}]}}"
						:chartData="miniActivePrecent" 
					/>
				</view>
			</view>
			<!-- <view class="update_data" @click="update_data" style="background-image: linear-gradient(to top right,#B678FD,#4A64F9)" :animation="animationData">刷新</view> -->
		</scroll-view>
		<view v-else class="container padding_stand-big normal_color">
			<li class="iconfont icon-cry cry"></li>暂无数据
		</view>
	</view>
</template>

<script>
	import Api from "../../static/api/mall/index.js"

	import DataProgress from "../data-progress/data-progress.vue"

	import userHealthyLineBar from '../../static/json/user-healthy/1.json';
	import baseData from '../../static/json/user-healthy/2.json';
	import userTrand from '../../static/json/user-healthy/3.json';

	import scanTrand from '../../static/json/user-healthy/4.json';
	import scanTrandPrecent from '../../static/json/user-healthy/5.json';
	import miniActive from '../../static/json/user-healthy/6.json';
	import miniActivePrecent from '../../static/json/user-healthy/7.json';

	var _self;
	export default {
		name: 'user-healthy',
		props: {
			scrollHeight: {
				type: String,
				default: "600px"
			},
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
			}
		},
		components: {
			DataProgress
		},
		data() {
			return {
				userHealthyLineBar,
				baseData,
				userTrand,
				scanTrand,
				scanTrandPrecent,
				miniActive,
				miniActivePrecent,
				delayload: false, //延时加载图表，否则会出现图表加载完后定位错乱
				pageScrollTop:0,
				animationData: {},
				off: false, //判断是否开启动画
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
			toScroll(e) {
			  this.pageScrollTop = e.detail.scrollTop
				this.declick();
			},
			async getData(){
				uni.showLoading();
				await setTimeout(() => {
					this.delayload = true;
					uni.hideLoading();
				}, 1000)
			}
		}
	}
</script>

<style scoped lang="less">
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
			padding: 30rpx 10rpx;

			.title {
				text-align: left;
				margin-bottom: 20rpx;
			}

			.trend_title {
				text-align: right;
				font-size: 22rpx;
				color: #ff9900;
				margin-top: 20rpx;
			}
		}
	}
</style>
