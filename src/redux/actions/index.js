import {
    SET_SHOP,
    UPDATE_SHOP,
    DELETE_SHOP_PERSONNEL,
    DELETE_SHOP,

    SET_USER,
    UPDATE_USER,
    SET_USER_EMAIL,
    DELETE_USER,

    SET_PERSONNEL,
    DELETE_PERSONNEL,
    SET_PERSONNEL_SERVICES,

    SET_RESERVE_INFO,
    DELETE_RESERVE_INFO,

    SET_RESERVE,
    DELETE_RESERVE,

    SET_EDIT,
    DELETE_EDIT,

    SET_NOTIFICATION,
    DELETE_NOTIFICATION,
    UPDATE_NOTIFICATION,
    UPDATE_NOTIFICATION_COUNT,
} from "./type";


// ******* Shop **********

export const setShop = (shop) => ({
    type: SET_SHOP,
    shop
});

export const updateShop = (shop) => ({
    type: UPDATE_SHOP,
    shop
});

export const deleteShopPersonnel = (id) => ({
    type: DELETE_SHOP_PERSONNEL,
    id
});

export const deleteShop = () => ({
    type: DELETE_SHOP,
});


// ******** User **********


export const setUser = (user) => ({
    type: SET_USER,
    user
});
export const updateUser = (user) => ({
    type: UPDATE_USER,
    user
});
export const setUserEmail = (email) => ({
    type: SET_USER_EMAIL,
    email: email
});

export const deleteUser = () => ({
    type: DELETE_USER
});


// ******* Personnel **********


export const setPersonnel = (personnel) => ({
    type: SET_PERSONNEL,
    personnel
});

export const deletePersonnel = () => ({
    type: DELETE_PERSONNEL
});

export const setPersonnelServices = (services) => ({
    type: SET_PERSONNEL_SERVICES,
    services 
});




// ******* ReserveInfo **********


export const setReserveInfo = (reserveInfo) => ({
    type: SET_RESERVE_INFO,
    reserveInfo
});

export const deleteReserveInfo = () => ({
    type: DELETE_RESERVE_INFO
});


// ******* Reserve **********


export const setReserve = (reserve) => ({
    type: SET_RESERVE,
    reserve
});

export const deleteReserve = () => ({
    type: DELETE_RESERVE
});


// ******* Edit **********


export const setEdit = (edit) => ({
    type: SET_EDIT,
    edit
});

export const deleteEdit = () => ({
    type: DELETE_EDIT
});


// ******* Notification **********


export const setNotification = (notification) => ({
    type: SET_NOTIFICATION,
    notification
});

export const updateNotification = (notification) => ({
    type: UPDATE_NOTIFICATION,
    notification
});

export const updateNotificationCount = (count) => ({
    type: UPDATE_NOTIFICATION_COUNT,
    count
});

export const deleteNotification = () => ({
    type: DELETE_NOTIFICATION
});


