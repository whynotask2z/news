//封装好的fetch
import http from "./http"

//获取新闻列表
export const queryNewLatest = () => {
    return http.get("/api/news_latest")
}

//获取以往新闻
export const queryNewsBefore = (time) => {
    return http.get("/api/news_before", {
        params: {
            time
        }
    })
}

//详情
export const queryNewInfo = (id) => {
    return http.get("/api//news_info", {
        params: {
            id
        }
    })
}

//获取新闻点赞信息
export const queryStory_extra = (id) => {
    return http.get("/api/story_extra", {
        params: {
            id
        }
    })
}

//登录&注册
export const login = (phone, code) => {
    return http.post("/api/login", {
        phone,
        code
    })
}

//发送验证码
export const phoneCode = (phone) => {
    return http.post("/api/phone_code", {
        phone
    })
}

//获取登录者信息
export const queryUserinfo = () => {
    return http.get("/api/user_info")
}

//获取收藏列表
export const queryStoreList = () => {
    return http.get("/api/store_list")
}

//移除收藏
export const removeStore = (id) => {
    return http.get("/api/store_remove",{
            params: {
                id
            }
        })
}

//收藏新闻
export const newsStore = (newsId) => {
    return http.post("/api/store",{
        newsId
    })
}

//上传图片
export const updateInfo = (username,file) => {
    let fm = new FormData();
    // fm.append("username",username)
    // fm.append("file",file);
    // console.log();
    return http.post("/api/user_update",{
        username,
        file
    })
}