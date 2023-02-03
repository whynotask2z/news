import { useLocation , useMatch, matchPath} from "react-router-dom";
import { useMemo , useCallback, useEffect,} from "react";
import Router from "./index"
import Home from "../views/Home";
import { lazy } from "react";
import React from "react"
import lazyLoad from "./lazyLoad";

const rootRouter = [
    {
        path: "/",
        element: <Home></Home>,
        name: "首页",
        meta: {
            title: "首页"
        }
    },
    {
        path: "/login",
        element: () => lazyLoad(lazy(import("../views/Login"))),
        name: "登录",
        meta: {
            title: "登录"
        }
    },
    {
        path: "/detail/:id",
        element: () => lazyLoad(lazy(import("../views/Detail"))),
        name: "详情页",
        meta: {
            title: "详情页"
        }
    }
    , {
        path: "/404",
        element: () => lazyLoad(lazy(import("../views/Page404"))),
        name: "404",
        meta: {
            title: "404页"
        }
    }, {
        path: "/store",
        element: () => lazyLoad(lazy(import("../views/Store"))),
        name: "收藏",
        meta: {
            title: "收藏"
        }
    }, {
        path: "/personal",
        element: () => lazyLoad(lazy(import("../views/Personal"))),
        name: "个人信息",
        meta: {
            title: "个人信息"
        }
    }, {
        path: "/update",
        element: () => lazyLoad(lazy(import("../views/Update"))),
        name: "修改个人信息",
        meta: {
            title: "修改个人信息"
        }
    }
]

//根据标签路由修改标签页名称
export const Layout = ({  children }) => {
    const { pathname } = useLocation();

    console.log(pathname,"pathname");
    const routerTitle = useMemo(() => {
        const title = rootRouter.filter(route => route.meta.title && matchPath(route.path,pathname))
        // console.log(title,"title");


        return Array.isArray(title) && title.length ? title[0].meta.title : '标题'
    }, [rootRouter, pathname])
    // console.log(routerTitle,"routerTitle");
    useEffect(() => {
      document.title = routerTitle
    }, [routerTitle])
    return (
        <div >
            {children}
        </div>
    );
};


export default Layout