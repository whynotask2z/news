import { useLocation, Navigate, useNavigate } from "react-router-dom";
// import Router from "./index"
import rootRouter from "./index"
import store from "../store"
import action from "../store/action"

//登陆态校验，我是通过自己写了一个类似vue的路由守卫的函数，然后需要传递一个要渲染的组件，在进入组件之前，会通过当前路由地址去路由元信息中添加的一个字段判断当前组件是否是需要登录才能访问的，如果是需要权限的话，并且还没登录的情况就跳到登录页，如果已经登录了，就正常渲染，判断是否登录的条件就是token




//递归去路由表中查找是当前地址
const searchRoute = (path, routes = []) => {
    let result = {};
    for (let item of routes) {
        if (item.path === path) return item;
        if (item.children) {
            const res = searchRoute(path, item.children);
            if (Object.keys(res).length) result = res;
        }
    }
    return result;
};

const AuthRouter = (props) => {
    const { pathname } = useLocation();
    // console.log(pathname,"pathname");
    const route = searchRoute(pathname, rootRouter.rootRouter);
    // * 在跳转路由之前，清除所有的请求

    // * 判断当前路由是否需要访问权限(不需要权限直接放行)
    if (!route.meta?.requiresAuth) return props.children;

    // const navigate = useNavigate();
    // * 判断是否有Token
    const token = localStorage.getItem("tk")

    if (!token) return <Navigate to="/login" />

    // // * Dynamic Router(动态路由，根据后端返回的菜单数据生成的一维数组)
    // const dynamicRouter = store.getState().auth.authRouter;
    // // * Static Router(静态路由，必须配置首页地址，否则不能进首页获取菜单、按钮权限等数据)，获取数据的时候会loading，所有配置首页地址也没问题
    // const staticRouter = [HOME_URL, "/403"];
    // const routerList = dynamicRouter.concat(staticRouter);
    // // * 如果访问的地址没有在路由表中重定向到403页面
    // if (routerList.indexOf(pathname) == -1) return <Navigate to="/403" />;

    // * 当前账号有权限返回 Router，正常访问页面

    // console.log(action,"action");   
    let { base : {info}} = store.getState();
    // console.log(info,"info");
    //获取info用户登录信息，如果有，就直接渲染对应组件，如果没有，可能是刷新过或者没登录，如果是刷新过，就重新派发一下任务，存储到容器中，在渲染组件
    if(info) return props.children;
    (async () => {
        //获取一下派发的信息
        let infoAction = await action.base.queryUserInfoAsync();
        info = infoAction.info;
        if(!info) return <Navigate to="/login" />;
        // 需要派发任务吧信息存到容器里
        store.dispatch(infoAction);

        // console.log(info,"info-afterdispatch");
    })()

    // console.log(props, "props");
    // console.log(props.children, "props-children");
    return props.children;
};

export default AuthRouter;