import React, { useState } from "react";
import { Button } from "antd-mobile";

const ButtonAgain = (props) => {
    /*  
        封装button思路，就是通过props接收到到所有属性，并且把需要自行设置某些操作的属性重新命名一下，然后自己完成需要的操作，在通过属性传递给button组件，比如本次，需要在执行方法的过程中展示loading效果，其实还是执行原button中的onclick中的方法，但是在执行的时候给他设置loading效果，进行二次封装「注意Form的onFinish={onSubmit}的这个方法，不能在button封装的时候用，需要自己手动在button上绑定一个onclick事件，因为是基于onclick来获取需要执行的函数的」
    */
    // console.log(props);
    let [loading, setLoading] = useState(false);
    //props的属性是冻结的，需要先clone？{冻结的对象上，没法给他添加或者删除属性}
    let options = { ...props };
    let { children, onClick: handle } = options;
    delete options.children;

    const clickHandle = async () => {
        setLoading(true);
        //用try-catch保证无论请求是否成功，最后的loading效果都会消失
        try {
            await handle();
        } catch (error) {

        }
        setLoading(false);
    }
    //如果能从组件中读取到onclick中绑定的方法，就给clone出来的options配置项中绑定上
    if(handle) options.onClick = clickHandle;
    return <Button {...options} loading={loading}>
        {children}
    </Button>
}
export default ButtonAgain