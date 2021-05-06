<template>
	<view>
		<!-- 地址 -->
		<view class="address-section" @click="editDialog = true">
			<view class="order-content">
				<text class="yticon icon-shouhuodizhi"></text>
				<view class="cen">
					<view class="top">
						<text class="name">{{ orderInfo.recevice_name }}</text>
						<text class="mobile">{{ orderInfo.recevice_phone }}</text>
					</view>
					<text class="address">{{ orderInfo.address_name }}</text>
				</view>
				<text class="yticon icon-you"></text>
			</view>
		</view>

		<view>
			<!-- 商品列表 -->
			<view v-for="(item, key) in goodsList" :key=key>
				<van-card
				  :num="item.goods_num"
				  :price="item.goods.unit_code || item.unit_code"
				  :title="item.goods.name || item.name"
				  :thumb="item.goods.show_pic || item.show_pic"
				/>
			</view>
		</view>

		<!-- 金额明细 -->
		<view class="yt-list">
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">商品金额</text>
				<text class="cell-tip">￥{{ total }}</text>
			</view>
			<view class="yt-list-cell desc-cell">
				<text class="cell-tit clamp">备注</text>
				<input class="desc" type="text" v-model="orderInfo.memo" placeholder="请填写备注信息" placeholder-class="placeholder" />
			</view>
		</view>
		
		<!-- 底部 -->
		<view class="footer">
			<view class="price-content">
				<text>实付款</text>
				<text class="price-tip">￥</text>
				<text class="price">{{ total }}</text>
			</view>
			<text class="submit" @click="openDialog = true">提交订单</text>
		</view>
		
		
		<!-- 确认支付弹出框 -->
		<van-dialog use-slot :show="openDialog" show-cancel-button @close="openDialog = false" @confirm="confirmBuy">
		  <view class="price-box">
		  	<text>支付金额</text>
		  	<text class="price">{{ total }}</text>
		  </view>
		  
		  <van-cell-group>
			  <van-field :value="password" type="password" label="密码" placeholder="请输入密码" required @change="changePwd"/>
		   </van-cell-group>
		</van-dialog>
		
		<!-- 修改收货信息弹出框 -->
		<van-dialog use-slot :zIndex="90" :show="editDialog" show-cancel-button @close="editDialog = false" @confirm="confirmedit">		  
		  <van-cell-group>
			  <van-field :value="receviceInfo.recevice_name" :error-message="nameError" label="收货人" placeholder="请输入收货人姓名" required @change="changeName"/>
		   </van-cell-group>
		   <van-cell-group>
			  <van-field :value="receviceInfo.recevice_phone" :error-message="phoneError" label="联系电话" placeholder="请输入联系电话" required @change="changePhone"/>
		   </van-cell-group>
		   <van-cell-group>
			  <van-cell title="收货地址" :value="receviceInfo.address_name" is-link @click="openPicker"></van-cell>
		   </van-cell-group>
		</van-dialog>
		
		
		<van-toast id="van-toast" />
		<van-popup :zIndex="91" :show="showAddressList" position="bottom" @close="showAddressList = false">
			<van-picker :columns="addressList" show-toolbar value-key="address_name" @cancel="showAddressList = false" @confirm="changeAddress"/>
		</van-popup>
	</view>
</template>

