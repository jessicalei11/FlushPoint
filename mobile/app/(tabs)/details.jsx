import { 
    View, 
    Text, 
    StyleSheet, 
    Image, 
    ScrollView, 
    Alert, 
    Linking, 
    Platform, 
    TouchableOpacity, 
    ActivityIndicator, 
    TextInput 
} from 'react-native';
import React, { useState, useEffect, useCallback } from 'react'; 
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router'; 
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import { API_URL } from '../../constants/api'; 
import { useAuthStore } from "../../store/authStore"; 
import styles from '../../assets/styles/details.styles';

const ReviewCard = ({ review }) => {
    const ratingIcons = Array(5).fill(null).map((_, i) => (
        <Ionicons 
            key={i} 
            name={review.rating > i ? "star" : "star-outline"} 
            size={16} 
            color={COLORS.yellow} 
        />
    ));

    const date = new Date(review.createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    return (
        <View style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
                <Text style={styles.reviewerName}>{review.user?.username || 'Anonymous'}</Text>
                <View style={styles.ratingContainer}>
                    {ratingIcons}
                </View>
            </View>
            <Text style={styles.reviewDescription}>{review.description || 'No comment provided.'}</Text>
            <Text style={styles.reviewDate}>Posted on {date}</Text>
        </View>
    );
};

const ReviewForm = ({ bathroomId, onReviewSubmitted }) => {
    const [rating, setRating] = useState(0);
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [averageRating, setAverageRating] = useState(0);
    const [currentNumOfReviews, setCurrentNumOfReviews] = useState(0);
    const { token } = useAuthStore(); 

    const handleRatingSelect = (selectedRating) => {
        setRating(selectedRating);
    };

    const handleSubmitReview = async () => {
        if (rating === 0) {
            Alert.alert("Input Required", "Please select a star rating.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/reviews`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`, 
                },
                body: JSON.stringify({
                    bathroomId: bathroomId,
                    rating: rating,
                    description: description,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                const errorMessage = data.message || "Failed to submit review due to server error.";
                
                Alert.alert("Submission Error", errorMessage); 
                return; 
            }

            Alert.alert("Success", "Your review has been posted!");
            setRating(rating);
            setDescription(description);
            setAverageRating(averageRating + rating);
            setCurrentNumOfReviews(currentNumOfReviews + 1);
            onReviewSubmitted(); 
            
        } catch (error) {
            console.error("Network Error:", error);
            Alert.alert("Error", error.message || "Could not connect to the server.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.reviewFormContainer}>
            <Text style={styles.formTitle}>Rate this Bathroom</Text>
            
            {/* Rating Stars Input */}
            <View style={styles.starContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity 
                        key={star} 
                        onPress={() => handleRatingSelect(star)}
                        disabled={loading}
                    >
                        <Ionicons
                            name={rating >= star ? "star" : "star-outline"}
                            size={30}
                            color={COLORS.yellow}
                            style={{ marginHorizontal: 3 }}
                        />
                    </TouchableOpacity>
                ))}
            </View>

            {/* Description Input */}
            <TextInput
                style={styles.formTextArea}
                placeholder="Share your thoughts (optional)"
                placeholderTextColor={COLORS.placeholderText}
                value={description}
                onChangeText={setDescription}
                multiline
                editable={!loading}
            />

            {/* Submit Button */}
            <TouchableOpacity 
                style={styles.formButton} 
                onPress={handleSubmitReview}
                disabled={loading || rating === 0}
            >
                {loading ? (
                    <ActivityIndicator color={COLORS.white} />
                ) : (
                    <Text style={styles.formButtonText}>Submit Review</Text>
                )}
            </TouchableOpacity>
        </View>
    );
};

export default function BathroomDetailScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();

    const [reviews, setReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(true);
    
    const [averageRating, setAverageRating] = useState(0);
    const [currentNumOfReviews, setCurrentNumOfReviews] = useState(0);

    const { 
        id, 
        name, 
        address, 
        description, 
        image, 
        latitude, 
        longitude,
    } = params;

    if (!id) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Error: Bathroom details not found.</Text>
                <Text style={styles.backLink} onPress={() => router.back()}>Go Back</Text>
            </View>
        );
    }

    const fetchReviews = async () => {
        if (!id) return;
        setLoadingReviews(true);
        try {
            const reviewsResponse = await fetch(`${API_URL}/reviews/${id}`);
            const reviewsData = await reviewsResponse.json();
            if (reviewsResponse.ok) {
                setReviews(reviewsData);
            } else {
                 console.error(`Failed to fetch reviews: Status ${reviewsResponse.status}`);
            }

            const bathroomResponse = await fetch(`${API_URL}/bathrooms/${id}`);
            
            if (bathroomResponse.ok) {
                const bathroomData = await bathroomResponse.json();
                console.log(bathroomData)
                setAverageRating(bathroomData.totalStars / bathroomData.numberOfRatings)
                setCurrentNumOfReviews(bathroomData.numberOfRatings)
            } else {
                console.error(`Failed to fetch bathroom details for stats: Status ${bathroomResponse.status}`);
            }

        } catch (error) {
            console.error("Error fetching data:", error);
            setReviews([]);
        } finally {
            setLoadingReviews(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchReviews();
        }, [id])
    );

    const handleNavigation = () => {
        const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
        const latLng = `${latitude},${longitude}`;
        const label = name;
        const url = Platform.select({
            ios: `${scheme}${label}@${latLng}`,
            android: `${scheme}${latLng}(${label})`
        });

        Linking.openURL(url).catch(() => {
            Alert.alert("Error", "Could not open map application.");
        });
        
        router.push('/'); 
    };

    return (
        <ScrollView style={styles.scrollView}>
            <View style={styles.container}>
                <Text style={styles.title}>{name}</Text>
                
                {image && (
                    <Image source={{ uri: image }} style={styles.mainImage} />
                )}

                <View style={styles.detailCard}>
                    
                    <View style={styles.detailRow}>
                        <Ionicons name="star-half-outline" size={24} color={COLORS.yellow} style={styles.icon} />
                        <Text style={styles.detailText}>
                            Rating: {
                                averageRating >= 0 && typeof averageRating === 'number' ? 
                                    `${averageRating} / 5.0 (${currentNumOfReviews} reviews)` 
                                    : 'No ratings yet.'
                            }
                        </Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Ionicons name="information-circle-outline" size={24} color={COLORS.primary} style={styles.icon} />
                        <Text style={styles.detailText}>{description || 'No detailed description available.'}</Text>
                    </View>
                    
                    {/* Coordinates*/}
                    <View style={styles.detailRow}>
                        <Ionicons name="navigate-circle-outline" size={24} color={COLORS.primary} style={styles.icon} />
                        <Text style={styles.detailText}>Lat: {latitude}, Lon: {longitude}</Text>
                    </View>
                    
                </View>

                {/* Navigation Button */}
                <TouchableOpacity style={styles.button} onPress={handleNavigation}>
                    <Ionicons name="walk-outline" size={24} color={COLORS.white} />
                    <Text style={styles.buttonText}>Navigate to this Location</Text>
                </TouchableOpacity>

                <ReviewForm 
                    bathroomId={id} 
                    onReviewSubmitted={fetchReviews} 
                />

                <View style={styles.reviewsSection}>
                    <Text style={styles.reviewsTitle}>Community Reviews ({reviews.length})</Text>
                    
                    {loadingReviews ? (
                        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 20 }} />
                    ) : reviews.length > 0 ? (
                        reviews.map(review => (
                            <ReviewCard key={review._id} review={review} />
                        ))
                    ) : (
                        <Text style={styles.noReviewsText}>Be the first to leave a review!</Text>
                    )}
                </View>

                <TouchableOpacity style={[styles.button, styles.backButton, { marginTop: 20 }]} onPress={() => router.back()}>
                    <Text style={styles.backText}>Return to Map</Text>
                </TouchableOpacity>

            </View>
        </ScrollView>
    );
}