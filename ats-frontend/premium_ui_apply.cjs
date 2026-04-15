const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const replaceInFile = (filePath) => {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Backgrounds for full pages (Login/Register)
    content = content.replace(/className="min-h-screen bg-app-bg/g, 'className="min-h-screen premium-bg');
    
    // Cards: Remove existing border/shadow classes and replace with premium-card
    content = content.replace(/bg-app-card border border-app-border shadow-xl rounded-2xl/g, 'premium-card rounded-2xl');
    
    // Buttons: Replace app-primary with premium-button
    // We look for bg-app-primary followed by text-app-text which is our standard button pattern
    content = content.replace(/bg-app-primary text-app-text/g, 'premium-button');
    content = content.replace(/hover:bg-app-primary-hover/g, ''); // Handled by premium-button class
    
    // Glassmorphism for specific elements
    content = content.replace(/bg-app-bg\/50/g, 'premium-glass');

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Premium UI applied: ' + filePath);
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
