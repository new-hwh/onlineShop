<template>
	<view>
		<view class="userInfo">
			<van-cell-group>
			  <van-field :value="userInfo.name" disabled label="用户名" placeholder="请输入用户名"/>
			</van-cell-group>
			<van-cell title="性别">
				 <radio-group @change="chageSex">
					<label class="radio"><radio value="0" :disabled="editDisabled" :checked="userInfo.sex === '0'" />男</label>
					<label class="radio"><radio value="1" :disabled="editDisabled" :checked="userInfo.sex === '1'" />女</label>
				</radio-group>
			</van-cell>
			<van-cell-group>
				<van-field :value="userInfo.email" :disabled="editDisabled"  label="邮箱地址" placeholder="请输入邮箱地址" @change="changeEmail"/>
			</van-cell-group>
			<van-cell-group>
				<van-field :value="userInfo.phone" :disabled="editDisabled"  label="手机号码" placeholder="请输入手机号码" @change="changePhone"/>
			</van-cell-group>
			<van-cell-group>
				<van-cell title="收货地址" :value="address" is-link @click="openPicker"></van-cell>
			</van-cell-group>
			<van-cell :border="false">
				<van-button v-if="editDisabled" type="primary" @click="editDisabled = false">修改</van-button>
				<van-button v-else type="info" @click="editUserInfo">确认修改</van-button>
			</van-cell>
		</view>
		
		<!-- 地址选择弹出 -->
		<van-popup :show="showAddressList" position="bottom" @close="showAddressList = false">
			<van-picker :columns="addressList" show-toolbar value-key="address_name" @cancel="showAddressList = false" @confirm="changeAddress"/>
		</van-popup>
		
		<van-toast id="van-toast" />
	</view>
</template>

<script>
import Toast from '../../wxcomponents/vant/dist/toast/toast.js';
	export default {
		data() {
			return {
				editDisabled: true,
				userInfo: {},
				showAddressList: false,
				addressList: [],
				address: ''
			}
		},
		onLoad(){
			const {name, sex, email, address_id, phone, address} = this.$store.state.userInfo
			this.userInfo = { name, sex, email, address_id, phone }
			if(address){
				this.address = address.address_name
			}
			this.getAddressList()
		},
		methods: {
			async getAddressList(){
				const res = await uni.request({url: 'http://127.0.0.1:7001/weapp/getAddressList'})
				if(res[1].data.code === 200){
					this.addressList  = res[1].data.data
				}
			},
			chageSex(e){
				this.userInfo.sex = e.detail.value
			},
			changeEmail(e){
				this.userInfo.email = e.detail
			},
			changePhone(e){
				this.userInfo.phone = e.detail
			},
			changeAddress(e){
				const { detail } = e
				this.address = detail.value.address_name
				this.userInfo.address_id = detail.value.id
				this.showAddressList = false
			},
			openPicker(){
				if(!this.editDisabled){
					this.showAddressList = true
				}
			},
			async editUserInfo(){
				const res =  await uni.request({
					url: `http://127.0.0.1:7001/weapp/editUser/${this.$store.state.userInfo.id}`,
					method: 'POST',
					data: this.userInfo
				})
				if(res[1].data.code === 200){
					this.editDisabled = true
					Toast.success('修改成功')
				}
			}
		}
	}
</script>

<style scoped>
	.userInfo {
		margin-top: 50upx;
	}
	.radio {
		margin-left: 20upx;
	}
</style>
