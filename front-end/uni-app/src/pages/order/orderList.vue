<template>
	<view>
		<van-tabs :active="active" @change="onChange">
		  <van-tab v-for="(item, key) in tabs" :key="key" :title="item">
			  <!-- 订单列表 -->
			  <view 
			  	v-for="(item,index) in orderList" :key="index"
			  	class="order-item"
			  >
			  	<view class="i-top b-b">
			  		<text class="time">订单号：{{item.id}}</text>
			  		<text 
			  			v-if="item.state == 3" 
			  			class="del-btn yticon icon-iconfontshanchu1"
			  			@click="deleteOrder(index)"
			  		>
					</text>
			  	</view>
			  	
			  	<scroll-view v-if="item.orderDetail.length > 1" class="goods-box" scroll-x>
			  		<view
			  			v-for="(goodsItem, goodsIndex) in item.orderDetail" :key="goodsIndex"
			  			class="goods-item"
			  		>
			  			<image class="goods-img" :src="goodsItem.goods.show_pic" mode="aspectFill"></image>
			  		</view>
			  	</scroll-view>
			  	<view 
			  		v-if="item.orderDetail.length === 1" 
			  		class="goods-box-single"
			  		v-for="(goodsItem, goodsIndex) in item.orderDetail" :key="goodsIndex"
			  	>
			  		<image class="goods-img" :src="goodsItem.goods.show_pic" mode="aspectFill"></image>
			  		<view class="right">
			  			<text class="title clamp">{{goodsItem.goods.name}}</text>
			  			<text class="attr-box">{{goodsItem.goods.unit_code}}  x {{ item.count }}</text>
			  			<text class="price">{{item.total}}</text>
			  		</view>
			  	</view>
			  	
			  	<view class="price-box">
			  		共
			  		<text class="num">{{ item.count}}</text>
			  		件商品 实付款
			  		<text class="price">{{item.total}}</text>
			  	</view>
			  	<view class="action-box b-t" v-if="item.state != 3">
			  		<button class="action-btn" @click="cancelOrder(item)">取消订单</button>
			  	</view>
			  </view>
		  </van-tab>
		</van-tabs>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabs: ['全部', '未发货', '已发货', '已送达', '已完成'],
				active: 4,
				orderList: []
			}
		},
		onLoad(options){
			this.active = parseInt(options.active)
		},
		methods: {
			async onChange(value){
				let state =  ''
				if(value.detail.index === 0){
					state = ''
				}else{
					state = value.detail.index - 1
				}
				const res = await uni.request({
					url: "http://127.0.0.1:7001/weapp/getOrderList",
					data: {
						user_id: this.$store.state.userInfo.id,
						state: state
					}
				})
				const data = res[1].data.data
				for(var i = 0; i < data.length; i++){
					const result = await uni.request({
						url: "http://127.0.0.1:7001/weapp/getOrderDetails/" + data[i].id
					})
					data[i].orderDetail = result[1].data.data
					
					data[i].count = this.getCount(data[i])
					data[i].total = this.getTotal(data[i])
				}
				this.orderList = data
			},
			getCount(item){
				let count = 0
				item.orderDetail.forEach(item => {
					count += item.goods_num
				})
				return count
			},
			
			getTotal(item){
				let total = 0
				item.orderDetail.forEach(item => {
					total += item.goods_num * item.goods.unit_code
				})
				return total.toFixed(2)
			},
			
			cancelOrder(item){
				uni.showToast({title:'取消订单'})
			}
		}
	}
</script>

<style lang="scss">
	page, .content{
		background: $page-color-base;
		height: 100%;
	}
	.order-item{
		display: flex;
		flex-direction: column;
		padding-left: 30upx;
		background: #fff;
		margin-top: 16upx;
		.i-top{
			display: flex;
			align-items: center;
			height: 80upx;
			padding-right:30upx;
			font-size: $font-base;
			color: $font-color-dark;
			position: relative;
			.time{
				flex: 1;
			}
			.state{
				color: $base-color;
			}
			.del-btn{
				padding: 10upx 0 10upx 36upx;
				font-size: $font-lg;
				color: $font-color-light;
				position: relative;
				&:after{
					content: '';
					width: 0;
					height: 30upx;
					border-left: 1px solid $border-color-dark;
					position: absolute;
					left: 20upx;
					top: 50%;
					transform: translateY(-50%);
				}
			}
		}
		/* 多条商品 */
		.goods-box{
			height: 160upx;
			padding: 20upx 0;
			white-space: nowrap;
			.goods-item{
				width: 120upx;
				height: 120upx;
				display: inline-block;
				margin-right: 24upx;
			}
			.goods-img{
				display: block;
				width: 100%;
				height: 100%;
			}
		}
		/* 单条商品 */
		.goods-box-single{
			display: flex;
			padding: 20upx 0;
			.goods-img{
				display: block;
				width: 120upx;
				height: 120upx;
			}
			.right{
				flex: 1;
				display: flex;
				flex-direction: column;
				padding: 0 30upx 0 24upx;
				overflow: hidden;
				.title{
					font-size: $font-base + 2upx;
					color: $font-color-dark;
					line-height: 1;
				}
				.attr-box{
					font-size: $font-sm + 2upx;
					color: $font-color-light;
					padding: 10upx 12upx;
				}
				.price{
					font-size: $font-base + 2upx;
					color: $font-color-dark;
					&:before{
						content: '￥';
						font-size: $font-sm;
						margin: 0 2upx 0 8upx;
					}
				}
			}
		}
		
		.price-box{
			display: flex;
			justify-content: flex-end;
			align-items: baseline;
			padding: 20upx 30upx;
			font-size: $font-sm + 2upx;
			color: $font-color-light;
			.num{
				margin: 0 8upx;
				color: $font-color-dark;
			}
			.price{
				font-size: $font-lg;
				color: $font-color-dark;
				&:before{
					content: '￥';
					font-size: $font-sm;
					margin: 0 2upx 0 8upx;
				}
			}
		}
		.action-box{
			display: flex;
			justify-content: flex-end;
			align-items: center;
			height: 100upx;
			position: relative;
			padding-right: 30upx;
		}
		.action-btn{
			width: 160upx;
			height: 60upx;
			margin: 0;
			margin-left: 24upx;
			padding: 0;
			text-align: center;
			line-height: 60upx;
			font-size: $font-sm + 2upx;
			color: $font-color-dark;
			background: #fff;
			border-radius: 100px;
			&:after{
				border-radius: 100px;
			}
			&.recom{
				background: #fff9f9;
				color: $base-color;
				&:after{
					border-color: #f7bcc8;
				}
			}
		}
	}

</style>
