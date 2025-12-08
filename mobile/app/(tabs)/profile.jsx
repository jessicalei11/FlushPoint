import { useEffect, useState, useCallback } from "react";
import {
    View,
    Alert,
    Text,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
    StyleSheet 
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { API_URL } from "../../constants/api";
import { useAuthStore } from "../../store/authStore";
import styles from "../../assets/styles/profile.styles"; 
import ProfileHeader from "../../components/ProfileHeader";
import LogoutButton from "../../components/LogoutButton";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/colors";
import { Image } from "expo-image";
import Loader from "../../components/Loader";

const RatingDisplay = ({ rating, numOfReviews }) => {
    const floorRating = Math.floor(rating);
    const hasHalfStar = rating - floorRating >= 0.5;

    const stars = Array(5).fill(null).map((_, i) => {
        let name = "star-outline";
        if (i < floorRating) {
            name = "star";
        } else if (i === floorRating && hasHalfStar) {
            name = "star-half-outline";
        }
        return <Ionicons key={i} name={name} size={14} color={COLORS.yellow} />;
    });
    
    const formattedRating = (rating > 0 && typeof rating === 'number') ? rating.toFixed(1) : '0.0';

    return (
        <View style={styles.ratingRow}>
            {stars}
            <Text style={styles.ratingText}>
                {formattedRating}/5.0 ({numOfReviews} reviews)
            </Text>
        </View>
    );
};

const UserReviewItem = ({ item, onDeleteReview }) => {
    const formattedDate = new Date(item.createdAt).toLocaleDateString();
    const ratingIcons = Array(5).fill(null).map((_, i) => (
        <Ionicons 
            key={i} 
            name={item.rating > i ? "star" : "star-outline"} 
            size={16} 
            color={COLORS.yellow} 
        />
    ));
    
    const confirmDelete = () => {
        Alert.alert(
            "Delete Review",
            "Are you sure you want to delete this review? This action cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: () => onDeleteReview(item._id) },
            ]
        );
    };

    return (
        <View style={styles.reviewItem}>
            
            <View style={styles.reviewItemHeader}>
                <Text style={styles.reviewLocationTitle}>{item.bathroom?.name || "Unknown Location"}</Text>
                
                <View style={styles.reviewActions}>
                    <TouchableOpacity onPress={confirmDelete}>
                        <Ionicons name="trash-outline" size={20} color={COLORS.error} />
                    </TouchableOpacity>
                </View>
            </View>
            
            <View style={styles.reviewStarRow}> 
                {ratingIcons}
            </View>

            <Text style={styles.reviewDescription} numberOfLines={2}>
                {item.description || "No comment provided."}
            </Text>
            <Text style={styles.reviewDate}>Reviewed on {formattedDate}</Text>
        </View>
    );
};

