'use strict';
const db = uniCloud.database();

exports.main = async (event, context) => {
    const { username, email, code, password } = event;
    
    // 打印接收到的参数
    console.log('接收到的注册参数:', {
        username,
        email,
        code,
        password: '***'
    });
    
    // 参数校验
    if (!username || !email || !code || !password) {
        return {
            code: -1,
            msg: '请填写完整信息'
        }
    }
    
    try {
        // 查询最新的验证码记录
        const emailVerify = await db.collection('email-verify')
            .where({
                email: email
            })
            .orderBy('create_time', 'desc')
            .limit(1)
            .get();
        
        console.log('查询到的验证码记录:', emailVerify);
        
        if (emailVerify.data.length === 0) {
            return {
                code: -2,
                msg: '请先获取验证码'
            }
        }
        
        const verifyData = emailVerify.data[0];
        console.log('验证码数据对比:', {
            saved: verifyData.code,
            received: code,
            expired_time: new Date(verifyData.expired_time),
            now: new Date()
        });
        
        // 检查验证码是否匹配
        if (verifyData.code !== code) {
            return {
                code: -2,
                msg: '验证码错误'
            }
        }
        
        // 检查是否过期
        if (verifyData.expired_time < Date.now()) {
            return {
                code: -2,
                msg: '验证码已过期，请重新获取'
            }
        }
        
        // 检查用户名是否已存在
        const userExist = await db.collection('users')
            .where({
                username: username
            })
            .get();
            
        if (userExist.data.length > 0) {
            return {
                code: -3,
                msg: '用户名已存在'
            }
        }
        
        // 检查邮箱是否已注册
        const emailExist = await db.collection('users')
            .where({
                email: email
            })
            .get();
            
        if (emailExist.data.length > 0) {
            return {
                code: -4,
                msg: '该邮箱已注册'
            }
        }
        
        // 创建用户
        const result = await db.collection('users').add({
            username,
            email,
            password,
            create_time: Date.now(),
            update_time: Date.now(),
            status: 1
        });
        
        // 使验证码失效
        await db.collection('email-verify').doc(verifyData._id).update({
            expired_time: Date.now()
        });
        
        return {
            code: 0,
            msg: '注册成功'
        }
        
    } catch(e) {
        console.error('注册错误:', e);
        return {
            code: -5,
            msg: '注册失败，请稍后重试'
        }
    }
}; 