const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    nama: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    divisi: { type: String, required: true },
    jabatan: { type: String, required: true },
    keaktifan: { type: Boolean, default: 1 },
    foto: { type: Boolean, default: null },
    token: { type: String },
});

module.exports = mongoose.model("user", userSchema);