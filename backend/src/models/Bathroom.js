const mongoose = require("mongoose");

const bathroomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true 
    },
    description: { 
        type: String,
        default: ""
    },
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
    image: { 
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    totalStars: {
        type: Number,
        min: 0,
        default: 0
    },
    numberOfRatings: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true 
});

const Bathroom = mongoose.model("Bathroom", bathroomSchema);

module.exports = Bathroom;