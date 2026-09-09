const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

const CONTENT_DIR = path.join(__dirname, '../portfolio-content');
const PUBLIC_ASSETS_DIR = path.join(__dirname, '../public/assets/weekly');
const PROTOSEM_DIR = path.join(__dirname, '../protosem');
const INDEX_HTML_PATH = path.join(__dirname, '../protosem.html');

// Ensure directories exist
function ensureDirExists(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

ensureDirExists(PUBLIC_ASSETS_DIR);

const IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
const ALL_MEDIA_EXTS = [...IMAGE_EXTS, '.mp4', '.webm', '.pdf', '.doc', '.docx'];

// We will construct the protosemWeeks array to replace in protosem.html
let protosemWeeksData = [];

function compile() {
    for (let w = 0; w <= 19; w++) {
        const weekStr = `Week_${String(w).padStart(2, '0')}`;
        const weekNumStr = String(w).padStart(2, '0');
        const weekPath = path.join(CONTENT_DIR, weekStr);
        const staticWeekPath = path.join(PROTOSEM_DIR, `week-${weekNumStr}`);
        const staticIndexHtmlPath = path.join(staticWeekPath, 'index.html');
        
        let hasContent = false;
        let weeklyHtmlContent = '';
        let weekActivities = [];
        
        if (fs.existsSync(weekPath)) {
            const dayFolders = ['01_Monday', '02_Tuesday', '03_Wednesday', '04_Thursday', '05_Friday', '06_Saturday'];
            
            for (const day of dayFolders) {
                const dayPath = path.join(weekPath, day);
                if (!fs.existsSync(dayPath)) continue;

                const files = fs.readdirSync(dayPath);
                const markdownFiles = files.filter(f => f.toLowerCase().endsWith('.md'));
                const mediaFiles = files.filter(f => ALL_MEDIA_EXTS.includes(path.extname(f).toLowerCase()));

                if (markdownFiles.length === 0 && mediaFiles.length === 0) continue;
                hasContent = true;

                const publicMediaDir = path.join(PUBLIC_ASSETS_DIR, weekStr, day);
                if (mediaFiles.length > 0) ensureDirExists(publicMediaDir);

                for (const media of mediaFiles) {
                    fs.copyFileSync(path.join(dayPath, media), path.join(publicMediaDir, media));
                }

                weeklyHtmlContent += `<h3 class="text-3xl font-bold mt-12 mb-6 text-accent-cyan">${day.replace('_', ' ')}</h3>\n`;

                for (const mdFile of markdownFiles) {
                    let content = fs.readFileSync(path.join(dayPath, mdFile), 'utf-8');

                    // Convert Obsidian links ![[image.png]]
                    content = content.replace(/!\[\[([^\]]+)\]\]/g, (match, filename) => {
                        return `![${filename}](/assets/weekly/${weekStr}/${day}/${filename})`;
                    });

                    // Parse markdown to HTML
                    let html = marked.parse(content);
                    
                    // Add styling to common elements
                    html = html.replace(/<ul>/g, '<ul class="list-disc ml-6 space-y-2 text-muted mb-6">');
                    html = html.replace(/<ol>/g, '<ol class="list-decimal ml-6 space-y-2 text-muted mb-6">');
                    html = html.replace(/<h2>/g, '<h2 class="text-2xl font-bold mt-8 mb-4 text-frost">');
                    html = html.replace(/<p>/g, '<p class="text-lg text-muted leading-relaxed mb-6">');
                    html = html.replace(/<img([^>]+)>/g, '<div class="my-8 rounded-xl overflow-hidden border border-white/10"><img$1 class="w-full h-auto object-cover"></div>');

                    weeklyHtmlContent += html + '\n';
                }
            }
        }

        // Update the static HTML file for this week if it exists
        if (fs.existsSync(staticIndexHtmlPath)) {
            let indexHtml = fs.readFileSync(staticIndexHtmlPath, 'utf8');
            
            // Check if we have injection markers, if not, add them around the editorial-glass div
            if (!indexHtml.includes('<!-- INJECT_CONTENT_START -->')) {
                const targetDiv = '<div class="editorial-glass p-8 md:p-12 mb-16">';
                indexHtml = indexHtml.replace(targetDiv, '<!-- INJECT_CONTENT_START -->\n' + targetDiv);
                indexHtml = indexHtml.replace(/Details for this week are currently being compiled\.<\/p>\s*<\/div>/, 'Details for this week are currently being compiled.</p>\n            </div>\n            <!-- INJECT_CONTENT_END -->');
            }

            const defaultContent = `
            <div class="editorial-glass p-8 md:p-12 mb-16">
                <p class="text-lg text-muted leading-relaxed mb-8">Details for this week are currently being compiled.</p>
            </div>`;
            
            const replacement = hasContent ? `
            <div class="editorial-glass p-8 md:p-12 mb-16 content-rendered">
                ${weeklyHtmlContent}
            </div>` : defaultContent;

            indexHtml = indexHtml.replace(/<!-- INJECT_CONTENT_START -->[\s\S]*?<!-- INJECT_CONTENT_END -->/, `<!-- INJECT_CONTENT_START -->\n${replacement}\n            <!-- INJECT_CONTENT_END -->`);
            fs.writeFileSync(staticIndexHtmlPath, indexHtml);
        }

        // Build data for timeline (protosem.html)
        if (hasContent || w === 0) { // Keep week 00 static data
            protosemWeeksData.push({
                week: weekNumStr,
                title: w === 0 ? "Orientation & Launch" : "Field Notes Compiled",
                tagline: w === 0 ? "4 Days of Connection, Discovery & Team Building" : "Exploration logged successfully.",
                overview: w === 0 ? "Four days of introductions, discovery, learning, games, and team spirit that kicked off the ProtoSem journey." : "Notes and activities for this week have been successfully synced from the portfolio-content vault.",
                highlights: w === 0 ? "CONNECT → DISCOVER → COLLABORATE → LAUNCH" : "",
                activities: w === 0 ? [
                    "<b>Day 01 — Icebreakers & Introductions:</b> Self and class introductions, followed by the Rock Paper Scissors game.",
                    "<b>Day 02 — Discover & Present:</b> LinkedIn session, 16Personalities assessment, and short story presentations.",
                    "<b>Day 03 — Stories, Talks & Team Games:</b> Story presentations, ITEC TechTalk, Imposter, Challenge, and Marshmello games.",
                    "<b>Day 04 — Learning & Launch:</b> The Art of Prompting TechTalk, orientation by Hema, leaderboard briefing, and official inauguration."
                ] : ["<b>Sync Complete:</b> Checkout the detailed week page to view full notes and gallery."]
            });
        } else {
            // For weeks up to 14, if no content, show in progress
            if (w <= 14) {
                protosemWeeksData.push({
                    week: weekNumStr,
                    title: "Field Notes in Progress",
                    tagline: "Exploration ongoing...",
                    overview: "Details for this week are currently being compiled.",
                    activities: []
                });
            }
        }
    }

    // Now update protosem.html timeline script
    if (fs.existsSync(INDEX_HTML_PATH)) {
        let protosemHtml = fs.readFileSync(INDEX_HTML_PATH, 'utf8');
        
        // Find the script block containing 'const protosemWeeks = ['
        const scriptStart = 'const protosemWeeks = [';
        const scriptEndRegex = /document\.addEventListener\('DOMContentLoaded', \(\) => {/;
        
        if (protosemHtml.includes(scriptStart) && protosemHtml.match(scriptEndRegex)) {
            const splitStart = protosemHtml.split(scriptStart)[0];
            const endMatch = protosemHtml.match(scriptEndRegex)[0];
            const splitEnd = protosemHtml.split(scriptEndRegex)[1];
            
            const newScriptContent = `const protosemWeeks = ${JSON.stringify(protosemWeeksData, null, 12).replace(/"([^"]+)":/g, '$1:')};

        `;
            fs.writeFileSync(INDEX_HTML_PATH, splitStart + newScriptContent + endMatch + splitEnd);
        }
    }

    console.log('Build completed successfully!');
}

compile();
