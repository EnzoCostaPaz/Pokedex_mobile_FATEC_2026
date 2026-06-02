import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        width: '90%',
        maxWidth: 1250,
        display: 'flex',
        alignSelf: 'center',

        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        marginTop: 30,
        gap: 20,

        borderRadius: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.5)',
    },
    logo: {
        width: 200,
        height: 100,
    },

    // Android
     containerAndroid: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#E3350D',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        elevation: 10,
        paddingTop: 20,

    },
    sideGroupAndroid: {
        flexDirection: 'row',
        gap: 16,
    },
    menuItemAndroid: {
        paddingVertical: 10,
    },
    menuTextAndroid: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
    logoWrapper: {
        position: 'absolute',
        left: '50%',
        marginLeft: -35,
        top: -30,
        backgroundColor: '#FFF',
        borderRadius: 40,
        padding: 5,
        elevation: 5,
    }
})


