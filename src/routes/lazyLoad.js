import React, { Suspense } from "react";
import { DotLoading } from "antd-mobile";

/**
 * @description 路由懒加载
 * @param {Element} Comp 需要访问的组件
 * @returns element
 */

const lazyLoad = (Comp) => {
    return (
        <Suspense fallback={
            <DotLoading />
        }>
	    <Comp />
        </Suspense>
    )
}
export default lazyLoad;
