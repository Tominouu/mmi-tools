// Données des tutoriels
const tutoriels = [
    {
        titre: 'Générateur de Qr Code à durée illimité',
        description: 'Générez des codes QR personnalisés avec des liens',
        categorie: 'web',
        lien: 'https://qrmmi.netlify.app',
    },
    {
        titre: "Convertisseur/Compresseur d'image en format webp",
        description: 'Convertissez des images en format webp pour une compression optimale',
        categorie: 'web',
        lien: 'https://mmi-webp.netlify.app',
    },
    {
        titre: 'Bientôt disponible',
        description: 'Bientôt disponible',
        categorie: 'web'
    }
];

// Données des outils
const outils = [
    {
        nom: 'Visual Studio Code',
        description: 'Éditeur de code polyvalent et puissant',
        lien: 'https://code.visualstudio.com/'
    },
    {
        nom: 'Figma',
        description: 'Outil de design d\'interface et de prototypage',
        lien: 'https://www.figma.com/'
    },
    {
        nom: 'GitHub',
        description: 'Plateforme de gestion de versions et de collaboration',
        lien: 'https://github.com/'
    }
];

// Fonction pour charger les tutoriels
function chargerTutoriels() {
    const container = document.querySelector('#tutoriels .grid');
    tutoriels.forEach(tuto => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <h3>${tuto.titre}</h3>
            <p>${tuto.description}</p>
            <a href="${tuto.lien}" target="_blank" rel="noopener noreferrer">En savoir plus</a>
        `;
        container.appendChild(card);
    });
}

// Fonction pour charger les outils
function chargerOutils() {
    const container = document.querySelector('#outils .grid');
    outils.forEach(outil => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <h3>${outil.nom}</h3>
            <p>${outil.description}</p>
            <a href="${outil.lien}" target="_blank" rel="noopener noreferrer">En savoir plus</a>
        `;
        container.appendChild(card);
    });
}

// Animation du header au scroll
function gererScroll() {
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    });
}

// Animation des cartes au scroll
function animerCartes() {
    const cards = document.querySelectorAll('.card');
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        },
        { threshold: 0.1 }
    );

    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.5s ease-out';
        observer.observe(card);
    });
}

// Gestion du menu mobile
function gererMenuMobile() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const liens = document.querySelectorAll('.nav-links a');

    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    liens.forEach(lien => {
        lien.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    chargerTutoriels();
    chargerOutils();
    gererScroll();
    animerCartes();
    gererMenuMobile();
});