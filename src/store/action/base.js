import * as TYPES from "../action-types"
import { queryUserinfo } from "../../api/index"


const baseAction = {
    async queryUserInfoAsync(){
        let info = null;
        try {
            let {code , data} = await queryUserinfo();
            if(code == 0)   info = data;
        } catch (error) {
            
        }
        return {
            type:TYPES.BASE_INFO,
            info
        }
    },
    clearUserInfo(){
        return {
            type:TYPES.BASE_INFO,
            info:null
        }
    }
}
export default baseAction