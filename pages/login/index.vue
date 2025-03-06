<template>
	<view class="content">
		<input v-model="email" class="input" />
		<button type="primary" @tap="testSend">测试发送验证码</button>
		<input v-model="code" class="input" />
		<button type="primary" @tap="testValidate">提交验证码</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				code: '',
				codeId: '',
				email: '',
				effectiveTime: 300,
				statusJson: {
					'-5':'验证失败',
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
		methods: {
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
			}
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.input {
		width: 650rpx;
		border: 1px solid #999999;
		height: 80rpx;
		line-height: 80rpx;
		border-radius: 6rpx;
		margin: 30rpx;
	}
</style>
