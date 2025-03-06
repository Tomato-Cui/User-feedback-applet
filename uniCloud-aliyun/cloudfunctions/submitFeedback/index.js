'use strict';
const db = uniCloud.database()

exports.main = async (event, context) => {
	//event为客户端上传的参数
	const { type, content, contact } = event
	
	// 参数校验
	if (!type || !content) {
		return {
			code: -1,
			msg: '反馈类型和内容不能为空'
		}
	}
	
	try {
		// 插入数据到feedback表
		const res = await db.collection('feedback').add({
			type,
			content,
			contact,
			create_time: Date.now(),
			// 可以记录用户IP等信息
			ip: context.CLIENTIP,
			platform: context.PLATFORM
		})
		
		return {
			code: 0,
			msg: '反馈提交成功'
		}
		
	} catch(e) {
		return {
			code: -2,
			msg: '提交失败，请稍后重试'
		}
	}
}; 