export default function Profile() {
    const [bathrooms, setBathrooms] = useState([]);
    const [reviews, setReviews] = useState([]); 
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [deleteLocationId, setDeleteLocationId] = useState(null); 

    const { token } = useAuthStore();
    const router = useRouter();

    const fetchData = async () => {
        try {
            if (!refreshing) setIsLoading(true); 

            if (!token) {
                setBathrooms([]);
                setReviews([]);
                return;
            }

            const locResponse = await fetch(`${API_URL}/bathrooms/user`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            let locData = await locResponse.json();
            
            if (!locResponse.ok) {
                Alert.alert("Error", locData?.message || `Failed to fetch locations.`);
                setBathrooms([]); 
                return;
            }
            setBathrooms(locData); 
            
            const reviewResponse = await fetch(`${API_URL}/reviews/user-reviews`, {
                headers: { Authorization: `Bearer ${token}` }, 
            });
            let reviewData = await reviewResponse.json();
            
            if (!reviewResponse.ok) {
                Alert.alert("Error", reviewData?.message || `Failed to fetch reviews.`);
                setReviews([]);
                return;
            }
            setReviews(reviewData);

        } catch (error) {
            console.error("Error fetching data:", error);
            Alert.alert("Error", error.message || "Failed to load profile data. Pull down to refresh.");
            setBathrooms([]);
            setReviews([]); 
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [token])
    );
    
    const handleDeleteReview = async (reviewId) => {
        try {
            const response = await fetch(`${API_URL}/reviews/${reviewId}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` },
            });

            const data = await response.json();

            if (!response.ok) {
                Alert.alert("Error", data.message || "Failed to delete review.");
                return;
            }

            Alert.alert("Success", "Review deleted successfully.");
            fetchData(); 
        } catch (error) {
            Alert.alert("Error", error.message || "Could not delete review.");
        }
    };

    const handleDeleteLocation = async (locationId) => {
        try {
            setDeleteLocationId(locationId);

            const response = await fetch(`${API_URL}/bathrooms/${locationId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await response.json();
            
            if (!response.ok) {
                Alert.alert("Error", data.message || "Failed to delete location");
                return;
            }

            setBathrooms(bathrooms.filter((location) => location._id !== locationId));
            Alert.alert("Success", "Location deleted successfully");
        } catch (error) {
            Alert.alert("Error", error.message || "Failed to delete location");
        } finally {
            setDeleteLocationId(null);
        }
    };

    const confirmDeleteLocation = (locationId) => {
        Alert.alert("Delete Location", "Are you sure you want to delete this bathroom location?", [
            { text: "Cancel", style: "cancel" },
            { text: "Delete", style: "destructive", onPress: () => handleDeleteLocation(locationId) },
        ]);
    };

    const renderLocationItem = ({ item }) => {
        const formattedDate = item.createdAt 
            ? new Date(item.createdAt).toLocaleDateString()
            : 'Date unavailable';

        const totalStars = item.totalStars || 0;
        const numOfReviews = item.numberOfRatings || 0;
        
        const averageRating = numOfReviews > 0 ? (totalStars / numOfReviews) : 0;

        return (
            <View style={styles.bookItem}>
                <Image source={item.image} style={styles.bookImage} /> 
                
                <View style={styles.bookInfo}>
                    <Text style={styles.bookTitle}>{item.name}</Text> 
                    
                    <RatingDisplay rating={averageRating} numOfReviews={numOfReviews} />
                    
                    <Text style={styles.bookCaption} numberOfLines={2}>
                        {item.description}
                    </Text>
                    
                    <Text style={styles.bookDate}>{formattedDate}</Text>
                    
                    <Text style={styles.bookDate}>
                        Lat: {item.latitude?.toFixed(4) || 'N/A'}, Lon: {item.longitude?.toFixed(4) || 'N/A'}
                    </Text>
                </View>

                <View style={styles.locationActions}>
                    <TouchableOpacity 
                        style={[styles.actionButton, styles.deleteOnlyButton]}
                        onPress={() => confirmDeleteLocation(item._id)}
                    >
                        {deleteLocationId === item._id ? ( 
                            <ActivityIndicator size="small" color={COLORS.primary} />
                        ) : (
                            <Ionicons name="trash-outline" size={20} color={COLORS.primary} />
                        )}
                    </TouchableOpacity>
                </View>

            </View>
        );
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchData();
    };

    if (isLoading && !refreshing) return <Loader />;

    return (
        <View style={styles.container}>
            <ProfileHeader />
            <LogoutButton />

            <View style={styles.booksHeader}>
                <Text style={styles.booksTitle}>Your Bathroom Locations</Text> 
                <Text style={styles.booksCount}>{bathrooms.length} locations</Text> 
            </View>

            <FlatList
                data={bathrooms} 
                renderItem={renderLocationItem} 
                keyExtractor={(item) => item._id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.booksList}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        colors={[COLORS.primary]}
                        tintColor={COLORS.primary}
                    />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="location-outline" size={50} color={COLORS.textSecondary} /> 
                        <Text style={styles.emptyText}>No locations created yet</Text>
                        <TouchableOpacity style={styles.addButton} onPress={() => router.push("/create")}>
                            <Text style={styles.addButtonText}>Add Your First Location</Text>
                        </TouchableOpacity>
                    </View>
                }
                
                ListFooterComponent={
                    <View style={styles.reviewsSectionContainer}>
                        <View style={styles.booksHeader}>
                            <Text style={styles.reviewsTitle}>Your Reviews</Text>
                            <Text style={styles.reviewsCount}>{reviews.length} reviews</Text>
                        </View>
                        
                        {reviews.length === 0 ? (
                            <View style={styles.emptyContainer}>
                                <Ionicons name="star-outline" size={50} color={COLORS.textSecondary} />
                                <Text style={styles.emptyReviewText}>You haven't rated any bathrooms yet.</Text>
                            </View>
                        ) : (
                            reviews.map((item) => (
                                <UserReviewItem 
                                    key={item._id} 
                                    item={item} 
                                    onDeleteReview={handleDeleteReview} 
                                />
                            ))
                        )}
                    </View>
                }
            />
        </View>
    );
}