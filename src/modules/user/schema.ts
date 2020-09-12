import * as mongoose from 'mongoose';

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        default: null,
    },
    age: {
        type: Number,
        default: null,
    },
    gender: {
        type: String,
        default: null,
        enum: ['H', 'M', null]
    },
    hobby: {
        type: String,
        default: null,
    },
    user: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    password: {
        type: String,
        required: true,
    },
}, {
    timestamps: true
});

schema.pre('save', function () {
    if (!!this.get('password')) {
        const bcrypt = require('bcryptjs');
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(this.get('password'), salt);
        this.set('password', hash)
    } else {
        throw new Error("Contraseña es requerida");
    }
});

export default mongoose.model('Users', schema);