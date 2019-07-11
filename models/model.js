const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    
    _id: {type:Number, required:true},
    nom: { type: String, required: true},
    email: { type: String, required: true, unique: true }
},
{
    timestamps: true
}
);

module.exports = mongoose.model('personne', UserSchema);