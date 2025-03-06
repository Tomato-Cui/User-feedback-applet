<template>
	<view class="content">
		<view class="feedback-form">
			<view class="form-title">意见反馈</view>
			
			<view class="form-item">
				<text class="label">反馈类型</text>
				<picker @change="bindPickerChange" :value="typeIndex" :range="feedbackTypes">
					<view class="picker">{{feedbackTypes[typeIndex]}}</view>
				</picker>
			</view>
			
			<view class="form-item">
				<text class="label">反馈内容</text>
				<textarea 
					class="feedback-content"
					v-model="content"
					placeholder="请详细描述您的问题或建议"
					maxlength="500"
				/>
				<text class="word-count">{{content.length}}/500</text>
			</view>
			
			<view class="form-item">
				<text class="label">联系方式</text>
				<input 
					class="contact-input"
					v-model="contact"
					placeholder="请留下您的手机号或邮箱"
				/>
			</view>
			
			<button class="submit-btn" @tap="submitFeedback">提交反馈</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				feedbackTypes: ['功能建议', '故障反馈', '其他问题'],
				typeIndex: 0,
				content: '',
				contact: ''
			}
		},
		onLoad() {

		},
		methods: {
			bindPickerChange(e) {
				this.typeIndex = e.detail.value
			},
			async submitFeedback() {
				// 表单验证
				if(!this.content.trim()) {
					uni.showToast({
						title: '请输入反馈内容',
						icon: 'none'
					})
					return
				}
				
				try {
					uni.showLoading({
						title: '提交中...'
					})
					
					// 调用云函数
					const res = await uniCloud.callFunction({
						name: 'submitFeedback',
						data: {
							type: this.feedbackTypes[this.typeIndex],
							content: this.content,
							contact: this.contact
						}
					})
					
					uni.hideLoading()
					
					if(res.result.code === 0) {
						uni.showToast({
							title: '提交成功',
							icon: 'success'
						})
						// 清空表单
						this.content = ''
						this.contact = ''
						this.typeIndex = 0
					} else {
						throw new Error(res.result.msg)
					}
					
				} catch(e) {
					uni.hideLoading()
					uni.showToast({
						title: e.message || '提交失败，请稍后重试',
						icon: 'none'
					})
				}
			}
		}
	}
</script>

<style>
	.content {
		padding: 20rpx;
	}

	.feedback-form {
		background: #fff;
		border-radius: 12rpx;
		padding: 30rpx;
	}

	.form-title {
		font-size: 36rpx;
		font-weight: bold;
		text-align: center;
		margin-bottom: 40rpx;
	}

	.form-item {
		margin-bottom: 30rpx;
	}

	.label {
		display: block;
		font-size: 28rpx;
		color: #666;
		margin-bottom: 10rpx;
	}

	.picker {
		height: 80rpx;
		line-height: 80rpx;
		background: #f8f8f8;
		padding: 0 20rpx;
		border-radius: 8rpx;
		font-size: 28rpx;
	}

	.feedback-content {
		width: 100%;
		height: 300rpx;
		background: #f8f8f8;
		padding: 20rpx;
		border-radius: 8rpx;
		font-size: 28rpx;
		box-sizing: border-box;
	}

	.word-count {
		font-size: 24rpx;
		color: #999;
		text-align: right;
		margin-top: 10rpx;
	}

	.contact-input {
		height: 80rpx;
		background: #f8f8f8;
		padding: 0 20rpx;
		border-radius: 8rpx;
		font-size: 28rpx;
	}

	.submit-btn {
		margin-top: 40rpx;
		background: #007AFF;
		color: #fff;
		border: none;
	}

	.submit-btn:active {
		opacity: 0.8;
	}
</style>
