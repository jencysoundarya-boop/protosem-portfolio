/**
 * ANTIGRAVITY - SPATIAL PHYSICS ENGINE v4 (EXTREME INTEREST)
 * Sophisticated, high-performance motion design
 */

class SpatialEngine {
    constructor() {
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
        } else {
            console.warn("GSAP or ScrollTrigger missing.");
            return;
        }

        this.isTouch = matchMedia('(hover: none)').matches;
        this.prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

        this.initLoader();

        if (!this.isTouch && !this.prefersReducedMotion) {
            this.initCursorAndHUD();
            this.initMagnetic();
            this.init3DTilt();
            this.initParallax();
        }

        this.initAchievementFilters();

        if (!this.prefersReducedMotion) {
            this.initScrollReveals();
        }
    }

    initLoader() {
        const loader = document.getElementById('cinematic-loader');
        
        document.querySelectorAll('.split-text').forEach(el => {
            const text = el.innerText;
            el.innerHTML = '';
            el.style.opacity = '1';
            [...text].forEach(char => {
                const span = document.createElement('span');
                span.innerText = char === ' ' ? '\u00A0' : char;
                span.style.display = 'inline-block';
                span.style.willChange = 'transform, opacity';
                el.appendChild(span);
            });
        });

        if (loader) {
            const tl = gsap.timeline();
            gsap.set('.split-text span', { y: 100, opacity: 0, rotateX: -90 });
            gsap.set(loader, { opacity: 1 });

            tl.to(loader, { opacity: 0, duration: 1, delay: 0.5, ease: "power2.inOut" })
              .set(loader, { display: "none" });

            tl.to('.split-text span', {
                y: 0,
                opacity: 1,
                rotateX: 0,
                duration: 1.2,
                stagger: 0.03,
                ease: "expo.out",
                force3D: true
            }, "-=0.5");

            tl.fromTo('.hero-sub', 
                { y: 30, opacity: 0 }, 
                { y: 0, opacity: 1, duration: 1, ease: "power3.out" }, 
                "-=0.8"
            );

        } else {
            gsap.fromTo('.split-text span', 
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, stagger: 0.02, ease: "power3.out" }
            );
        }
    }

    initCursorAndHUD() {
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        document.body.appendChild(cursor);

        const xTo = gsap.quickTo(cursor, "x", {duration: 0.4, ease: "power3"});
        const yTo = gsap.quickTo(cursor, "y", {duration: 0.4, ease: "power3"});
        
        const hudX = document.getElementById('hud-x');
        const hudY = document.getElementById('hud-y');
        const hudOpt = document.getElementById('hud-opt');

        let lastTime = 0;
        
        window.addEventListener('mousemove', (e) => {
            xTo(e.clientX);
            yTo(e.clientY);
            
            // Update HUD
            if (hudX && hudY) {
                hudX.innerText = String(e.clientX).padStart(4, '0');
                hudY.innerText = String(e.clientY).padStart(4, '0');
            }
            
            // Create Liquid Mouse Particle
            const now = Date.now();
            if (now - lastTime > 30) { // Throttle particle creation
                this.spawnLiquidParticle(e.clientX, e.clientY);
                lastTime = now;
            }
        });

        // Randomly update HEX in HUD to look alive
        setInterval(() => {
            if (hudOpt) {
                hudOpt.innerText = '0x' + Math.floor(Math.random()*16777215).toString(16).toUpperCase().padStart(6, '0');
            }
        }, 2000);

        const interactables = document.querySelectorAll('a, button, .magnetic-btn, .editorial-glass');
        interactables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                const actionText = el.getAttribute('data-cursor-text');
                if (actionText) {
                    cursor.classList.add('action');
                    cursor.innerText = actionText;
                } else {
                    cursor.classList.add('hover');
                }
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover', 'action');
                cursor.innerText = '';
            });
        });
    }

    spawnLiquidParticle(x, y) {
        const particle = document.createElement('div');
        particle.className = 'mouse-particle';
        document.body.appendChild(particle);
        
        // Random drift
        const targetX = x + (Math.random() - 0.5) * 40;
        const targetY = y + (Math.random() - 0.5) * 40 + 20; // gravity

        gsap.fromTo(particle, 
            { x: x, y: y, scale: 1, opacity: 0.8 },
            { 
                x: targetX, y: targetY, scale: 0, opacity: 0, 
                duration: 0.8 + Math.random() * 0.5, 
                ease: "power2.out",
                onComplete: () => particle.remove() 
            }
        );
    }

    initMagnetic() {
        const magneticElements = document.querySelectorAll('.magnetic, .magnetic-btn');
        
        magneticElements.forEach(el => {
            const xTo = gsap.quickTo(el, "x", {duration: 1, ease: "elastic.out(1, 0.3)"});
            const yTo = gsap.quickTo(el, "y", {duration: 1, ease: "elastic.out(1, 0.3)"});
            
            el.addEventListener("mousemove", (e) => {
                const rect = el.getBoundingClientRect();
                const relX = e.clientX - rect.left - (rect.width / 2);
                const relY = e.clientY - rect.top - (rect.height / 2);
                
                xTo(relX * 0.4);
                yTo(relY * 0.4);
            });
            
            el.addEventListener("mouseleave", () => {
                xTo(0);
                yTo(0);
            });
        });
    }

    init3DTilt() {
        const tiltCards = document.querySelectorAll('.tilt-card, .editorial-glass, .project-card');
        
        tiltCards.forEach(card => {
            gsap.set(card, { transformPerspective: 1000, transformStyle: "preserve-3d" });
            
            // Inject holographic glare element if it's editorial glass
            let glare = null;
            if (card.classList.contains('editorial-glass')) {
                card.style.position = 'relative';
                card.style.overflow = 'hidden';
                glare = document.createElement('div');
                glare.className = 'holo-glare';
                card.appendChild(glare);
            }
            
            const innerElements = card.querySelectorAll('h3, img, span, p');
            
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
                const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
                
                gsap.to(card, {
                    rotationX: -y * 8,
                    rotationY: x * 8,
                    duration: 0.5,
                    ease: "power2.out"
                });
                
                if (glare) {
                    const bgX = (e.clientX - rect.left) / rect.width * 100;
                    const bgY = (e.clientY - rect.top) / rect.height * 100;
                    glare.style.backgroundPosition = `${bgX}% ${bgY}%`;
                }

                if(innerElements.length) {
                    gsap.to(innerElements, {
                        x: x * 10,
                        y: y * 10,
                        translateZ: 30,
                        duration: 0.5,
                        ease: "power2.out",
                        stagger: 0.02
                    });
                }
            });
            
            card.addEventListener('mouseleave', () => {
                gsap.to(card, { rotationX: 0, rotationY: 0, duration: 0.7, ease: "power3.out" });
                if (glare) {
                    glare.style.backgroundPosition = '100% 100%';
                }
                if(innerElements.length) {
                    gsap.to(innerElements, { x: 0, y: 0, translateZ: 0, duration: 0.7, ease: "power3.out" });
                }
            });
        });
    }

    initParallax() {
        const layers = document.querySelectorAll('.parallax-layer');
        window.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth) - 0.5;
            const y = (e.clientY / window.innerHeight) - 0.5;
            
            layers.forEach(layer => {
                const speed = parseFloat(layer.getAttribute('data-speed') || 0.1);
                gsap.to(layer, {
                    x: x * speed * 200,
                    y: y * speed * 200,
                    rotationY: x * speed * 10,
                    rotationX: -y * speed * 10,
                    duration: 1,
                    ease: "power2.out"
                });
            });
        });
    }

    initScrollReveals() {
        gsap.utils.toArray('.reveal-up').forEach(elem => {
            gsap.fromTo(elem, 
                { y: 100, autoAlpha: 0 },
                {
                    y: 0, autoAlpha: 1,
                    duration: 1.2,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: elem,
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });

        gsap.utils.toArray('.timeline-line').forEach(line => {
            gsap.fromTo(line,
                { height: 0 },
                {
                    height: '100%',
                    ease: "none",
                    scrollTrigger: {
                        trigger: line.parentElement,
                        start: "top 50%",
                        end: "bottom 50%",
                        scrub: true
                    }
                }
            );
        });
    }

    initAchievementFilters() {
        const filterBtns = document.querySelectorAll('#achievement-filters .filter-btn');
        const items = document.querySelectorAll('.timeline-item');
        
        if(!filterBtns.length) return;

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active state styling
                filterBtns.forEach(b => {
                    b.classList.remove('active', 'border-accent-cyan', 'text-accent-cyan', 'bg-accent-cyan/10');
                    b.classList.add('border-white/10', 'text-muted', 'bg-[rgba(255,255,255,0.02)]');
                });
                btn.classList.remove('border-white/10', 'text-muted', 'bg-[rgba(255,255,255,0.02)]');
                btn.classList.add('active', 'border-accent-cyan', 'text-accent-cyan', 'bg-accent-cyan/10');

                const filter = btn.getAttribute('data-filter');

                items.forEach(item => {
                    const categories = item.getAttribute('data-category') || '';
                    if (filter === 'all' || categories.includes(filter)) {
                        gsap.to(item, { height: 'auto', autoAlpha: 1, duration: 0.4, ease: "power2.out", display: 'block', margin: '16px 0' });
                    } else {
                        gsap.to(item, { height: 0, autoAlpha: 0, duration: 0.4, ease: "power2.in", display: 'none', margin: '0' });
                    }
                });
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    try {
        window.spatialEngine = new SpatialEngine();
    } catch (err) {
        const errDiv = document.createElement('div');
        errDiv.style.position = 'fixed';
        errDiv.style.top = '100px';
        errDiv.style.left = '0';
        errDiv.style.background = 'blue';
        errDiv.style.color = 'white';
        errDiv.style.zIndex = '999999';
        errDiv.style.padding = '20px';
        errDiv.style.fontSize = '16px';
        errDiv.style.whiteSpace = 'pre-wrap';
        errDiv.innerText = "Caught Error: " + err.message + "\n\n" + err.stack;
        document.body.appendChild(errDiv);
    }
});
