const fs = require('fs');

let indexHtml = fs.readFileSync('index.html', 'utf8');

function replaceSection(id, newContent) {
    const regex = new RegExp(`<!-- \\d+ ${id} -->(.*?)<!-- \\d+ `, 's');
    if (indexHtml.match(regex)) {
        indexHtml = indexHtml.replace(regex, `<!-- ${id} -->\n${newContent}\n\n    <!-- `);
    } else {
        const fallbackRegex = new RegExp(`<!-- \\d+ ${id} -->(.*?)</section>`, 's');
        indexHtml = indexHtml.replace(fallbackRegex, `<!-- ${id} -->\n${newContent}\n    </section>`);
    }
}

function removeSection(id) {
    const regex = new RegExp(`\\s*<!-- \\d+ ${id} -->(.*?)</section>`, 's');
    indexHtml = indexHtml.replace(regex, '');
}

const aboutContent = `    <section id="about" class="min-h-screen flex items-center py-32 px-4 md:px-12 relative z-10">
        <div class="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center">
            <div class="reveal-up">
                <p class="text-meta text-accent-cyan mb-4">01 — ABOUT ME</p>
                <h2 class="text-editorial mb-8 leading-tight">
                    CURIOUS BY NATURE.<br>
                    <span class="text-accent-pink">CREATIVE BY MINDSET.</span><br>
                    TECHNOLOGY-DRIVEN BY AMBITION.
                </h2>
            </div>
            <div class="editorial-glass reveal-up" style="transition-delay: 0.2s;">
                <p class="text-lg md:text-xl leading-relaxed mb-6">
                    Motivated MCA student with interests in User Experience Design, Artificial Intelligence and Software Development. Experienced in UI/UX design, user research, prototyping, and web technologies through academic projects and internship experience. Strong problem-solving and teamwork skills with a passion for building user-centered technology solutions.
                </p>
            </div>
        </div>
    </section>`;

const skillsContent = `    <section id="skills" class="py-32 px-4 relative spatial-container overflow-hidden bg-[rgba(255,255,255,0.01)] border-t border-white/5">
        <div class="max-w-7xl mx-auto text-center">
            <p class="text-meta text-accent-violet mb-4 reveal-up">02 — SKILLS & TOOLKIT</p>
            <h2 class="text-4xl font-bold mb-24 reveal-up">THE ARSENAL</h2>
            <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8 reveal-up">
                <div class="editorial-glass p-8 group hover:border-accent-cyan transition-colors" data-cursor-text="TECH">
                    <h3 class="text-2xl font-bold mb-6 text-accent-cyan">TECHNICAL</h3>
                    <ul class="space-y-4 text-muted text-sm font-bold tracking-wider uppercase">
                        <li>HTML</li><li>CSS</li><li>JavaScript</li><li>Python</li><li>Database Management</li><li>Frontend Development</li><li>IoT Fundamentals</li><li>Animation</li>
                    </ul>
                </div>
                <div class="editorial-glass p-8 group hover:border-accent-pink transition-colors" data-cursor-text="UI/UX">
                    <h3 class="text-2xl font-bold mb-6 text-accent-pink">UI/UX</h3>
                    <ul class="space-y-4 text-muted text-sm font-bold tracking-wider uppercase">
                        <li>User Research</li><li>Wireframing</li><li>Prototyping</li><li>User-Centered Design</li>
                    </ul>
                </div>
                <div class="editorial-glass p-8 group hover:border-accent-violet transition-colors" data-cursor-text="TOOLS">
                    <h3 class="text-2xl font-bold mb-6 text-accent-violet">TOOLS</h3>
                    <ul class="space-y-4 text-muted text-sm font-bold tracking-wider uppercase">
                        <li>Figma</li><li>Canva</li><li>Blender</li><li>Inkscape</li><li>Microsoft Office</li>
                    </ul>
                </div>
                <div class="editorial-glass p-8 group hover:border-frost transition-colors" data-cursor-text="SOFT">
                    <h3 class="text-2xl font-bold mb-6 text-frost">SOFT SKILLS</h3>
                    <ul class="space-y-4 text-muted text-sm font-bold tracking-wider uppercase">
                        <li>Leadership</li><li>Public Speaking</li><li>Team Management</li><li>Communication</li><li>Problem Solving</li><li>Collaboration</li><li>Adaptability</li>
                    </ul>
                </div>
            </div>
        </div>
    </section>`;

