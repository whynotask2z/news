import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import "lib-flexible"

import "../src/assets/reset.css";
import "./index.less";

import { ConfigProvider } from "antd-mobile";
import zhCn from "antd-mobile/es/locales/zh-CN"

import store from "./store";
import {Provider} from "react-redux"


const root = ReactDOM.createRoot(document.getElementById('root'));
(function(){
  //处理一种情况，如果设备宽度大于设计稿的750了，也不进行等比的增大了，就维持最大的1rem=75，然后多出来的宽度空白
  const handleMaxWidth = () => {
    let html = document.documentElement,
    deviceW = html.clientWidth;
    html.style.maxWidth = "750px";
    if(deviceW >= 750){
      html.style.fontSize = "75px"
    }
  }
  handleMaxWidth()
})()


root.render(
  // <React.StrictMode>
<Provider store={store}>
<ConfigProvider locale={zhCn}>
      <App></App>
    </ConfigProvider>
  
</Provider>



  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
