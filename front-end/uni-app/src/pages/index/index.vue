<template>
	<view>
		<van-search shape="round" :value="query.search" placeholder="请输入搜索关键词" show-action @search="onSearch" @cancel="onCancel" @clear="query.search = ''"/>
		
		<van-divider contentPosition="center">商品列表</van-divider>
		<van-row>
			<van-col :span="12">
				<van-dropdown-menu>
				  <van-dropdown-item :value="0" :options="option" @change="sortChange" />
				</van-dropdown-menu>
			</van-col>
			<van-col :span="12">
				<van-cell title="选择分类" is-link @click="showPopup" />
			</van-col>
		</van-row>
		
		<van-card v-for="(item, key) in goodsList" :key="key" :desc="'已售: '+ item.sale_num" :price="item.unit_code" :title="item.name" :thumb="item.show_pic || emptyImg" :thumb-link="'/pages/goods/goodsDetail?id=' + item.id">
			<view slot="footer">
			  <van-icon name="cart-o" size="20px" color="red" @click="joinCart(item.id)" />
			</view>
		</van-card>

		
		<van-popup  :show="show" @close="onClose" position="bottom">
			<van-picker show-toolbar :columns="columns" @change="onChange" @confirm="confirmSelete" @cancel="onClose" />
		</van-popup>
		
		<van-toast id="van-toast" />
		
	</view>
</template>

<script>
import Toast from '../../wxcomponents/vant/dist/toast/toast'
	export default {
		data() {
			return {
				cateList: [{text: "全部商品", value: ''}],
				goodsList: [],
				option: [
				  { text: '全部商品', value: 0 },
				  { text: '价格升序', value: 1 },
				  { text: '销量降序', value: 2 },
				],
				query: {
					search: '',
					sort: 1,
					cateId: ''
				},
				show: false,
				emptyImg: '/static/cart-empty.png',
				columns: []
			}
		},
		onLoad() {
			this.getGoodsList()
			this.getCateList()
		},
		methods: {
			// 获取商品列表
			async getGoodsList(){
				const res = await uni.request({
					url: 'http://127.0.0.1:7001/weapp/getGoodsList',
					data: this.query
				})
				if(res[1].data.code === 200){
					this.goodsList = res[1].data.data.rows
				}
			},
			
			// 获取分类列表
			async getCateList(){
				const res = await uni.request({
					url: 'http://127.0.0.1:7001/weapp/getCateList'
				})
				if(res[1].data.code === 200){
					const data = res[1].data.data
					data.forEach(item => {
						var obj = {}
						obj.text = item.name
						obj.value = item.id
						if(item.children){
							obj.children = []
							item.children.forEach(item => {
								obj.children.push({
									text: item.name,
									value: item.id
								})
							})
						}
						this.cateList.push(obj)
					})
				}
				this.columns = [
					{
						values: this.cateList,
						className: 'column1'
					},
					{
						values: this.cateList[0].children ? this.cateList[0].children : '',
						className: 'column2',
						defaultIndex: 2
					}
				
				]
			},
			
			
			onChange(event) {
				const { value, picker, index } = event.detail
				if(index == 0){
					picker.setColumnValues(index + 1, value[0].children == null ? '' : value[0].children);
				}
				
			},
			onSearch(event){
				this.query.search = event.detail
				this.getGoodsList()
			},
			onCancel(){
				this.query.search = ''
			},
			
			// 显示分类选择器
			showPopup(){
				this.show = true
			},
			// 隐藏分类选择器
			onClose(){
				this.show = false
			},
			// 确定选择
			confirmSelete(event){
				const { value } = event.detail
				if(value[1]){
					this.query.cateId = value[1].value
				} else {
					this.query.cateId = value[0].value
				}
				this.getGoodsList()
				this.show = false
			},
			
			sortChange(value){
				this.query.sort = value.detail
				this.getGoodsList()
			},
			
			async joinCart(id) {	
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
		}
	}
</script>

<style>

</style>
