<template>
	<view class="content">
		<scroll-view v-if="true" scroll-y class="data_body" :style="{height:scrollHeight}" @scroll="toScroll">
			<!--数据进度条-->
			<view v-if="goodsProgress.length > 0" class="progress">
				<view class="title">销售前5榜单</view>
				<progress-bar :isPC="isPC" :isRank="isRank" :content="goodsProgress" @updateRanking="updateRanking" />
			</view>
			<view class="split_line"></view>

			<!-- 销售指数-->
			<view class="friend_operate">
				<view class="title">销售指数
					<text class="font-small">(总销售)</text>
				</view>
				<text-block :isPC="isPC" :content="salePoint"></text-block>
				<view class="title">
					<text class="trend_title">常规商品</text>
				</view>
				<view class="charts-box">
					<qiun-data-charts 
						type="rose"
						collection="opendb-mall-goods"
						groupby="name as text,total_sell_count as value" 
						where="category_id=='60616f1b4f2517000140c59b'"
						:resshow="delayload" :canvas2d="isCanvas2d" canvasId="two_a"
						:reload="reloadTwoA" @complete="completeTwoA"
						:inScrollView="true"
						:pageScrollTop="pageScrollTop"
						:ontouch="true"
						:opts="{legend:{position:'bottom'}}" 
					/>
				</view>
			</view>

			<!-- 医疗器械消费分析 -->
			<view class="friend_operate">
				<view class="title">销售对比
					<text class="font-middle">(月销售)</text>
				</view>
				<text-block :isPC="isPC" :content="salePlatform"></text-block>
				<view v-if="salePlatformMix" class="charts-box" style="height: 300px;">
					<qiun-data-charts type="mix" :opts="{yAxis:{data:[{position: 'left',title: '销售额/元',min:0}]}}"
						:chartData="salePlatformMix" :resshow="delayload" canvasId="two_b" :canvas2d="isCanvas2d" 
						:inScrollView="true"
						:pageScrollTop="pageScrollTop"
						:ontouch="true"/>
				</view>
			</view>
			<view class="split_line"></view>

			<!-- 微客群运营-->
			<view class="friend_operate">
				<view class="title">活跃会员分布
					<text class="font-middle">(最近活跃时间)</text>
				</view>
				<senior-table v-if="!isPC" :headers="dataTable.headers" headerBgColor="#F78D58"
					:contents="dataTable.contents" :urlCol="dataTable.urlCol" :firstLineFixed="true"
					:sortCol="dataTable.sortCol" :computedCol="dataTable.computedCol"
					:formatCol="dataTable.formatCol" />
				<senior-table v-else headerBgColor="#F78D58" :headers="dataTable.headers" :contents="dataTable.contents"
					:urlCol="dataTable.urlCol" :firstLineFixed="true" :sortCol="dataTable.sortCol"
					:computedCol="dataTable.computedCol" :formatCol="dataTable.formatCol" default-col-width="400"
					:min-height="seniorHeightInPc" :font-size="seniorFontSizeInPc" />
			</view>
			<view class="split_line"></view>

			<!-- X商品脱落率-->
			<view class="friend_operate">
				<view class="title">
					X（慢病） 商品脱落率
				</view>
				<view style="display: flex;justify-content: space-between;">
					<view class="charts-box" style="height: 130px;width: 45%;">
						<qiun-data-charts type="arcbar" :chartData="Arcbar1" canvasId="two_c" :canvas2d="isCanvas2d"
							:resshow="delayload"
							:inScrollView="true"
							:pageScrollTop="pageScrollTop"
							:ontouch="true"
							:opts="{title:{name:'75%',color:'#24ABFD',fontSize:25},subtitle:{name:'当前脱落率',color:'#666666',fontSize:12}}" />
					</view>
					<view class="charts-box" style="height: 130px;width: 45%;">
						<qiun-data-charts type="arcbar" :chartData="Arcbar2" canvasId="two_d" :canvas2d="isCanvas2d"
							:resshow="delayload"
							:inScrollView="true"
							:pageScrollTop="pageScrollTop"
							:ontouch="true"
							:opts="{title:{name:'33%',color:'#F04864',fontSize:25},subtitle:{name:'脱落率警示线',color:'#666666',fontSize:12}}" />
					</view>
				</view>
			</view>

			<!-- 慢病病种脱落率-->
			<view class="friend_operate">
				<view class="title">慢病病种脱落率
				</view>
				<view class="charts-box" style="height: 300px;">
					<qiun-data-charts type="column" :chartData="illnessDropPrecent" :resshow="delayload"
						:canvas2d="isCanvas2d" canvasId="two_e"
						:inScrollView="true"
						:pageScrollTop="pageScrollTop"
						:ontouch="true"
						:opts="{yAxis:{data:[{position: 'left',title: '销售额/元',min:0,max:25,unit:'%'}]}}" />
				</view>
			</view>

			<!-- W商品脱落率-->
			<view class="friend_operate">
				<view class="title">
					W（保健） 商品脱落率
				</view>
				<view style="display: flex;justify-content: space-between;">
					<view class="charts-box" style="height: 130px;width: 45%;">
						<qiun-data-charts type="arcbar" :chartData="Arcbar1" canvasId="two_f" :canvas2d="isCanvas2d"
							:resshow="delayload"
							:inScrollView="true"
							:pageScrollTop="pageScrollTop"
							:ontouch="true"
							:opts="{title:{name:'75%',color:'#24ABFD',fontSize:25},subtitle:{name:'当前脱落率',color:'#666666',fontSize:12}}" />
					</view>
					<view class="charts-box" style="height: 130px;width: 45%;">
						<qiun-data-charts type="arcbar" :chartData="Arcbar2" canvasId="two_g" :canvas2d="isCanvas2d"
							:resshow="delayload"
							:inScrollView="true"
							:pageScrollTop="pageScrollTop"
							:ontouch="true"
							:opts="{title:{name:'33%',color:'#F04864',fontSize:25},subtitle:{name:'脱落率警示线',color:'#666666',fontSize:12}}" />
					</view>
				</view>
			</view>
			
			<view class="update_data" @click="update_data" style="background-image: linear-gradient(to top right,#F77E89,#F7953B)" :animation="animationData">刷新</view>
		</scroll-view>
		<view v-else class="container padding_stand-big normal_color">
			<li class="iconfont icon-cry cry"></li>暂无数据
		</view>
	</view>
