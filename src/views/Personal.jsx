import React from "react";
import NavBarAgain from "../components/NavBarAgain"
import { Image, List, Toast } from "antd-mobile";
import timg from "../assets/timg.jpg"
import { useNavigate } from "react-router-dom";
import "./personal.less"
import { connect } from "react-redux";
import action from "../store/action";
import { Link } from "react-router-dom"


const Personal = (props) => {
    //test git
    let { info, clearUserInfo, clearStoreList } = props;
    console.log(info, "info");
    const navigate = useNavigate();
    const toUpdate = () => {
        navigate("/update")
    }
    const signOut = () => {
        //退出登录需要清空用户信息、收藏信息、和token信息
        clearUserInfo();
        clearStoreList();
        localStorage.removeItem("tk");
        Toast.show({
            icon:"success",
            content:"退出登录成功"
        })
        navigate("/login");
    }

    //从redux中读取信息，渲染页面
    return <div className="Personal_box">
        <NavBarAgain title={"个人中心"}></NavBarAgain>
        <div className="info_box">
            <div className="img_box" onClick={toUpdate}>
                <Image
                    src={info.pic}
                    width={64}
                    height={64}
                    fit='cover'
                    style={{ borderRadius: 32 }}
                />
            </div>

            <p className="info_name">{info.name}</p>

            <List className="list_box" header='列表'>
                <Link to={"/store"}>
                    <List.Item >
                        个人收藏
                    </List.Item>
                </Link>
                <List.Item onClick={signOut}>
                    退出登录
                </List.Item>
            </List>
        </div>
    </div>
}
export default connect(state => state.base,
    { ...action.base, ...action.collection })(Personal) 