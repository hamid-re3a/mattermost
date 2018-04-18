import {
    SET_RESERVE,
    DELETE_RESERVE,
} from "../actions/type";

const initialState = {
    id : null,
    user_id : null,
    shop_service_id : null,
    service_price : null,
    is_accepted : null,
    is_requested_for_cancel : null,
    is_accepted_for_cancel : null,
    date : null,
    start_time : null,
    end_time : null,
    is_done : null,
    payment_type : null,
    is_paid : null,
    rate : null,
    conflict : null,

}

export default reserve = (state = initialState, action = {}) => {
    switch (action.type) {
        case SET_RESERVE:
            const { reserve } = action;
            return {
                ...initialState,
                ...reserve
            }
            break;
        case DELETE_RESERVE:
            return initialState;
            break;
        default:
            return state;
    }
}