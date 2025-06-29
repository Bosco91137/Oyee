document.addEventListener('DOMContentLoaded', function() {
    // Variables
    const audioToggle = document.getElementById('audioToggle');
    const backgroundAudio = document.getElementById('backgroundAudio');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const sections = document.querySelectorAll('.section');
    const navItems = document.querySelectorAll('.nav-links a');
    const songs = [
        'Damso -  60 Annees.mp3'
    ];
    let currentSongIndex = 0;
    let isPlaying = false;
    let audioInitialized = false;

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

    // Initialize audio properly with loading state
    function initAudio() {
        if (audioInitialized) return;
        
        backgroundAudio.src = songs[currentSongIndex];
        backgroundAudio.volume = 0.4;
        backgroundAudio.preload = 'auto';
        backgroundAudio.addEventListener('ended', playNextSong);
        
        // Wait for audio to be ready before allowing play
        backgroundAudio.addEventListener('canplaythrough', function() {
            audioInitialized = true;
            console.log('Audio is ready to play');
        });
        
        // Handle audio errors
        backgroundAudio.addEventListener('error', function() {
            console.error('Error loading audio:', backgroundAudio.error);
            audioToggle.style.display = 'none'; // Hide audio control if error
        });
    }

    // Play next song
    function playNextSong() {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
        backgroundAudio.src = songs[currentSongIndex];
        backgroundAudio.play().catch(error => console.log('Audio playback failed:', error));
    }

    // Toggle audio play/pause
    audioToggle.addEventListener('click', function() {
        if (!audioInitialized) {
            initAudio();
            // First play requires user interaction
            backgroundAudio.play()
                .then(() => {
                    isPlaying = true;
                    audioToggle.innerHTML = '<i class="fas fa-pause"></i>';
                })
                .catch(error => console.log('Audio playback failed:', error));
            return;
        }

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

    // Mobile menu toggle
    hamburger.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    });

    // Close mobile menu when a link is clicked
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });
    });

    // Observer for sections to change theme and animate
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // Lower threshold for better mobile detection
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                changeTheme(sectionId);
                animateSection(entry.target);
                
                // Update URL hash without scrolling
                if (history.pushState) {
                    history.pushState(null, null, '#' + sectionId);
                } else {
                    window.location.hash = '#' + sectionId;
                }
            }
        });
    }, observerOptions);

    // Observe all sections
    sections.forEach(section => {
        observer.observe(section);
        
        // Ensure sections are visible on mobile
        section.style.minHeight = '100vh';
        section.style.display = 'flex';
        section.style.flexDirection = 'column';
        section.style.justifyContent = 'center';
    });

    // Change theme based on visible section
    function changeTheme(sectionId) {
        const theme = sectionThemes[sectionId];
        if (!theme) return;

        document.documentElement.style.setProperty('--bg-color', theme.bg);
        document.documentElement.style.setProperty('--text-color', theme.text);
        document.documentElement.style.setProperty('--accent-color', theme.accent);
    }

    // Animate section elements when they become visible
    function animateSection(section) {
        const animateElements = section.querySelectorAll('.animate-text, .competence-card, .projet-card, .service-card, .skill-card, .title-card, .stat-card, .testimonial-card');
        
        animateElements.forEach((element, index) => {
            // Reset animation state for mobile
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    // Contact form submission
    const emailForm = document.getElementById('emailForm');
    if (emailForm) {
        emailForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            alert(`Merci ${name}, votre message a été envoyé! Je vous répondrai dès que possible.`);
            emailForm.reset();
        });
    }

    // Initialize on window load
    window.addEventListener('load', function() {
        // Initialize animations for the first visible section
        const accueilSection = document.getElementById('accueil');
        if (accueilSection) {
            animateSection(accueilSection);
        }
        
        // Initialize audio (but don't autoplay)
        initAudio();
        
        // Fix for mobile viewport height
        setViewportHeight();
        window.addEventListener('resize', setViewportHeight);
    });

    // Set proper viewport height for mobile
    function setViewportHeight() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        
        // Ensure sections take full viewport height
        sections.forEach(section => {
            section.style.minHeight = window.innerHeight + 'px';
        });
    }

    // Scroll animation for navbar
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;
        
        if (scrollPosition > 100) {
            document.querySelector('.navbar').classList.add('scrolled');
        } else {
            document.querySelector('.navbar').classList.remove('scrolled');
        }
    });
});
