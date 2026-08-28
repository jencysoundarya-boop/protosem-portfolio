class GlobalNavbar extends HTMLElement {
    connectedCallback() {
        const active = this.getAttribute('active-page') || '';
        
        // Reliably determine the relative prefix by checking how this script was loaded
        let prefix = '';
        const scripts = document.getElementsByTagName('script');
        for (let i = 0; i < scripts.length; i++) {
            const src = scripts[i].getAttribute('src');
            if (src && src.includes('components.js')) {
                if (src.startsWith('../')) prefix = '../';
                else if (src.startsWith('../../')) prefix = '../../';
                break;
            }
        }
        
        const path = window.location.pathname.toLowerCase();
        // If we're on the main page, just use hash links for smooth scrolling. 
        // If we're on another page (prefix is not empty, or it's resume.html), point back to index.html with the hash.
        const isRoot = prefix === '' && !path.includes('resume.html');
        const hashPrefix = isRoot ? '' : prefix + 'index.html';

        const navItems = [
            { id: 'HOME', name: 'HOME', link: hashPrefix + '#hero' },
            { id: 'ABOUT', name: 'ABOUT', link: hashPrefix + '#about' },
            { id: 'SKILLS', name: 'SKILLS', link: hashPrefix + '#skills' },
            { id: 'EXPERIENCE', name: 'EXPERIENCE', link: hashPrefix + '#experience' },
            { id: 'PROTOSEM', name: 'PROTOSEM', link: prefix + 'protosem/index.html' },
            { id: 'PROJECTS', name: 'PROJECTS', link: hashPrefix + '#projects' },
            { id: 'ACHIEVEMENTS', name: 'ACHIEVEMENTS', link: hashPrefix + '#achievements' },
            { id: 'CERTIFICATIONS', name: 'CERTIFICATIONS', link: hashPrefix + '#credentials' },
            { id: 'WORKSHOPS', name: 'WORKSHOPS', link: hashPrefix + '#workshops' },
            { id: 'EDUCATION', name: 'EDUCATION', link: hashPrefix + '#education' },
            { id: 'CONTACT', name: 'CONTACT', link: hashPrefix + '#contact' }
        ];

        let desktopLinks = '';
        let mobileLinks = '';
        
        navItems.forEach(item => {
            const isActive = active === item.id;
            // Original template used font-bold and a specific color for the active item (like ProtoSem being text-accent-cyan)
            // The user wanted a subtle active state: "underline, glow, indicator, typography change, accent line. Do not overdo."
            const activeDesktopClass = isActive ? 'text-accent-cyan font-bold border-b border-accent-cyan' : '';
            const activeMobileClass = isActive ? 'text-accent-cyan font-bold' : '';
            
            desktopLinks += `<a href="${item.link}" class="nav-link magnetic ${activeDesktopClass}" data-cursor-text="NAV">${item.name}</a>`;
            mobileLinks += `<a href="${item.link}" class="text-2xl font-bold hover:text-accent-pink transition-colors ${activeMobileClass}">${item.name}</a>`;
        });

        this.innerHTML = `
            <!-- Desktop Nav -->
            <nav class="nav-bar hidden lg:flex items-center gap-6 z-50">
                ${desktopLinks}
            </nav>
            
            <!-- Mobile Toggle -->
            <div class="lg:hidden fixed top-6 right-6 z-[60]">
                <button id="mobile-menu-btn" class="p-3 bg-[rgba(255,255,255,0.05)] backdrop-blur-md border border-white/10 rounded-xl text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                </button>
            </div>
            
            <!-- Mobile Menu -->
            <div id="mobile-menu" class="fixed inset-0 z-[55] bg-black/95 backdrop-blur-xl flex-col items-center justify-center space-y-8 opacity-0 pointer-events-none transition-opacity duration-300 flex">
                ${mobileLinks}
            </div>
        `;

        // Mobile menu logic
        const btn = this.querySelector('#mobile-menu-btn');
        const menu = this.querySelector('#mobile-menu');
        const links = this.querySelectorAll('#mobile-menu a');
        
        let isOpen = false;
        btn.addEventListener('click', () => {
            isOpen = !isOpen;
            if (isOpen) {
                menu.classList.remove('opacity-0', 'pointer-events-none');
                menu.classList.add('opacity-100', 'pointer-events-auto');
            } else {
                menu.classList.add('opacity-0', 'pointer-events-none');
                menu.classList.remove('opacity-100', 'pointer-events-auto');
            }
        });

        links.forEach(link => {
            link.addEventListener('click', () => {
                isOpen = false;
                menu.classList.add('opacity-0', 'pointer-events-none');
                menu.classList.remove('opacity-100', 'pointer-events-auto');
            });
        });

        // Inject Tech-HUD Metrics globally
        if (!document.getElementById('tech-hud-container')) {
            const hud = document.createElement('div');
            hud.id = 'tech-hud-container';
            hud.innerHTML = `
                <div class="tech-hud hud-tr">SYS.OPT: <span id="hud-opt">0x8F</span></div>
                <div class="tech-hud hud-bl">POS_X: <span id="hud-x">000</span><br>POS_Y: <span id="hud-y">000</span></div>
                <div class="tech-hud hud-br">ENG: ONLINE<br>LAT: 12ms</div>
            `;
            document.body.appendChild(hud);
        }
    }
}

