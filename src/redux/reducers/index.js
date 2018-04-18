import { combineReducers } from 'redux';
import { AsyncStorage } from 'react-native';
import personnel from './personnelReducer';
import user from './userReducer';
import shop from './shopReducer';
import notification from './notificationReducer';
import reserveInfo from './reserveInfoReducer.js';
import reserve from './reserveReducer.js';
import edit from './editReducer.js';
import { REHYDRATE, PURGE, persistCombineReducers } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
const config = {
    key: 'primary',
    storage: AsyncStorage
}

const rehydrated = (state = false, action) => {
    switch (action.type) {
        case "persist/REHYDRATE":
            return true;
            break;
        default:
            return state;
    }
}
const reducers = persistCombineReducers(config, {
    edit,
    reserve,
    reserveInfo,
    personnel,
    user,
    shop,
    notification,
    rehydrated
})
export default reducers;


