<template>
	<view class="content">
		<scroll-view v-if="true" scroll-y class="data_body" :style="{ height: scrollHeight }" @scroll="toScroll">
			<view class="view_item">
				<!--数据进度条-->
				<view v-if="goodsProgress.length > 0" class="progress">
					<view class="title">销售前5榜单</view>
					<progress-bar :isPC="isPC" :isRank="isRank" :content="goodsProgress" @updateRanking="updateRanking"/>
				</view>
			</view>
			<view class="split_line"></view>

			<view class="friend_operate">
				<view class="title">统计概览</view>
				<view class="progress_circle">
					<view v-for="(item, index) in CircleData" :key="index" :class="['progress_block', 'block_' + index]">
						<view class="name">{{ item.series[0].name }}</view>
						<view class="value">{{ item.series[0].value }}</view>
						<view class="planet">
							<view class="planet_shadow"></view>
							<view class="crater1"></view>
							<view class="crater2"></view>
							<view class="crater3"></view>
							<view class="crater4"></view>
						</view>
						<view class="star" :class="['star' + index]"></view>
						<view class="star pink" :class="['star' + index]"></view>
						<view class="star blue" :class="['star' + index]"></view>
						<view class="star yellow" :class="['star' + index]"></view>
					</view>
				</view>

				<!-- 医疗器械消费分析 -->

				<view class="title">
					销售对比
					<text class="font-middle">(日销售)</text>
				</view>
				<view v-if="salePlatformMix" class="charts-box" style="height: 300px;">
					<qiun-data-charts
						type="area"
						:opts="{ yAxis: { data: [{ position: 'left', title: '销售额/元', min: 0 }] } }"
						:chartData="salePlatformMix"
						:resshow="delayload"
						canvasId="two_b"
						:canvas2d="isCanvas2d"
						:inScrollView="true"
						:pageScrollTop="pageScrollTop"
						:ontouch="true"/>
				</view>
			</view>
			<view class="split_line"></view>

			<!-- X商品脱落率-->
			<!-- 		<view class="friend_operate">
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
			</view> -->

			<!-- 销售指数-->
			<view class="friend_operate">
				<view class="selectCate">
					<view class="title">
						销售指数
						<text class="font-small">(总销售)</text>
					</view>
					<view class="uni-list">
						<view class="uni-list-cell">
							<view class="uni-list-cell-db">
								<picker @change="bindPickerChange" :value="index" :range="catelist">
									<view class="uni-input" style="color: #ff9900;">类别：{{ catelist[index] }}</view>
								</picker>
							</view>
						</view>
					</view>
				</view>
				<view class="charts-box">
					<qiun-data-charts type="ring" collection="market-goods" groupby="name as text,total_sell_count as value" :where="cateid" :resshow="delayload" :canvas2d="isCanvas2d" canvasId="two_a" :reload="reloadTwoA" @complete="completeTwoA" :inScrollView="true" :pageScrollTop="pageScrollTop" :ontouch="true" :opts="{ legend: { position:'bottom' }}" />
				</view>
			</view>
			<view class="friend_operate">
				<view class="title">
					销量对比
					<text class="font-small">(按类别)</text>
				</view>
				<view class="charts-box" style="height: 300px;">
					<qiun-data-charts
						type="column"
						:chartData="columnData"
						:resshow="delayload"
						:canvas2d="isCanvas2d"
						canvasId="two_e"
						:inScrollView="true"
						:pageScrollTop="pageScrollTop"
						:ontouch="true"
						:opts="{ yAxis: { showTitle: false, data: [{ position: 'left', min: 0, title: '销量/个' }] } }"/>
				</view>
			</view>
			<view class="update_data" @click="update_data" style="background-image: linear-gradient(to top right,#3EB2F5,#9374F7);" :animation="animationData">
				刷新
			</view>
		</scroll-view>
	</view>
</template>

