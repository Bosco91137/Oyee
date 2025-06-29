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
        
        // Start audio on first interaction (mobile requires user gesture)
        const initAudioPlay = () => {
            if (isPlaying) return;
            
            const playPromise = backgroundAudio.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    isPlaying = true;
                    audioToggle.innerHTML = '<i class="fas fa-pause"></i>';
                }).catch(error => {
                    console.log('Audio playback prevented:', error);
                    // Show play button if autoplay was prevented
                    audioToggle.innerHTML = '<i class="fas fa-play"></i>';
                });
            }
        };
        
        // Add click event to document for audio initialization
        document.addEventListener('click', initAudioPlay, { once: true });
        
        // Also add to audio toggle button
        audioToggle.addEventListener('click', initAudioPlay, { once: true });
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
        
        // Close menu when clicking on a link
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
            // Close mobile menu if open
            if (navLinks.classList.contains('active')) {
                closeMenu();
            }
            
            // Handle anchor links
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
        
        // On mobile, show all immediately with small delay for better UX
        if (isMobile) {
            elements.forEach((el, index) => {
                setTimeout(() => {
                    el.classList.add('visible');
                }, index * 50);
            });
            return;
        }
        
        // On desktop, animate with delay
        elements.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('visible');
            }, index * 100);
        });
    }

    // Initialize sections based on device
    function initSections() {
        if (isMobile) {
            // Show all sections with small delay on mobile
            sections.forEach(section => {
                setTimeout(() => {
                    animateSection(section);
                }, 100);
            });
        } else {
            // Use IntersectionObserver for desktop
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -100px 0px'
            };
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateSection(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, observerOptions);
            
            sections.forEach(section => {
                observer.observe(section);
                
                // Animate sections already in view
                const rect = section.getBoundingClientRect();
                if (rect.top < window.innerHeight * 0.75) {
                    animateSection(section);
                    observer.unobserve(section);
                }
            });
        }
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
            
            // Here you would normally send the form data
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
    handleScroll(); // Initialize on load

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
        // Close menu if open when resizing to desktop
        if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
            closeMenu();
        }
    }
    
    window.addEventListener('resize', handleResize);

    // Initialize everything
    initAudio();
    initSections();
    
    // Add loaded class to body when everything is ready
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});
