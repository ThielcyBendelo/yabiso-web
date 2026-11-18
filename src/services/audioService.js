// Gestionnaire d'immersion sonore pour la plateforme
let audioMuted = false;

export const audioService = {
  isEnabled: () => {
    return !audioMuted;
  },

  toggle: () => {
    audioMuted = !audioMuted;
    return !audioMuted; // Renvoie le nouvel état (true = activé, false = coupé)
  },

  playClick: () => {
    if (audioMuted) return;
    try {
      // Sécurité : On utilise l'API Audio native du navigateur
      // Si vous avez un fichier click.mp3 dans public/audio/, remplacez l'URL
      const audio = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==');
      audio.volume = 0.2;
      audio.play().catch(() => console.log("Audio bloqué par le navigateur"));
    } catch (e) {
      console.log("Lecture audio indisponible");
    }
  },

  playNavigate: () => {
    if (audioMuted) return;
    try {
      // Effet sonore lors du changement de page
      const audio = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==');
      audio.volume = 0.15;
      audio.play().catch(() => console.log("Audio bloqué par le navigateur"));
    } catch (e) {
      console.log("Lecture audio indisponible");
    }
  }
};

export default audioService;
