import React, { useState, useEffect } from "react";
import NavBarAgain from "../components/NavBarAgain"
import { Form, Input, Button, Toast } from 'antd-mobile'
import { phoneCode, login } from "../api/index"
import ButtonAgain from "../components/ButtonAgain";
import { connect } from "react-redux";
import  action  from "../store/action"
import { queryUserinfo } from "../api/index";
import { useNavigate , useSearchParams} from "react-router-dom";

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


const Login = (props) => {

    //为了路由跳转和获取路由中to的参数进行处理
    const navigate = useNavigate();
    const [usp] = useSearchParams()

    //从props中解构出来两个派发的方法，用于登录请求成功后，将info存在redux中
    let { clearUserInfo , queryUserInfoAsync} = props;
    const [form] = Form.useForm()
    //button禁用态
    const [disable, setDisable] = useState(false)
    // button显示文字
    const [sendText, setSendText] = useState("发送验证码")

    // const delay = (interval = 1000) => {
    //     return new Promise(resolve => {
    //         setTimeout(() => {
    //             resolve();
    //         }, interval);
    //     })
    // }

    //记得要清除定时器,注意依赖项要写[]，否则每次都直接销毁定时器了，就没有效果了「组件销毁的时候，这个是针对，在30s内直接验证成功登录，跳到其他页面的情况」
    useEffect(() => {
        return () => {
            if (timer) {
                clearInterval(timer);
                timer = null;
            }
        }
    }, []);

    //发送过程中的计时操作
    let timer = null;
    let num = 30;
    const countTime = () => {
        num--;
        if (num == 0) {
            clearInterval(timer);
            timer = null;
            setDisable(false);
            setSendText("发送验证码")
            return
        }
        setSendText(`${num}秒后重发`)
    }


    const sendCode = async () => {
        try {
            //发送验证码，需要先校验
            await form.validateFields(["phone"]);
            let phone = form.getFieldValue("phone")
            let { code } = await phoneCode(phone);
            if (code != 0) {
                //发送失败
                Toast.show({
                    icon: "fail",
                    content: "发送失败"
                })
                return;
            }
            //发送成功
            setDisable(true)
            countTime()
            if (!timer) {
                timer = setInterval(() => {
                    countTime()
                }, 1000);
            }

        } catch (error) {

        }
    }

    const onSubmit = async () => {
        try {
            let { phone, code } = form.getFieldsValue();
            console.log(phone, code);
            let { token, code: codeHttp } = await login(phone, code);
            if (codeHttp != 0) {
                Toast.show({
                    icon: "fail",
                    content: "验证码错误"
                })
                return;
            }
            //验证成功「存储token，存储登录信息到redux、提示、跳转」
            console.log(token, "succeed");
            storage.set("tk", token);
            await queryUserInfoAsync();
            Toast.show({
                icon:"success",
                content:"登录成功"
            })
            //登录成功后跳转有点细节，需要replace替换着用可以不让登录页在历史记录中，并且如果有to地址的话，直接去to的地址，连带的细节返回组件的封装
            let to = usp.get("to");
            to ? navigate(to,{replace:true}) : navigate(-1)
             navigate(-1)
        } catch (error) {
            console.log(222,"222");
        }
    }

    return <div className="Login_box">
        <NavBarAgain title={"登录/注册"}></NavBarAgain>

        <>
            <Form layout='horizontal'
                form={form}
                initialValues={{
                    phone: "",
                    code: ""
                }}
                mode='card' style={{ padding: "20px 5px", "--border-inner": "none" }} requiredMarkStyle="none"
                footer={
                    <ButtonAgain block type='submit' color='primary' size='large' onClick={onSubmit}>
                        提交
                    </ButtonAgain>
                }
            // onFinish={onSubmit}

            >
                <Form.Item name="phone" label='手机号' style={{ marginBottom: "10px" }}
                    rules={[{ required: true, message: "手机号不能为空" },
                    { pattern: /^1(3\d|4[5-9]|5[0-35-9]|6[2567]|7[0-8]|8\d|9[0-35-9])\d{8}$/, message: "手机号格式不对" }]} >
                    <Input placeholder='请输入' />
                </Form.Item>
                <Form.Item label='验证码' name="code"
                    rules={[{ required: true, message: "验证码号不能为空" },
                    { pattern: /^\d{6}$/, message: "格式不对" }]}
                    extra={
                        <ButtonAgain color='primary' fill='outline' onClick={sendCode} disabled={disable}>
                            {sendText}
                        </ButtonAgain>}>
                    <Input placeholder='请输入' />
                </Form.Item>
            </Form></>
    </div>
}
export default connect(null,action.base)(Login)