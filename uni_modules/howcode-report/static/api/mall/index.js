/**
 * 颜色配置
 */
const configColor = ["#FFBE68", "#0FEBE1", "#BF8DFC", "#FF859C", "#51ADCF"]

/**
 *
 * @param {Number} n: 需要补齐两位数的数字
 * @return {String} String: 前面用0补齐的两位或多位数字，字符类型。如: 2->02 12->12
 */
function doubleNum(n) {
	const str = "" + n;
	// return str[1] ? str : `0${str}`;
	return str.padStart(2, "0");
}

/**
 *
 * @param 传入年月即可转成对应的月初和月末时间戳
 * @return [1614528000000, 1617120000000]
 */
function computeTime(year, month) {
	return [
		new Date(year, month - 1, 1).getTime(),
		new Date(year, month, 0).getTime()
	]
}
/**
 * @param 获取传入时间的时间戳
 */
function toTimeStamp(year, month,day) {
	return new Date(year, month - 1, day).getTime()
}

/**
 * 电商进度条的数据api
 * @param {Number} length:获取数据的长度
 * name:标题
 * num:数值
 * width:宽度；但不传，组件内部根据用户是否开启排序并通过num值自动计算获得
 * background:自动分配配置颜色
 */
const getGoodsProgressBar = (data) => {
	return new Promise((reslove, reject) => {
		uniCloud.callFunction({
			name: "getGoodsProgressBar",
			data
		}).then((res) => {
			if (res.result.data.length > 0) {
				let result = [];
				let topResult = res.result.data.sort((a, b) => b.total_sell_count - a.total_sell_count).splice(0, data.length)
				topResult.map((x, index) => {
					let object = {
						"name": x.name,
						"num": x.total_sell_count,
						"width": "",
						"background": configColor[index % 5]
					};
					result.push(object);
				})
				reslove(result)
			} else {
				reject(res.result)
			}
		}).catch((err) => {
			console.log(err);
			reject(err)
		})
	})
}


/**
 * 电商Mix图表的数据api
 * column：柱形图表
 * line：折线图表
 * line + curve：曲线图表
 * 具体查看ucharts图表配置
 */
const getGoodsMixCharts = (data) => {
	return new Promise((reslove, reject) => {
		uniCloud.callFunction({
			name: "getMallOrders",
			data
		}).then((res) => {
			if (res.result.data.length > 0) {
				let allOrder = res.result.data
				let result = {categories:[],series:[]};
				//由于数据不能一直更新且有限，故选取特定的一组时间计算
				let time_array =  ["2021-3-21", "2021-3-22", "2021-3-23", "2021-3-24", "2021-3-25", "2021-3-26", "2021-3-27"] 
				let time_stamp_arr = []
				result.categories = time_array.map(x=>{
					let time_arr = x.split("-");
					let timeStamp = toTimeStamp(time_arr[0],time_arr[1],time_arr[2]);
					time_stamp_arr.push(timeStamp);
					return x.substr(5,x.length);
				})
				let offlineData=[]
				time_stamp_arr.map((timeItem,index)=>{
					let offline_orders = allOrder.filter(x=>x.create_date < timeItem + 86400000 && x.create_date >= timeItem);
					let offline_count=0
					offline_orders.map(x=>{offline_count+=x.total_cash});
					offlineData.push(offline_count)
				})
				let offlineObject = {
					"name":"销售额",
					"data":offlineData,
					"color": "#1890FF",
				}
				result.series.push(offlineObject)
				
				reslove(result)
			} else {
				reject(res.result)
			}
		}).catch((err) => {
			console.log(err);
			reject(err)
		})
	})
}
export default {
	getGoodsProgressBar,
	getGoodsMixCharts
}
