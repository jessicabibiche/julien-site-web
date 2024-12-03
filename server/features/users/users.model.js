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
    default:
      "https://res.cloudinary.com/dfikgdrpn/image/upload/v1730706984/avatardefault_umnmgs.png",
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
  status: {
    type: String,
    enum: ["online", "offline"],
    default: "offline",
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
    default: false,
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
UserSchema.pre("save", async function (next) {
  // Ne hashez le mot de passe que s'il n'est pas déjà haché
  if (!this.isModified("password") || this.password.startsWith("$2b$")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePasswords = async function (candidatePassword) {
  console.log("Mot de passe candidat en clair :", candidatePassword);
  console.log("Mot de passe en base (haché) :", this.password);

  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  console.log("Résultat de la comparaison dans le modèle User :", isMatch);

  return isMatch;
};

// Méthode pour générer un token JWT
UserSchema.methods.createAccessToken = function () {
  return jwt.sign(
    { userId: this._id, pseudo: this.pseudo },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_LIFETIME } // Exemple : "15m" pour 15 minutes
  );
};

// Méthode pour générer un Refresh Token
UserSchema.methods.createRefreshToken = function () {
  return jwt.sign(
    { userId: this._id },
    process.env.JWT_REFRESH_SECRET, // Clé secrète différente pour le refresh token
    { expiresIn: "7d" } // Durée de vie plus longue que l'access token
  );
};

export default model("User", UserSchema);
