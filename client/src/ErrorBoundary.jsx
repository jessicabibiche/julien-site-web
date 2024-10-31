import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  // Cette méthode est déclenchée quand une erreur est détectée dans un enfant du composant
  static getDerivedStateFromError(error) {
    // Met à jour l'état de sorte à afficher un écran de repli lors de la prochaine actualisation
    return { hasError: true };
  }

  // Utilisez cette méthode pour loguer les détails d'erreur
  componentDidCatch(error, errorInfo) {
    console.error("Erreur détectée par ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Affichez un message de repli personnalisé
      return (
        <h1>Quelque chose s'est mal passé. Veuillez réessayer plus tard.</h1>
      );
    }

    // Si aucune erreur n'est détectée, rend les enfants normalement
    return this.props.children;
  }
}

export default ErrorBoundary;
