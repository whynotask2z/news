import * as Type from "../action-types"

const initial = {
    info: null
}
const baseReducer = (state = initial, action) => {
    state = { ...state };
    switch (action.type) {
        case Type.BASE_INFO:
            state.info = action.info
            break;
        default:
    }
    return state;
}
export default baseReducer