import React, { useState, useEffect, useMemo } from "react";
import { NavBar, TabBar, Badge, Image, Toast } from "antd-mobile"
import "./detail.less"
import { MessageOutline, LikeOutline, StarOutline } from 'antd-mobile-icons'
import { useNavigate, useParams } from "react-router-dom";
import { queryNewInfo, queryStory_extra, queryStoreList, removeStore, newsStore } from "../api/index"
import SkeletonAgain from "../components/SkeletonAgain"
import { flushSync } from "react-dom"
import { connect } from "react-redux";
import action from "../store/action";
import { useLocation } from "react-router-dom";

const Detail = (props) => {
    //函数组件 ，导入hook函数useNavigate实现返回-1的route导航
    const navigate = useNavigate();
    //获取路由参数
    const routeParams = useParams();

    const [info, setInfo] = useState(null);
    const [extra, setExtra] = useState("");

    const back = () => {
        navigate(-1);
    }

    //处理css && 图片
    let link;
    const handleCss = (result) => {
        // console.log(result);
        /* 
                注意，这里面直接是拿不到info的值的，由于setInfo是异步执行的所以不行，可以通过参数传过来，flashasync也不行，是因为虽然会立即刷新页面，但是在第一次修改的闭包中，读取的上下文还是第一次的info值，是null

                当然也可以在写一个useffect然后依赖info，也行
        */
        if (!Array.isArray(result.css)) return;
        link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = result.css[0];
        document.head.appendChild(link);
    }
    const handleImage = (result) => {
        //总体思路先获取页面上已经加载好的存放图片的html结构，然后就是创建一个图片标签，如果图片获取到了就给html结构上添加创建的标签，如果失败了，就把整个结构都删除，直接显示文字就完事了「唯一需要注意的时候获取存放图片的html结构，需要页面已经渲染完毕，所以获取信息的hook修改需要放在flushSync中，否则获取不到的」
        let imgBox = document.querySelector(".img-place-holder")
        if (!imgBox) return;
        let tempImage = document.createElement("img")
        tempImage.src = result.image;
        tempImage.onload = () => {
            imgBox.appendChild(tempImage)
        }
        tempImage.onerror = () => {
            let parent = imgBox.parentNode;
            parent.parentNode.removeChild(parent)
        }
    }

    //写两个useffect，就可以保证请求是并行发送的了，否则写一个里面是串行的，没必要
    useEffect(() => {
        (async () => {
            let res = await queryNewInfo(routeParams.id);
            //  这两个写flushSync的原因是，处理图片的时候，需要页面已经加载完了才可以获取存图片的那个div结构，不这样的话，setInfo是异步的，会直接执行下面的处理图片的逻辑，拿不到图片都
            flushSync(() => {
                setInfo(res)
                handleCss(res);
            })

            handleImage(res)
        })()

        return () => {
            //在组件销毁的时候，要记得清楚添加的link标签，否则会影响其他页面的样式，并且只要点一次详情就会创建一个link标签的
            if (link) document.head.removeChild(link)
        }
    }, [])

    useEffect(() => {
        (async () => {
            let res = await queryStory_extra(routeParams.id);
            setExtra(res)
        })()
    }, [])



    // 处理登录详情页逻辑，和首页一样，也是判断是否有info信息，如果没有派发一下，只要登录过就可以获取到的，没登录就跳转登录界面，目前来看这个参数好像没b用带不带都行
    let { base: { info: userInfo }, queryUserInfoAsync, collection: { list: storeList }, querystoreListAsync, removeStoreList } = props;
    console.log(props, "props");

    useEffect(() => {
        //用await管理是由于收藏列表需要通过有无info来进行判断处理
        console.log(storeList, "storeList");
        (async () => {
            if (!userInfo) {

                // let { info } = await queryStoreList();
                let { info } = await queryUserInfoAsync();
                //如果登录了，userinfo肯定是读到登录者的，如果没登录也是null，不怕啦就
                userInfo = info;
            }
            //如果已经登录并且redux中没有storelist，需要获取一下「又可能刷新过」
            if (userInfo && !storeList) {
                querystoreListAsync();
            }

        })()
    }, [])
    
    //依赖于路由地址参数以及storelist计算出当前新闻是否被收藏
    const isStore = useMemo(() => {
        if (!storeList) return false;

        return storeList.some(item => {
            // console.log(item, "item");
            // console.log(item.news.id, "item.news.id");
            return item.news.id == routeParams.id
        })
    }, [routeParams, storeList])

    // console.log(isStore, "isStore");

    const loaction = useLocation();

    const handleStore = async () => {
        // console.log(userInfo,"userInfo");
        if (!userInfo) {
            navigate(`/login/?to=${loaction.pathname}`, { reaplace: true })
            // navigate(`/login`)
            return
        }
        //如果已经登录，就收藏获取移除收藏
        if (isStore) {
            //移除收藏
            //需要获取一下当前新闻在收藏列表中的id通过find拿当前新闻的id去收藏列表中查找那一项，然后获取到对应的在收藏列表中的id
            try {
                let item = storeList.find(item => {
                    return item.news.id == routeParams.id
                })
                let { code } = await removeStore(item.id);
                if (code == 0) {
                    Toast.show({
                        icon: "success",
                        content: "移除成功"
                    })
                    //也要通知redux中，移除这一项收藏
                    removeStoreList(item.id)
                    return;
                }
                Toast.show({
                    icon: "fail",
                    content: "移除失败"
                })

            } catch (error) {

            }
        }
        // 收藏
        try {
            let { code } = await newsStore(routeParams.id);
            if (code == 0) {
                Toast.show({
                    icon: "success",
                    content: "收藏成功"
                })
                // console.log(storeList, "storeList-store-store");
                //最后要记得派发一下redux里的行为，让移除后的结果重新存储在redux中
                querystoreListAsync()
                return;
            }
            Toast.show({
                icon: "fail",
                content: "收藏失败"
            })

        } catch (error) {

        }
    }



    return <div className="Detail_box">
        {/* {    //获取到的时候是html结构，需要这样渲染} */}
        {!info ? <SkeletonAgain></SkeletonAgain> : <div className="content" dangerouslySetInnerHTML={
            {
                __html: info.body
            }
        }>
        </div>}

        <div className="tab-bar">
            <NavBar onBack={back}>
                <Badge content={extra ? extra.comments : null}>
                    <MessageOutline />
                </Badge>
                <Badge content={extra ? extra.popularity : null}>
                    <LikeOutline />
                </Badge>
                <span onClick={handleStore} className={isStore ? "store" : ""}><StarOutline></StarOutline></span>
            </NavBar>
        </div>
    </div>
}
//这样是导入多个state以及action的写法
export default connect(state => {
    return {
        base: state.base,
        collection: state.collection
    }
}, { ...action.base, ...action.collection })(Detail)