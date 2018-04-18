import {
    SET_SHOP,
    UPDATE_SHOP,
    DELETE_SHOP_PERSONNEL,
    DELETE_SHOP
} from "../actions/type";

const initialState = {
    id: null,
    uuid: null,
    shop_category_id: null,
    user_id: null,
    shop_type: null,
    conflict: null,
    alias: null,
    work_cat: null,
    country: null,
    province: null,
    city: null,
    region_number: null,
    work_address: null,
    work_phone: null,
    fax: null,
    website: null,
    unique_name: null,
    profile_pic: null,
    cover_pic: null,
    postal_code: null,
    cell_phone: null,
    work_mail: null,
    work_desc: null,
    shoar: null,
    latitude: null,
    longitude: null,
    actived: null,
    created_at: null,
    updated_at: null,
    personnel:null,
    free_reservation: 0,
}

Array.prototype.clean = function(deleteValue) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == deleteValue) {         
      this.splice(i, 1);
      i--;
    }
  }
  return this;
};
export default shop = (state = initialState, action = {}) => {
    switch (action.type) {
        case SET_SHOP:
            var { shop } = action;
            return {
                ...initialState,
                ...shop
            }
            break;
        case UPDATE_SHOP:
            var { shop } = action;
            return {
                ...state,
                ...shop
            }
            break;
        case DELETE_SHOP_PERSONNEL:
            var { id } = action;
            var personnel = state.personnel.map(function(person){
                if(person.personnel_id != id.id)
                    return person;
                
                return ;
            })
            personnel.clean(undefined);;
            return {
                ...state,
                personnel
            }
            break;
        case DELETE_SHOP:
            return initialState;
            break;
        default:
            return state;
    }
}