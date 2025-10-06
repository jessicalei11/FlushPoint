const mongoose = require("mongoose");

const bathroomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true 
    },
    latitude: {
        type: Number,
        require: true
    },
    longitude: {
        type: Number,
        require: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, {
    timestamps: true 
});

const Bathroom = mongoose.model("Bathroom", bathroomSchema);

module.exports = Bathroom;