'use strict';
const nodemailer = require('nodemailer');
const config = require('./config.json');

exports.main = async (event, context) => {
	const { email } = event;
	
	// 参数校验
	if (!email) {
		return {
			code: -1,
			msg: '邮箱不能为空'
		}
	}
	
	// 验证邮箱格式
	const emailReg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
	if (!emailReg.test(email)) {
		return {
			code: -2,
			msg: '邮箱格式不正确'
		}
	}
	
	try {
		// 生成6位验证码
		const code = Math.random().toString().slice(-6);
		
		// 创建邮件发送器
		const transporter = nodemailer.createTransport({
			host: config.emailConfig.host,
			port: config.emailConfig.port,
			secure: true,
			auth: {
				user: config.emailConfig.user,
				pass: config.emailConfig.pass
			}
		});
		
		// 发送邮件
		await transporter.sendMail({
			from: config.emailConfig.from,
			to: email,
			subject: '验证码',
			html: `<p>您的验证码是：<strong style="color: #ff0000;">${code}</strong></p>
				   <p>验证码有效期为5分钟，请尽快使用。</p>`
		});
		
		// 将验证码保存到数据库，设置5分钟过期
		const db = uniCloud.database();
		await db.collection('email-verify').add({
			email,
			code,
			create_time: Date.now(),
			expired_time: Date.now() + 5 * 60 * 1000
		});
		
		return {
			code: 0,
			msg: '验证码发送成功'
		}
		
	} catch(e) {
		console.error(e);
		return {
			code: -3,
			msg: '验证码发送失败'
		}
	}
}; 