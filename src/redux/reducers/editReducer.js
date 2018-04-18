import {
    SET_EDIT,
    DELETE_EDIT,
} from "../actions/type";

const initialState = {
    
    elementType : null,
    elementToEdit : null,
    elementId : null,
    belongsTo : null,

}

export default edit = (state = initialState, action = {}) => {
    switch (action.type) {
        case SET_EDIT:
            const { edit } = action;
            return {
                ...initialState,
                ...edit
            }
            break;
        case DELETE_EDIT:
            return initialState;
            break;
        default:
            return state;
    }
}