const expContent = `    <section id="experience" class="py-32 px-4 md:px-12">
        <div class="max-w-5xl mx-auto">
            <p class="text-meta text-accent-cyan mb-4 reveal-up">03 — EXPERIENCE</p>
            <h2 class="text-4xl font-bold mb-24 reveal-up">PROFESSIONAL TIMELINE</h2>
            <div class="space-y-32">
                <!-- ProtoSem -->
                <div class="reveal-up relative pl-8 md:pl-0 border-l border-white/10 md:border-none">
                    <div class="absolute w-3 h-3 bg-accent-cyan rounded-full left-[-6px] top-4 md:hidden"></div>
                    <div class="grid md:grid-cols-12 gap-8 items-start">
                        <div class="md:col-span-3 pt-4 text-meta text-muted">2024 - Present</div>
                        <div class="md:col-span-9 editorial-glass hover:border-accent-cyan transition-colors group">
                            <h3 class="text-3xl font-bold mb-2">PRICE PROTOSEM</h3>
                            <p class="text-accent-cyan font-mono text-sm mb-6">Innovation Engineer Trainee</p>
                            <p class="text-muted leading-relaxed mb-8 italic">"Selected for a 20-week industry-integrated innovation programme focused on solving real-world retail and commerce challenges through AI, analytics, intelligent systems, IoT, prototyping, and entrepreneurship. Working with industry problem statements to explore, develop, and validate practical technology solutions beyond conventional classroom learning."</p>
                            <a href="/protosem/" class="magnetic-btn outline text-sm" data-cursor-text="EXPLORE">EXPLORE PROTOSEM JOURNEY →</a>
                        </div>
                    </div>
                </div>
                <!-- Tavant Technologies -->
                <div class="reveal-up relative pl-8 md:pl-0 border-l border-white/10 md:border-none">
                    <div class="absolute w-3 h-3 bg-accent-violet rounded-full left-[-6px] top-4 md:hidden"></div>
                    <div class="grid md:grid-cols-12 gap-8 items-start">
                        <div class="md:col-span-3 pt-4 text-meta text-muted">May 2024</div>
                        <div class="md:col-span-9 editorial-glass hover:border-accent-violet transition-colors group">
                            <h3 class="text-3xl font-bold mb-2">Tavant Technologies, Bangalore</h3>
                            <p class="text-accent-violet font-mono text-sm mb-6">UI/UX Design Intern</p>
                            <ul class="text-muted leading-relaxed space-y-4 list-disc ml-4">
                                <li>Observed and learned the UI/UX design process.</li>
                                <li>Completed assigned UI and UX tasks to strengthen design and problem-solving skills.</li>
                                <li>Designed user interfaces and gained hands-on experience with UX methodologies.</li>
                                <li>Collaborated with team members and presented design work, demonstrating communication and teamwork skills.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>`;

