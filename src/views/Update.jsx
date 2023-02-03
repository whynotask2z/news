import React, { useState } from "react";
import NavBarAgain from "../components/NavBarAgain";
import { Form, Input, ImageUploader } from "antd-mobile";
import ButtonAgain from "../components/ButtonAgain"
import "./update.less"
import { connect } from "react-redux";
import action from "../store/action";
import { updateInfo } from "../api"


const Update = (props) => {
    let { info, queryUserInfoAsync } = props;
    let [pic, setPic] = useState(
        [
            { url: info.pic }]
    );
    let [username, setUsername] = useState(info.name);
    let [imgfile, setImgFile] = useState("");

    let [fileList, setFileList] = useState([
        // pic
        // [{/
            // url: pic,
        // }]
    ])
    console.log(username,"username");

    console.log(fileList,"fileList");

    let fm = new FormData();
    // fm.append("username",username)

    // console.log(fm.get("file"),"fmfmfmfmfmfmfmmfmfmfmf");

    const [form] = Form.useForm()
    const submit = async () => {
        const values = form.getFieldsValue()
        console.log(values, "values");

        // fm.append(values.username);
        // fm.append(values.pic[0].url)
        // let pic = values.pic[0].url.slice(5);
        // console.log(values.pic[0].url.slice(5), "values");
        // console.log(fileList,"fileList11111");
        fm.append("username",values.username)
        console.log(fm.get("username"),"submit_fm");
        console.log(fm.get("file"),"submit_fm_file");
        try {
            let { code } = await updateInfo(fm)
            console.log(code, "code");
        } catch (error) {

        }
    }

    const mockUpload = async (file) => {
        // await sleep(3000)
        console.log("1111111111");
        console.log(file,"file");
        fm.append("file",file);
        console.log(fm.get("file"),"file_after");
        // setImgFile({imgfile:file});
        // setFileList({fileList:file})
        // console.log(fileList,"fileListfileListfileListfileListfileList");
        // console.log(imgfile, "imgfile");
        return {
            url: URL.createObjectURL(file),
        }
    }

    const normFile = (e) => {
        console.log(e, "upload");
    }
    // console.log(mockUpload(),"mockUpload");



    return <div className="Update_box">
        <NavBarAgain title={"修改个人信息"}></NavBarAgain>
        <div className="form_box">
            <Form layout='horizontal' form={form} mode='card' initialValues={{
                username: username
            }} style={{ "--border-top": "none", "--border-inner": "none", "--border-bottom": "none" }} footer={
                <ButtonAgain block type='submit' color='primary' size='large' onClick={submit}>
                    提交
                </ButtonAgain>
            }>
                <Form.Item label='头像' name="pic" className="pic_box" getValueFromEvent={normFile}>
                    <ImageUploader
                        style={{ '--cell-size': '70px' }}
                        maxCount={1}
                        onDelete={() => { setPic([]) }}
                        value={fileList}
                        // onChange={setImgFile}
                        onChange={setFileList}
                        upload={mockUpload}
                    />
                </Form.Item>
                <Form.Item label='昵称' name="username" >
                    <Input placeholder='请输入' value={username} />
                </Form.Item>
            </Form>
        </div>
    </div>
}
export default connect(state => state.base
    , action.base)(Update)