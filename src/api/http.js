import qs from "qs"
import { Modal } from "antd-mobile"
import md5 from "md5";

const storage = {
    set(key, value) {
        localStorage.setItem(key, JSON.stringify({
            time: +new Date(),
            value
        }));
    },
    get(key, cycle = 60000) {
        let data = localStorage.getItem(key);
        if (!data) return null;
        let { time, value } = JSON.parse(data);
        if ((+new Date() - time) > cycle) {
            //超过有效期，就不会获取值了
            storage.remove(key);
            return null;
        }
        //在有效期，才会获取值
        return value;
    },
    remove(key) {
        localStorage.removeItem(key);
    }
}

const isPlainObject = (obj) => {
    // obj没值「null或者undefined」或者检测都不是object直接return false
    if (!obj || Object.prototype.toString.call(obj) !== "[object Object]") return false;
    //获取obj.__proto__
    let proto = Object.getPrototypeOf(obj);
    if (!proto) return true  //对应的Object.create(null)，也是纯粹对象
    let Ctor = Object.prototype.hasOwnProperty.call(proto, "constructor") && proto.constructor;
    //用于区分是否是Object的构造函数，避免是自定义构造函数
    return typeof Ctor === "function" && Ctor === Object;
}

const http = function http(config) {
    // let baseUrl = "/api"
    // initial config{默认配置项} & 校验配置项
    if (!isPlainObject(config)) config = {};
    //优化配置项，给配置项赋值初始值，如果参数中传递的有一些配置项的内容，则以参数传递的为主
    config = Object.assign({
        url: "",
        method: "GET",
        credentials: "include",
        headers: null,
        body: null,
        params: null,
        responseType: "json",
        signal: null
    }, config);
    if (!config.url) throw new TypeError("url must be required");
    //这个只是本地要求传递的headers必须是对象格式的不能是类的实例那种，如果不是对象，就当成没传「赋值为空」
    if (!isPlainObject(config.headers)) config.headers = {};
    //params必须是个对象，要不也当作没传
    if (config.params !== null && !isPlainObject(config.params)) config.params = null;
    //处理细节点
    let { url, method, credentials, headers, body, params, responseType, signal } = config;
    // 问号传参问题，将params中的参数手动拼接到后面「fetch默认是不支持params传参的所以要这样封装一下」
    //判断一下url中是否有？，有的话得通过&拼接到后面，没有就需要传递一个？了，由于需要urlencoded格式，所以要qs转换一下格式
    if (params) {
        url += `${url.includes("?") ? "&" : "?"}${qs.stringify(params)}`
    }

    //处理请求主体信息:本次后台要求，如果body是个普通对象，要设置成urlencodeed格式
    if (isPlainObject(body)) {
        body = qs.stringify(body);
        headers["Content-Type"] = "application/x-www-form-urlencoded";
    }
    //类似axios的请求拦截器，每个请求，传递给服务器相同的参数「比如token」
    let tokenRequire = ["/user_info", "/user_update", "/store", "/store_remove", "/store_list"]
    let token = storage.get("tk");
    if (token) {
        let reg = /\/api(\/[^?#]+)/
        // console.log(reg.exec(url), "reg");
        //用正则匹配url地址，如果没匹配到就赋值个空数组,然后解构出小分组的内容
        let [, $1] = reg.exec(url) || [];
        //用数组的some方法，判断需要url地址是否存在在需要token的请求列表中，如果存在，就给他添加token
        let isToken = tokenRequire.some(item => {
            return $1 == item;
        })
        let time = +new Date()
        let sign = md5(`${token}@${time}@zhufeng`);
        //如果判断好该请求需要token，就给请求头设置个authorzation字段，传递token
        if (isToken) {
            headers["authorzation"] = token;
            headers["time"] = time;
            headers["sign"] = sign;
        }
    }




    //
    method = method.toUpperCase();
    config = {
        method,
        credentials,
        headers,
        caches: "no-cache",
        signal
    }
    if (/^(POST|PUT|PATCH)$/i.test(method) && body) config.body = body;

    return fetch(url, config)
        .then(response => {
            let { status, statusText } = response;
            if (/^(2|3)\d{2}$/.test(status)) {
                let result;
                //根据传递进来的预设方式，获取需要的格式的值
                switch (responseType.toLowerCase()) {
                    case "text":
                        result = response.text();
                        break;
                    case "arraybuffer":
                        result = response.arrayBuffer();
                        break;
                    case "blob":
                        result = response.blob();
                        break;
                    default:
                        //默认转成json
                        result = response.json();
                }
                return result;
            }
            return Promise.reject({
                //比如返回code-100,标识http状态码返回失败，在在catch中根据status进行不同状态码报错的提示
                code: -100,
                status,
                statusText
            })
        }).catch(reason => {
            if (reason && typeof reason == "object") {
                let { code, status } = reason;
                if (code === -100) {
                    //对http状态码返回失败做出提示
                    switch (+status) {
                        case 400:
                            Modal.alert({
                                content: '请求参数问题',
                                onConfirm: () => {
                                    console.log('Confirmed')
                                },
                            })
                            break;
                    }
                } else if (code == 20) {
                    Modal.alert({
                        content: '请求被中断了',
                        onConfirm: () => {
                            console.log('Confirmed')
                        },
                    })
                } else {
                    Modal.alert({
                        content: '网络繁忙，再试',
                        onConfirm: () => {
                            console.log('Confirmed')
                        },
                    })
                }
            }
            Modal.alert({
                content: '请求失败,try again',
                onConfirm: () => {
                    console.log('Confirmed')
                },
            })
            //处理完之后，还应该是失败的promise
            return Promise.reject(reason)
        });
};

//因为fetch和axios还是有些差距的，毕竟axios是经过二次封装的，所以我之前也对fetch进行了一些二次封装，就比如fetch的一些常用的配置项以及中断请求方法，以及由于get请求传递参数的时候默认是通过？进行拼接的哈，我是让他也可以实现通过params来传递还有就是实现快捷调用可以通过fetch.get,{params:{}}）这种格式来调用fetch


/* 
实现快捷方法，类似axios的那种axios.get("/api/xxx",{
 params:{}
)这种形式的,
因为fetch默认是需要fetch("url",{配置项的})这种格式的懂吧
*/


["GET", "HEAD", "DELETE", "OPTIONS"].forEach(item => {
    //迭代这几个属性，给http分别添加上这几个名字的函数
    http[item.toLowerCase()] = function (url, config) {
        // 函数执行过程中，先检查传入的配置项是否存在,不是让他等于{}
        // 然后url和method要赋值乘参数传递的 因为快捷方法执行的时候
        // http.get("/api/xxx",{params:{}})这种就默认已经知道url和method了，所以以这个为主，然后在最后还是执行http(config)，但是此时config中的url,method都是参数传递的了
        if (!isPlainObject(config)) config = {};
        config["url"] = url;
        config["method"] = item;
        return http(config);
    }
});
// http.get("/api/xxx",{params:{}})相当于
// http({
//     url:"/api/xxx",
//     method:"GET",
//     params:{}
// })，写上面那个方法，就是为了实现可以快捷调用封装的http这个方法，少传递几个参数其实就是

["POST", "PUT", "PATCH"].forEach(item => {
    http[item.toLowerCase()] = function (url, body, config) {
        if (!isPlainObject(config)) config = {};
        config["url"] = url;
        config["method"] = item;
        config["body"] = body;
        return http(config)
    }
})

export default http;