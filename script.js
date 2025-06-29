document.addEventListener('DOMContentLoaded', function() {
    // Variables
    const audioToggle = document.getElementById('audioToggle');
    const backgroundAudio = document.getElementById('backgroundAudio');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const sections = document.querySelectorAll('.section');
    const navItems = document.querySelectorAll('.nav-links a');
    const songs = [
        'Damso - 60 Annees.mp3',
        // Add more songs if needed
    ];
    let currentSongIndex = 0;
    let isPlaying = false;

    // Initialize audio
    function initAudio() {
        if (songs.length > 0) {
            backgroundAudio.src = songs[currentSongIndex];
            backgroundAudio.volume = 0.4;
            backgroundAudio.addEventListener('ended', playNextSong);
            
            // Start audio on first user interaction
            document.addEventListener('click', function initAudioPlay() {
                if (!isPlaying) {
                    backgroundAudio.play()
                        .then(() => {
                            isPlaying = true;
                            audioToggle.innerHTML = '<i class="fas fa-pause"></i>';
                        })
                        .catch(error => console.log('Audio playback failed:', error));
                }
                document.removeEventListener('click', initAudioPlay);
            });
        }
    }

    // Play next song
    function playNextSong() {
        if (songs.length > 0) {
            currentSongIndex = (currentSongIndex + 1) % songs.length;
            backgroundAudio.src = songs[currentSongIndex];
            backgroundAudio.play();
        }
    }

    // Toggle audio play/pause
    audioToggle.addEventListener('click', function() {
        if (songs.length === 0) return;
        
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
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    });

    // Close mobile menu when clicking a link
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            if (navLinks.classList.contains('active')) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
            
            // Smooth scroll to section
            const targetId = this.getAttribute('href');
            if (targetId.startsWith('#')) {
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    window.scrollTo({
                        top: targetSection.offsetTop - 70, // Account for fixed header
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Intersection Observer for animations and theme changes
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2
    };

    const sectionObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const section = entry.target;
                animateSection(section);
                
                // Update URL hash without scrolling
                if (history.pushState) {
                    history.pushState(null, null, `#${section.id}`);
                }
            }
        });
    }, observerOptions);

    // Observe all sections
    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // Animate elements in a section when it becomes visible
    function animateSection(section) {
        const animateElements = section.querySelectorAll(
            '.animate-text, .competence-card, .projet-card, .service-card, ' +
            '.skill-card, .title-card, .stat-card, .testimonial-card'
        );
        
        animateElements.forEach((element, index) => {
            // Only animate if not already animated
            if (!element.classList.contains('animated')) {
                setTimeout(() => {
                    element.classList.add('visible', 'animated');
                }, index * 150); // Stagger animations
            }
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
            
            // Here you would add code to actually send the email
            // For now we'll just show a confirmation
            alert(`Thank you ${name}, your message has been sent! I'll respond as soon as possible.`);
            
            emailForm.reset();
        });
    }

    // Initialize animations on load for elements already in view
    function checkInitialAnimations() {
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.8) {
                animateSection(section);
            }
        });
    }

    // Navbar scroll effect
    function handleScroll() {
        const scrollPosition = window.scrollY;
        
        // Navbar background effect
        if (scrollPosition > 100) {
            document.querySelector('.navbar').classList.add('scrolled');
        } else {
            document.querySelector('.navbar').classList.remove('scrolled');
        }
    }

    // Initialize everything
    window.addEventListener('load', function() {
        initAudio();
        checkInitialAnimations();
    });

    window.addEventListener('scroll', handleScroll);

    // Handle page refresh with hash in URL
    window.addEventListener('load', function() {
        if (window.location.hash) {
            const targetSection = document.querySelector(window.location.hash);
            if (targetSection) {
                setTimeout(() => {
                    window.scrollTo({
                        top: targetSection.offsetTop - 70,
                        behavior: 'smooth'
                    });
                }, 100);
            }
        }
    });
});
