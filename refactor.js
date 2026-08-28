const fs = require('fs');
const path = require('path');

// Step 1: Update protosem.html and move to protosem/index.html
if (fs.existsSync('protosem.html')) {
    let protosem = fs.readFileSync('protosem.html', 'utf8');
    
    // Add components.js to head
    if (!protosem.includes('components.js')) {
        protosem = protosem.replace('</head>', '    <script src="/components.js"></script>\n</head>');
    }
    
    // Fix asset links
    protosem = protosem.replace(/href="spatial.css"/g, 'href="/spatial.css"');
    protosem = protosem.replace(/src="physics.js"/g, 'src="/physics.js"');
    protosem = protosem.replace(/href="index.html/g, 'href="/');
    
    // Replace nav
    protosem = protosem.replace(/<nav class="nav-bar">.*?<\/nav>/s, '<global-navbar active-page="PROTOSEM"></global-navbar>');
    
    // Add breadcrumb
    if (!protosem.includes('bread-crumbs')) {
        protosem = protosem.replace(/<h1/, '<bread-crumbs path="HOME, PROTOSEM"></bread-crumbs>\n            <h1');
    }
    
    // Replace footer
    protosem = protosem.replace(/<footer.*?<\/footer>/s, '<global-footer></global-footer>');

    fs.mkdirSync('protosem', { recursive: true });
    fs.writeFileSync('protosem/index.html', protosem);
    console.log('Created protosem/index.html');
}

// Step 2: Generate week pages
const weekData = {
    "00": {
        title: "Orientation & Launch",
        tagline: "4 Days of Connection, Discovery & Team Building",
        overview: "Four days of introductions, discovery, learning, games, and team spirit that kicked off the ProtoSem journey.",
        highlights: "CONNECT → DISCOVER → COLLABORATE → LAUNCH"
    }
};

for (let i = 1; i <= 14; i++) {
    const weekStr = i.toString().padStart(2, '0');
    weekData[weekStr] = {
        title: "Field Notes in Progress",
        tagline: "Exploration ongoing...",
        overview: "Details for this week are currently being compiled.",
        highlights: ""
    };
}

const template = (week, data) => `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Week ${week} | PROTOSEM</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="/spatial.css" rel="stylesheet">
    <script src="/components.js"></script>
</head>
<body>
    <div class="ambient-field" style="background: radial-gradient(circle at 50% 0%, rgba(139, 92, 246, 0.05) 0%, transparent 70%);"></div>
    <div class="noise-overlay"></div>

    <global-navbar active-page="PROTOSEM"></global-navbar>

    <section class="min-h-[80vh] pt-32 pb-16 px-4 md:px-12 relative z-10 spatial-container">
        <div class="max-w-4xl mx-auto reveal-up">
            <bread-crumbs path="HOME, PROTOSEM, WEEK ${week}"></bread-crumbs>
            
            <p class="text-meta text-accent-cyan mb-4">PROTOSEM — WEEK ${week}</p>
            <h1 class="text-5xl md:text-7xl font-black mb-6 tracking-tighter text-frost">${data.title.toUpperCase()}</h1>
            <p class="text-2xl text-accent-violet italic mb-12">"${data.tagline}"</p>
            
            <div class="editorial-glass p-8 md:p-12 mb-16">
                <p class="text-lg text-muted leading-relaxed mb-8">${data.overview}</p>
                ${data.highlights ? `<p class="text-sm font-bold tracking-widest text-accent-cyan">${data.highlights}</p>` : ''}
            </div>
            
            <div class="flex flex-wrap justify-between items-center pt-8 border-t border-white/10 gap-4">
                ${week !== "00" ? `<a href="/protosem/week-${String(Number(week)-1).padStart(2, '0')}/" class="text-xs font-bold uppercase tracking-widest text-muted hover:text-white transition-colors" data-cursor-text="PREV">← PREVIOUS WEEK</a>` : '<span></span>'}
                <a href="/protosem/" class="text-xs font-bold uppercase tracking-widest text-frost border-b border-frost pb-1 hover:text-accent-cyan hover:border-accent-cyan transition-colors" data-cursor-text="BACK">← BACK TO PROTOSEM</a>
                ${week !== "14" ? `<a href="/protosem/week-${String(Number(week)+1).padStart(2, '0')}/" class="text-xs font-bold uppercase tracking-widest text-muted hover:text-white transition-colors" data-cursor-text="NEXT">NEXT WEEK →</a>` : '<span></span>'}
            </div>
        </div>
    </section>

    <global-footer></global-footer>
    <script src="/physics.js"></script>
</body>
</html>`;

for (const [week, data] of Object.entries(weekData)) {
    const dir = `protosem/week-${week}`;
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(`${dir}/index.html`, template(week, data));
}
console.log('Created 15 week pages');

// Step 3: Update resume.html
if (fs.existsSync('resume.html')) {
    let resume = fs.readFileSync('resume.html', 'utf8');
    
    // Add components and spatial.css
    if (!resume.includes('components.js')) {
        resume = resume.replace('</head>', `    <script src="https://cdn.tailwindcss.com"></script>
    <link href="/spatial.css" rel="stylesheet">
    <script src="/components.js"></script>
</head>`);
    }
    
    // Extract body content and wrap it in global structure
    const bodyMatch = resume.match(/<body[^>]*>(.*?)<\/body>/s);
    if (bodyMatch && !resume.includes('global-navbar')) {
        const bodyContent = bodyMatch[1];
        const newBody = `<body>
    <div class="ambient-field"></div>
    <div class="noise-overlay"></div>
    <global-navbar active-page=""></global-navbar>
    
    <div class="relative z-10 pt-32 pb-16 px-4 spatial-container">
        <div class="max-w-4xl mx-auto reveal-up">
            <bread-crumbs path="HOME, RESUME"></bread-crumbs>
            <div class="bg-white text-black p-8 md:p-12 rounded-2xl shadow-2xl overflow-hidden print:p-0 print:shadow-none print:m-0" id="resume-container">
                \${bodyContent}
            </div>
        </div>
    </div>
    
    <global-footer></global-footer>
    <script src="/physics.js"></script>
</body>`;
        
        resume = resume.replace(/<body[^>]*>.*?<\/body>/s, newBody);
        
        // Ensure printing works properly and overrides background
        resume = resume.replace('</style>', `
        @media print {
            body { background: white !important; -webkit-print-color-adjust: exact; }
            .nav-bar, global-navbar, global-footer, bread-crumbs, .noise-overlay, .ambient-field { display: none !important; }
            .spatial-container { padding: 0 !important; }
            #resume-container { box-shadow: none !important; border-radius: 0 !important; }
        }
    </style>`);
        
        fs.writeFileSync('resume.html', resume);
        console.log('Updated resume.html');
    }
}
