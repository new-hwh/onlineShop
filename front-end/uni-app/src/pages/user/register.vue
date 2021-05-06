<template>
	<view class="container">
		<view class="left-bottom-sign"></view>
<!-- 		<van-icon class="back-btn" name="arrow-left" @click="navBack"/> -->
		<view class="right-top-sign"></view>
		<!-- 设置白色背景防止软键盘把下部绝对定位元素顶上来盖住输入框等 -->
		<view class="wrapper">
			<view class="left-top-sign">RESGISTER</view>
			<view class="welcome">
				注册用户！
			</view>
			<view class="input-content">
				<view class="input-item">
					<text class="tit">用户名</text>
					<input 
						type="text" 
						v-model="username"
						placeholder="请输入用户名"
						maxlength="20"
					/>
				</view>
				<view class="input-item">
					<text class="tit">密码</text>
					<input 
						v-model="password"
						placeholder="请输入密码"
						maxlength="100"
						password 
						data-key="password"
					/>
				</view>
				<view class="input-item">
					<text class="tit">确认密码</text>
					<input 
						v-model="confirmPwd"
						placeholder="请再次输入密码"
						maxlength="100"
						password 
						data-key="confirmPwd"
						@confirm="toRegister"
					/>
				</view>
			</view>
			<button class="confirm-btn" @click="toRegister" :disabled="logining">注册</button>
<!-- 			<view class="forget-section">
				忘记密码?
			</view> -->
		</view>
		<view class="register-section">
			已有账号?
			<text @click="toLogin">去登录</text>
		</view>
		
		<van-toast id="van-toast" />
	</view>
</template>

<script>
import Toast from '../../wxcomponents/vant/dist/toast/toast.js';
	
	export default{
		data(){
			return {
				username: '',
				password: '',
				confirmPwd: '',
				logining: false
			}
		},
		onLoad(){
			
		},
		methods: {
			navBack(){
				uni.navigateBack();
			},
			toLogin(){
				uni.navigateTo({
					url: '/pages/user/login'
				})
			},
			async toRegister(){
				this.logining = true
				if(!this.username || !this.password){
					this.logining = false
					Toast.fail('账号或密码不能为空')
					return
				}
				if(this.confirmPwd !== this.password){
					this.logining = false
					Toast.fail('两次密码不一致，请重新输入')
					return
				}
				const res = await uni.request({
					url: 'http://127.0.0.1:7001/weapp/register',
					method: 'PUT',
					data: {
						name: this.username,
						password: this.password
					}
				})
				if(res[1].data.code === 200){
					Toast.success('注册成功')
					uni.navigateBack()
				}else {
					Toast.fail("注册失败" + res[1].data.message)
					this.logining = false
				}
			}
		},

	}
</script>

<style lang='scss'>
	page{
		background: #fff;
	}
	.container{
		padding-top: 115px;
		position:relative;
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		background: #fff;
	}
	.wrapper{
		position:relative;
		z-index: 90;
		background: #fff;
		padding-bottom: 40upx;
	}
	.back-btn{
		position:absolute;
		left: 40upx;
		z-index: 9999;
		padding-top: var(--status-bar-height);
		top: 40upx;
		font-size: 40upx;
		color: $font-color-dark;
	}
	.left-top-sign{
		font-size: 120upx;
		color: $page-color-base;
		position:relative;
		left: -16upx;
	}
	.right-top-sign{
		position:absolute;
		top: 80upx;
		right: -30upx;
		z-index: 95;
		&:before, &:after{
			display:block;
			content:"";
			width: 400upx;
			height: 80upx;
			background: #b4f3e2;
		}
		&:before{
			transform: rotate(50deg);
			border-radius: 0 50px 0 0;
		}
		&:after{
			position: absolute;
			right: -198upx;
			top: 0;
			transform: rotate(-50deg);
			border-radius: 50px 0 0 0;
			/* background: pink; */
		}
	}
	.left-bottom-sign{
		position:absolute;
		left: -270upx;
		bottom: -320upx;
		border: 100upx solid #d0d1fd;
		border-radius: 50%;
		padding: 180upx;
	}
	.welcome{
		position:relative;
		left: 50upx;
		top: -90upx;
		font-size: 46upx;
		color: #555;
		text-shadow: 1px 0px 1px rgba(0,0,0,.3);
	}
	.input-content{
		padding: 0 60upx;
	}
	.input-item{
		display:flex;
		flex-direction: column;
		align-items:flex-start;
		justify-content: center;
		padding: 0 30upx;
		background:$page-color-light;
		height: 120upx;
		border-radius: 4px;
		margin-bottom: 50upx;
		&:last-child{
			margin-bottom: 0;
		}
		.tit{
			height: 50upx;
			line-height: 56upx;
			font-size: $font-sm+2upx;
			color: $font-color-base;
		}
		input{
			height: 60upx;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			width: 100%;
		}	
	}

	.confirm-btn{
		width: 630upx;
		height: 76upx;
		line-height: 76upx;
		border-radius: 50px;
		margin-top: 70upx;
		background: $uni-color-primary;
		color: #fff;
		font-size: $font-lg;
		&:after{
			border-radius: 100px;
		}
	}
	.forget-section{
		font-size: $font-sm+2upx;
		color: $font-color-spec;
		text-align: center;
		margin-top: 40upx;
	}
	.register-section{
		position:absolute;
		left: 0;
		bottom: 50upx;
		width: 100%;
		font-size: $font-sm+2upx;
		color: $font-color-base;
		text-align: center;
		text{
			color: $font-color-spec;
			margin-left: 10upx;
		}
	}
</style>
