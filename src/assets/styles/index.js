import EStyleSheet from 'react-native-extended-stylesheet';

export const form = EStyleSheet.create({
    StyleForm: {
        padding: 20
    },
    item: {
        borderRadius: 5,
        marginBottom: 10,
        paddingRight: 10,
        paddingLeft: 10
    },
    input: {
        textAlign: 'right',
        fontFamily: '$IS',
        fontSize: 14
    },
    submitButton: {
        borderRadius: 5,
        backgroundColor: '$mainColor'
    },
    submitButtonClicked: {
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'gray',
        backgroundColor: 'transparent'
    },
    submitText: {
        fontSize: 16,
        fontFamily: '$IS',
        color: 'white'
    },
    error: {
        fontFamily: '$IS',
        fontSize: 12,
        color: '#ed2f2f',
        marginBottom: 10
    }
});

export const drawer = EStyleSheet.create({
    container: {
        flex: 1
    },
    imageHeader: {
        height: 200,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    item: {
        justifyContent: 'flex-start',
        padding: 10
    },
    itemTitle: {
        fontFamily: '$IS'
    },
    itemIcon: {
        marginRight: 10
    }
});

export const index = EStyleSheet.create({
    splashContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '$mainColor'
    },
    splashText: {
        color: 'white',
        fontSize: 18,
        fontFamily: '$IS'
    }
});

export const general = EStyleSheet.create({
    navText: {
        fontFamily: 'IRANSansMobile',
        color: 'white'
    },
    navIcon: {
        color: 'white'
    },
    text: {
        fontFamily: 'IRANSansMobile',
        color: 'black'
    },
    h3: {
        lineHeight: 31,
        textAlign: 'left'
    },
    h1: {
        lineHeight: 41,
        color: 'white'
    },
    bodyRightAlign: {

    },
    title: {
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export const navigation = EStyleSheet.create({
    active: {
        backgroundColor: '#BFBFBF'
    }
});

export const personnel = EStyleSheet.create({
    reserveStatusCol:{
        height: 120,
         borderBottomColor: '#F2F1EF',
          borderBottomWidth: 2,
           padding: 10
    },
    reserveStatusMiddleCol:{
        height: 120,
        borderRightWidth: 2, borderRightColor: '#F2F1EF',
        borderLeftWidth: 2, borderLeftColor: '#F2F1EF',
    },
    reserveStatusRow: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
    },
    reserveStatusText: {
        fontFamily: 'IRANSansMobile',
        color: 'black',
        color: '#333',
        fontSize: 14
    },
    reserveStatusIcon : {
        color: '#333',
        fontSize: 20 
    },
    reserveStatusActiveIcon: {
        color: '#333',
        fontSize: 26
    },
    reserveStatusActiveText:{
        fontFamily: 'IRANSansMobile',
        color: 'black',
        color: '#333',
        fontSize: 18
    }

});


export default styles = {
    index
};