import RNFetchBlob from 'react-native-fetch-blob';


export const uploader = (data) => {
    return RNFetchBlob.fetch('POST' , 'http://roocket.org/api/upload/image' , {
        'Content-Type' : 'multipart/form-data'
    }, data)
}