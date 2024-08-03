import React, { useState, useEffect, useRef } from "react";
import HomeHead from "../components/HomeHead";
import { Swiper, Toast, Image, Divider, SpinLoading } from 'antd-mobile'
import { queryNewLatest, queryNewsBefore } from "../api/index"
import "./Home.less"
import { Link } from "react-router-dom";
import SkeletonAgain from "../components/SkeletonAgain"
import Newsitem from "../components/NewsItem"

const Home = () => {
    //test merge dev-2
    const forMatTime = (time, templete) => {
        if (typeof time != "string") {
            time = new Date().toLocaleString("zh-CN", { hour12: false })
        }
        if (typeof templete != "string") {
            templete = "{0}年{1}月{2}日 {3}:{4}:{5}"
        }
        let arr = [];
        if (/^\d{8}$/.test(time)) {
            let [, $1, $2, $3] = /^(\d{4})(\d{2})(\d{2})$/.exec(time);
            arr.push($1, $2, $3);
        } else {
            arr = time.match(/\d+/g);
        }
        return templete.replace(/\{(\d+)\}/g, (_, $1) => {
            let item = arr[$1] || "00";
            if (item.length < 2) item = "0" + item;
            return item;
        })
    }

    //通过useState定义头部时间状态，有初始值和请求回来的情况
    const [today, setToday] = useState(forMatTime(null, "{0}{1}{2}"));

    const [imgList, setImgList] = useState([]);

    const [newsList, setNewsList] = useState([]);

    //获取loading的dom元素通过useref
    const loadMore = useRef();
    useEffect(() => {
        //通过intersectionObserver监听页面底部的loading是否出现在底部，出现，说明需要重新请求数据了,并且，所有手动设置的监听器，都要记得在组件销毁的时候清除，恰好，useffect如果return一个函数的话，return的函数就是在组件销毁的时候执行，所以可以通过它来手动销毁
        // console.log(loadMore.current);
        let ob = new IntersectionObserver(async changes => {
            // console.log(changes[0]);
            let { isIntersecting } = changes[0];
            if (isIntersecting) {
                try {
                    //获取新闻列表最后一项的日期作为请求往日信息的参数
                    let time = newsList[newsList.length - 1]["date"]
                    // console.log(isIntersecting, "isIntersecting");
                    let res = await queryNewsBefore(time);
                    newsList.push(res);
                    setNewsList([...newsList])
                } catch (error) {

                }

            }

        })
        ob.observe(loadMore.current)
        //需要用一个变量存一下获取到的dom元素，否则在页面销毁「比如进入详情页跳转」的时候，dom元素也会销毁,就无法取消监听了
        let loadMoreBox = loadMore.current
        return () => {
            ob.unobserve(loadMoreBox);
            ob = null;
        }
    }, [])

    //页面第一次渲染完毕后，获取数据
    useEffect(() => {
        const init = async () => {
            let { date, stories, top_stories } = await queryNewLatest();
            setToday(date);
            setImgList(top_stories)
            newsList.push({
                date,
                stories
            })
            setNewsList([...newsList])
            console.log([newsList]);
        }
        init()
    }, [])


    return <div className="Home_box">
        {/* header */}
        <HomeHead today={today} />
        {/* 轮播图 */}
        <div className="swiper-box">
            {/* 判断一下轮播图信息列表是否存在，只有存在，才说明获取到了之后才能循环绑定轮播图 */}
            {imgList.length > 0 ? <Swiper autoplay loop>
                {imgList.map((item) => {
                    return <Swiper.Item key={item.id}>
                        <Link to={
                            {
                                pathname: `/detail/${item.id}`
                            }
                        }>
                            <Image src={item.image} alt="" lazy />
                            <div className="desc">
                                <h3 className="title">{item.title}</h3>
                                <p className="author">{item.hint}</p>
                            </div>
                        </Link>
                    </Swiper.Item>
                })}



            </Swiper> : null}
        </div>
        {/* 新闻列表 */}
        {/* 根据newsList中是否有信息判断是否渲染骨架屏 */}
        {newsList.length == 0 ?
            <SkeletonAgain></SkeletonAgain> :
            <>
                {
                    newsList.map((item, index) => {
                        return <div className="newsList_box" key={index}>
                            {/* 判断是否是第一条数据，决定是否渲染分割线 */}
                            {index != 0 ? <Divider contentPosition='left'>{forMatTime(item.date, "{1}月{2}日")}</Divider> : null}
                            <div className="list">
                                {item.stories.map(value => {
                                    return <Newsitem value={value} key={value.id}></Newsitem>
                                })}
                            </div>
                        </div>
                    })

                }
            </>
        }

        <div className="loadingBox" ref={loadMore} style={
            { display: newsList.length == 0 ? null : "block" }
        }>
            <SpinLoading color='primary' />
        </div>
    </div>
}
export default Home