class GlobalFooter extends HTMLElement {
    connectedCallback() {
        let prefix = '';
        const scripts = document.getElementsByTagName('script');
        for (let i = 0; i < scripts.length; i++) {
            const src = scripts[i].getAttribute('src');
            if (src && src.includes('components.js')) {
                if (src.startsWith('../')) prefix = '../';
                else if (src.startsWith('../../')) prefix = '../../';
                break;
            }
        }
        
        const path = window.location.pathname.toLowerCase();
        const isRoot = prefix === '' && !path.includes('resume.html');
        const hashPrefix = isRoot ? '' : prefix + 'index.html';

        this.innerHTML = `
            <footer id="contact" class="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 relative z-10 spatial-container overflow-hidden">
                <div class="parallax-layer absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(244,114,182,0.05),transparent_60%)]"
                    data-speed="-0.05" data-z="-200"></div>

                <div class="reveal-up relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center">
                    <h2 class="text-hero text-grad-cyber mb-8">
                        LET'S BUILD<br>
                        SOMETHING<br>
                        INTERESTING.
                    </h2>
                    <p class="text-xl text-muted italic mb-16 max-w-2xl mx-auto">"Have an idea, opportunity, project, or simply
                        want to connect? I'd love to hear from you."</p>

                    <div class="mb-16">
                        <h3 class="text-2xl font-bold mb-2">JENCY SOUNDARYA</h3>
                        <p class="text-meta text-accent-cyan">MCA Student · Innovation Engineer Trainee · UI/UX Enthusiast</p>
                    </div>

                    <div class="flex flex-wrap gap-6 justify-center mb-16">
                        <a href="mailto:jencysoundarya@gmail.com" class="magnetic-btn outline"
                            data-cursor-text="EMAIL">jencysoundarya@gmail.com</a>
                        <a href="tel:+919943930189" class="magnetic-btn outline" data-cursor-text="CALL">+91 9943930189</a>
                        <a href="https://linkedin.com/in/jency-soundarya-b3ba0b250/" target="_blank" class="magnetic-btn outline" data-cursor-text="LINKEDIN">LinkedIn</a>
                        <a href="https://github.com/jencysoundarya-boop" target="_blank" class="magnetic-btn outline" data-cursor-text="GITHUB">GitHub</a>
                        <a href="${prefix}resume.html" target="_blank" class="magnetic-btn outline text-accent-pink border-accent-pink/30 hover:border-accent-pink" data-cursor-text="RESUME">Resume</a>
                    </div>
                    
                    <!-- Unified Footer Links -->
                    <div class="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-bold text-muted mb-16">
                        <a href="${hashPrefix}#about" class="hover:text-white transition-colors">About</a>
                        <a href="${hashPrefix}#skills" class="hover:text-white transition-colors">Skills</a>
                        <a href="${hashPrefix}#experience" class="hover:text-white transition-colors">Experience</a>
                        <a href="${prefix}protosem/index.html" class="hover:text-white transition-colors">ProtoSem</a>
                        <a href="${hashPrefix}#projects" class="hover:text-white transition-colors">Projects</a>
                        <a href="${hashPrefix}#achievements" class="hover:text-white transition-colors">Achievements</a>
                        <a href="${hashPrefix}#credentials" class="hover:text-white transition-colors">Certifications</a>
                        <a href="${hashPrefix}#workshops" class="hover:text-white transition-colors">Workshops</a>
                        <a href="${hashPrefix}#education" class="hover:text-white transition-colors">Education</a>
                        <a href="${hashPrefix}#contact" class="hover:text-white transition-colors">Contact</a>
                    </div>

                    <p class="text-meta opacity-50">© 2026 JENCY SOUNDARYA G.</p>
                </div>
            </footer>
        `;
    }
}

class BreadCrumbs extends HTMLElement {
    connectedCallback() {
        const pathStr = this.getAttribute('path');
        if (!pathStr) return;
        
        const parts = pathStr.split(',');
        let html = '<div class="flex flex-wrap gap-2 text-xs font-bold tracking-widest text-muted mb-8 uppercase">';
        
        parts.forEach((part, index) => {
            if (index > 0) {
                html += '<span class="opacity-50">/</span>';
            }
            if (index === parts.length - 1) {
                html += `<span class="text-accent-cyan">${part.trim()}</span>`;
            } else {
                html += `<span>${part.trim()}</span>`;
            }
        });
        
        html += '</div>';
        this.innerHTML = html;
    }
}

customElements.define('global-navbar', GlobalNavbar);
customElements.define('global-footer', GlobalFooter);
customElements.define('bread-crumbs', BreadCrumbs);
