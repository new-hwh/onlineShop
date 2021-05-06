<template>
    <view class="container">
		<view v-if="!hasLogin || empty === true" class="empty">
			<image src="/static/cart-empty.png" mode="aspectFit"></image>
			<view v-if="hasLogin" class="empty-tips">
				空空如也
				<navigator class="navigator" v-if="hasLogin" url="/pages/index/index" open-type="switchTab">随便逛逛></navigator>
			</view>
			<view v-else class="empty-tips">
				还未登录？
				<view class="navigator" @click="navToLogin">去登陆></view>
			</view>
		</view>
		
		<!-- 购物车模块 -->
		<view v-else class="cart-container">
			<sideslip-car ref="mycar" @selAllBtn="selAllBtn" @delBtn="delBtn" @touchEv="touchEv" class="sideslip-car" @selThis="selThis" @jsBtn="jsBtn" @changeNum="changeNum" :carts="cartList"></sideslip-car>
		</view>
    </view>
</template>
<script>
	 import sideslipCar from '../../components/sideslip-car/sideslip-car.vue'
	 import { mapState } from 'vuex';
	    export default {
	        components:{
	            sideslipCar
	        },
	        data() {
	            return {
					cartList: [],
					empty: false, //空白页现实  true|false
	            }
	        },
			onLoad(){
			},
	        async onShow() {
				this.login = uni.getStorageSync('haslogin');
				await this.getCartList()
				if(this.hasLogin && !this.empty){
					this.$refs.mycar.getTotalPrice();
				}
				
	        },
			onReady(){
			},
			watch:{
				//显示空白页
				cartList(e){
					let empty = e.length === 0 ? true: false;
					if(this.empty !== empty){
						this.empty = empty;
					}
				},
				hasLogin(e){
					if(e){
						this.getCartList();
					}
				}
			},
			computed:{
				...mapState(['hasLogin'])
			},
	        methods: {
				async getCartList(){
					const res = await uni.request({
						url: `http://127.0.0.1:7001/weapp/getCartList/${this.$store.state.userInfo.id}`
					})
					let list = res[1].data.data
					list.forEach(item => {
						item.isTouchMove = false
						item.selected = true
					})
					this.cartList = list
				},
				// 跳转登录
				navToLogin(){
					uni.navigateTo({
						url: '/pages/user/login'
					})
				},
				// 点击结算按钮
	            jsBtn(goodsList){
					uni.navigateTo({
						url: "/pages/order/pay?item=" + encodeURIComponent(JSON.stringify(goodsList))
					})
	            },
				// 数量改变
	            async changeNum(carts, id, nums){
	                this.cartList = carts;
	                this.$refs.mycar.getTotalPrice();
					await uni.request({
						url: `http://127.0.0.1:7001/weapp/updateCart/${id}`,
						method: "POST",
						data: {
							goods_num: nums
						}
					})
	            },
				// 选择按钮
	            selThis(carts){
	                this.cartList = carts;
	                this.$refs.mycar.getTotalPrice();
	            },
				// 全选按钮
	            selAllBtn(carts){
	                this.cartList = carts;
	                this.$refs.mycar.getTotalPrice();
	            },
				// 滑动事件
	            touchEv(carts){
	                this.cartList = carts;
	            },
				// 点击删除按钮
	            async delBtn(carts,id,index){
	                carts.splice(index, 1);
	                this.cartList = carts;
	                this.$refs.mycar.getTotalPrice();
					await uni.request({
						url: `http://127.0.0.1:7001/weapp/delCart/${id}`,
						method: 'DELETE'
					})
	            }
	        }
	    }
</script>

<style lang="scss">

    page{
      background: #f5f5f5;
    }
    view,textarea,input,text,button{
      padding: 0;
      margin: 0;
      box-sizing:border-box;
      font-size: 28rpx;
      font-family: "微软雅黑";
    }
    .uni-checkbox-input{
        border-radius: 50% !important;
    }
	
	.container{
			padding-bottom: 134upx;
			/* 空白页 */
			.empty{
				position:fixed;
				left: 0;
				top:0;
				width: 100%;
				height: 100vh;
				padding-bottom:100upx;
				display:flex;
				justify-content: center;
				flex-direction: column;
				align-items:center;
				background: #fff;
				image{
					width: 240upx;
					height: 160upx;
					margin-bottom:30upx;
				}
				.empty-tips{
					display:flex;
					font-size: $font-sm+2upx;
					color: $font-color-disabled;
					.navigator{
						color: $uni-color-primary;
						margin-left: 16upx;
					}
				}
			}
		}
	
    .cart-container {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        box-sizing: border-box;
        background: #f5f5f5;
        overflow: hidden;
    }
    .line1{
        overflow: hidden;
        text-overflow: ellipsis;
        display: box;
        display: -webkit-box;
        line-clamp: 1;
        box-orient: vertical;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        word-break: break-all; /* 英文换行问题 */
    }
    .line2 {
        overflow: hidden;
        text-overflow: ellipsis;
        display: box;
        display: -webkit-box;
        line-clamp: 2;
        box-orient: vertical;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        word-break: break-all; /* 英文换行问题 */
    }
    .centerboth {
        display:flex;
        display: -webkit-flex;
        align-items:center;
        -webkit-align-items:center;
        justify-content: center;
        -webkit-justify-content: center;
    }
    .clearfix:after {
        content: "";
        display: block;
        visibility: hidden;
        height: 0;
        clear: both;
    }

    .clearfix {
        zoom: 1;
    }
    image{
      padding: 0;
      margin: 0;
    }
    textarea {
      width:300rpx;
      height:75rpx;
      display:block;
      position:relative;
      font-size: 28rpx;
    }
    button::after{ border: none; }
    input:-ms-input-placeholder {
        color: #808080;
    }
    .cart-container {
        background: #F5F5F5;
    }
    .cart-container {
        width: 100%;
        padding: 0 24rpx;
    }
    .sideslip-car{
        width: 100%;
    }
</style>
