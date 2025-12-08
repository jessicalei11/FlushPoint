import { StyleSheet } from 'react-native';
import COLORS from '../../constants/colors'; 

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    container: {
        padding: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: 15,
        textAlign: 'center',
    },
    mainImage: {
        width: '100%',
        height: 250,
        borderRadius: 12,
        marginBottom: 20,
        resizeMode: 'cover',
    },
    detailCard: {
        width: '100%',
        backgroundColor: "#FFFFFF",
        padding: 15,
        borderRadius: 12,
        marginBottom: 20,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    icon: {
        marginRight: 10,
        marginTop: 2,
    },
    detailText: {
        flex: 1,
        fontSize: 16,
        color: COLORS.textPrimary,
        lineHeight: 22,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.primary,
        padding: 15,
        borderRadius: 10,
        width: '100%',
        marginBottom: 15,
    },
    buttonText: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 10,
    },
    backButton: {
            backgroundColor: COLORS.primary, 
            padding: 15, 
            borderRadius: 10, 
        },
        backText: {
            color: COLORS.white, 
            fontSize: 18, 
            fontWeight: '600', 
        },
    errorText: {
        fontSize: 18,
        color: COLORS.error,
        textAlign: 'center',
        marginTop: 50,
    },
    backLink: {
        marginTop: 10,
        fontSize: 16,
        color: COLORS.primary,
        textDecorationLine: 'underline',
    },

    reviewsSection: {
        width: '100%',
        marginTop: 10,
    },
    reviewsTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: 15,
    },
    reviewCard: {
        backgroundColor: "#FFFFFF",
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
    },
    reviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    reviewerName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    ratingContainer: {
        flexDirection: 'row',
    },
    reviewDescription: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginBottom: 8,
    },
    reviewDate: {
        fontSize: 12,
        color: COLORS.placeholderText,
        textAlign: 'right',
    },
    noReviewsText: {
        fontSize: 16,
        color: COLORS.textSecondary,
        textAlign: 'center',
        padding: 20,
        backgroundColor: COLORS.cardBackground,
        borderRadius: 10,
    },
    reviewFormContainer: {
        width: '100%',
        backgroundColor: "#FFFFFF",
        padding: 20,
        borderRadius: 12,
        marginBottom: 20,
    },
    formTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: 10,
    },
    starContainer: {
        flexDirection: 'row',
        marginBottom: 15,
        justifyContent: 'center',
    },
    formTextArea: {
        minHeight: 80,
        backgroundColor: "#FFFFFF",
        padding: 10,
        borderRadius: 8,
        fontSize: 16,
        color: COLORS.textPrimary,
        borderWidth: 1,
        borderColor: COLORS.placeholderText,
        marginBottom: 15,
        textAlignVertical: 'top',
    },
    formButton: {
        backgroundColor: COLORS.primary,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    formButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '600',
    },
});

export default styles;