let Mongoose = require('mongoose');

const Transcription = Mongoose.model("transcription", {
    created_at: {
        type: Date,
        required: true
    },
    finished_at: {
        type: Date,
        required: true
    }
});

module.exports = Transcription;