# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

1Mise à jour du profil (PUT /api/user/profile) :

Permet à l'utilisateur de mettre à jour son email, mot de passe, et bio. Par exemple : app.put('/api/user/profile', authMiddleware, async (req, res) => {
const { email, password, bio } = req.body;
try {
const user = await User.findById(req.user.id);
if (email) user.email = email;
if (password) user.password = await bcrypt.hash(password, 10);
if (bio) user.bio = bio;
await user.save();
res.json({ message: "Profil mis à jour avec succès" });
} catch (error) {
res.status(500).json({ message: "Erreur serveur" });
}
});
2 Suppression du compte (DELETE /api/user/profile) :

Permet à l'utilisateur de supprimer définitivement son compte. Par exemple :
app.delete('/api/user/profile', authMiddleware, async (req, res) => {
try {
await User.findByIdAndDelete(req.user.id);
res.json({ message: "Compte supprimé avec succès" });
} catch (error) {
res.status(500).json({ message: "Erreur serveur" });
}
});
