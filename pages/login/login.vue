<template>
	<view class="login-container">
		<view class="header">
			<image class="logo" src="/static/logo.png" mode="aspectFit"></image>
			<text class="title">欢迎使用</text>
		</view>

		<view class="form-container">
			<!-- 切换按钮 -->
			<view class="switch-form">
				<text :class="['switch-btn', isLogin ? 'active' : '']" @tap="isLogin = true">登录</text>
				<text :class="['switch-btn', !isLogin ? 'active' : '']" @tap="isLogin = false">注册</text>
			</view>

			<!-- 登录表单 -->
			<view v-if="isLogin" class="form">
				<view class="input-group">
					<input class="input" type="text" v-model="loginForm.username" placeholder="请输入用户名" />
				</view>
				<view class="input-group">
					<input class="input" type="password" v-model="loginForm.password" placeholder="请输入密码" />
				</view>
				<button class="submit-btn" @tap="handleLogin">登录</button>
			</view>

			<!-- 注册表单 -->
			<view v-else class="form">
				<view class="input-group">
					<input class="input" type="text" v-model="registerForm.username" placeholder="请输入用户名" />
				</view>
				<view class="input-group">
					<input class="input" type="text" v-model="registerForm.email" placeholder="请输入邮箱" />
				</view>
				<view class="input-group code-group">
					<input class="input code-input" type="text" v-model="registerForm.code" placeholder="请输入验证码" />
					<button class="code-btn" :disabled="isCountDown" @tap="testSend">{{countDownText}}</button>
				</view>
				<view class="input-group">
					<input class="input" type="password" v-model="registerForm.password" placeholder="请输入密码" />
				</view>
				<button class="submit-btn" @tap="handleRegister">注册</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isLogin: true,
				loginForm: {
					username: '',
					password: ''
				},
				registerForm: {
					username: '',
					email: '',
					code: '',
					password: ''
				},
				countDown: 60,
				isCountDown: false,
				code: '',
				codeId: '',
				email: '',
				effectiveTime: 300,
				statusJson: {
					'-5': '验证失败',
					'-4': '验证码已使用',
					'-3': '验证码已失效',
					'-2': '当前邮箱未发送验证码',
					'-1': '还未发送验证码',
					'0': '验证码不正确',
					'1': '验证成功'
				}
			}
		},
		onLoad() {
		
		},
		computed: {
			countDownText() {
				return this.isCountDown ? `${this.countDown}秒后重试` : '获取验证码'
			}
		},
		methods: {
			// 处理登录
			testSend() {
				if(!this.email){
					uni.showToast({
						duration: 1500,
						title: '请输入邮箱',
						mask: true,
						icon: 'none'
					})
					return;
				}
				uni.showLoading({
					mask: true
				})
				uniCloud.callFunction({
					name: "emailCode",
					data: {
						serviceType: 'qq',
						method: 'sendCode',
						html: '您注册的验证码是#code#',
						email: this.email,
						subject: '注册验证码'
					}
				}).then((res) => {
					uni.hideLoading();
					if (res.result.status) {
						this.codeId = res.result.id;
						uni.showToast({
							duration: 1500,
							icon: 'none',
							title: '发送成功',
							mask: true
						})
					} else {
						uni.showToast({
							duration: 1500,
							title: '发送失败',
							mask: true,
							icon: 'none'
						})
					}
				});
			},
			testValidate() {
				if(!this.code){
					uni.showToast({
						duration: 1500,
						title: '请输入验证码',
						mask: true,
						icon: 'none'
					})
					return;
				}
				if(!this.email){
					uni.showToast({
						duration: 1500,
						title: '请输入邮箱',
						mask: true,
						icon: 'none'
					})
					return;
				}
				uni.showLoading({
					mask: true
				})
				uniCloud.callFunction({
					name: "emailCode",
					data: {
						code: this.code,
						method: 'validateCode',
						email: this.email,
						codeId: this.codeId,
						effectiveTime: 300
					}
				}).then((res) => {
					uni.hideLoading();
					uni.showToast({
						duration: 1500,
						title: this.statusJson[res.result.status],
						mask: true,
						icon: 'none'
					})
				});
			},
			async handleLogin() {
				if (!this.loginForm.username || !this.loginForm.password) {
					uni.showToast({
						title: '请填写完整信息',
						icon: 'none'
					})
					return
				}

				try {
					uni.showLoading({
						title: '登录中...'
					})

					const res = await uniCloud.callFunction({
						name: 'login',
						data: this.loginForm
					})

					uni.hideLoading()

					if (res.result.code === 0) {
						uni.setStorageSync('userInfo', res.result.data)
						uni.showToast({
							title: '登录成功'
						})
						setTimeout(() => {
							uni.switchTab({
								url: '/pages/index/index'
							})
						}, 1500)
					} else {
						throw new Error(res.result.msg)
					}
				} catch (e) {
					uni.hideLoading()
					uni.showToast({
						title: e.message || '登录失败',
						icon: 'none'
					})
				}
			},

			//uc31539@gmail.com

			// 发送验证码
			async sendCode() {
				if (!this.registerForm.email) {
					uni.showToast({
						title: '请输入邮箱',
						icon: 'none'
					})
					return
				}

				// 验证邮箱格式
				const emailReg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
				if (!emailReg.test(this.registerForm.email)) {
					uni.showToast({
						title: '邮箱格式不正确',
						icon: 'none'
					})
					return
				}

				try {
					uni.showLoading({
						title: '发送中...'
					})

					const res = await uniCloud.callFunction({
						name: 'sendEmailCode',
						data: {
							email: this.registerForm.email
						}
					})

					uni.hideLoading()

					if (res.result.code === 0) {
						uni.showToast({
							title: '验证码已发送'
						})
						this.startCountDown()
					} else {
						throw new Error(res.result.msg)
					}
				} catch (e) {
					uni.hideLoading()
					uni.showToast({
						title: e.message || '发送失败',
						icon: 'none'
					})
				}
			},
			// async sendCode() {
			// 	const res = await uniCloud.callFunction({
			// 		name: 'uni-id-co',
			// 		data: {
			// 			action: 'sendEmailCode',
			// 			params: {
			// 				email: this.email
			// 			}
			// 		}
			// 	});


			// 	if (res.result.code === 0) {
			// 		uni.showToast({
			// 			title: '验证码已发送',
			// 			icon: 'success'
			// 		});
			// 	} else {
			// 		uni.showToast({
			// 			title: res.result.message,
			// 			icon: 'none'
			// 		});
			// 	}
			// },

			async register() {
				const res = await uniCloud.callFunction({
					name: 'uni-id-co',
					data: {
						action: 'registerByEmail',
						params: {
							email: this.email,
							code: this.code,
							password: this.password
						}
					}
				});
				if (res.result.code === 0) {
					uni.showToast({
						title: '注册成功',
						icon: 'success'
					});
					uni.navigateTo({
						url: '/pages/login/login'
					});
				} else {
					uni.showToast({
						title: res.result.message,
						icon: 'none'
					});
				}
			},

			// 开始倒计时
			startCountDown() {
				this.isCountDown = true
				const timer = setInterval(() => {
					this.countDown--
					if (this.countDown <= 0) {
						clearInterval(timer)
						this.isCountDown = false
						this.countDown = 60
					}
				}, 1000)
			},

			// 处理注册
			async handleRegister() {
				if (!this.registerForm.username || !this.registerForm.email ||
					!this.registerForm.code || !this.registerForm.password) {
					uni.showToast({
						title: '请填写完整信息',
						icon: 'none'
					})
					return
				}

				try {
					uni.showLoading({
						title: '注册中...'
					})

					const res = await uniCloud.callFunction({
						name: 'register',
						data: this.registerForm
					})

					uni.hideLoading()

					if (res.result.code === 0) {
						uni.showToast({
							title: '注册成功'
						})
						this.isLogin = true
						this.registerForm = {
							username: '',
							email: '',
							code: '',
							password: ''
						}
					} else {
						throw new Error(res.result.msg)
					}
				} catch (e) {
					uni.hideLoading()
					uni.showToast({
						title: e.message || '注册失败',
						icon: 'none'
					})
				}
			}
		}
	}
