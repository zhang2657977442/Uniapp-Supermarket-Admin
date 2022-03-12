<template>
	<view class="warp">
		<!-- 任务 -->
		<view class="task-box b-card">
			<view class="tips">感谢您的光临~</view>
			<view class="id">订单编号：9041081653460</view>
			<view class="date">下单时间: 2022-03-11 09:06:18</view>
			<view v-for="(item, index) in order" :key="index" class="task-item b-flex-space">
				<view class="index b-fontw">{{ index + 1 }}</view>
				<view class="name">{{ item.name }}</view>
				<view class="count">×{{ item.count }}</view>
				<view class="price">￥{{ item.price }}</view>
			</view>
			<view class="total_cash b-flex-space">
				<span>订单总额</span>
				<span>￥{{ total_cash }}</span>
			</view>
			<view class="discount_cash b-flex-space">
				<span>优惠金额</span>
				<span>-￥0.00</span>
			</view>
			<view class="pay_cash b-flex-space">
				<span>付款金额</span>
				<view class="task-item-btn">
					<image class="img" src="https://zhoukaiwen.com/img/clockImg/icon-money.png" mode=""></image>
					￥{{ total_cash }}
				</view>
			</view>

			<button type="primary" @click="finish()">支付</button>
		</view>
	</view>
</template>

<script>
const db = uniCloud.database()
export default {
	data() {
		return {
			receive: false,
			total_start: 0,
			total: 6562,
			order: [],
			orderId: [],
			total_cash: 0
		}
	},
	onLoad(option) {
		if (option.item != null) {
			this.calcCash(JSON.parse(decodeURIComponent(option.item)))
		}
	},
	methods: {
		// 计算账单
		calcCash(obj) {
			for (let i in obj) {
				const item = {
					name: '',
					count: 0,
					price: 0
				}
				item.count = obj[i].length
				// 计算价格
				switch (i) {
					case 'water':
						item.name = '康师傅矿泉水'
						item.price = item.count * 2.0
						break
					case 'noodle':
						item.name = '香辣牛肉面'
						item.price = item.count * 2.5
						break
					case 'paper':
						item.name = '相印纸抽'
						item.price = item.count * 6.0
						break
					case 'biscuit':
						item.name = '好吃点饼干'
						item.price = item.count * 5.5
				}
				this.order.push(item)
				this.total_cash += item.price
				// 创建账单
				db.collection('market-goods')
					.where({
						name: item.name
					})
					.get()
					.then(res => {
						db.collection('market-order')
							.add({
								order_guid: '0',
								good_id: res.result.data[0]._id,
								total_cash: item.price,
								discount_cash: 0,
								create_date: Date.parse(new Date()),
								payment_date: null
							})
							.then(res => {
								this.orderId.push(res.result.id)
							})
					})
			}
			this.total_cash = this.total_cash.toFixed(2)
			console.log('order', this.order)
		},
		finish() {
			const arr = this.orderId
			for (let j = 0; j < arr.length; j++) {
				db.collection('market-order')
					.doc(arr[j])
					.update({
						payment_date: Date.parse(new Date())
					})
			}
			uni.showToast({
				title: '支付成功',
				icon: 'success',
				duration: 1500
			})
			setTimeout(() => {
				uni.redirectTo({
					url: '/uni_modules/howcode-report/pages/reportdemo/reportdemo'
				})
			}, 1500)
		}
	}
}
</script>

<style lang="scss" scoped>
$W: 140rpx;
$titleSize: 32rpx;
$signH: 80rpx;
.b-card {
	margin: 30rpx;
	padding: 30rpx;
	background-color: #ffffff;
	border-radius: 10rpx;
	box-shadow: 2rpx 2rpx 10rpx #c0c0c0;
}
.b-flex-space {
	display: flex;
	justify-content: space-between;
}
.b-fontw {
	font-weight: 600;
}
.warp {
	.task-box {
		color: #666;
		.tips {
			padding-bottom: 10rpx;
			border-bottom: 2rpx #e3e3e3 dashed;
			color: #000000;
		}
		.id {
			margin: 20rpx 0;
		}
		.date {
			margin: 20rpx 0 30rpx 0;
		}
		.title {
			font-size: $titleSize;
		}
		.task-item {
			padding: 30rpx 0;
			align-items: center;
			color: #000;
			border-top: 2rpx #e3e3e3 solid;
			.count {
				color: #666;
			}
		}

		.total_cash {
			border-top: 2rpx #e3e3e3 dashed;
			padding-top: 30rpx;
			margin-bottom: 20rpx;
		}
		.discount_cash {
			margin: 20rpx 0;
		}
		.pay_cash {
			color: #000;
			border-top: 2rpx #e3e3e3 solid;
			padding: 30rpx 0 50rpx 0;
			.task-item-btn {
				color: #fff;
				padding: 10rpx 20rpx;
				font-size: 30rpx;
				font-weight: 600;
				// background-color: #00c657;
				// background-image: linear-gradient( to left, #454c64,#262d47);
				background-image: linear-gradient(to top right, #06c852, #66e805);
				box-shadow: 2rpx 2rpx 10rpx #f5f6fa;
				border-radius: 40rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				.img {
					width: 40rpx;
					height: 40rpx;
				}
			}
		}
	}
}
</style>
