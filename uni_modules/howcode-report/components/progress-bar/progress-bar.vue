<template>
	<view>
		<view v-if="cloneContent.length > 0" class="ranking">
			<view class="ranking-item" v-for="(content,index) in cloneContent" :key="index"
				:style="{padding:progressPadding+'rpx'}">
				<view class="name">{{content.name}}</view>
				<view class="progress">
					<text
						:style="{background:content.background,width:content.width + '%',height:progressWidth+'rpx'}"></text>
				</view>
				<view class="num">{{content.num}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'ranking-list',
		props: {
			content: {
				type: Array,
				default () {
					return []
				}
			},
			isPC: {
				type: Boolean,
				default: false
			},
			isRank: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				progressWidth: 24,
				progressPadding: 10,
				maxNumber: 0,
				culCount: 0,
				cloneContent: []
			}
		},
		methods: {
			init() {
				if (this.cloneContent && this.cloneContent.length > 0) {
					if (this.isRank) {
						this.cloneContent = this.cloneContent.sort((a, b) => b.num - a.num);
						this.maxNumber = this.cloneContent[0].num;
					} else {
						this.maxNumber = Math.max.apply(Math, this.cloneContent.map(item => {
							return item.num
						}));
					}
					this.cloneContent.map((item, index) => {
						item.width = this.computeWidth(this.maxNumber, item.num);
					});
					this.$emit("updateRanking", this.cloneContent)
				}
			},
			deepCloneAssign(obj) {
				var newobj = obj.constructor === Array ? [] : {};
				if (typeof obj !== 'object') {
					return;
				}
				for (var i in obj) {
					newobj[i] = typeof obj[i] === 'object' ? this.deepCloneAssign(obj[i]) : obj[i];
				}
				return newobj
			},
			computeWidth(max, current) {
				let num = (current / max) * 100;
				return num.toFixed(2);
			},
		},
		mounted() {
			if (this.isPC) {
				this.progressWidth = 40;
				this.progressPadding = 30;
			}
			this.cloneContent = this.deepCloneAssign(this.content)
			this.init();
		}
	}
</script>

<style scoped lang="scss">
	.ranking-item {
		display: flex;
		margin-bottom: 13rpx;
		align-content: center;
		height: 28rpx;

		.name {
			padding-right: 10rpx;
			color: #868688;
			font-size: 20rpx;
			flex: 1;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}

		.progress {
			flex: 5;
			text-align: left;
			padding-right: 10rpx;

			text {
				display: inline-block;
				border-radius: 30rpx;
				vertical-align: top;
			}

		}

		.num {
			font-size: 26rpx;
			color: #3EB2F5;
			flex: 1;
		}
	}
</style>
