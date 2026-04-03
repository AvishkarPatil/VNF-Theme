document.addEventListener('DOMContentLoaded', () => {
    // 1. & 2. Header Scroll & Mobile Menu Toggle
    const header = document.querySelector('.site-header-pill');
    const menuToggle = document.querySelector('.menu-toggle');
    const navWrapper = document.querySelector('.pill-nav');

    window.addEventListener('scroll', () => {
        if (!header) return;
        if (window.scrollY > 80) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navWrapper.classList.toggle('open');
        });
    }

    // Close mobile menu when clicking outside of it
    document.addEventListener('click', (e) => {
        if (navWrapper && navWrapper.classList.contains('open')) {
            if (!navWrapper.contains(e.target) && !menuToggle.contains(e.target)) {
                navWrapper.classList.remove('open');
            }
        }
    });



    // 2.6 Footer Navigation Refactoring
    const footerNavCol = document.querySelector('.footer-col-nav');
    if (footerNavCol) {
        const firstNavList = footerNavCol.querySelector('.nav-col:first-child .nav');
        if (firstNavList) {
            let moreNode = null;
            let childrenNodes = [];
            let isCollecting = false;
            
            const listItems = Array.from(firstNavList.querySelectorAll('li'));
            listItems.forEach(li => {
                const text = li.textContent.trim();
                if (text === 'More') {
                    moreNode = li;
                    isCollecting = true;
                } else if (isCollecting && text.startsWith('-')) {
                    childrenNodes.push(li);
                } else {
                    isCollecting = false;
                }
            });
            
            if (moreNode && childrenNodes.length > 0) {
                // Remove the empty 'More' link from the footer
                moreNode.remove();
                
                // Create the new 'Explore' column
                const newCol = document.createElement('div');
                newCol.className = 'nav-col';
                newCol.innerHTML = '<h4 style="color: var(--color-white); font-size: 1.1rem; margin-bottom: 1.5rem; font-family: var(--font-heading);">Explore</h4><ul class="nav"></ul>';
                const newUl = newCol.querySelector('ul');
                
                // Populate the new column and strip the hyphens
                childrenNodes.forEach(node => {
                    const link = node.querySelector('a');
                    if (link) {
                        link.textContent = link.textContent.trim().substring(1).trim();
                    }
                    newUl.appendChild(node);
                });
                
                // Insert the new column exactly between 'About Us' and 'Get Involved'
                if (footerNavCol.children.length > 1) {
                    footerNavCol.insertBefore(newCol, footerNavCol.children[1]);
                } else {
                    footerNavCol.appendChild(newCol);
                }
            }
        }
    }

    // 3. Hero Slider
    const heroSlides = document.querySelectorAll('.hero-slide');
    const heroDots = document.querySelectorAll('.slide-indicators .slide-dot');
    const heroSlider = document.querySelector('.hero-slider');
    if (heroSlides.length > 0) {
        let currentSlide = 0;
        let slideInterval;
        let isHovered = false;
        
        const goToSlide = (index) => {
            heroSlides[currentSlide].classList.remove('active');
            if(heroDots[currentSlide]) heroDots[currentSlide].classList.remove('active');
            
            currentSlide = index;
            if(currentSlide < 0) currentSlide = heroSlides.length - 1;
            if(currentSlide >= heroSlides.length) currentSlide = 0;
            
            heroSlides[currentSlide].classList.add('active');
            if(heroDots[currentSlide]) heroDots[currentSlide].classList.add('active');
        };

        const nextSlide = () => { if (!isHovered) goToSlide(currentSlide + 1); };
        
        const startSlider = () => { slideInterval = setInterval(nextSlide, 5000); };
        const stopSlider = () => { clearInterval(slideInterval); };

        heroDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                goToSlide(index);
                stopSlider();
                startSlider();
            });
        });

        if (heroSlider) {
            heroSlider.addEventListener('mouseenter', () => { isHovered = true; });
            heroSlider.addEventListener('mouseleave', () => { isHovered = false; });
            
            let touchStartX = 0;
            let touchEndX = 0;
            heroSlider.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; }, {passive: true});
            heroSlider.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                if (touchStartX - touchEndX > 50) goToSlide(currentSlide + 1);
                if (touchEndX - touchStartX > 50) goToSlide(currentSlide - 1);
            }, {passive: true});
        }
        startSlider();
    }

    // 4. Reveal Animations
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { rootMargin: '0px 0px -50px 0px', threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    // 5. Counter Animation
    const counters = document.querySelectorAll('.counter[data-target]');
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = +counter.getAttribute('data-target');
                const duration = 2000;
                const startTime = performance.now();
                
                const updateCounter = (currentTime) => {
                    const elapsedTime = currentTime - startTime;
                    const progress = Math.min(elapsedTime / duration, 1);
                    const easeProgress = 1 - Math.pow(1 - progress, 4);
                    const currentVal = Math.floor(target * easeProgress);
                    
                    counter.innerText = currentVal + (counter.dataset.suffix || '+');
                    
                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.innerText = target + (counter.dataset.suffix || '+');
                    }
                };
                requestAnimationFrame(updateCounter);
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => counterObserver.observe(counter));

    // 6. Testimonials Slider
    const testCards = document.querySelectorAll('.testimonial-card');
    const testDots = document.querySelectorAll('.testimonial-dots .slide-dot');
    if (testCards.length > 0) {
        let currentTest = 0;
        let testInterval;
        
        const goToTest = (index) => {
            testCards[currentTest].classList.remove('active');
            if(testDots[currentTest]) testDots[currentTest].classList.remove('active');
            
            currentTest = index;
            if(currentTest < 0) currentTest = testCards.length - 1;
            if(currentTest >= testCards.length) currentTest = 0;
            
            testCards[currentTest].classList.add('active');
            if(testDots[currentTest]) testDots[currentTest].classList.add('active');
        };
        
        const nextTest = () => { goToTest(currentTest + 1); };
        
        testDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                goToTest(index);
                clearInterval(testInterval);
                testInterval = setInterval(nextTest, 6000);
            });
        });
        
        testInterval = setInterval(nextTest, 6000);
    }

    // 7. Smooth Anchor Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            const targetEl = document.querySelector(targetId);
            if(targetEl) {
                e.preventDefault();
                targetEl.scrollIntoView({ behavior: 'smooth' });
                if (navWrapper && navWrapper.classList.contains('open')) {
                    navWrapper.classList.remove('open');
                }
            }
        });
    });


    // 8. Accessibility Framework Logic
    const a11yToggle = document.getElementById('a11y-toggle-btn');
    const a11yPanel = document.getElementById('a11y-panel');
    const htmlElement = document.documentElement;

    if (a11yToggle && a11yPanel) {
        // Hydrate saved a11y preferences
        const savedA11yPrefs = JSON.parse(localStorage.getItem('vnf-a11y-prefs') || '{}');
        Object.keys(savedA11yPrefs).forEach(pref => {
            if (savedA11yPrefs[pref]) {
                htmlElement.classList.add(pref);
                const btn = a11yPanel.querySelector(`[data-action="${pref}"]`);
                if(btn) btn.classList.add('active');
            }
        });

        // Toggle panel state
        a11yToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = a11yPanel.hidden;
            a11yPanel.hidden = !isOpen;
            a11yToggle.setAttribute('aria-expanded', isOpen);
        });

        // Handle panel closure events (Outside Click & Close Button)
        const closeBtn = document.querySelector('.a11y-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                a11yPanel.hidden = true;
                a11yToggle.setAttribute('aria-expanded', 'false');
            });
        }
        document.addEventListener('click', (e) => {
            if (!a11yPanel.hidden && !a11yPanel.contains(e.target) && !a11yToggle.contains(e.target)) {
                a11yPanel.hidden = true;
                a11yToggle.setAttribute('aria-expanded', 'false');
            }
        });

        // Font Scaling Logic
        let currentFontScale = parseInt(localStorage.getItem('vnf-a11y-font-scale')) || 0;
        const fontIndicator = document.getElementById('a11y-font-indicator');
        
        const updateFontScale = (scale) => {
            currentFontScale = scale;
            if (currentFontScale < -2) currentFontScale = -2;
            if (currentFontScale > 4) currentFontScale = 4; // allow 3-4 times larger as requested
            
            // Step size is roughly 12% per click
            htmlElement.style.fontSize = currentFontScale === 0 ? '' : `calc(100% + ${currentFontScale * 12}%)`;
            if (fontIndicator) {
                fontIndicator.textContent = `${100 + (currentFontScale * 12)}%`;
            }
            localStorage.setItem('vnf-a11y-font-scale', currentFontScale);
        };
        
        // Hydrate initial Font Scale
        if (currentFontScale !== 0) updateFontScale(currentFontScale);

        document.querySelectorAll('.a11y-font-scale-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (btn.classList.contains('a11y-decrease')) updateFontScale(currentFontScale - 1);
                else if (btn.classList.contains('a11y-increase')) updateFontScale(currentFontScale + 1);
            });
        });

        // Bind interactive options
        document.querySelectorAll('.a11y-option').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = btn.dataset.action;
                
                if (action === 'reset') {
                    // Flash HTML classes
                    ['high-contrast','grayscale','dyslexia-font','highlight-links','reduce-motion','read-aloud'].forEach(c => {
                        htmlElement.classList.remove(c);
                    });
                    document.querySelectorAll('.a11y-option').forEach(b => b.classList.remove('active'));
                    localStorage.setItem('vnf-a11y-prefs', '{}');
                    updateFontScale(0); // Also reset font scale
                    return;
                }
                
                const isActive = htmlElement.classList.toggle(action);
                btn.classList.toggle('active', isActive);
                
                const prefs = JSON.parse(localStorage.getItem('vnf-a11y-prefs') || '{}');
                prefs[action] = isActive;
                localStorage.setItem('vnf-a11y-prefs', JSON.stringify(prefs));
            });
        });

        // --- Read Aloud Core Engine ---
        const synth = window.speechSynthesis;
        let readingNode = null;

        document.addEventListener('click', (e) => {
            if (!htmlElement.classList.contains('read-aloud')) return;
            if (e.target.closest('.a11y-widget')) return;

            const target = e.target.closest('p, h1, h2, h3, h4, h5, h6, li, blockquote');
            if (target) {
                e.preventDefault();
                e.stopPropagation();

                // Stop playing if clicking the exact node actively being read
                if (readingNode === target && synth.speaking) {
                    synth.cancel();
                    target.classList.remove('a11y-reading-active');
                    readingNode = null;
                    return;
                }

                // Hard stop any prior reading queue
                synth.cancel();
                if (readingNode) readingNode.classList.remove('a11y-reading-active');

                const text = target.textContent || target.innerText;
                if (!text.trim()) return;

                const utterance = new SpeechSynthesisUtterance(text);
                
                // Map our saved language code to correct BCP-47 TTS locale
                const langMap = {
                    'en': 'en-IN',
                    'kn': 'kn-IN',
                    'hi': 'hi-IN',
                    'te': 'te-IN',
                    'ta': 'ta-IN',
                    'mr': 'mr-IN',
                    'ml': 'ml-IN',
                    'gu': 'gu-IN'
                };
                const activeLang = localStorage.getItem('vnf-preferred-lang') || 'en';
                const ttsLang = langMap[activeLang] || 'en-IN';
                utterance.lang = ttsLang;

                // Try to find a matching voice installed in the user's browser
                const voices = synth.getVoices();
                const matchedVoice = voices.find(v =>
                    v.lang === ttsLang ||
                    v.lang.startsWith(activeLang)
                );
                if (matchedVoice) {
                    utterance.voice = matchedVoice;
                }
                
                utterance.rate = 0.95;

                utterance.onend = () => {
                    target.classList.remove('a11y-reading-active');
                    if (readingNode === target) readingNode = null;
                };

                target.classList.add('a11y-reading-active');
                readingNode = target;
                synth.speak(utterance);
            }
        });

        // Bind reset hooks for audio engine
        const resetBtn = document.querySelector('.a11y-option.reset-btn');
        if(resetBtn) {
            resetBtn.addEventListener('click', () => {
                if (synth) synth.cancel();
                if (readingNode) {
                    readingNode.classList.remove('a11y-reading-active');
                    readingNode = null;
                }
            });
        }

        // A11y specific escape key binding
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && !a11yPanel.hidden) {
                a11yPanel.hidden = true;
                a11yToggle.setAttribute('aria-expanded', 'false');
                a11yToggle.focus();
            }
        });
    }
});

