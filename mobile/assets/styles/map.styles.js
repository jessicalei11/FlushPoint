import { StyleSheet } from 'react-native';
import COLORS from '../../constants/colors'; 

const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { width: '100%', height: '100%' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    calloutContainer: {
        width: 180, 
        padding: 5,
        backgroundColor: COLORS.white,
        borderRadius: 10,
        alignItems: 'center',
    },
    calloutTitle: {
        fontWeight: 'bold',
        fontSize: 14,
        marginBottom: 4,
        textAlign: 'center',
    },
    calloutImage: {
        width: 160,
        height: 100, 
        resizeMode: 'cover',
        borderRadius: 6,
        marginTop: 5,
    },
    calloutNoImage: {
        fontSize: 12,
        color: COLORS.textSecondary,
    },
    calloutTapHint: { 
        fontSize: 10,
        color: COLORS.primary,
        marginTop: 3,
        fontWeight: '500',
    },
    
    refreshButton: {
        position: 'absolute',
        bottom: 80,
        right: 10,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#0000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
});

export default styles;