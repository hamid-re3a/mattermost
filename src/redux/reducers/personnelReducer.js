import {
    SET_PERSONNEL,
    DELETE_PERSONNEL,
    SET_PERSONNEL_SERVICES
} from "../actions/type";

const initialState = {
    id: null,
    tel_id: null,
    username: null,
    bio: null,
    gender: null,
    birthday: null,
    birthday_year: null,
    birthday_month: null,
    birthday_day: null,
    first_name: null,
    last_name: null,
    mobile_no: null,
    actived: null,
    profile_pic: null,
    created_at: null,
    updated_at: null,
    personnel_id: null,
    services: null
}

export default personnel = (state = initialState, action = {}) => {
    switch (action.type) {
        case SET_PERSONNEL:
            const { personnel } = action;
            return {
                ...initialState,
                ...personnel
            }
            break;

        case SET_PERSONNEL_SERVICES:
            const { services } = action;
            return {
                ...state,
                services
            }
            break;
        case DELETE_PERSONNEL:
            return initialState;
            break;
        default:
            return state;
    }
}