const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const replaceInFile = (filePath) => {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Gradients to solid
    content = content.replace(/bg-gradient-to-r from-indigo-500 to-cyan-500/g, 'bg-purple-500');
    content = content.replace(/bg-gradient-to-tr from-indigo-500 to-cyan-400/g, 'bg-purple-500');
    content = content.replace(/bg-gradient-to-tr from-indigo-500\/20 to-cyan-500\/20/g, 'bg-purple-500/20');
    content = content.replace(/hover:from-indigo-600 hover:to-cyan-600/g, 'hover:bg-purple-600');
    
    // Abstract classes
    content = content.replace(/animated-gradient/g, 'bg-slate-900');
    content = content.replace(/glass/g, 'bg-slate-800 border border-slate-700 shadow-xl');
    content = content.replace(/gradient-text/g, 'text-zinc-100');
    
    // Indigo -> Purple
    content = content.replace(/text-indigo-/g, 'text-purple-');
    content = content.replace(/bg-indigo-/g, 'bg-purple-');
    content = content.replace(/ring-indigo-/g, 'ring-purple-');
    content = content.replace(/shadow-indigo-/g, 'shadow-purple-');
    content = content.replace(/border-indigo-/g, 'border-purple-');

    // Input styles
    content = content.replace(/bg-white\/5/g, 'bg-slate-900/50');
    content = content.replace(/border-white\/10/g, 'border-slate-700');
    
    // Ensure primary text
    content = content.replace(/text-slate-300/g, 'text-slate-200');

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Updated: ' + filePath);
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
