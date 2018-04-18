import {
    SET_NOTIFICATION,
    DELETE_NOTIFICATION,
    UPDATE_NOTIFICATION,
    UPDATE_NOTIFICATION_COUNT,
} from "../actions/type";

const initialState = {
    notifications : [],
    count : 0
}
Array.prototype.unique = function () {
    var a = this.concat();
    for (var i = 0; i < a.length; ++i) {
        for (var j = i + 1; j < a.length; ++j) {
            if (a[i].id === a[j].id) {
                a[i].seen = a[j].seen;
                a.splice(j--, 1);
            }
        }
    }

    return a;
};
export default notification = (state = initialState, action = {}) => {
    let notifications = [];
    switch (action.type) {        
        case SET_NOTIFICATION:
            var { notification } = action;

            if(notification.notifications != undefined)
                notifications = state.notifications.concat(notification.notifications).unique();
            return {
                ...state,
                notifications
            };

            break;
        case UPDATE_NOTIFICATION:
            var { notification } = action;

            if(notification.notifications != undefined)
                notifications = state.notifications.concat(notification.notifications).unique();
            return {
                ...state,
                notifications
            };

            break;
        case UPDATE_NOTIFICATION_COUNT:

            return {
                ...state,
                count : action.count
            }
        case DELETE_NOTIFICATION:
            return initialState;
            break;
        default:
            return state;
    }
}