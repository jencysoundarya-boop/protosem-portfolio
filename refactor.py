import os
import re
import shutil

# Step 1: Modify index.html
with open('index.html', 'r', encoding='utf-8') as f:
    index_html = f.read()

# Add <script src="components.js"></script> to the <head>
if 'components.js' not in index_html:
    index_html = index_html.replace('</head>', '    <script src="/components.js"></script>\n</head>')

# Replace hardcoded navigation with <global-navbar>
nav_pattern = re.compile(r'<nav class="nav-bar">.*?</nav>', re.DOTALL)
index_html = nav_pattern.sub('<global-navbar active-page="HOME"></global-navbar>', index_html)

# Add id="workshops" to the workshops section so the link /#workshops works
index_html = index_html.replace('<section class="py-32 px-4 md:px-12 border-t border-white/5">', '<section id="workshops" class="py-32 px-4 md:px-12 border-t border-white/5">', 1)

# Replace the hardcoded footer with <global-footer>
footer_pattern = re.compile(r'<footer id="contact".*?</footer>', re.DOTALL)
index_html = footer_pattern.sub('<global-footer></global-footer>', index_html)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(index_html)

print("Updated index.html")

# Step 2: Create protosem/index.html
os.makedirs('protosem', exist_ok=True)
with open('protosem.html', 'r', encoding='utf-8') as f:
    protosem_html = f.read()

if 'components.js' not in protosem_html:
    protosem_html = protosem_html.replace('</head>', '    <script src="/components.js"></script>\n</head>')
    # Fix CSS link to be absolute or relative to root
    protosem_html = protosem_html.replace('href="spatial.css"', 'href="/spatial.css"')
    protosem_html = protosem_html.replace('src="physics.js"', 'src="/physics.js"')

protosem_html = nav_pattern.sub('<global-navbar active-page="PROTOSEM"></global-navbar>', protosem_html)
protosem_html = footer_pattern.sub('<global-footer></global-footer>', protosem_html)

# Add Breadcrumbs to protosem.html just above the h1
bread_crumb = '\n            <bread-crumbs path="HOME, PROTOSEM"></bread-crumbs>\n'
protosem_html = protosem_html.replace('<h1', bread_crumb + '            <h1', 1)

with open('protosem/index.html', 'w', encoding='utf-8') as f:
    f.write(protosem_html)

print("Created protosem/index.html")

# Step 3: Create protosem/week-XX/index.html pages
week_data = {
    "00": {
        "title": "Orientation & Launch",
        "tagline": "4 Days of Connection, Discovery & Team Building",
        "overview": "Four days of introductions, discovery, learning, games, and team spirit that kicked off the ProtoSem journey.",
        "highlights": "CONNECT → DISCOVER → COLLABORATE → LAUNCH"
    }
}
for i in range(1, 15):
    week_str = f"{i:02d}"
    week_data[week_str] = {
        "title": "Field Notes in Progress",
        "tagline": "Exploration ongoing...",
        "overview": "Details for this week are currently being compiled.",
        "highlights": ""
    }

week_template = """<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Week {week_num} | PROTOSEM</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="/spatial.css" rel="stylesheet">
    <script src="/components.js"></script>
</head>
<body>
    <div class="ambient-field" style="background: radial-gradient(circle at 50% 0%, rgba(139, 92, 246, 0.05) 0%, transparent 70%);"></div>
    <div class="noise-overlay"></div>

    <global-navbar active-page="PROTOSEM"></global-navbar>

    <section class="min-h-screen pt-32 pb-16 px-4 md:px-12 relative z-10 spatial-container">
        <div class="max-w-4xl mx-auto reveal-up">
            <bread-crumbs path="HOME, PROTOSEM, WEEK {week_num}"></bread-crumbs>
            
            <p class="text-meta text-accent-cyan mb-4">PROTOSEM — WEEK {week_num}</p>
            <h1 class="text-5xl md:text-7xl font-black mb-6 tracking-tighter text-frost">{title}</h1>
            <p class="text-2xl text-accent-violet italic mb-12">"{tagline}"</p>
            
            <div class="editorial-glass p-8 md:p-12 mb-16">
                <p class="text-lg text-muted leading-relaxed mb-8">{overview}</p>
                {highlights_html}
            </div>
            
            <div class="flex flex-wrap justify-between items-center pt-8 border-t border-white/10">
                {prev_link}
                <a href="/protosem/" class="text-xs font-bold uppercase tracking-widest text-frost border-b border-frost pb-1 hover:text-accent-cyan hover:border-accent-cyan transition-colors" data-cursor-text="BACK">← BACK TO PROTOSEM</a>
                {next_link}
            </div>
        </div>
    </section>

    <global-footer></global-footer>
    <script src="/physics.js"></script>
</body>
</html>"""

for week_str, data in week_data.items():
    week_dir = f"protosem/week-{week_str}"
    os.makedirs(week_dir, exist_ok=True)
    
    highlights_html = f'<p class="text-sm font-bold tracking-widest text-accent-cyan">{data["highlights"]}</p>' if data["highlights"] else ''
    
    prev_week = f"{int(week_str)-1:02d}"
    next_week = f"{int(week_str)+1:02d}"
    
    prev_link = f'<a href="/protosem/week-{prev_week}/" class="text-xs font-bold uppercase tracking-widest text-muted hover:text-white transition-colors" data-cursor-text="PREV">← PREVIOUS WEEK</a>' if week_str != "00" else '<span></span>'
    next_link = f'<a href="/protosem/week-{next_week}/" class="text-xs font-bold uppercase tracking-widest text-muted hover:text-white transition-colors" data-cursor-text="NEXT">NEXT WEEK →</a>' if week_str != "14" else '<span></span>'
    
    html = week_template.format(
        week_num=week_str,
        title=data['title'].upper(),
        tagline=data['tagline'],
        overview=data['overview'],
        highlights_html=highlights_html,
        prev_link=prev_link,
        next_link=next_link
    )
    
    with open(f"{week_dir}/index.html", 'w', encoding='utf-8') as f:
        f.write(html)
    
print("Created week pages.")

# Update resume.html
with open('resume.html', 'r', encoding='utf-8') as f:
    resume_html = f.read()

# Make it use spatial.css, tailwind, and components
resume_head = """
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="/spatial.css" rel="stylesheet">
    <script src="/components.js"></script>
"""
if "components.js" not in resume_html:
    resume_html = resume_html.replace('</head>', resume_head + '</head>')
    
    # Wrap body contents in spatial container, add navbar and footer
    body_content = re.search(r'<body>(.*?)</body>', resume_html, re.DOTALL).group(1)
    
    new_body = f"""<body>
    <div class="ambient-field"></div>
    <div class="noise-overlay"></div>
    <global-navbar active-page=""></global-navbar>
    
    <div class="relative z-10 pt-32 pb-16 px-4 spatial-container">
        <div class="editorial-glass max-w-4xl mx-auto p-8 md:p-16">
            <bread-crumbs path="HOME, RESUME"></bread-crumbs>
            {body_content}
        </div>
    </div>
    
    <global-footer></global-footer>
    <script src="/physics.js"></script>
</body>"""
    
    resume_html = re.sub(r'<body>.*?</body>', new_body, resume_html, flags=re.DOTALL)
    
    with open('resume.html', 'w', encoding='utf-8') as f:
        f.write(resume_html)

print("Updated resume.html")
