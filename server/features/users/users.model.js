import mongoose, { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Schéma utilisateur avec Mongoose
const UserSchema = new Schema({
  pseudo: {
    type: String,
    required: [true, "Veuillez fournir un nom"],
    minlength: 3,
    maxlength: 50,
  },
  discriminator: {
    type: String,
    required: true,
    default: function () {
      return Math.floor(1000 + Math.random() * 9000);
    },
  },
  email: {
    type: String,
    required: [true, "Veuillez fournir un email"],
    unique: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Veuillez fournir un email valide",
    ],
  },
  password: {
    type: String,
    required: [true, "Veuillez fournir un mot de passe"],
    minlength: 6,
  },
  bio: {
    type: String,
    maxlength: 500,
  },
  avatar: {
    type: String,
  },
  firstname: {
    type: String,
    maxlength: 50,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  address: {
    type: String,
    maxlength: 200,
  },
  phone: {
    type: String,
    match: [/^\d{10}$/, "Veuillez fournir un numéro de téléphone valide"],
  },
  // Champs pour la visibilité des informations
  isEmailPublic: {
    type: Boolean,
    default: false,
  },
  isBioPublic: {
    type: Boolean,
    default: false,
  },
  isFirstnamePublic: {
    type: Boolean,
    default: false,
  },
  isLastnamePublic: {
    type: Boolean,
    default: false,
  },
  isAddressPublic: {
    type: Boolean,
    default: false,
  },
  isPhonePublic: {
    type: Boolean,
    default: false,
  },
  isFriendsListPublic: {
    type: Boolean,
    default: false, // La liste d'amis est privée par défaut
  },
  friends: [
    {
      friendId: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      status: {
        type: String,
        default: "offline",
      },
    },
  ],
});

// Middleware de hachage du mot de passe avant la sauvegarde
UserSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Méthode pour comparer les mots de passe
UserSchema.methods.comparePasswords = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Méthode pour générer un token JWT
UserSchema.methods.createAccessToken = function () {
  return jwt.sign(
    { userId: this._id, pseudo: this.pseudo },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_LIFETIME }
  );
};

export default model("User", UserSchema);
