document.addEventListener('DOMContentLoaded', function() {
    // Variables
    const audioToggle = document.getElementById('audioToggle');
    const backgroundAudio = document.getElementById('backgroundAudio');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const sections = document.querySelectorAll('.section');
    const navItems = document.querySelectorAll('.nav-links a');
    const songs = [
        'Damso -  60 Annees.mp3',
      
        
    ];
    let currentSongIndex = 0;
    let isPlaying = false;

    // Thèmes pour chaque section
    const sectionThemes = {
        'accueil': { bg: '#121212', text: '#ffffff', accent: '#4a6bff' },
        'professionnel': { bg: '#1a1a2e', text: '#e6e6e6', accent: '#4ecca3' },
        'debrouillard': { bg: '#16213e', text: '#ffffff', accent: '#f9a828' },
        'titres': { bg: '#0f3460', text: '#ffffff', accent: '#e94560' },
        'apropos': { bg: '#1b262c', text: '#bbe1fa', accent: '#3282b8' },
        'temoignages': { bg: '#222831', text: '#eeeeee', accent: '#00adb5' },
        'contact': { bg: '#000000', text: '#ffffff', accent: '#f50057' }
    };

    // Initialiser l'audio
    function initAudio() {
        backgroundAudio.src = songs[currentSongIndex];
        backgroundAudio.volume = 0.4;
        backgroundAudio.addEventListener('ended', playNextSong);
        
        // Démarrer automatiquement (avec permission utilisateur)
        document.addEventListener('click', function() {
            if (!isPlaying) {
                backgroundAudio.play()
                    .then(() => {
                        isPlaying = true;
                        audioToggle.innerHTML = '<i class="fas fa-pause"></i>';
                    })
                    .catch(error => console.log('Audio playback failed:', error));
            }
        }, { once: true });
    }

    // Jouer la chanson suivante
    function playNextSong() {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
        backgroundAudio.src = songs[currentSongIndex];
        backgroundAudio.play();
    }

    // Basculer l'audio play/pause
    audioToggle.addEventListener('click', function() {
        if (isPlaying) {
            backgroundAudio.pause();
            audioToggle.innerHTML = '<i class="fas fa-play"></i>';
        } else {
            backgroundAudio.play()
                .then(() => {
                    audioToggle.innerHTML = '<i class="fas fa-pause"></i>';
                })
                .catch(error => console.log('Audio playback failed:', error));
        }
        isPlaying = !isPlaying;
    });

    // Menu hamburger
    hamburger.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Fermer le menu mobile lorsqu'un lien est cliqué
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    });

    // Observer les sections pour le changement de thème et l'animation
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.3
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                changeTheme(sectionId);
                animateSection(entry.target);
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    // Changer le thème en fonction de la section visible
    function changeTheme(sectionId) {
        const theme = sectionThemes[sectionId];
        if (!theme) return;

        document.documentElement.style.setProperty('--bg-color', theme.bg);
        document.documentElement.style.setProperty('--text-color', theme.text);
        document.documentElement.style.setProperty('--accent-color', theme.accent);
    }

    // Animer les éléments de la section lorsqu'elle devient visible
    function animateSection(section) {
        const animateElements = section.querySelectorAll('.animate-text, .competence-card, .projet-card, .service-card, .skill-card, .title-card, .stat-card, .testimonial-card');
        
        animateElements.forEach((element, index) => {
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    // Envoyer le formulaire de contact
    const emailForm = document.getElementById('emailForm');
    if (emailForm) {
        emailForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Ici, vous ajouteriez le code pour envoyer l'email
            // Pour l'exemple, nous allons simplement afficher une alerte
            alert(`Merci ${name}, votre message a été envoyé! Je vous répondrai dès que possible.`);
            
            emailForm.reset();
        });
    }

    // Initialiser les animations au chargement
    window.addEventListener('load', function() {
        const accueilSection = document.getElementById('accueil');
        if (accueilSection) {
            animateSection(accueilSection);
        }
        
        // Initialiser l'audio
        initAudio();
    });

    // Animation au défilement
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;
        
        // Animation de la navbar
        if (scrollPosition > 100) {
            document.querySelector('.navbar').classList.add('scrolled');
        } else {
            document.querySelector('.navbar').classList.remove('scrolled');
        }
    });
});