</script>

<style>
	.login-container {

		padding: 40rpx;
		min-height: 100vh;
		background-color: #f8f8f8;
	}

	.header {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 60rpx 0;
	}

	.logo {
		width: 160rpx;
		height: 160rpx;
		margin-bottom: 20rpx;
	}

	.title {
		font-size: 36rpx;
		font-weight: bold;
		color: #333;
	}

	.form-container {
		background-color: #fff;
		border-radius: 20rpx;
		padding: 40rpx;
		box-shadow: 0 0 20rpx rgba(0, 0, 0, 0.05);
	}

	.switch-form {
		display: flex;
		justify-content: center;
		margin-bottom: 40rpx;
	}

	.switch-btn {
		padding: 20rpx 40rpx;
		font-size: 32rpx;
		color: #666;
		position: relative;
	}

	.switch-btn.active {
		color: #007AFF;
		font-weight: bold;
	}

	.switch-btn.active::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 60rpx;
		height: 4rpx;
		background-color: #007AFF;
		border-radius: 2rpx;
	}

	.input-group {
		margin-bottom: 30rpx;


	}

	.code-group {
		display: flex;
		align-items: center;
	}

	.code-input {
		flex: 1;
		margin-right: 20rpx;
	}

	.code-btn {
		width: 200rpx;
		height: 90rpx;
		line-height: 90rpx;
		font-size: 26rpx;
		background-color: #007AFF;
		color: #fff;
		border-radius: 45rpx;
	}

	.code-btn[disabled] {
		background-color: #ccc;
	}

	.input {
		width: 100%;
		height: 90rpx;
		background-color: #f8f8f8;
		border-radius: 45rpx;
		padding: 0 40rpx;
		font-size: 28rpx;
		box-sizing: border-box;
		/* 让 padding 和 border 计算在 width 之内 */
	}

	.submit-btn {
		width: 100%;
		height: 90rpx;
		line-height: 90rpx;
		background-color: #007AFF;
		color: #fff;
		border-radius: 45rpx;
		font-size: 32rpx;
		margin-top: 40rpx;
	}

	.submit-btn:active {
		opacity: 0.8;
	}
</style>