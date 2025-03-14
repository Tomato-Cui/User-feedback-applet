'use strict';
const nodemailer = require('nodemailer');
const config = require('./config.json');

exports.main = async (event, context) => {
	console.log('收到的参数:', event);
	
	const { email, method } = event;
	
	if (method === 'sendCode') {
		try {
			const db = uniCloud.database();
			
			// 检查是否在60秒内发送过验证码
			const recentCode = await db.collection('email-verify')
				.where({
					email,
					create_time: db.command.gt(Date.now() - 60000) // 60秒内
				})
				.orderBy('create_time', 'desc')
				.limit(1)
				.get();
				
			if (recentCode.data.length > 0) {
				return {
					status: false,
					msg: '请60秒后再试'
				}
			}
			
			// 生成6位验证码
			const code = Math.random().toString().slice(-6);
			console.log('生成的验证码:', code);
			
			// 创建邮件发送器
			const transporter = nodemailer.createTransport({
				host: config.emailConfig.host,
				port: config.emailConfig.port,
				secure: true,
				auth: {
					user: config.emailConfig.auth.user,
					pass: config.emailConfig.auth.pass
				}
			});
			
			console.log('准备发送邮件...');
			
			// 发送邮件
			await transporter.sendMail({
				from: config.emailConfig.from,
				to: email,
				subject: '注册验证码',
				html: `<p>您的验证码是：<strong style="color: #ff0000;">${code}</strong></p>
					   <p>验证码有效期为5分钟，请尽快使用。</p>`
			});
			
			console.log('邮件发送成功，准备保存验证码...');
			
			// 保存验证码到数据库
			const result = await db.collection('email-verify').add({
				email,
				code,
				create_time: Date.now(),
				expired_time: Date.now() + 5 * 60 * 1000  // 5分钟有效期
			});
			
			console.log('验证码保存结果:', result);
			
			return {
				status: true,  // 修改为 true 表示成功
				msg: '验证码发送成功'
			}
			
		} catch(e) {
			console.error('发送验证码错误:', e);
			return {
				status: false,
				msg: '验证码发送失败：' + (e.message || '未知错误')
			}
		}
	}
	
	return {
		status: false,
		msg: '未知的操作类型'
	}
};
