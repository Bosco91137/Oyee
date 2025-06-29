document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const audioToggle = document.getElementById('audioToggle');
    const backgroundAudio = document.getElementById('backgroundAudio');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const sections = document.querySelectorAll('.section');
    const navItems = document.querySelectorAll('.nav-links a');
    const emailForm = document.getElementById('emailForm');
    
    // Configuration
    const songs = [
        'Damso - 60 Annees.mp3',
        'Damso - 60 Annees.mp3'
    ];
    let currentSongIndex = 0;
    let isPlaying = false;
    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    // Initialize Audio
    function initAudio() {
        if (songs.length === 0) return;
        
        backgroundAudio.src = songs[currentSongIndex];
        backgroundAudio.volume = 0.4;
        backgroundAudio.addEventListener('ended', playNextSong);
        
        // Start audio on first interaction
        document.addEventListener('click', function initAudioPlay() {
            backgroundAudio.play().then(() => {
                isPlaying = true;
                audioToggle.innerHTML = '<i class="fas fa-pause"></i>';
            }).catch(e => console.log('Audio playback prevented:', e));
            document.removeEventListener('click', initAudioPlay);
        }, { once: true });
    }

    function playNextSong() {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
        backgroundAudio.src = songs[currentSongIndex];
        backgroundAudio.play();
    }

    // Audio Toggle
    audioToggle.addEventListener('click', function() {
        if (songs.length === 0) return;
        
        if (isPlaying) {
            backgroundAudio.pause();
            audioToggle.innerHTML = '<i class="fas fa-play"></i>';
        } else {
            backgroundAudio.play().then(() => {
                audioToggle.innerHTML = '<i class="fas fa-pause"></i>';
            });
        }
        isPlaying = !isPlaying;
    });

    // Mobile Menu
    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    });

    // Navigation
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Close mobile menu if open
            if (navLinks.classList.contains('active')) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
            
            // Handle anchor links
            const targetId = this.getAttribute('href');
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    window.scrollTo({
                        top: targetSection.offsetTop - (isMobile ? 70 : 80),
                        behavior: 'smooth'
                    });
                    
                    // Update URL without page jump
                    if (history.pushState) {
                        history.pushState(null, null, targetId);
                    }
                }
            }
        });
    });

    // Section Animations
    function animateSection(section) {
        const elements = section.querySelectorAll(
            '.animate-text, .competence-card, .projet-card, .service-card, ' +
            '.skill-card, .title-card, .stat-card, .testimonial-card'
        );
        
        // On mobile, show all immediately
        if (isMobile) {
            elements.forEach(el => {
                el.classList.add('visible');
            });
            return;
        }
        
        // On desktop, animate with delay
        elements.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('visible');
            }, index * 150);
        });
    }

    // Initialize sections based on device
    function initSections() {
        if (isMobile) {
            // Show all sections immediately on mobile
            sections.forEach(section => {
                animateSection(section);
            });
        } else {
            // Use IntersectionObserver for desktop
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateSection(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            
            sections.forEach(section => {
                observer.observe(section);
                
                // Animate sections already in view
                const rect = section.getBoundingClientRect();
                if (rect.top < window.innerHeight * 0.8) {
                    animateSection(section);
                }
            });
        }
    }

    // Contact Form
    if (emailForm) {
        emailForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Here you would normally send the form data
            alert(`Thank you ${name}! Your message has been sent. I'll respond soon.`);
            emailForm.reset();
        });
    }

    // Navbar Scroll Effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            document.querySelector('.navbar').classList.add('scrolled');
        } else {
            document.querySelector('.navbar').classList.remove('scrolled');
        }
    });

    // Handle page load with hash in URL
    window.addEventListener('load', function() {
        if (window.location.hash) {
            const targetSection = document.querySelector(window.location.hash);
            if (targetSection) {
                setTimeout(() => {
                    window.scrollTo({
                        top: targetSection.offsetTop - (isMobile ? 70 : 80),
                        behavior: 'smooth'
                    });
                }, 100);
            }
        }
    });

    // Initialize everything
    initAudio();
    initSections();
});