const projectsContent = `    <section id="projects" class="py-32 px-4 md:px-12 bg-[rgba(255,255,255,0.01)] border-t border-white/5">
        <div class="max-w-7xl mx-auto">
            <p class="text-meta text-accent-pink mb-4 reveal-up">04 — PROJECTS</p>
            <h2 class="text-4xl font-bold mb-24 reveal-up">SELECTED EXHIBITS</h2>
            <div class="space-y-24">
                <div class="reveal-up">
                    <div class="editorial-glass p-8 md:p-16 hover:border-accent-cyan transition-colors">
                        <h3 class="text-4xl font-bold mb-2">INTELLICHAT</h3>
                        <p class="text-meta text-accent-cyan mb-8">Generative AI Voice Assistant (UI/UX Project)</p>
                        <ul class="text-muted leading-relaxed space-y-4 list-disc ml-4 text-lg">
                            <li>Designed an AI-powered voice assistant focused on intuitive and engaging user interactions.</li>
                            <li>Applied user research, wireframing, and prototyping to create user-centered experiences.</li>
                            <li>Built interactive UI designs in Figma with a focus on accessibility and usability.</li>
                        </ul>
                    </div>
                </div>
                <div class="reveal-up">
                    <div class="editorial-glass p-8 md:p-16 hover:border-accent-pink transition-colors">
                        <h3 class="text-4xl font-bold mb-2">ROJAVANAM</h3>
                        <p class="text-meta text-accent-pink mb-8">Old Age Home Management Application</p>
                        <ul class="text-muted leading-relaxed space-y-4 list-disc ml-4 text-lg">
                            <li>Built a web-based solution for managing resident information and daily activities in old-age homes.</li>
                            <li>Designed intuitive interfaces to support caregivers and administrators.</li>
                            <li>Focused on accessibility, usability, and user-centered design.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </section>`;

const achievementsContent = `    <section id="achievements" class="py-32 px-4 md:px-12 border-t border-white/5">
        <div class="max-w-5xl mx-auto">
            <p class="text-meta text-accent-cyan mb-4 reveal-up">05 — RECOGNITION</p>
            <h2 class="text-4xl font-bold mb-16 reveal-up">ACHIEVEMENTS SUMMARY</h2>
            <div class="editorial-glass p-8 md:p-12 reveal-up mb-32">
                <ul class="space-y-6 text-lg text-muted list-disc ml-4">
                    <li>Presented and participated in 10+ Paper Presentation competitions across various colleges and secured 7+ winning positions.</li>
                    <li>Won prizes in multiple technical and non-technical intercollegiate competitions, including Technical Events, Photography, Singing, Dancing, Mime, Declamation, Essay Writing, and Stand-Up Comedy.</li>
                    <li>Selected among the Top 100 Speakers in Madurai in ICT Talkathon 2023.</li>
                    <li>Participated in the Smart India Hackathon 2023, collaborating on innovative problem-solving and technology-driven solutions.</li>
                    <li>Served as President of the Rangering Club, leading club activities, coordinating events, and managing teams effectively.</li>
                </ul>
            </div>
            <h2 class="text-4xl font-bold mb-16 reveal-up">DETAILED COMPETITION HISTORY</h2>
            <div class="space-y-8 reveal-up">
                <div class="grid md:grid-cols-12 gap-6 items-start border-b border-white/10 pb-8">
                    <div class="md:col-span-3 text-meta text-accent-cyan">19/07/2024</div>
                    <div class="md:col-span-9">
                        <h4 class="text-xl font-bold text-frost">1st Prize & Participation</h4>
                        <p class="text-muted mt-2">Grab Your Crown · Shortfilm</p>
                        <p class="text-sm font-bold tracking-widest text-white/50 uppercase mt-2">Student Service Centre, VHNSN College</p>
                    </div>
                </div>
                <div class="grid md:grid-cols-12 gap-6 items-start border-b border-white/10 pb-8">
                    <div class="md:col-span-3 text-meta text-accent-violet">13/02/2024</div>
                    <div class="md:col-span-9">
                        <h4 class="text-xl font-bold text-frost">2nd Prize</h4>
                        <p class="text-muted mt-2">Tech Charades</p>
                        <p class="text-sm font-bold tracking-widest text-white/50 uppercase mt-2">Dept of Computer Science, Bishop Heber College</p>
                    </div>
                </div>
                <div class="grid md:grid-cols-12 gap-6 items-start border-b border-white/10 pb-8">
                    <div class="md:col-span-3 text-meta text-accent-pink">20/03/2024</div>
                    <div class="md:col-span-9">
                        <h4 class="text-xl font-bold text-frost">2nd & 3rd Prizes</h4>
                        <p class="text-muted mt-2">Culinary Quest · T-Shirt Painting · Hairdressing</p>
                        <p class="text-sm font-bold tracking-widest text-white/50 uppercase mt-2">Department of French, Lady Doak College</p>
                    </div>
                </div>
                <div class="grid md:grid-cols-12 gap-6 items-start border-b border-white/10 pb-8">
                    <div class="md:col-span-3 text-meta text-accent-pink">02/08/2024</div>
                    <div class="md:col-span-9">
                        <h4 class="text-xl font-bold text-frost">3rd Prize & Participation</h4>
                        <p class="text-muted mt-2">Stress Interview · Paper Presentation</p>
                        <p class="text-sm font-bold tracking-widest text-white/50 uppercase mt-2">Department of Computer Science, Fatima College</p>
                    </div>
                </div>
                <div class="grid md:grid-cols-12 gap-6 items-start border-b border-white/10 pb-8">
                    <div class="md:col-span-3 text-meta text-accent-pink">24/10/2024</div>
                    <div class="md:col-span-9">
                        <h4 class="text-xl font-bold text-frost">3rd Prize & Participation</h4>
                        <p class="text-muted mt-2">Hint Hunt · Fashion Parade</p>
                        <p class="text-sm font-bold tracking-widest text-white/50 uppercase mt-2">Friends of Library, Lady Doak College</p>
                    </div>
                </div>
                <div class="grid md:grid-cols-12 gap-6 items-start border-b border-white/10 pb-8">
                    <div class="md:col-span-3 text-meta text-accent-pink">23/01/2025</div>
                    <div class="md:col-span-9">
                        <h4 class="text-xl font-bold text-frost">3rd Prize</h4>
                        <p class="text-muted mt-2">Paper Presentation</p>
                        <p class="text-sm font-bold tracking-widest text-white/50 uppercase mt-2">Dept of Data Science, American College Satellite Campus</p>
                    </div>
                </div>
                <div class="grid md:grid-cols-12 gap-6 items-start border-b border-white/10 pb-8">
                    <div class="md:col-span-3 text-meta text-muted">2022 - 2025</div>
                    <div class="md:col-span-9">
                        <h4 class="text-xl font-bold text-frost">Participation</h4>
                        <ul class="text-muted mt-2 space-y-2 list-disc ml-4">
                            <li>Photography & Stand-up Comedy (Fatima College)</li>
                            <li>Taste Hunt (Arul Anandar College)</li>
                            <li>Regional Pre-finals Youth Talk by ICT Academy (Mannar Thirumalai Naicker College)</li>
                            <li>Parallel Frames (Lady Doak College)</li>
                            <li>Logo Designing (NPR Arts and Science College)</li>
                            <li>Figma Design Competition (Skillnest)</li>
                            <li>Figma Design Quiz (Skillnest, Chennai)</li>
                            <li>Radio Jockey & Solo Singing (Bishop Heber College)</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </section>`;

