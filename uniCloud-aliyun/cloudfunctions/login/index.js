'use strict';
const db = uniCloud.database();

exports.main = async (event, context) => {
    const { username, password } = event;
    
    // 参数校验
    if (!username || !password) {
        return {
            code: -1,
            msg: '用户名和密码不能为空'
        }
    }
    
    try {
        // 查询用户
        const userInfo = await db.collection('users')
            .where({
                username: username,
                password: password // 实际应用中应该对密码进行加密比对
            })
            .limit(1)
            .get();
            
        if (userInfo.data.length === 0) {
            return {
                code: -2,
                msg: '用户名或密码错误'
            }
        }
        
        // 返回用户信息（去除敏感信息）
        const user = userInfo.data[0];
        return {
            code: 0,
            msg: '登录成功',
            data: {
                _id: user._id,
                username: user.username,
                email: user.email,
                create_time: user.create_time
            }
        }
        
    } catch(e) {
        console.error(e);
        return {
            code: -3,
            msg: '登录失败，请稍后重试'
        }
    }
}; 