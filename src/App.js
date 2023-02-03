import logo from './logo.svg';
import './App.css';

import { BrowserRouter } from "react-router-dom"
// import Router from "./routes/index"
import Layout from './routes/layout';

import RouterView from "../src/routes/index"

import AuthRouter from "../src/routes/authRouter"
import rootRouter from "../src/routes/index"

//实现组件缓存的插件，导入进来，吧要渲染的入口包起来，然后去路由表中，导出一个withKeepAlive包起来需要缓存的组件
import { KeepAliveProvider } from "keepalive-react-component"

function App() {

  const Router = rootRouter.Router
  return <BrowserRouter>
    <KeepAliveProvider>
      <div className="App">
        <Layout>
          <AuthRouter>
            <Router></Router>
          </AuthRouter>
          {/* <routerView></routerView> */}
          {/* <RouterView /> */}
        </Layout>

      </div>
    </KeepAliveProvider>

  </BrowserRouter>

}

export default App;