const educationContent = `    <section id="education" class="py-32 px-4 md:px-12 border-t border-white/5">
        <div class="max-w-3xl mx-auto">
            <p class="text-meta text-accent-cyan mb-4 reveal-up">08 — ACADEMICS</p>
            <h2 class="text-4xl font-bold mb-16 reveal-up">EDUCATION</h2>
            <div class="space-y-12">
                <div class="reveal-up pl-6 border-l-2 border-accent-cyan">
                    <h3 class="text-2xl font-bold mb-2">MASTER OF COMPUTER APPLICATIONS</h3>
                    <p class="text-meta text-muted mb-4">Kumaraguru College of Technology, Coimbatore</p>
                    <p class="text-accent-cyan font-bold tracking-widest uppercase text-sm">2025 – 2027</p>
                </div>
                <div class="reveal-up pl-6 border-l-2 border-accent-violet">
                    <h3 class="text-2xl font-bold mb-2">BACHELOR OF SCIENCE IN INFORMATION TECHNOLOGY</h3>
                    <p class="text-meta text-muted mb-4">Lady Doak College, Madurai</p>
                    <p class="text-accent-violet font-bold tracking-widest uppercase text-sm">2022 – 2025</p>
                </div>
            </div>
        </div>
    </section>`;

const credentialsContent = `    <section id="credentials" class="py-32 px-4 md:px-12 bg-[rgba(255,255,255,0.01)] border-t border-white/5">
        <div class="max-w-7xl mx-auto">
            <p class="text-meta text-accent-violet mb-4 reveal-up">06 — CREDENTIALS</p>
            <h2 class="text-4xl font-bold mb-16 reveal-up">CERTIFICATIONS</h2>
            <div class="grid md:grid-cols-3 gap-8">
                <div class="block editorial-glass p-8 hover:border-accent-cyan transition-colors reveal-up group">
                    <h3 class="text-xl font-bold mb-2 group-hover:text-accent-cyan transition-colors">UI/UX Design Certification</h3>
                    <p class="text-meta text-accent-cyan mb-4">Innovel Institute · 2025</p>
                    <span class="text-xs font-bold uppercase tracking-widest text-frost border-b border-frost pb-1 group-hover:border-accent-cyan transition-colors cursor-pointer">VIEW CERTIFICATE ↗</span>
                </div>
                <div class="block editorial-glass p-8 hover:border-accent-violet transition-colors reveal-up group">
                    <h3 class="text-xl font-bold mb-2 group-hover:text-accent-violet transition-colors">UI/UX Design Certification</h3>
                    <p class="text-meta text-accent-violet mb-4">Teachnook & IIT Roorkee · 2024</p>
                    <span class="text-xs font-bold uppercase tracking-widest text-frost border-b border-frost pb-1 group-hover:border-accent-violet transition-colors cursor-pointer">VIEW CERTIFICATE ↗</span>
                </div>
                <div class="block editorial-glass p-8 hover:border-accent-pink transition-colors reveal-up group">
                    <h3 class="text-xl font-bold mb-2 group-hover:text-accent-pink transition-colors">InfoSec Management Foundation Course (SFC 101) & Security Analyst (NO901)</h3>
                    <p class="text-meta text-accent-pink mb-4">NASSCOM, Wadhwani Foundation & Adobe · 2024</p>
                    <span class="text-xs font-bold uppercase tracking-widest text-frost border-b border-frost pb-1 group-hover:border-accent-pink transition-colors cursor-pointer">VIEW CERTIFICATE ↗</span>
                </div>
            </div>
        </div>
    </section>`;

