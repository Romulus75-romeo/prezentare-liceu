
// Mobile Menu Toggle
function initMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle) {
        // Remove existing listeners to avoid duplicates if any
        const newNavToggle = navToggle.cloneNode(true);
        navToggle.parentNode.replaceChild(newNavToggle, navToggle);

        newNavToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = newNavToggle.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Initialize mobile menu
    initMobileMenu();


    // Intercept clicks on internal links
    document.addEventListener('click', e => {
        const link = e.target.closest('a');
        if (!link) return;

        // Skip if external link or download or target blank or specific pages
        if (link.hostname !== window.location.hostname ||
            link.getAttribute('target') === '_blank' ||
            link.hasAttribute('download') ||
            link.getAttribute('href').startsWith('#') ||
            link.getAttribute('href').startsWith('mailto:') ||
            link.getAttribute('href').startsWith('tel:') ||
            link.getAttribute('href').includes('prezentare_grecia.html')) {
            return;
        }

        // Extract URL from the link
        const url = link.href;

        // Check for file protocol - bypass SPA to avoid CORS issues locally
        if (window.location.protocol === 'file:') {
            window.location.href = url;
            return;
        }

        e.preventDefault();

        try {
            // Push state for history
            history.pushState(null, '', url);
        } catch (err) {
            console.warn('pushState failed:', err);
            // Fallback to standard nav if pushState fails (though getting here means protocol wasn't file:)
            window.location.href = url;
            return;
        }

        loadPage(url);
    });


    // Handle back/forward navigation
    window.addEventListener('popstate', () => {
        loadPage(window.location.href);
    });

    function loadPage(url) {
        fetch(url)
            .then(response => response.text())
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');

                // Update title
                document.title = doc.title;

                // Identify audio elements to PRESERVE
                const currentAudio = document.getElementById('bg-music');
                const currentControls = document.getElementById('audio-controls');
                const currentAudioScript = document.querySelector('script[src*="audio.js"]');
                const currentNavScript = document.querySelector('script[src*="navigation.js"]');

                // Get new content body
                const newBody = doc.body;

                // Create a fragment for the new content
                const fragment = document.createDocumentFragment();

                // Append children from new body, SKIPPING duplicate audio elements if they exist in new page
                Array.from(newBody.children).forEach(child => {
                    // Check if this child is one of our preserved elements by ID or src
                    const isAudio = child.id === 'bg-music' || child.id === 'audio-controls';
                    const isScript = child.tagName === 'SCRIPT' && (
                        (child.src && child.src.includes('audio.js')) ||
                        (child.src && child.src.includes('navigation.js'))
                    );

                    if (!isAudio && !isScript) {
                        fragment.appendChild(child);
                    }
                });

                // Clear current body but keep preserved elements
                // Implementation detail: Move preserved elements to a safe place or re-append them?
                // Safest: Remove all children except preserved ones.

                const children = Array.from(document.body.children);
                children.forEach(child => {
                    if (child !== currentAudio &&
                        child !== currentControls &&
                        child !== currentAudioScript &&
                        child !== currentNavScript) {
                        child.remove();
                    }
                });

                // Insert new content at the beginning
                document.body.insertBefore(fragment, document.body.firstChild);

                // Re-execute scripts
                // Inline scripts in the new content need to be run manually
                const scripts = document.body.querySelectorAll('script');
                scripts.forEach(script => {
                    if (script === currentAudioScript || script === currentNavScript) return; // Skip our persistent scripts

                    const newScript = document.createElement('script');
                    if (script.src) {
                        newScript.src = script.src;
                    } else {
                        newScript.textContent = script.textContent;
                    }
                    // Replace old script with executable new one
                    script.parentNode.replaceChild(newScript, script);
                });

                // Dispatch event for other scripts to hook into
                window.dispatchEvent(new CustomEvent('page-changed'));

                // Scroll to top
                window.scrollTo(0, 0);

            })
            .catch(err => {
                console.error('Error loading page (likely CORS or file:// protocol), falling back to standard navigation:', err);
                window.location.href = url;
            });
    }
});

// --- SCROLL TO TOP FEATURE ---
document.addEventListener('DOMContentLoaded', () => {
    // Create button
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.title = 'Mergi sus';
    document.body.appendChild(scrollBtn);

    // CSS for button (injected here or could be in style.css)
    Object.assign(scrollBtn.style, {
        position: 'fixed',
        bottom: '80px', // Above audio controls
        right: '20px',
        width: '45px',
        height: '45px',
        borderRadius: '50%',
        backgroundColor: 'var(--primary-blue)',
        color: 'white',
        border: 'none',
        boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
        cursor: 'pointer',
        display: 'none', // Hidden by default
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.2rem',
        zIndex: '999', // Below audio controls (which are usually 9999)
        transition: 'opacity 0.3s, transform 0.3s'
    });

    // Show/Hide logic
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollBtn.style.display = 'flex';
        } else {
            scrollBtn.style.display = 'none';
        }
    });

    // Scroll logic
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});
// --- SCROLL ANIMATIONS ---
document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    // Elements to animate
    const elementsToAnimate = document.querySelectorAll('.card, .video-container, .hero h2, .hero p, .grid div, .responsive-3-col > div');
    elementsToAnimate.forEach(el => {
        el.classList.add('fade-in-section');
        observer.observe(el);
    });

    // Re-attach on page navigation (SPA) is handled by 'page-changed' event in navigation.js usually, 
    // but since we are inside navigation.js, we can hook into our own event.
    window.addEventListener('page-changed', () => {
        const newElements = document.querySelectorAll('.card, .video-container, .hero h2, .grid div, .responsive-3-col > div');
        newElements.forEach(el => {
            if (!el.classList.contains('fade-in-section')) {
                el.classList.add('fade-in-section');
                observer.observe(el);
            }
        });
    });
});
