
document.addEventListener('DOMContentLoaded', () => {
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
