<template>
	<view class="column">
		<view v-for="(item,index) in content" :key="index" :class="['row','font-small','progress',padMiddle?'paddingMiddle':'']">
			<text class="title" :style={flex:flex}>{{item.name}}</text>
			<view class="body">
				<view class="number">{{item.now?item.now+"/":""}}{{item.expect}} [{{item.value}}%]</view>
				<progress :percent="item.value" backgroundColor="#C9C9C9"
				:border-radius="borderRadius?borderRadius+'rpx':'0px'"
				:color="time | formatColor(item.value,item.name)" 
				stroke-width="16" />
			</view>
		</view>
	</view>
</template>

<script>
	import Config from "../../static/js/config.js"
	export default {
		name:'data-progress',
		props: {
			content: {
				type: Array,
				default: ()=> {
					return []
				}
			},
			borderRadius:{
				type:Number,
				default:0
			},
			padMiddle:{
				type:String,
				default:"false"
			},
            isPC:{
                type:Boolean,
                default:false
            }
		},
		data() {
			return {
				time:0,
				progressWidth:16,
				textTop:0,
				flex:2
			}
		},
		filters:{
			formatColor(time, data, type){
				if (type == "时间进度" || type == "系数进度") {
				    return Config.COLOR[3];
				} else {
				    if (Number(data) >= 100) {
				        return Config.COLOR[2];
				    } else if (Number(data) <= Number(time)) {
				        return Config.COLOR[0];
				    } else {
				        return Config.COLOR[1];
				    }
					
				}
			}
		},
		watch:{
			"content":{
				deep: true,
				handler: function(newVal, oldVal) {
					this.time = newVal.filter(x=>x.name=="时间进度")[0].value;
				}
			}
		},
		created() {
			this.time = this.content.filter(x=>x.name=="时间进度")[0].value;
			if(this.isPC){
                this.progressWidth = 25;
                this.textTop = 5;
				this.flex = 1;
            }
		}
	}
</script>

<style lang="scss">
	.paddingMiddle{
		padding: 18rpx 10rpx;
	}
	.row{
		    display: flex;
		    flex-direction: row;
	}
	.progress{
		
		.title{
			font-size: 14px;
			display: flex;
			align-items: center;
			flex:2;
		}
		.body{
			position: relative;
			flex: 6;
			
			.number{
				color: #fff;
				position: absolute;
				z-index: 2;
				left: 26rpx;
				height: 100%;
				display: flex;
				align-items: center;
				text-overflow: ellipsis;
				white-space: nowrap;
				overflow: hidden;
				height: 44rpx;
			}
			progress{
				padding: 6rpx 0;
			}
		
		}
	}
	
	
	
</style>
