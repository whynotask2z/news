import * as Type from "../action-types"
const initial = {
    list: []
}
const collectionReducer = (state = initial, action) => {
    state = { ...state };
    switch (action.type) {
        case Type.STORE_LIST:
            state.list = action.list;
            break;
        case Type.STORE_REMOVE:
            if (Array.isArray(state.list)) {
                state.list = state.list.filter(item => {
                    return item.id !== action.id
                })
            }
            break;
        default:
    }
    return state;
}
export default collectionReducer