const workshopsContent = `    <section id="workshops" class="py-32 px-4 md:px-12 border-t border-white/5">
        <div class="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16">
            <div>
                <p class="text-meta text-accent-pink mb-4 reveal-up">07 — LEARNING</p>
                <h2 class="text-4xl font-bold mb-12 reveal-up">WORKSHOPS & TRAINING</h2>
                <p class="text-muted leading-relaxed mb-6 reveal-up">Attended 10+ workshops, seminars, and training programs on emerging technologies and professional development topics, including:</p>
            </div>
            <div class="space-y-12">
                <div class="reveal-up">
                    <h3 class="text-xl font-bold mb-4 text-accent-cyan">Technology</h3>
                    <div class="flex flex-wrap gap-3">
                        <span class="border border-white/10 px-4 py-2 rounded-full text-sm">Cyber Security</span>
                        <span class="border border-white/10 px-4 py-2 rounded-full text-sm">AI</span>
                        <span class="border border-white/10 px-4 py-2 rounded-full text-sm">Big Data Analytics</span>
                        <span class="border border-white/10 px-4 py-2 rounded-full text-sm">Flutter App Development</span>
                        <span class="border border-white/10 px-4 py-2 rounded-full text-sm">UI/UX Design</span>
                        <span class="border border-white/10 px-4 py-2 rounded-full text-sm">Power BI</span>
                        <span class="border border-white/10 px-4 py-2 rounded-full text-sm">Databricks</span>
                    </div>
                </div>
                <div class="reveal-up">
                    <h3 class="text-xl font-bold mb-4 text-accent-violet">Creative & Cultural</h3>
                    <div class="flex flex-wrap gap-3">
                        <span class="border border-white/10 px-4 py-2 rounded-full text-sm">Musical Theatre</span>
                        <span class="border border-white/10 px-4 py-2 rounded-full text-sm">French Culture and Language Awareness</span>
                    </div>
                </div>
                <div class="reveal-up mt-12 border-t border-white/10 pt-8">
                    <h3 class="text-sm font-bold tracking-widest uppercase mb-6 text-white/50">Detailed Workshop History</h3>
                    <div class="space-y-6">
                        <div class="border-l border-accent-cyan pl-4">
                            <p class="font-bold">Cuisine Français</p>
                            <p class="text-xs text-muted mt-1">Department of Marine Catering & Hotel Management, Subbalakshmi Lakshmipathy College of Science · 08/11/2022</p>
                        </div>
                        <div class="border-l border-accent-violet pl-4">
                            <p class="font-bold">Western Musical Theatre</p>
                            <p class="text-xs text-muted mt-1">Centre for Music, Lady Doak College · 23/08/2023 – 25/08/2023</p>
                        </div>
                        <div class="border-l border-accent-pink pl-4">
                            <p class="font-bold">Flutter and Thunkable</p>
                            <p class="text-xs text-muted mt-1">Mepco Schlenk Engineering College · 16/02/2024 – 17/02/2024</p>
                        </div>
                        <div class="border-l border-frost pl-4">
                            <p class="font-bold">Big Data Analytics</p>
                            <p class="text-xs text-muted mt-1">NIT · 08/03/2024 – 10/03/2024</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>`;