</template>

<script>
	import Api from "../../static/api/mall/index.js"

	import TextBlock from "../text-block/text-block.vue"
	import SeniorTable from "../data-table/senior-table.vue"

	import dataTable from "../../static/json/user-operate/6.json"
	import illnessDropPrecent from '../../static/json/user-operate/8.json';


	export default {
		name: 'user-operate',
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
			SeniorTable,
			TextBlock,
		},
		data() {
			return {
				goodsProgress: [],
				salePoint: [],
				salePlatform: [],
				salePlatformMix: null,
				illnessDropPrecent,
				dataTable,
				seniorHeightInPc: [150, , 150],
				seniorFontSizeInPc: [30, 30],
				isRank: true,
				delayload: false, //延时加载图表，否则会出现图表加载完后定位错乱,
				pageScrollTop:0,
				Arcbar1: {
					series: [{
						"color": "#24ABFD",
						"data": 0.75,
						"index": 0,
						"legendShape": "circle",
						"name": "测试",
						"pointShape": "circle",
						"show": true,
						"type": "arcbar"
					}]
				},
				Arcbar2: {
					series: [{
						"color": "#F04864",
						"data": 0.33,
						"index": 0,
						"legendShape": "circle",
						"name": "测试",
						"pointShape": "circle",
						"show": true,
						"type": "arcbar"
					}]
				},
				animationData: {},
				off: false, //判断是否开启动画,
				reloadTwoA:false
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
			update_data() {
				this.goodsProgress = null;
				this.salePoint = null;
				this.salePlatform = null;
				this.salePlatformMix = null;
				this.reloadTwoA = true;
				this.getData();
			},
			completeTwoA(){
				this.reloadTwoA = false
			},
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
			  this.pageScrollTop = e.detail.scrollTop + 85
				this.declick();
			},
			updateRanking(nVal) {
				this.goodsProgress = nVal;
			},
			async getData() {
				uni.showLoading();
				await Api.getGoodsProgressBar({
					name: "getGoodsProgressBar",
					length: 5
				}).then((res) => {
					this.goodsProgress = res
				})
				await Api.getMallTextBlock({
					name: "getMallTextBlock",
					data: {
						type: "one"
					}
				}).then((res) => {
					this.salePoint = res
				})
				this.delayload = true;
				await Api.getMallTextBlock({
					name: "getMallTextBlock",
					data: {
						type: "two"
					}
				}).then((res) => {
					this.salePlatform = res
				})
				await Api.getGoodsMixCharts({
					name: "getGoodsMixCharts"
				}).then((res) => {
					this.salePlatformMix = res;
				})
				await uni.hideLoading();
			}
		}
	}
</script>

<style scoped lang="less">
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

			.title {
				text-align: center;
				margin-bottom: 20rpx;
				font-size: 40rpx;
				color: #e5707e;
			}
		}

		.friend_operate {
			padding: 30rpx 20rpx;

			.title {
				text-align: left;
				margin-bottom: 30rpx;
				font-size: 40rpx;
			}

			.trend_title {
				float: right;
				font-size: 22rpx;
				color: #ff9900;
				margin-top: 20rpx;
			}
		}
	}
</style>
