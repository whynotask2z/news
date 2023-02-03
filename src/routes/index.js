import { useLocation, useMatch, matchPath, Routes } from "react-router-dom";
import { useMemo, useCallback, useEffect, Suspense, } from "react";
import { lazy } from "react";
import React from "react"
import lazyLoad from "./lazyLoad";
import { useRoutes, Route } from "react-router-dom";
import Home from "../views/Home";

import { withKeepAlive } from 'keepalive-react-component'


// import Login from "../views/Login";
// import Detail from "../views/Detail";
// import Page404 from "../views/Page404";
// import Personal from "../views/Personal";
// import Store from "../views/Store";
// import Update from "../views/Update";


// const Login = lazy(() => import("../views/Login"))

import routes from "./routes";
import { DotLoading } from "antd-mobile";

// const Login = lazyLoad(React.lazy(import("../views/Login")))


//通过withKeepAlive把路由处理，cacheId一个该缓存组件的唯一id，scroll是否开启滚动高度缓存
const HomeKeepAlive = withKeepAlive(Home,{cacheId:"home",scroll:true})



const rootRouter = [
    {
        path: "/",
        element:<HomeKeepAlive></HomeKeepAlive>,
        name: "首页",
        meta: {
            title: "首页",
            requiresAuth: false
        }
    },
    {
        path: "/login",
        element: lazyLoad(lazy(() => import("../views/Login"))),
        name: "登录",
        meta: {
            title: "登录",
            requiresAuth: false
        }
    },
    {
        path: "/detail/:id",
        element: lazyLoad(lazy(() => import("../views/Detail"))),
        name: "详情页",
        meta: {
            title: "详情页",
            requiresAuth: false
        }
    }
    , {
        path: "/store",
        element: lazyLoad(lazy(() => import("../views/Store"))),
        name: "收藏",
        meta: {
            title: "收藏",
            requiresAuth: true
        }
    }, {
        path: "/personal",
        element: lazyLoad(lazy(() => import("../views/Personal"))),
        name: "个人信息",
        meta: {
            title: "个人信息",
            requiresAuth: true
        }
    }, {
        path: "/update",
        element: lazyLoad(lazy(() => import("../views/Update"))),
        name: "修改个人信息",
        meta: {
            title: "修改个人信息",
            requiresAuth: true
        }
    },
    {
        path: "*",
        element: lazyLoad(lazy(() => import("../views/Page404"))),
        name: "404",
        meta: {
            title: "404页",
            requiresAuth: false
        }
    },
]

const Router = () => {
    const routes = useRoutes(rootRouter);
    return routes;
}





export default { Router, rootRouter }


// import {lazy} from "react";
// import { Home } from "../views/Home"

// const Element = (props) => {
//     let { component: Compoent, meta } = props;
//     let { title = "zhihu" } = meta || {}
//     document.title = title
//     return <Compoent></Compoent>
// }
// const RouterView = () => {
//     return <Suspense fallback={
//         <DotLoading />
//     }>
//         <Routes>
//             {
//                 routes.map(item => {
//                     let { name, path } = item;
//                     return <Route key={name} path={path} element={ <Element {...item}></Element> }  />
//                 })
//             }
//         </Routes>
//     </Suspense>
// }
// export default RouterView