// --- Google Translate Core UI Engine ---
window.translateTo = function(langCode) {
    if (!langCode) return;
    
    // Save language preference persistently
    localStorage.setItem('vnf-preferred-lang', langCode);

    // Completely bypass fragile DOM DOM events and forcefully write the native translation cookie
    if (langCode === 'en') {
        // Purge translation cookies to natively restore the base language
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        if (window.location.hostname !== 'localhost') {
            document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
        }
    } else {
        // Enforce translation route via target language cookie
        document.cookie = `googtrans=/en/${langCode}; path=/;`;
        if (window.location.hostname !== 'localhost') {
            document.cookie = `googtrans=/en/${langCode}; path=/; domain=${window.location.hostname};`;
        }
    }

    // Force a single, intentional UI reload. 
    // Google's injected element.js will natively detect our forced cookie and instantly translate.
    window.location.reload();
};

// Hydrate saved language preference organically post-load
window.addEventListener('load', () => {
    const savedLang = localStorage.getItem('vnf-preferred-lang');
    
    // Sync dropdown state visibly to match current active translation
    const a11yDropdown = document.getElementById('a11y-lang-dropdown');
    if (a11yDropdown && savedLang) {
        a11yDropdown.value = savedLang;
    }
    
    // Notice: We completely remove the setTimeout -> translateTo() function call here.
    // By enforcing cookie states inside translateTo(), Google natively reads them instantly on load,
    // which fundamentally eradicates any possibility of an infinite reload loop.
});
