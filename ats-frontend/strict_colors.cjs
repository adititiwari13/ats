const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const replaceInFile = (filePath) => {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Backgrounds
    content = content.replace(/bg-slate-900/g, 'bg-app-bg');
    content = content.replace(/bg-\[\#0f172a\]/g, 'bg-app-bg');
    
    // Cards & Panels
    content = content.replace(/bg-slate-800/g, 'bg-app-card');
    content = content.replace(/bg-slate-900\/50/g, 'bg-app-bg');
    content = content.replace(/bg-white\/\[0\.03\]/g, 'bg-app-border/20');
    content = content.replace(/bg-white\/\[0\.06\]/g, 'bg-app-border/40');
    content = content.replace(/hover:bg-white\/\[0\.06\]/g, 'hover:bg-app-border/40');

    // Borders
    content = content.replace(/border-slate-700/g, 'border-app-border');
    content = content.replace(/border-white\/5/g, 'border-app-border');
    content = content.replace(/border-white\/10/g, 'border-app-border');

    // Text Colors
    content = content.replace(/text-slate-100/g, 'text-app-text');
    content = content.replace(/text-slate-200/g, 'text-app-text');
    content = content.replace(/text-zinc-100/g, 'text-app-text');
    content = content.replace(/text-white/g, 'text-app-text');
    content = content.replace(/text-slate-400/g, 'text-app-subtext');
    content = content.replace(/text-slate-500/g, 'text-app-subtext');
    content = content.replace(/text-slate-300/g, 'text-app-text');

    // Primary Colors (Purple -> Custom Primary)
    content = content.replace(/bg-purple-500/g, 'bg-app-primary');
    content = content.replace(/hover:bg-purple-600/g, 'hover:bg-app-primary-hover');
    content = content.replace(/text-purple-400/g, 'text-app-primary');
    content = content.replace(/text-purple-500/g, 'text-app-primary');
    content = content.replace(/border-purple-500/g, 'border-app-primary');
    content = content.replace(/ring-purple-500/g, 'ring-app-primary');
    content = content.replace(/shadow-purple-[^\s"']+/g, '');

    // Cleanup remaining gradients that might have survived
    content = content.replace(/bg-gradient-to-[^\s"']+/g, 'bg-app-primary');
    content = content.replace(/from-[^\s"']+/g, '');
    content = content.replace(/to-[^\s"']+/g, '');

    if (content !== original) {
        // Fix any double spaces caused by removing gradient strings
        content = content.replace(/  +/g, ' ');
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Updated strict colors: ' + filePath);
    }
}

const walkDir = (dir) => {
    fs.readdirSync(dir).forEach(file => {
        let fullPath = path.join(dir, file);
        if (fs.lstatSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else if (fullPath.endsWith('.jsx')) {
            replaceInFile(fullPath);
        }
    });
}

walkDir(srcDir);
