<template>
	<view>
		<van-row>
			<van-col :class="userInfo" span="6" offset="9" >
				<view @click="toLogin">
					<view class="avatar">
						<image :src="userInfo.avatar_img || avatarImg" mode="aspectFit"></image>
					</view>
					<view class="userName" v-if="hasLogin">
						<text>{{ userInfo.name }}</text>
					</view>
					<view v-else style="width: 150upx; text-align: center;">
						<text>游客</text>
					</view>
				</view>
			</van-col>
		</van-row>
		
		<!-- 订单栏 -->
		<van-grid column-num="5">
			<van-grid-item icon="bill-o" text="全部订单" @click="toOrderList(0)" />
			<van-grid-item icon="bill-o" text="未发货" :badge="orderNum.zero" @click="toOrderList(1)"/>
			<van-grid-item icon="orders-o" text="已发货" :badge="orderNum.one" @click="toOrderList(2)"/>
			<van-grid-item icon="logistics" text="已送达" :badge="orderNum.two" @click="toOrderList(3)"/>
			<van-grid-item icon="certificate" text="已完成" :badge="orderNum.three" @click="toOrderList(4)"/>
		</van-grid>
		
		<van-cell class="infoCell" is-link title="我的信息" link-type="navigateTo" url="/pages/user/userInfo"/>
		<van-cell is-link title="退出登录" @click="tologout"/>
		
		<van-toast id="van-toast" />
	</view>
</template>

<script>
import { mapMutations } from 'vuex';
import Toast from '../../wxcomponents/vant/dist/toast/toast.js';
	export default {
		data() {
			return {
				hasLogin: false,
				userInfo: {},
				avatarImg: '/static/avatar.png',
				orderList: [],
				orderNum: {
					zero: 0,
					one: 0,
					two: 0,
					three: 0
				}
				
			}
		},
		async onShow(){
			this.userInfo = this.$store.state.userInfo
			this.hasLogin = this.$store.state.hasLogin
			await this.getOrderList()
			this.countOrderNun()
		},
		methods: {
			...mapMutations(['logout']),
			async getOrderList(){
				const res = await uni.request({
					url: "http://127.0.0.1:7001/weapp/getOrderList",
					data: {
						user_id: this.userInfo.id,
						state: ''
					}
				})
				this.orderList = res[1].data.data 
			},
			countOrderNun(){
				this.orderNum = { zero: 0, one: 0, two: 0, three: 0 }
				this.orderList.forEach(item => {
					if(item.state == 0){
						this.orderNum.zero += 1
					}else if (item.state == 1){
						this.orderNum.one += 1
					}else if (item.state == 2){
						this.orderNum.two += 1
					}else if (item.state == 3){
						this.orderNum.three += 1
					}
				})
			},
			tologout(){
				if(this.hasLogin){
					this.logout()
					Toast.success('退出成功');
					uni.navigateTo({url: '/pages/user/login'})
				}else {
					Toast.fail('你还没登录呢');
				}
			},
			toLogin(){
				if(!this.hasLogin){
					uni.navigateTo({url: '/pages/user/login'})
				}
			},
			
			toOrderList(active){
				uni.navigateTo({url: `/pages/order/orderList?active=${active}`})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.avatar {
		image {
			width: 150upx;
			height: 150upx;
		}
	}
	.userName {
		color: red;
		width: 150upx;
		text-align: center;
	}
	/deep/.van-row {
		margin: 20px 0; 
	}

</style>
