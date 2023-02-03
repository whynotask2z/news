import reducer from "./reducer";
import reduxLogger from "redux-logger";
import reduxThunk from "redux-thunk";
import reduxPromise from "redux-promise"
import { createStore, applyMiddleware } from "redux"


// 根据不同环境，导入不同中间件，生产和开发
let middleware = [reduxThunk, reduxPromise];
let env = process.env.NODE_ENV;
if(env == "development"){
    middleware.push(reduxLogger)
}


const store = createStore(reducer , applyMiddleware(...middleware))

export default store;