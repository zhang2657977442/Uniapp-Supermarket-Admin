<template>
	<view class="qiun-columns">
		<view class="qiun-charts3">
			<!--#ifndef MP-ALIPAY-->
			<view class="progress">
				<canvas canvas-id="canvasArcbar1" id="canvasArcbar1" class="charts3" :style="{'width':cWidth3*pixelRatio+'px','height':cHeight3*pixelRatio+'px', 'transform': 'scale('+(1/pixelRatio)+')','margin-left':-cWidth3*(pixelRatio-1)/2+'px','margin-top':-cHeight3*(pixelRatio-1)/2+'px'}"></canvas>
				<view>{{progressJson[0].series[0].title}}</view>
			</view>
			<view class="progress">
				<canvas canvas-id="canvasArcbar2" id="canvasArcbar2" class="charts3" :style="{'width':cWidth3*pixelRatio+'px','height':cHeight3*pixelRatio+'px', 'transform': 'scale('+(1/pixelRatio)+')','margin-left':0+'px','margin-top':-cHeight3*(pixelRatio-1)/2+'px'}"></canvas>
				<view>{{progressJson[1].series[0].title}}</view>
			</view>
			<!--#endif-->
		</view>
	</view>
</template>

<script>
	// import uCharts from '../../utils/uCharts/u-charts.min.js';
	import uCharts from '../../js_sdk/u-charts/u-charts.min.js';
	var _self;
	var canvaArcbar1;
	
	export default {
		name:'progress-canvas',
		props: {
			progressJson:{
				type:Array,
				default:[]
			},
		},
		data() {
			return {
				cWidth3:'',//圆弧进度图
				cHeight3:'',//圆弧进度图
				arcbarWidth:'',//圆弧进度图，进度条宽度,此设置可使各端宽度一致
				pixelRatio:1,
				textarea:''
			}
		},
		created() {
			_self = this;
			//#ifdef MP-ALIPAY
			uni.getSystemInfo({
				success: function (res) {
					if(res.pixelRatio>1){
						//正常这里给2就行，如果pixelRatio=3性能会降低一点
						//_self.pixelRatio =res.pixelRatio;
						_self.pixelRatio =2;
					}
				}
			});
			//#endif
			this.cWidth3=uni.upx2px(250);//这里要与样式的宽高对应
			this.cHeight3=uni.upx2px(250);//这里要与样式的宽高对应
			this.arcbarWidth=uni.upx2px(24);
			this.getServerData();
		},
		methods: {
			getServerData(){
				let Arcbar1={series:[]};
				let Arcbar2={series:[]};
				//这里我后台返回的是数组，所以用等于，如果您后台返回的是单条数据，需要push进去
				Arcbar1.series=this.progressJson[0]?this.progressJson[0].series:[];
				Arcbar2.series=this.progressJson[1]?this.progressJson[1].series:[];
				// Arcbar3.series=this.progressJson[2]?this.progressJson[2].series:[];
				_self.textarea = JSON.stringify(this.progressJson[0]);
				_self.showArcbar("canvasArcbar1",Arcbar1);
				_self.showArcbar2("canvasArcbar2",Arcbar2);
				// _self.showArcbar3("canvasArcbar3",Arcbar3);
			},
			//这里我做了三个方法，你可以根据需求，传入不同参数，只定义一个方法是没问题的
			showArcbar(canvasId,chartData){
				canvaArcbar1=new uCharts({
					$this:_self,
					canvasId: canvasId,
					type: 'arcbar',
					fontSize:11,
					legend:{show:false},
					background:'#FFFFFF',
					pixelRatio:_self.pixelRatio,
					series: chartData.series,
					animation: true,
					width: _self.cWidth3*_self.pixelRatio,
					height: _self.cHeight3*_self.pixelRatio,
					dataLabel: true,
					title: {
						name: Math.round(chartData.series[0].data*100)+'%',
						color: chartData.series[0].color,
						fontSize: 25*_self.pixelRatio
					},
					subtitle: {
						name: chartData.series[0].name,
						color: '#666666',
						fontSize: 15*_self.pixelRatio
					},
					extra: {
						arcbar:{
							type:'default',
							width: _self.arcbarWidth*_self.pixelRatio,//圆弧的宽度
						}
					}
				});
				
			},
			showArcbar2(canvasId,chartData){
				new uCharts({
					$this:_self,
					canvasId: canvasId,
					type: 'arcbar',
					fontSize:11,
					legend:false,
					title: {
						name: Math.round(chartData.series[0].data*100)+'%',
						color: chartData.series[0].color,
						fontSize: 25*_self.pixelRatio
					},
					subtitle: {
						name: chartData.series[0].name,
						color: '#666666',
						fontSize: 15*_self.pixelRatio
					},
					extra: {
						arcbar:{
							type:'default',
							width: _self.arcbarWidth*_self.pixelRatio,//圆弧的宽度
							backgroundColor:'#ffe3e8',
						}
					},
					background:'#FFFFFF',
					pixelRatio:_self.pixelRatio,
					series: chartData.series,
					animation: true,
					width: _self.cWidth3*_self.pixelRatio,
					height: _self.cHeight3*_self.pixelRatio,
					dataLabel: true,
				});
				
			},
			changeData(){
				if(this.$Common.isJSON(_self.textarea)){
					let newdata=JSON.parse(_self.textarea);
					canvaArcbar1.updateData({
						series: newdata.series,
						categories: newdata.categories,
						title: {//这里的文案是自定义的，不写是不变的
							name:Math.round(newdata.series[0].data*100)+'%',
							color: newdata.series[0].color,
							fontSize: 25*_self.pixelRatio
						},
						subtitle:{//这里的文案是自定义的，不写是不变的
							name: '更新数据',
							color: '#666666',
							fontSize: 15*_self.pixelRatio
						}
					});
				}else{
					uni.showToast({
						title:'数据格式错误',
						image:'../../../static/images/alert-warning.png'
					})
				}
			}
		}
	}
</script>

<style>
	/*样式的width和height一定要与定义的cWidth和cHeight相对应*/
	.qiun-charts3 {
		height: 300upx;
		background-color: #FFFFFF;
		position: relative;
		display: flex;
		justify-content: space-around;
	}
	.progress{
		width: 250upx;
		height: 300upx;
	}
	.charts3 {
		width: 250upx;
		height: 250upx;
		background-color: #FFFFFF;
	}
</style>
