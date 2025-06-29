document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const audioToggle = document.getElementById('audioToggle');
    const backgroundAudio = document.getElementById('backgroundAudio');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const sections = document.querySelectorAll('.section');
    const navItems = document.querySelectorAll('.nav-links a');
    const emailForm = document.getElementById('emailForm');
    const body = document.body;
    
    // Configuration
    const songs = [
        'Damso - 60 Annees.mp3'
    ];
    let currentSongIndex = 0;
    let isPlaying = false;
    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    // Section themes
    const sectionThemes = {
        'accueil': { bg: '#121212', text: '#ffffff', accent: '#4a6bff' },
        'professionnel': { bg: '#1a1a2e', text: '#e6f7ff', accent: '#4cc9f0' },
        'debrouillard': { bg: '#2d2424', text: '#f5e8c7', accent: '#b85c38' },
        'titres': { bg: '#16213e', text: '#e8f9fd', accent: '#0f4c75' },
        'apropos': { bg: '#1e1e1e', text: '#f8f1f1', accent: '#025464' },
        'temoignages': { bg: '#2c003e', text: '#f5e6ca', accent: '#fe346e' },
        'contact': { bg: '#0f3460', text: '#e8f9fd', accent: '#533483' }
    };

    // Animation timing
    const animationSettings = {
        fadeInDuration: 800,
        staggerDelay: 100,
        threshold: 0.2
    };

    // Initialize Audio with aggressive autoplay
    function initAudio() {
        if (songs.length === 0) return;
        
        // Create audio element with all necessary attributes
        backgroundAudio.src = songs[currentSongIndex];
        backgroundAudio.volume = 0.4;
        backgroundAudio.loop = true;
        backgroundAudio.preload = "auto";
        backgroundAudio.muted = false;
        
        // Create audio context
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            const audioContext = new AudioContext();
            
            if (audioContext.state === 'suspended') {
                audioContext.resume();
            }
            
            const source = audioContext.createMediaElementSource(backgroundAudio);
            source.connect(audioContext.destination);
        } catch (e) {
            console.log('Web Audio API not supported', e);
        }
        
        // Function to attempt playback
        const attemptPlayback = () => {
            const playPromise = backgroundAudio.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    isPlaying = true;
                    audioToggle.innerHTML = '<i class="fas fa-pause"></i>';
                }).catch(error => {
                    console.log('Playback prevented:', error);
                    const playOnInteraction = () => {
                        backgroundAudio.play().then(() => {
                            isPlaying = true;
                            audioToggle.innerHTML = '<i class="fas fa-pause"></i>';
                            document.removeEventListener('click', playOnInteraction);
                            document.removeEventListener('touchstart', playOnInteraction);
                            document.removeEventListener('keydown', playOnInteraction);
                        }).catch(err => {
                            console.log('Playback failed:', err);
                        });
                    };
                    
                    document.addEventListener('click', playOnInteraction, { once: true });
                    document.addEventListener('touchstart', playOnInteraction, { once: true });
                    document.addEventListener('keydown', playOnInteraction, { once: true });
                });
            }
        };
        
        // Try to play immediately
        attemptPlayback();
        backgroundAudio.addEventListener('canplaythrough', attemptPlayback);
        backgroundAudio.addEventListener('ended', playNextSong);
    }

    function playNextSong() {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
        backgroundAudio.src = songs[currentSongIndex];
        backgroundAudio.play();
    }

    // Audio Toggle
    audioToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        
        if (songs.length === 0) return;
        
        if (isPlaying) {
            backgroundAudio.pause();
            audioToggle.innerHTML = '<i class="fas fa-play"></i>';
        } else {
            backgroundAudio.play().then(() => {
                audioToggle.innerHTML = '<i class="fas fa-pause"></i>';
            }).catch(error => {
                console.log('Playback failed:', error);
            });
        }
        isPlaying = !isPlaying;
    });

    // Mobile Menu
    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
        
        if (navLinks.classList.contains('active')) {
            navLinks.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', closeMenu);
            });
        }
    });
    
    function closeMenu() {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.classList.remove('no-scroll');
    }

    // Navigation
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            if (navLinks.classList.contains('active')) {
                closeMenu();
            }
            
            const targetId = this.getAttribute('href');
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    const offset = isMobile ? 70 : 80;
                    const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - offset;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    if (history.pushState) {
                        history.pushState(null, null, targetId);
                    }
                }
            }
        });
    });

    // Theme transition animation
    function applyThemeTransition(newTheme) {
        body.style.transition = 'background-color 0.8s ease, color 0.8s ease';
        document.documentElement.style.setProperty('--bg-color', newTheme.bg);
        document.documentElement.style.setProperty('--text-color', newTheme.text);
        document.documentElement.style.setProperty('--accent-color', newTheme.accent);
        
        // Remove transition after animation completes
        setTimeout(() => {
            body.style.transition = 'none';
        }, 800);
    }

    // Progressive element animation
    function animateElements(section) {
        const animatableElements = section.querySelectorAll(
            '.animate-text, .competence-card, .projet-card, .service-card, ' +
            '.skill-card, .title-card, .stat-card, .testimonial-card'
        );
        
        animatableElements.forEach((el, index) => {
            // Skip if already animated
            if (el.classList.contains('animated')) return;
            
            // Set initial state
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = `opacity ${animationSettings.fadeInDuration}ms ease-out, transform ${animationSettings.fadeInDuration}ms ease-out`;
            el.style.transitionDelay = `${index * animationSettings.staggerDelay}ms`;
            
            // Trigger animation
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
                el.classList.add('animated');
            }, 50);
        });
    }

    // Section detection and handling
    function handleSectionChanges() {
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const sectionId = section.id;
            const theme = sectionThemes[sectionId];
            
            // Calculate visibility percentage
            const visibility = Math.min(
                1,
                Math.max(
                    0,
                    (Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0)
                ) / Math.min(rect.height, window.innerHeight)
            );
            
            // If section is significantly visible
            if (visibility > animationSettings.threshold) {
                // Apply theme if section is active
                if (theme) {
                    applyThemeTransition(theme);
                }
                
                // Animate elements
                animateElements(section);
            }
        });
    }

    // Initialize sections and scroll handler
    function initSections() {
        // Initial check
        handleSectionChanges();
        
        // Set up optimized scroll listener
        let ticking = false;
        window.addEventListener('scroll', function() {
            if (!ticking) {
                window.requestAnimationFrame(function() {
                    handleSectionChanges();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    // Contact Form
    if (emailForm) {
        emailForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();
            
            if (!name || !email || !subject || !message) {
                alert('Please fill in all fields');
                return;
            }
            
            alert(`Thank you ${name}! Your message has been sent. I'll respond soon.`);
            emailForm.reset();
        });
    }

    // Navbar Scroll Effect
    function handleScroll() {
        if (window.scrollY > 100) {
            document.querySelector('.navbar').classList.add('scrolled');
        } else {
            document.querySelector('.navbar').classList.remove('scrolled');
        }
    }
    
    window.addEventListener('scroll', handleScroll);
    handleScroll();

    // Handle page load with hash in URL
    function handleHashOnLoad() {
        if (window.location.hash) {
            const targetSection = document.querySelector(window.location.hash);
            if (targetSection) {
                setTimeout(() => {
                    const offset = isMobile ? 70 : 80;
                    const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - offset;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }, 100);
            }
        }
    }
    
    window.addEventListener('load', handleHashOnLoad);

    // Handle resize events
    function handleResize() {
        if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
            closeMenu();
        }
    }
    
    window.addEventListener('resize', handleResize);

    // Initialize everything
    initAudio();
    initSections();
    
    // Add loaded class to body
    setTimeout(() => {
        body.classList.add('loaded');
    }, 100);
});