replaceSection("ABOUT", aboutContent);
replaceSection("SKILLS", skillsContent);
replaceSection("EXPERIENCE", expContent);
replaceSection("PROJECTS", projectsContent);
replaceSection("ACHIEVEMENTS", achievementsContent);
replaceSection("EDUCATION", educationContent);
replaceSection("CREDENTIALS", credentialsContent); // Added
// Re-add Workshops without the ID regex since it doesn't have an ID comment but has a section
indexHtml = indexHtml.replace(/<!-- 19 WORKSHOPS & TRAINING -->.*?<\/section>/s, \`<!-- 19 WORKSHOPS & TRAINING -->\n\${workshopsContent}\`);
indexHtml = indexHtml.replace(/<!-- 21 & 22 EDUCATION & EXPLORING -->.*?<\/section>\\s+<!-- Exploring -->.*?<\/section>/s, \`<!-- 21 EDUCATION -->\n\${educationContent}\`);
// Also fix education if the regex above didn't catch it correctly since it has multiple divs
indexHtml = indexHtml.replace(/<!-- 21 & 22 EDUCATION & EXPLORING -->.*?<section id="education".*?<\/section>/s, \`<!-- 21 EDUCATION -->\n\${educationContent}\`);

removeSection("BEYOND TECHNOLOGY");

// Fix Hero subtext using literal strings to avoid escape issues
indexHtml = indexHtml.replace(/<p class="text-meta mt-8 mb-4 reveal-up" style="transition-delay: 0.2s;">MCA STUDENT · INNOVATION ENGINEER\\s+TRAINEE · UI\/UX ENTHUSIAST<\/p>/, '<p class="text-meta mt-8 mb-4 reveal-up" style="transition-delay: 0.2s;">MCA STUDENT · TECH ENTHUSIAST</p>');

indexHtml = indexHtml.replace(/<p class="text-xl md:text-2xl font-light text-muted italic reveal-up" style="transition-delay: 0.3s;">\\s+"Designing ideas. Exploring technology. Creating meaningful experiences."<\/p>/, '<p class="text-xl md:text-2xl font-light text-muted italic reveal-up" style="transition-delay: 0.3s;">"Motivated MCA student with interests in User Experience Design, Artificial Intelligence and Software Development."</p>');

fs.writeFileSync("index.html", indexHtml);
console.log("Sync complete");
