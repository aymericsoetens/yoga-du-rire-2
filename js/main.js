
import {loadInstagramEmbeds, observeInstagramEmbeds, refreshInstagramEmbeds} from './modules/instagram.js';
import {initScrollReveal, initVideoAnimation, initCardHoverEffects} from './modules/animations.js';
import {initMobileMenu} from './modules/menu.js';

// Initialisation du menu hamburger
initMobileMenu();

// Initialisation des animations
initScrollReveal();
initVideoAnimation();
initCardHoverEffects();

// Gestion de la newsletter
const newsletterForm = document.getElementById('newsletterForm');
const formMessage = document.getElementById('formMessage');

if (newsletterForm) {
    newsletterForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(newsletterForm);
        const email = formData.get('email');
        const rgpd = formData.get('rgpd');
        
        // Validation basique
        if (!email || !rgpd) {
            showMessage('Veuillez remplir tous les champs', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showMessage('Veuillez entrer une adresse email valide', 'error');
            return;
        }
        
        // Afficher un message de chargement
        const submitBtn = newsletterForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Inscription...';
        submitBtn.disabled = true;
        
        try {
            // Envoi vers votre service de newsletter
            const response = await fetch('api/newsletter.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email })
            });
            
            const result = await response.json();
            
            if (result.success) {
                showMessage('Merci pour votre inscription ! 🎉', 'success');
                newsletterForm.reset();
            } else {
                showMessage('Une erreur est survenue. Veuillez réessayer.', 'error');
            }
        } catch (error) {
            showMessage('Erreur de connexion. Veuillez réessayer plus tard.', 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

function showMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
    
    setTimeout(() => {
        formMessage.textContent = '';
        formMessage.className = 'form-message';
    }, 5000);
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Chargement des vidéos Instagram
loadInstagramEmbeds();
observeInstagramEmbeds();

// Gestion de la soumission des formulaires (désactivation double envoi)
document.addEventListener('submit', (e) => {
    const form = e.target;
    if (form.id === 'contact-form') {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn && submitBtn.disabled) {
            e.preventDefault();
        }
    }
});