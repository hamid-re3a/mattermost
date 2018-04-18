import ImagePicker from 'react-native-image-picker';

// More info on all the options is below in the README...just some common use cases shown here
const options = {
    title: 'انتخاب تصویر',
    takePhotoButtonTitle : 'گرفتن از دوربین ...',
    chooseFromLibraryButtonTitle : 'انتخاب از گالری تصاویر ...',
    cancelButtonTitle : 'منصرف شدم',
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
};

/**
 * The first arg is the options object for customization (it can also be null or omitted for default options),
 * The second arg is the callback which sends object: response (more info below in README)
 */
export const cropper = (callback) => {
    
    
}