<template>
	<view class="container">
		<view class="carousel">
			<view class="image-wrapper">
				<image
					:src="goodsInfo.show_pic || emptyImg" 
					class="loaded" 
					mode="aspectFill"
				>
				</image>
			</view>
		</view>
		
		<view class="introduce-section">
			<text class="title">{{ goodsInfo.name }}</text>
			<view class="price-box">
				<text class="price-tip">¥</text>
				<text class="price">{{ goodsInfo.unit_code }}</text>
			</view>
			<view class="bot-row">
				<text>销量: {{ goodsInfo.sale_num }}</text>
				<text>库存: {{ goodsInfo.store_num }}</text>
			</view>
		</view>
		
		<view class="detail-desc">
			<view class="d-header">
				<text>商品详情</text>
			</view>
			<rich-text :nodes="goodsInfo.description"></rich-text>
		</view>
		
		<!-- 底部操作菜单 -->
		<view class="page-bottom">
			<navigator  url="/pages/index/index" open-type="switchTab" class="p-b-btn">
				<van-icon name="home-o" />
				<text>首页</text>
			</navigator>
			<navigator url="/pages/shoppingCart/shoppingCart" open-type="switchTab" class="p-b-btn">
				<van-icon name="shopping-cart-o" />
				<text>购物车</text>
			</navigator>

			<view class="action-btn-group">
				<button type="primary" class=" action-btn no-border buy-now-btn" @click="buy">立即购买</button>
				<button type="primary" class=" action-btn no-border add-cart-btn" @click="joinCart">加入购物车</button>
			</view>
		</view>
		
		<van-toast id="van-toast" />
		
	</view>
</template>

<script>
import Toast from '../../wxcomponents/vant/dist/toast/toast'
	export default{
		data() {
			return {
				goodsInfo: '',
				emptyImg: '/static/data-empty.png'
			};
		},
		onLoad(options){
			this.getGoodsInfo(options.id)
			
		},
		methods:{
			async getGoodsInfo(id){
				const res = await uni.request({ url: `http://127.0.0.1:7001/weapp/getGoods/${id}` })
				if(res[1].data.code === 200){
					this.goodsInfo = res[1].data.data
				}
			},
			buy(){
				uni.navigateTo({
					url: "/pages/order/pay?item=" + encodeURIComponent(JSON.stringify(this.goodsInfo))
				})
			},
			async joinCart() {
				let id = this.goodsInfo.id
				if(!this.$store.state.hasLogin){
					Toast.fail('你还没登录呢');
				}else {
					// console.log(this.$store.state.userInfo.id);
					const res = await uni.request({
						url: 'http://127.0.0.1:7001/weapp/addCart',
						method: 'POST',
						data: {
							user_id: this.$store.state.userInfo.id,
							goods_id: id
						}
					})
					
					if(res[1].data.code === 200){
						console.log(1);
						Toast.success('加入购物车成功');
					}
					
				}
				
			}
		},
	}
</script>

<style lang='scss'>
	page{
		background: $page-color-base;
		padding-bottom: 160upx;
	}
	.icon-you{
		font-size: $font-base + 2upx;
		color: #888;
	}
	.carousel {
		height: 722upx;
		position:relative;
		swiper{
			height: 100%;
		}
		.image-wrapper{
			width: 100%;
			height: 100%;
		}
		.swiper-item {
			display: flex;
			justify-content: center;
			align-content: center;
			height: 750upx;
			overflow: hidden;
			image {
				width: 100%;
				height: 100%;
			}
		}
		
	}
	
	/* 标题简介 */
	.introduce-section{
		background: #fff;
		padding: 20upx 30upx;
		
		.title{
			font-size: 32upx;
			color: $font-color-dark;
			height: 50upx;
			line-height: 50upx;
		}
		.price-box{
			display:flex;
			align-items:baseline;
			height: 64upx;
			padding: 10upx 0;
			font-size: 26upx;
			color:$uni-color-primary;
		}
		.price{
			font-size: $font-lg + 2upx;
		}
		.m-price{
			margin:0 12upx;
			color: $font-color-light;
			text-decoration: line-through;
		}
		.coupon-tip{
			align-items: center;
			padding: 4upx 10upx;
			background: $uni-color-primary;
			font-size: $font-sm;
			color: #fff;
			border-radius: 6upx;
			line-height: 1;
			transform: translateY(-4upx); 
		}
		.bot-row{
			display:flex;
			align-items:center;
			height: 50upx;
			font-size: $font-sm;
			color: $font-color-light;
			text{
				flex: 1;
			}
		}
	}
	
	/*  详情 */
	.detail-desc{
		background: #fff;
		margin-top: 16upx;
		.d-header{
			display: flex;
			justify-content: center;
			align-items: center;
			height: 80upx;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			position: relative;
				
			text{
				padding: 0 20upx;
				background: #fff;
				position: relative;
				z-index: 1;
			}
			&:after{
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translateX(-50%);
				width: 300upx;
				height: 0;
				content: '';
				border-bottom: 1px solid #ccc; 
			}
		}
	}
	
	
	
	/* 底部操作菜单 */
	.page-bottom{
		position:fixed;
		left: 30upx;
		bottom:30upx;
		z-index: 95;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 690upx;
		height: 100upx;
		background: rgba(255,255,255,.9);
		box-shadow: 0 0 20upx 0 rgba(0,0,0,.5);
		border-radius: 16upx;		
		
		.p-b-btn{
			display:flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			font-size: $font-sm;
			color: $font-color-base;
			width: 96upx;
			height: 80upx;
			.van-icon {
				font-size: 40upx;
				line-height: 48upx;
				color: $font-color-light;
			}
			&.active, &.active .yticon{
				color: $uni-color-primary;
			}
		}
		.action-btn-group{
			display: flex;
			height: 76upx;
			border-radius: 100px;
			overflow: hidden;
			box-shadow: 0 20upx 40upx -16upx #fa436a;
			box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
			background: linear-gradient(to right, #ffac30,#fa436a,#F56C6C);
			margin-left: 20upx;
			position:relative;
			&:after{
				content: '';
				position:absolute;
				top: 50%;
				right: 50%;
				transform: translateY(-50%);
				height: 28upx;
				width: 0;
				border-right: 1px solid rgba(255,255,255,.5);
			}
			.action-btn{
				display:flex;
				align-items: center;
				justify-content: center;
				width: 180upx;
				height: 100%;
				font-size: $font-base ;
				padding: 0;
				border-radius: 0;
				background: transparent;
			}
		}
	}
	
</style>
