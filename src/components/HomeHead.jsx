import React, { useMemo , useEffect } from "react"
import timg from "../assets/timg.jpg"
import "./homeHead.less"
import { connect } from "react-redux"
import { useNavigate } from "react-router-dom"
import action from "../store/action"

const HomeHead = (props) => {
    let { today , info , queryUserInfoAsync} = props;
    //通过useMemo实现类似计算属性的效果，只有依赖的today更新，才会重新计算，视图其他数据更新不会重新计算
    const time = useMemo(() => {

        let [, month, day] = today.match(/^\d{4}(\d{2})(\d{2})$/);
        //通过拿到的month数作为索引，去下面数组匹配队友的汉字月份
        let area = [, "一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"]
        return {
            month: area[month],
            day
        }
    }, [today])

    //页面第一次渲染的时候获取一下登录的信息，用于展示头像，如果没有info，就手动派发获取一下，只要是登录状态就可以拿到的
    useEffect(() => {
        if(!info){
            info = queryUserInfoAsync();
        }
    },[])
    const navigate = useNavigate();
    // console.log(info,"homehead");


    return <header className="home-head-box">
        <div className="info">
            <div className="time">
                <span>{time.day}</span>
                <span>{time.month}</span>
            </div>
            <h2 className="title">日报</h2>
        </div>
        <div className="picture">
            {/* 
            //如果是按照普通的那种，相对路径引入图片的src地址的话，在页面是看不到图片的
            因为经过webpack打包之后的项目结构目录改变了「也就是资源位置变了」，但是jsx视图中还是按照原先的相对路径去查找的，所以找不到
            + 解决，直接写绝对路径，http://这种
            + 通过ES6d导入，用一个变量接收一下，然后src地址写这个
*/}
            <img src={info ? info.pic : timg} alt=""  onClick={() => {
                navigate("personal")
            }}/>
        </div>
    </header>
}

export default connect(state => state.base,action.base)(HomeHead);