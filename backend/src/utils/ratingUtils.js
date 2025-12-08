const mongoose = require('mongoose'); 
const Review = require('../models/Review');   
const Bathroom = require('../models/Bathroom'); 

const updateBathroomRating = async (bathroomId, rating) => {
    if (!mongoose.Types.ObjectId.isValid(bathroomId)) {
        console.error("Invalid bathroomId provided to updateBathroomRating.");
        return;
    }

    try {
        await Bathroom.updateOne(
            { _id: bathroomId },
            {
                $inc: {
                    "totalStars": rating, 
                    "numberOfRatings": rating >= 0 ? 1 : -1 ,
                }
            }
        );

        console.log("successfully updated ratings for bathroom with id: " + bathroomId)
        
        // console.log(`Successfully added rating stats for bathroom ${bathroomId}.`);

    } catch (error) {
        console.error(`Error updating bathroom rating for ${bathroomId}:`, error);
    }
};

module.exports = { updateBathroomRating };