const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const protect = require('../middleware/auth'); 
const { updateBathroomRating } = require('../utils/ratingUtils'); 

// -----------------------------------------------------------
// ⭐ 1. STATIC ROUTE: Get all reviews submitted by the authenticated user (Profile Screen)
//    MUST BE PLACED FIRST.
// -----------------------------------------------------------
// Endpoint: GET /api/reviews/user-reviews
router.get('/user-reviews', protect, async (req, res) => {
    const userId = req.user._id;

    try {
        const reviews = await Review.find({ user: userId }) 
            .populate('bathroom', 'name') 
            .sort({ createdAt: -1 });

        res.status(200).json(reviews);
    } catch (error) {
        console.error("Error fetching user reviews:", error);
        res.status(500).json({ 
            message: 'Failed to retrieve user reviews', 
            error: error.message 
        });
    }
});

// -----------------------------------------------------------
// 2. DYNAMIC ROUTE: Get all reviews for a specific bathroom (Details Screen)
// -----------------------------------------------------------
// Endpoint: GET /api/reviews/:bathroomId
router.get('/:bathroomId', async (req, res) => {
    const { bathroomId } = req.params;

    try {
        const reviews = await Review.find({ bathroom: bathroomId })
            .populate('user', 'username profileImage') 
            .sort({ createdAt: -1 });

        res.status(200).json(reviews);
    } catch (error) {
        console.error("Error fetching reviews for bathroom:", error);
        res.status(500).json({ 
            message: 'Failed to retrieve reviews', 
            error: error.message 
        });
    }
});

// --- 3. POST: Create a new review ---
// Endpoint: POST /api/reviews
router.post('/', protect, async (req, res) => {
    const { bathroomId, rating, description } = req.body;
    const userId = req.user._id; 

    if (!bathroomId || !rating) {
        return res.status(400).json({ message: 'Bathroom ID and rating are required.' });
    }

    const numericRating = parseInt(rating); 
    if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
        return res.status(400).json({ message: 'Rating must be a valid number between 1 and 5.' });
    }

    try {
        const newReview = await Review.create({
            bathroom: bathroomId,
            user: userId,
            rating: numericRating,
            description,
        });

        updateBathroomRating(newReview.bathroom, numericRating);

        res.status(201).json(newReview);
    } catch (error) {
        if (error.code === 11000) { 
            return res.status(400).json({ message: 'You have already submitted a review for this bathroom.' });
        }
        console.error("Error submitting review:", error);
        res.status(500).json({ message: 'Error submitting review.', error: error.message });
    }
});

// --- 4. PUT/PATCH: Edit an existing review ---
// Endpoint: PUT /api/reviews/:reviewId
router.put('/:reviewId', protect, async (req, res) => {
    const { reviewId } = req.params;
    const { rating, description } = req.body;
    const userId = req.user._id;

    if (!rating) {
        return res.status(400).json({ message: 'Rating is required for updating.' });
    }
    
    const numericRating = parseInt(rating); 
    if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
        return res.status(400).json({ message: 'Rating must be a valid number between 1 and 5.' });
    }

    try {
        const review = await Review.findById(reviewId);

        if (!review) {
            return res.status(404).json({ message: 'Review not found.' });
        }
        if (review.user.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'Not authorized to edit this review.' });
        }

        review.rating = numericRating;
        console.log("review.rating: " + review.rating)
        review.description = description; 
        await review.save();

        console.log("performing updateBathroomRating(" + review.bathroom + "," + review.rating + ")");
        updateBathroomRating(review.bathroom, review.rating);

        res.status(200).json(review);

    } catch (error) {
        console.error("Error editing review:", error);
        res.status(500).json({ message: 'Failed to edit review.', error: error.message });
    }
});

// --- 5. DELETE: Delete a specific review ---
// Endpoint: DELETE /api/reviews/:reviewId
router.delete('/:reviewId', protect, async (req, res) => {

    const { reviewId } = req.params;
    const userId = req.user._id;

    try {
        const review = await Review.findById(reviewId);

        if (!review) {
            return res.status(404).json({ message: 'Review not found.' });
        }

        if (review.user.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this review.' });
        }
        
        const bathroomIdToUpdate = review.bathroom;

        await Review.deleteOne({ _id: reviewId });

        updateBathroomRating(bathroomIdToUpdate, -review.rating); 

        res.status(200).json({ message: 'Review successfully deleted.' });

    } catch (error) {
        console.error("Error deleting review:", error);
        res.status(500).json({ message: 'Failed to delete review.', error: error.message });
    }
});

module.exports = router;