<script>
import Api from '../../static/api/mall/index.js'
import CircleData from '../../static/json/user-server/1.json'
const db = uniCloud.database()
export default {
	name: 'user-operate',
	props: {
		scrollHeight: {
			type: String,
			default: '600px'
		},
		currentTab: {
			type: String,
			default: ''
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
	data() {
		return {
			category: [],
			catelist: [],
			cateid: "category_id=='60616f1b4f2517000140c59b'",
			index: 0,
			CircleData,
			goodsProgress: [],
			salePlatformMix: null,
			seniorHeightInPc: [150, , 150],
			seniorFontSizeInPc: [30, 30],
			isRank: true,
			delayload: false, //延时加载图表，否则会出现图表加载完后定位错乱,
			pageScrollTop: 0,
			Arcbar1: {
				series: [
					{
						color: '#24ABFD',
						data: 0.75,
						index: 0,
						legendShape: 'circle',
						name: '测试',
						pointShape: 'circle',
						show: true,
						type: 'arcbar'
					}
				]
			},
			Arcbar2: {
				series: [
					{
						color: '#F04864',
						data: 0.33,
						index: 0,
						legendShape: 'circle',
						name: '测试',
						pointShape: 'circle',
						show: true,
						type: 'arcbar'
					}
				]
			},
			animationData: {},
			off: false, //判断是否开启动画,
			reloadTwoA: false,
			columnData:{
				  categories:[],
				  series:[],
			}
		}
	},
	mounted() {
		this.getData()
		// 初始化一个动画
		var animation = uni.createAnimation({
			duration: 1000,
			timingFunction: 'ease'
		})
		this.animation = animation
	},
	methods: {
		update_data() {
			this.goodsProgress = null
			this.salePlatformMix = null
			this.reloadTwoA = true
			this.getData()
		},
		completeTwoA() {
			this.reloadTwoA = false
		},
		//开启动画事件
		declick() {
			if (!this.off) {
				this.rotateAndScale()
				this.off = true
			}
		},
		// 定义动画内容
		rotateAndScale() {
			// 定义动画内容
			this.animation.translateX(-80).step()
			// 导出动画数据传递给data层
			this.animationData = this.animation.export()
			var timer = setTimeout(() => {
				this.off = false
				this.norotateAndScale()
			}, 3000)
		},
		norotateAndScale() {
			this.animation.translateX(0).step()
			this.animationData = this.animation.export()
		},
		toScroll(e) {
			this.pageScrollTop = e.detail.scrollTop + 85
			this.declick()
		},
		updateRanking(nVal) {
			this.goodsProgress = nVal
		},
		bindPickerChange: function(e) {
			this.index = e.target.value
			this.cateid = "category_id=='" + this.category[this.index]._id + "'"
		},
		async getData() {
			uni.showLoading()
			await Api.getGoodsProgressBar({
				name: 'getGoodsProgressBar',
				length: 5
			}).then(res => {
				this.goodsProgress = res
			})
			await Api.getGoodsMixCharts({
				name: 'getGoodsMixCharts'
			}).then(res => {
				this.salePlatformMix = res
			})
			let res = await db
				.collection('market-categories')
				.where({
					parent_id: ''
				})
				.get()
			let goods = await db
				.collection('market-goods').get()
			this.category = res.result.data
			for (let i in res.result.data) {
				this.catelist.push(res.result.data[i].name)
				this.columnData.categories = this.catelist
			}
			let coldata = []
			this.category.map((item,index)=>{
				let cate_orders = goods.result.data.filter(x=>x.category_id == item._id)
				let cate_count=0;
				cate_orders.map(x=>{cate_count+=x.total_sell_count})
				coldata.push(cate_count)
			})
			let obj = {
				"name":"销量",
				"data":coldata,
				"color": "#6294F8",
			}
			this.columnData.series.push(obj)
			await uni.hideLoading()
		}
	}
}
</script>

<style scoped lang="less">
@import '../../static/css/common.wxss';

.content {
	padding-top: 10rpx;

	.data_body {
		height: 100%;
		.view_item {
			padding: 30rpx 20rpx;
			.title {
				text-align: left;
				margin-bottom: 30rpx;
				font-size: 40rpx;
			}
		}
		.progress_circle {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-around;
			align-items: center;
			height: 450rpx;

			.progress_block {
				width: 45%;
				border-radius: 20rpx;
				height: 180rpx;
				position: relative;
				overflow: hidden;

				.name {
					color: #fff;
					font-size: 24rpx;
					position: absolute;
					top: 20rpx;
					left: 10rpx;
					max-width: 144rpx;
				}
				.value {
					color: #fff;
					font-size: 38rpx;
					position: absolute;
					top: 62rpx;
					left: 4rpx;
					max-width: 144rpx;
				}

				.circle {
					position: absolute;
					right: 8rpx;
					top: 16rpx;
				}
				.arcbar {
					position: absolute;
					right: -4rpx;
					top: 8rpx;
				}
			}
			.block_0 {
				background-color: #0fc3ff;
			}
			.block_1 {
				background-color: #ff6b8b;
			}
			.block_2 {
				background-color: #ffcb1d;
			}
			.block_3 {
				background-color: #3bdcaa;
			}
		}
		.planet {
			width: 60px;
			height: 60px;
			border-radius: 50%;
			background: #333;
			position: absolute;
			left: -13px;
			bottom: -26px;
			overflow: hidden;
			opacity: 0.5;
			z-index: 0;
		}

		.planet_shadow {
			position: absolute;
			border-radius: 50%;
			height: 100%;
			width: 100%;
			top: -40%;
			right: -10%;
			border: 35px solid rgba(0, 0, 0, 0.15);
		}

		.crater1,
		.crater2,
		.crater3,
		.crater4 {
			position: absolute;
			border-radius: 50%;
			background: rgba(0, 0, 0, 0.3);
			box-shadow: inset 3px 3px 0 rgba(0, 0, 0, 0.2);
		}

		.crater1 {
			width: 20px;
			height: 20px;
			left: 25%;
			top: 20%;
		}

		.crater2 {
			width: 10px;
			height: 10px;
			left: 50%;
			top: 60%;
		}

		.crater3 {
			width: 15px;
			height: 15px;
			left: 30%;
			top: 65%;
		}

		.crater4 {
			width: 15px;
			height: 15px;
			left: 60%;
			top: 35%;
		}

		.star {
			display: block;
			width: 5px;
			height: 5px;
			border-radius: 50%;
			background: #fff;
			top: 10px;
			left: 50px;
			position: relative;
			transform-origin: 100% 0;
			box-shadow: 0 0 5px 5px rgba(255, 255, 255, 0.3);
			opacity: 0;
			z-index: 2;
		}
		.star0 {
			animation: star-ani 4s infinite ease-out;
		}
		.star1 {
			animation: star-ani 5s infinite ease-out;
		}
		.star2 {
			animation: star-ani 6s infinite ease-out;
		}
		.star3 {
			animation: star-ani 7s infinite ease-out;
		}

		.star:after {
			content: '';
			display: block;
			top: 20px;
			left: 60px;
			border: 0px solid #fff;
			border-width: 0px 90px 2px 90px;
			border-color: transparent transparent transparent rgba(255, 255, 255, 0.3);
			transform: rotate(-45deg) translate3d(1px, 3px, 0);
			box-shadow: 0 0 1px 0 rgba(255, 255, 255, 0.1);
			transform-origin: 0% 100%;
			animation: shooting-ani 100s infinite ease-out;
		}

		.pink {
			top: 10px;
			left: 60px;
			background: #ff5a99;
			animation-delay: 5s;
			-webkit-animation-delay: 5s;
			-moz-animation-delay: 5s;
		}

		.pink:after {
			border-color: transparent transparent transparent #ff5a99;
			animation-delay: 5s;
			-webkit-animation-delay: 5s;
			-moz-animation-delay: 5s;
		}

		.blue {
			top: 15px;
			left: 70px;
			background: cyan;
			animation-delay: 7s;
			-webkit-animation-delay: 7s;
			-moz-animation-delay: 7s;
		}

		.blue:after {
			border-color: 'transpareanimation-delay: 12s';
			-webkit-animation-delay: 7s;
			-moz-animation-delay: 7s;
			animation-delay: 7s;
		}

		.yellow {
			top: 0px;
			left: 80px;
			background: #ffcd5c;
			animation-delay: 5.8s;
		}

		.yellow:after {
			border-color: transparent transparent transparent #ffcd5c;
			animation-delay: 5.8s;
		}

		@keyframes star-ani {
			0% {
				opacity: 0;
				transform: scale(0) rotate(0) translate3d(0, 0, 0);
				-webkit-transform: scale(0) rotate(0) translate3d(0, 0, 0);
				-moz-transform: scale(0) rotate(0) translate3d(0, 0, 0);
			}

			50% {
				opacity: 0.5;
				transform: scale(1) rotate(0) translate3d(-20px, 20px, 0);
				-webkit-transform: scale(1) rotate(0) translate3d(-20px, 20px, 0);
				-moz-transform: scale(1) rotate(0) translate3d(-20px, 20px, 0);
			}

			100% {
				opacity: 0;
				transform: scale(1) rotate(0) translate3d(-30px, 30px, 0);
				-webkit-transform: scale(1) rotate(0) translate3d(-30px, 30px, 0);
				-moz-transform: scale(1) rotate(0) translate3d(-30px, 30px, 0);
			}
		}
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

.selectCate {
	padding: 0 20rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 30rpx;
}
</style>
