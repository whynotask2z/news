import React from "react";
import { NavBar } from 'antd-mobile'
import { useNavigate , useLocation , useSearchParams } from "react-router-dom";

const NavBarAgain = (props) => {
    const navigate = useNavigate();
    const loaction = useLocation();
    //这个是为了获取to的参数
    const [usp] = useSearchParams();
    
    // let par
    let { title } = props;
    const back = () => {
        let to = usp.get("to");
        console.log(to,"to");
        if(loaction.pathname == "/login" && /^\/detail\/\d+$/.test(to)){
            //如果是登录页的这个组件，并且是从detail页跳过来的「如果不这样写，由于是用repalce跳转的，没记录，会直接跳到首屏，所以这里处理一下」
            navigate(to,{replace:true});
            return;
        }
        navigate(-1);
    }
    return  <div>
        <NavBar onBack={back}>{title}</NavBar>
    </div>
}
export default NavBarAgain;