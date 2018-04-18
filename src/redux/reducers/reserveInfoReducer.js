import {
    SET_RESERVE_INFO,
    DELETE_RESERVE_INFO,
} from "../actions/type";

const initialState = {
    service_id: null,
    start_time: null,
    date: null,
    show_date: null,
    service_name: null,
    service_price: null,
    length_time: null
}

export default reserveInfo = (state = initialState, action = {}) => {
    switch (action.type) {
        case SET_RESERVE_INFO:
            const { reserveInfo } = action;
            return {
                ...initialState,
                ...reserveInfo
            }
            break;
        case DELETE_RESERVE_INFO:
            return initialState;
            break;
        default:
            return state;
    }
}