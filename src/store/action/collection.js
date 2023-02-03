import * as TYPES from "../action-types"
import { queryStoreList } from "../../api/index"

const collectionAction = {
    //异步获取收藏列表存储到redux中
    async querystoreListAsync() {
        // console.log(111);
        let list = null;
        try {
        let { code, data } = await queryStoreList();
        if (+code == 0) list = data;
        } catch (error) {

        }
        return {
            type: TYPES.STORE_LIST,
            list
        }
    },
    //其他这两个直接同步派发就可以了
    clearStoreList() {
        return {
            type: TYPES.STORE_LIST,
            list: null
        }
    },
    removeStoreList(id) {
        return {
            type: TYPES.STORE_REMOVE,
            id
        }
    }
}
export default collectionAction