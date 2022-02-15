<template>
	<view class="window">
		<!-- #ifndef H5 -->
		<fix-window />
		<!-- #endif -->
		<!--滑动列表头-->
		<view id="tabBar" class="uni-tabs__header">
			<view class="uni-tabs__nav-wrap">
				<view class="uni-tabs__nav-scroll">
					<scroll-view class="uni-tabs__nav" :scroll-x="true">
						<view v-for="(item, index) in tabList" :key="index" @click="switchTab(item.value)"
							:class="{'is-active':currentTab===item.value}" class="uni-tabs__item">{{item.text}}</view>
					</scroll-view>
				</view>
			</view>
		</view>
		<!--主体内容-->
		<view class="data_body" :style="{height: scrollHeight}">
			<view v-if="currentTab == 'PAGE_ONE'">
				<page-one :scrollHeight="scrollHeight" :currentTab="currentTab" :isPC="isPC" :isCanvas2d="isCanvas2d" />
			</view>
			<view v-else-if="currentTab == 'PAGE_TWO'">
				<page-two :scrollHeight="scrollHeight" :currentTab="currentTab" :isPC="isPC" :isCanvas2d="isCanvas2d" />
			</view>
			<view v-else-if="currentTab == 'PAGE_THREE'">
				<page-three :scrollHeight="scrollHeight" :currentTab="currentTab" :isPC="isPC"
					:isCanvas2d="isCanvas2d" />
			</view>
			<view v-else-if="currentTab == 'PAGE_FOUR'">
				<page-four :scrollHeight="scrollHeight" :currentTab="currentTab" :isPC="isPC"
					:isCanvas2d="isCanvas2d" />
			</view>
		</view>
	</view>
</template>
<script>
	import Config from "../../static/js/config.js"
	import Common from "../../static/js/common.js"
	import PageOne from "../../components/data-center/page-one.vue"
	import PageTwo from "../../components/data-center/page-two.vue"
	import PageThree from "../../components/data-center/page-three.vue"
	import PageFour from "../../components/data-center/page-four.vue"
	export default {
		components: {
			PageOne,
			PageTwo,
			PageThree,
			PageFour,
		},
		data() {
			return {
				tabList: Config.TABLIST, //标签头
				currentTab: 'PAGE_ONE',
				progress_bar_width: 16,
				progress_text_top: 0,
				isPC: false,
				scrollHeight: "100%", //主体高度,
				isCanvas2d: true
			};
		},
		methods: {
			switchTab(tab) {
				this.currentTab = tab
			},
			//获取设备信息
			async getTelephoneInfo() {
				var telephoneInfo = await Common.getTelephoneInfo();
				let hasHeight = 0;
				// 设置滚动高度
				const query = wx.createSelectorQuery();
				query.select('#tabBar').boundingClientRect();
				query.exec(res => {
					res.map((item, index) => {
						hasHeight += item.height;
					})
					this.scrollHeight = (telephoneInfo.screenHeight - hasHeight - telephoneInfo
						.statusBarHeight - 59) + 'px';
				})
			},
		},
		onLoad() {
			// #ifdef H5
			if (navigator.userAgent.indexOf('Mobile') > -1) {
				this.isPC = false
			} else {
				this.isPC = true
			}
			//#endif
			//#ifndef H5
			this.getTelephoneInfo();
			//#endif
			switch (uni.getSystemInfoSync().platform) {
				case 'android':
					this.isCanvas2d = true
					break;
				case 'ios':
					this.isCanvas2d = true
					break;
				default:
					this.isCanvas2d = false
					break;
			}
		}
	}
</script>
<style lang="scss">
	/* #ifndef H5 */
	page {
		padding-top: 85px;
	}

	/* #endif */
	@import "../../static/css/common.wxss";
	@import "../../static/css/uni.css";
	@import "../../static/css/icon.wxss";

	.window {
		// height: 100vh;
		overflow: hidden;

		.topLine {
			background-color: #40A2ED;
			width: 100%;
		}

		scroll-view {
			box-sizing: border-box;
		}

		.swiper {
			box-sizing: border-box;
		}

		.nav {
			background: #40A2ED;
			background-size: 100% 100%;

			.back {
				font-size: 54rpx;
				padding: 20rpx 14rpx 15rpx 14rpx;
				color: #fff;
			}

			.title {
				color: #fff;
				font-size: 30rpx;
				flex: 1;
				text-align: center;
			}

			.hidden {
				visibility: hidden;
			}
		}

		.head {
			padding: 0 16rpx 14rpx 16rpx;
			color: #fff;
			background-color: #40A2ED;
			justify-content: space-between;
			font-size: 26rpx !important;

			.calendar_drag {
				width: 340rpx;
				display: flex;
				justify-content: center;
				align-items: center;

				.calendar_name {
					margin-right: 10rpx;
				}

				.icon-calendar {
					font-size: 26rpx;
					margin-top: 4rpx;
				}
			}
		}

		.data_body {
			overflow: auto;
			text-align: center;
			color: #333333;
			background-repeat: repeat;
			background-color: #ffffff;
			height: 100%;

			.item {
				padding: 0 20rpx;
				margin-bottom: 20rpx;

				.name {
					font-weight: 600;
					font-size: 36rpx;
				}

				.operate {
					view {
						padding: 5rpx 12rpx;
						color: #fff;
					}

					.bg-blue {
						background-color: #40A2ED;
					}

					.bg-yellow {
						background-color: #FFC300;
					}
				}

				.tip {
					margin-bottom: 30rpx;

					.update {
						color: #C4100A;
						margin-left: auto;
						font-size: 30rpx;
					}
				}
			}

			.cry {
				font-size: 96rpx;
				margin-bottom: 10rpx;
			}
		}
	}
</style>
