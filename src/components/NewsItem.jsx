import React from "react";
import { Image , Ellipsis} from "antd-mobile";
import { Link , NavLink} from "react-router-dom";
import "./NewsItem.less"
import PropTypes from "prop-types";

const Newsitem = (props) => {
    let { value } = props
    // console.log(value,"value");
    if (!value) return null;
    let { title, id, images, hint , image} = value;
    if(!images) images = [image]    //处理在个人收藏页面返回的数据图片不是一个数组，并且也没有hint的情况
    if(!Array.isArray(images)) images = [""];
    return <div className="newsItemBox">
        <NavLink to={{
            pathname: `/detail/${id}`
        }}>
            <div className="content">

                {/* <h4 >{title}</h4> */}
                <Ellipsis className="title" direction='end' content={title} />
                {hint ? <p className="author">{hint}</p> : null}
            </div>
            <div className="img_box">
                <Image src={images[0]}></Image>
            </div>
        </NavLink>
    </div>

}

//默认值null，但是如果有值，就必须是对象类型的
Newsitem.defaultProps = {
    value: null
};
Newsitem.propTypes = {
    value: PropTypes.object
}


export default Newsitem;