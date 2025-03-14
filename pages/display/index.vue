<template>
	<view class="container">
		<!-- 顶部banner -->
		<view class="banner">
			<image src="/static/banner.jpg" mode="aspectFill"></image>
			<view class="banner-text">
				<text class="company-name">科技创新服务</text>
				<text class="slogan">智能物联 · 技术引领 · 创新服务</text>
			</view>
		</view>

		<!-- 业务分类网格 -->
		<view class="grid-container">
			<view class="grid-title">我们的服务</view>
			<view class="grid-list">
				<view class="grid-item" v-for="(item, index) in serviceList" :key="index" @tap="navigateToDetail(item)">
					<view class="item-icon">
						<image :src="item.icon" mode="aspectFit"></image>
					</view>
					<view class="item-content">
						<text class="item-title">{{item.title}}</text>
						<text class="item-desc">{{item.description}}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 公司简介 -->
		<view class="about-section">
			<view class="section-title">关于我们</view>
			<view class="about-content">
				<text class="about-text">我们是一家专注于物联网技术研发和信息系统集成服务的高新技术企业，致力于为客户提供全方位的技术解决方案。</text>
			</view>
		</view>

		<!-- 底部导航栏 -->
		<view class="tab-bar">
			<view class="tab-item" v-for="(item, index) in tabList" :key="index" @tap="switchTab(item)">
				<image :src="item.icon" mode="aspectFit"></image>
				<text>{{item.name}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				serviceList: [{
						icon: '/static/icons/iot.png',
						title: '物联网技术研发',
						description: '提供物联网整体解决方案，包括传感器研发、数据采集和分析等服务'
					},
					{
						icon: '/static/icons/service.png',
						title: '物联网技术服务',
						description: '为企业提供物联网技术咨询、实施和运维服务'
					},
					{
						icon: '/static/icons/integration.png',
						title: '信息系统集成',
						description: '提供信息系统规划、设计、实施和运维的一站式服务'
					},
					{
						icon: '/static/icons/software.png',
						title: '软件开发服务',
						description: '专业的软件定制开发，满足企业个性化需求'
					},
					{
						icon: '/static/icons/hardware.png',
						title: '计算机硬件销售',
						description: '提供优质的计算机硬件及辅助设备批发服务'
					},
					{
						icon: '/static/icons/tech.png',
						title: '技术咨询服务',
						description: '提供技术咨询、交流、转让和推广服务'
					},
					{
						icon: '/static/icons/engineering.png',
						title: '工程技术服务',
						description: '提供专业的工程技术服务和解决方案'
					},
					{
						icon: '/static/icons/material.png',
						title: '新材料技术研发',
						description: '致力于新材料技术的研发和应用'
					}
				],
				tabList: [{
						icon: '/static/icons/home.png',
						name: '首页',
						url: '/pages/index/index'
					},
					{
						icon: '/static/icons/display.png',
						name: '产品',
						url: '/pages/display/index'
					},
					{
						icon: '/static/icons/feedback.png',
						name: '反馈',
						url: '/pages/feedback/index'
					},
					{
						icon: '/static/icons/user.png',
						name: '我的',
						url: '/pages/user/index'
					}
				]
			}
		},
		methods: {
			navigateToDetail(item) {
				uni.navigateTo({
					url: `/pages/service-detail/service-detail?title=${item.title}`
				})
			},
			switchTab(item) {
				uni.navigateTo({
					url: item.url
				})
			}
		}
	}
</script>

<style>
	.container {
		padding-bottom: calc(100rpx + env(safe-area-inset-bottom));
	}

	.banner {
		position: relative;
		width: 100%;
		height: 400rpx;
	}

	.banner image {
		width: 100%;
		height: 100%;
	}

	.banner-text {
		position: absolute;
		left: 40rpx;
		bottom: 40rpx;
		color: #fff;
	}

	.company-name {
		font-size: 48rpx;
		font-weight: bold;
		display: block;
		margin-bottom: 10rpx;
		text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.3);
	}

	.slogan {
		font-size: 28rpx;
		opacity: 0.9;
		text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.3);
	}

	.grid-container {
		padding: 30rpx;
		background-color: #fff;
	}

	.grid-title, .section-title {
		font-size: 36rpx;
		font-weight: bold;
		margin-bottom: 30rpx;
		color: #333;
	}

	.grid-list {
		display: flex;
		flex-wrap: wrap;
		margin: 0 -10rpx;
	}

	.grid-item {
		width: calc(50% - 20rpx);
		margin: 10rpx;
		background-color: #fff;
		border-radius: 12rpx;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
		overflow: hidden;
		transition: all 0.3s;
	}

	.grid-item:active {
		transform: scale(0.98);
	}

	.item-icon {
		height: 160rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #f8f8f8;
	}

	.item-icon image {
		width: 80rpx;
		height: 80rpx;
	}

	.item-content {
		padding: 20rpx;
	}

	.item-title {
		font-size: 28rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 10rpx;
		display: block;
	}

	.item-desc {
		font-size: 24rpx;
		color: #666;
		line-height: 1.4;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}

	.about-section {
		margin-top: 30rpx;
		padding: 30rpx;
		background-color: #fff;
	}

	.about-content {
		background-color: #f8f8f8;
		padding: 30rpx;
		border-radius: 12rpx;
	}

	.about-text {
		font-size: 28rpx;
		color: #666;
		line-height: 1.6;
	}

	/* 底部导航栏样式 */
	.tab-bar {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: 100rpx;
		background-color: #ffffff;
		display: flex;
		justify-content: space-around;
		align-items: center;
		box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
		padding-bottom: env(safe-area-inset-bottom); /* 适配iPhone全面屏 */
	}

	.tab-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 10rpx 0;
	}

	.tab-item image {
		width: 44rpx;
		height: 44rpx;
		margin-bottom: 4rpx;
	}

	.tab-item text {
		font-size: 24rpx;
		color: #333;
	}
</style>