<script>
import Toast from '../../wxcomponents/vant/dist/toast/toast.js';	
	export default {
		data() {
			return {
				goodsList: [],
				total: 0,
				openDialog: false,
				password: '',
				receviceInfo: {},
				orderInfo: {
					user_id: '',
					recevice_name: '',
					recevice_phone: '',
					address_name: '',
					memo: ''
				},
				editDialog: false,
				phoneError: '',
				nameError: '',
				showAddressList: false,
				addressList: [],
			}
		},
		onLoad(option){
			let userInfo = this.$store.state.userInfo
			// 用户默认收货姓名和地址
			const { phone, address} = userInfo
			this.orderInfo.user_id = userInfo.id
			this.orderInfo.recevice_name = userInfo.name
			if(phone) {
				this.orderInfo.recevice_phone = phone
			}
			if(address) {
				this.orderInfo.address_name = address.address_name
			}
			
			//商品数据
			let item = JSON.parse(decodeURIComponent(option.item))
			if(!item.length){
				item.goods_num = 1
				this.goodsList.push(item)
			} else  {
				this.goodsList = item
			}
			this.getAddressList()
			this.getOrderTotal()
			
			this.receviceInfo.recevice_name = userInfo.name
			if(phone) {
				this.receviceInfo.recevice_phone = phone
			}
			if(address) {
				this.receviceInfo.address_name = address.address_name
			}
		},
		methods: {
			async getAddressList(){
				const res = await uni.request({url: 'http://127.0.0.1:7001/weapp/getAddressList'})
				if(res[1].data.code === 200){
					this.addressList  = res[1].data.data
				}
			},
			getOrderTotal() {
				this.goodsList.forEach(item => {
					if(item.goods){
						this.total += item.goods_num * item.goods.unit_code 
					}else {
						this.total += item.goods_num * item.unit_code
					}
				})
				this.total = this.total.toFixed(2)
			},
			
			changePwd(value){
				this.password = value.detail
			},
			changeName(value){
				if(!value.detail){
					this.nameError = '收货人姓名不能为空'
				}else{
					this.nameError = ''
				}
				this.receviceInfo.recevice_name = value.detail
			},
			changePhone(value){
				if(!value.detail){
					this.phoneError = '联系电话不能为空'
				}else {
					this.phoneError = ''
				}
				this.receviceInfo.recevice_phone = value.detail
			},
			
			openPicker(){
				if(!this.editDisabled){
					this.showAddressList = true
				}
			},
			changeAddress(e){
				const { detail } = e
				this.receviceInfo.address_name = detail.value.address_name
				this.showAddressList = false
			},
			confirmedit(){
				if(!this.receviceInfo.recevice_phone || !this.receviceInfo.recevice_name){
					Toast.fail('修改失败，收货人或联系电话不能为空')
				}else {
					this.orderInfo.recevice_name = this.receviceInfo.recevice_name
					this.orderInfo.recevice_phone = this.receviceInfo.recevice_phone
					this.orderInfo.address_name = this.receviceInfo.address_name
				}
			},
			async confirmBuy() {
				const res = await uni.request({
					url: "http://127.0.0.1:7001/weapp/vaildPwd/" + this.$store.state.userInfo.id,
					method: "POST",
					data: {
						password: this.password
					}
				})
				if(res[1].data.code === 200){
					// 新增订单
					const result = await uni.request({
						url: "http://127.0.0.1:7001/weapp/createOrder",
						method: "PUT",
						data: this.orderInfo
					})
					// 创建订单ID对应的订单详情
					const order_id = result[1].data.data.order_id
					this.goodsList.forEach(async item => {
						await uni.request({
							url: "http://127.0.0.1:7001/weapp/createOrderDetails",
							method: "PUT",
							data: {
								order_id,
								goods_id: item.goods.id || item.id,
								goods_num: item.goods_num
							}
						})
						
						if(item.goods){
							// 购物车进来的删除对应购物车商品
							await uni.request({
								url: "http://127.0.0.1:7001/weapp/delCart/" + item.id,
								method: "DELETE",
							})
						}
					})
					uni.navigateTo({
						url: '/pages/order/paySuccess',
					})
				}else{
					Toast.fail('密码错误，请重新输入')
					this.password = ''
				}
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: $page-color-base;
		padding-bottom: 100upx;
	}

	.address-section {
		padding: 30upx 0;
		background: #fff;
		position: relative;

		.order-content {
			display: flex;
			align-items: center;
		}

		.icon-shouhuodizhi {
			flex-shrink: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 90upx;
			color: #888;
			font-size: 44upx;
		}

		.cen {
			display: flex;
			flex-direction: column;
			flex: 1;
			font-size: 28upx;
			color: $font-color-dark;
		}

		.name {
			font-size: 34upx;
			margin-right: 24upx;
		}

		.address {
			margin-top: 16upx;
			margin-right: 20upx;
			color: $font-color-light;
		}

		.icon-you {
			font-size: 32upx;
			color: $font-color-light;
			margin-right: 30upx;
		}

		.a-bg {
			position: absolute;
			left: 0;
			bottom: 0;
			display: block;
			width: 100%;
			height: 5upx;
		}
	}

	.yt-list {
		margin-top: 16upx;
		background: #fff;
	}

	.yt-list-cell {
		display: flex;
		align-items: center;
		padding: 10upx 30upx 10upx 40upx;
		line-height: 70upx;
		position: relative;

		&.cell-hover {
			background: #fafafa;
		}

		&.b-b:after {
			left: 30upx;
		}

		.cell-icon {
			height: 32upx;
			width: 32upx;
			font-size: 22upx;
			color: #fff;
			text-align: center;
			line-height: 32upx;
			background: #f85e52;
			border-radius: 4upx;
			margin-right: 12upx;

			&.hb {
				background: #ffaa0e;
			}

			&.lpk {
				background: #3ab54a;
			}

		}

		.cell-more {
			align-self: center;
			font-size: 24upx;
			color: $font-color-light;
			margin-left: 8upx;
			margin-right: -10upx;
		}

		.cell-tit {
			flex: 1;
			font-size: 26upx;
			color: $font-color-light;
			margin-right: 10upx;
		}

		.cell-tip {
			font-size: 26upx;
			color: $font-color-dark;

			&.disabled {
				color: $font-color-light;
			}

			&.active {
				color: $base-color;
			}
			&.red{
				color: $base-color;
			}
		}

		&.desc-cell {
			.cell-tit {
				max-width: 90upx;
			}
		}

		.desc {
			flex: 1;
			font-size: $font-base;
			color: $font-color-dark;
		}
	}
	
	.footer{
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 995;
		display: flex;
		align-items: center;
		width: 100%;
		height: 90upx;
		justify-content: space-between;
		font-size: 30upx;
		background-color: #fff;
		z-index: 998;
		color: $font-color-base;
		box-shadow: 0 -1px 5px rgba(0,0,0,.1);
		.price-content{
			padding-left: 30upx;
		}
		.price-tip{
			color: $base-color;
			margin-left: 8upx;
		}
		.price{
			font-size: 36upx;
			color: $base-color;
		}
		.submit{
			display:flex;
			align-items:center;
			justify-content: center;
			width: 280upx;
			height: 100%;
			color: #fff;
			font-size: 32upx;
			background-color: $base-color;
		}
	}
	
	
	
	// 支付弹出框
	.price-box {
		background-color: #fff;
		height: 265upx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		font-size: 28upx;
		color: #909399;
	
		.price{
			font-size: 50upx;
			color: #303133;
			margin-top: 12upx;
			&:before{
				content: '￥';
				font-size: 40upx;
			}
		}
	}

</style>
