import {
    SET_USER,
    DELETE_USER,
    UPDATE_USER,
    SET_USER_EMAIL
} from "../actions/type";

const initialState = {
    id : null,
    name : null,
    email : null,
    apiToken : null,
    refreshToken: null,
    tel_id: null,
    username: null,
    bio: null,
    gender: null,
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
    remaining_money: 0,
    notifications: true
}

export default user = (state = initialState , action = {}) => {
    switch (action.type) {
        case SET_USER_EMAIL :
            const  {email}  = action;
            return {
                ...initialState,
                email
            }
            break;
        case SET_USER :
            const { user } = action;
            return {
                ...initialState,
                id: user.userInfo.id,
                name : user.userInfo.name,
                email : user.userInfo.email,
                apiToken: user.access_token,
                refreshToken: user.refresh_token,
                tel_id: user.userInfo.tel_id,
                username: user.userInfo.username,
                bio: user.userInfo.bio,
                gender: user.userInfo.gender,
                birthday_year: user.userInfo.birthday_year,
                birthday_month: user.userInfo.birthday_month,
                birthday_day: user.userInfo.birthday_day,
                first_name: user.userInfo.first_name,
                last_name: user.userInfo.last_name,
                mobile_no: user.userInfo.mobile_no,
                actived: user.userInfo.actived,
                profile_pic: user.userInfo.profile_pic,
                created_at: user.userInfo.created_at,
                updated_at: user.userInfo.updated_at
            }
            break;
        case DELETE_USER :
            return initialState;
            break;
        case UPDATE_USER :
        var { user } = action;
            return {
                ...state,
                ...user
            }
            break;
        default:
            return state;
    }
}