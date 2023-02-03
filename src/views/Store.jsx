import React, { useEffect } from "react";
import NavBarAgain from "../components/NavBarAgain";
import Newsitem from "../components/NewsItem";
import { Image, Ellipsis, SwipeAction, Toast } from "antd-mobile";
import { connect } from "react-redux";
import action from "../store/action";
import { queryStoreList, removeStore } from "../api";
import SkeletonAgain from "../components/SkeletonAgain";

const Store = (props) => {
    let { list, querystoreListAsync, removeStoreList } = props;
    useEffect(() => {
        (async () => {
            if (list) await querystoreListAsync()
        })()
    }, [])
    const handleRemove = async (id) => {
        try {
            let { code } = await removeStore(id);
            if (+ code == 0) {
                Toast.show({
                    icon: "success",
                    content: "移除收藏成功"
                })
                removeStoreList(id);
            }
        } catch (error) {

        }
    }
    return <div className="Store_box">
        <NavBarAgain title={"收藏"}></NavBarAgain>
        {list ? list.map((item, index) => {
            let { id, news } = item;
            return <SwipeAction key={index} rightActions={[
                {
                    key: 'delete',
                    text: '删除',
                    color: 'danger',
                    onClick: handleRemove.bind(null, id)
                }]} >
                <Newsitem value={news}></Newsitem>
            </SwipeAction>
        }) : <SkeletonAgain></SkeletonAgain>}
    </div >
}
export default connect(state => state.collection,
    action.collection)(Store)