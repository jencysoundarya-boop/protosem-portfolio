const fs = require('fs');
const path = require('path');

const CONTENT_DIR = path.join(__dirname, '../portfolio-content');
const PUBLIC_ASSETS_DIR = path.join(__dirname, '../public/assets/weekly');
const COMPILED_DIR = path.join(__dirname, '../src/content/blogs');
const JSON_OUTPUT_PATH = path.join(__dirname, '../src/data/compiledProtoSem.json');

// Ensure directories exist
function ensureDirExists(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

ensureDirExists(PUBLIC_ASSETS_DIR);
ensureDirExists(COMPILED_DIR);
ensureDirExists(path.dirname(JSON_OUTPUT_PATH));

// Supported media extensions
const IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
const VIDEO_EXTS = ['.mp4', '.webm'];
const DOC_EXTS = ['.pdf', '.doc', '.docx'];
const ALL_MEDIA_EXTS = [...IMAGE_EXTS, ...VIDEO_EXTS, ...DOC_EXTS];

const compiledJson = {
    days: {},
    evidence: []
};

// Main process
function compile() {
    let evidenceIdCounter = 1;

    for (let w = 0; w <= 19; w++) {
        const weekStr = `Week_${String(w).padStart(2, '0')}`;
        const weekPath = path.join(CONTENT_DIR, weekStr);
        
        if (!fs.existsSync(weekPath)) continue;

        let weeklyMarkdownContent = `# ${weekStr}\n\n`;

        const dayFolders = ['01_Monday', '02_Tuesday', '03_Wednesday', '04_Thursday', '05_Friday', '06_Saturday'];
        
        for (const day of dayFolders) {
            const dayPath = path.join(weekPath, day);
            if (!fs.existsSync(dayPath)) continue;

            const files = fs.readdirSync(dayPath);
            const markdownFiles = files.filter(f => f.toLowerCase().endsWith('.md'));
            const mediaFiles = files.filter(f => ALL_MEDIA_EXTS.includes(path.extname(f).toLowerCase()));

            // Day Key
            const dayKey = `${weekStr}_${day}`;
            const publicMediaDir = path.join(PUBLIC_ASSETS_DIR, weekStr, day);

            // Copy media files if they exist
            if (mediaFiles.length > 0) {
                ensureDirExists(publicMediaDir);
                for (const media of mediaFiles) {
                    fs.copyFileSync(path.join(dayPath, media), path.join(publicMediaDir, media));
                }
            }

            let dayContent = `## ${day}\n\n`;
            let linkedMedia = new Set();
            let dayData = {
                title: day,
                topics: [],
                activities: [],
                evidenceIds: []
            };

            for (const mdFile of markdownFiles) {
                let content = fs.readFileSync(path.join(dayPath, mdFile), 'utf-8');

                // Extract Obsidian Links ![[image.png]]
                const obsidianLinkRegex = /!\[\[([^\]]+)\]\]/g;
                content = content.replace(obsidianLinkRegex, (match, filename) => {
                    linkedMedia.add(filename);
                    const webPath = `/assets/weekly/${weekStr}/${day}/${filename}`;
                    return `![${filename}](${webPath})`;
                });

                // Extract normal Markdown Links ![image.png](image.png)
                const mdLinkRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
                content = content.replace(mdLinkRegex, (match, alt, filename) => {
                    // if it's a local file in this folder
                    if (!filename.startsWith('http') && !filename.startsWith('/')) {
                        const actualFilename = path.basename(filename);
                        linkedMedia.add(actualFilename);
                        return `![${alt}](/assets/weekly/${weekStr}/${day}/${actualFilename})`;
                    }
                    return match;
                });

                dayContent += content + '\n\n';
            }

            // Unlinked media
            let galleryHtml = '';
            const unlinkedMedia = mediaFiles.filter(m => !linkedMedia.has(m));

            for (const media of mediaFiles) {
                const ext = path.extname(media).toLowerCase();
                const type = IMAGE_EXTS.includes(ext) ? 'image' : VIDEO_EXTS.includes(ext) ? 'video' : 'document';
                const url = `/assets/weekly/${weekStr}/${day}/${media}`;

                const evidenceItem = {
                    id: `ev_${evidenceIdCounter++}`,
                    type,
                    title: media,
                    url,
                    previewUrl: type === 'image' ? url : null
                };
                compiledJson.evidence.push(evidenceItem);
                dayData.evidenceIds.push(evidenceItem.id);

                if (unlinkedMedia.includes(media) && type === 'image') {
                    galleryHtml += `![${media}](${url})\n`;
                }
            }

            if (galleryHtml) {
                dayContent += `### Gallery\n\n${galleryHtml}\n\n`;
            }

            weeklyMarkdownContent += dayContent;
            compiledJson.days[dayKey] = dayData;
        }

        // Write Weekly Markdown
        fs.writeFileSync(path.join(COMPILED_DIR, `${weekStr}.md`), weeklyMarkdownContent);
    }

    fs.writeFileSync(JSON_OUTPUT_PATH, JSON.stringify(compiledJson, null, 2));
    console.log('Build completed successfully!');
}

// Check if src/services/obsidianParser.js exists. If it does, we could use it, but since we are generating this fresh:
const obsidianParserPath = path.join(__dirname, '../src/services/obsidianParser.js');
if (fs.existsSync(obsidianParserPath)) {
    console.log("Existing obsidianParser found, but executing internal compiler as per architecture.");
}

compile();
