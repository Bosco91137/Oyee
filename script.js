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

    // Initialize Audio with aggressive autoplay
    function initAudio() {
        if (songs.length === 0) return;
        
        // Create audio element with all necessary attributes
        backgroundAudio.src = songs[currentSongIndex];
        backgroundAudio.volume = 0.4;
        backgroundAudio.loop = true;
        backgroundAudio.preload = "auto";
        backgroundAudio.muted = false; // Ensure not muted
        
        // Create audio context (required for some browsers)
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
                    console.log('Playback started successfully');
                }).catch(error => {
                    console.log('Playback prevented:', error);
                    // If blocked, wait for user interaction
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
        
        // Also try when audio is ready
        backgroundAudio.addEventListener('canplaythrough', attemptPlayback);
        
        // Handle song ending
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

    // Section Animations and Theme Changes
    function handleSectionChanges() {
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const sectionId = section.id;
            const theme = sectionThemes[sectionId];
            
            // Check if section is in view
            if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
                // Apply theme if section is active
                if (theme) {
                    document.documentElement.style.setProperty('--bg-color', theme.bg);
                    document.documentElement.style.setProperty('--text-color', theme.text);
                    document.documentElement.style.setProperty('--accent-color', theme.accent);
                }
                
                // Animate elements
                const elements = section.querySelectorAll(
                    '.animate-text, .competence-card, .projet-card, .service-card, ' +
                    '.skill-card, .title-card, .stat-card, .testimonial-card'
                );
                
                elements.forEach((el, index) => {
                    setTimeout(() => {
                        el.classList.add('visible');
                    }, index * 100);
                });
            }
        });
    }

    // Initialize sections and scroll handler
    function initSections() {
        // Initial check
        handleSectionChanges();
        
        // Set up scroll listener
        let isScrolling;
        window.addEventListener('scroll', function() {
            // Clear the timeout if it's already set
            clearTimeout(isScrolling);
            
            // Set a timeout to run after scrolling stops
            isScrolling = setTimeout(function() {
                handleSectionChanges();
            }, 100);
        }, false);
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
