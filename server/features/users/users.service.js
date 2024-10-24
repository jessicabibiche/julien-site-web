import User from "./users.model.js";

// Crée un nouvel utilisateur dans la base de données
const createUser = (data) => {
  return User.create(data);
};

// Récupère un utilisateur par ses critères (par exemple, par email)
const getUser = (options) => {
  return User.findOne(options);
};

export { createUser, getUser };
