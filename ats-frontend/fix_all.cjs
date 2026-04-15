const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const updateJobs = (filePath) => {
    let content = fs.readFileSync(filePath, 'utf8');
    // Fix imports
    content = content.replace(/DollarSign/g, 'IndianRupee');
    // Fix symbols
    content = content.replace(/\$/g, '?');
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed Jobs UI: ' + filePath);
}

const updateApplications = (filePath) => {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Add missing skills UI logic
    const skillMatchSection = 
  {/* NEW: Skill Match Details for Recruiters */}
  {(isAdmin() || isRecruiter()) && (app.matchedSkills?.length > 0 || app.missingSkills?.length > 0) && (
    <div className=\"mt-4 pt-4 border-t border-app-border/50\">
      <div className=\"flex flex-wrap gap-4\">
        {app.matchedSkills?.length > 0 && (
          <div>
            <p className=\"text-[10px] uppercase tracking-wider text-green-400/70 font-bold mb-1.5\">Matched Skills</p>
            <div className=\"flex flex-wrap gap-1.5\">
              {app.matchedSkills.map(skill => (
                <span key={skill} className=\"px-2 py-0.5 bg-green-500/10 text-green-400 rounded-md text-[11px] border border-green-500/20\">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
        {app.missingSkills?.length > 0 && (
          <div>
            <p className=\"text-[10px] uppercase tracking-wider text-red-400/70 font-bold mb-1.5\">Missing Skills</p>
            <div className=\"flex flex-wrap gap-1.5\">
              {app.missingSkills.map(skill => (
                <span key={skill} className=\"px-2 py-0.5 bg-red-500/10 text-red-400 rounded-md text-[11px] border border-red-500/20\">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )}
;
    // Find the end of the metadata div and insert
    const insertPoint = \"{app.hasResume && (\";
    if (content.includes(insertPoint)) {
        // We find the closing brace of the flex-items-center div where hasResume is located
        // Actually, just find the closing tag of that div block.
        // Simplified: Insert after the entire metadata div block (around line 206)
        content = content.replace('      </div>\\n          </div>\\n        </div>\\n\\n        <div className=\"flex items-center gap-3\">', '      </div>\\n          </div>\\n' + skillMatchSection + '        </div>\\n\\n        <div className=\"flex items-center gap-3\">');
    }
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed Applications UI: ' + filePath);
}

const walkDir = (dir) => {
    fs.readdirSync(dir).forEach(file => {
        let fullPath = path.join(dir, file);
        if (fs.lstatSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else if (file === 'Jobs.jsx') {
            updateJobs(fullPath);
        } else if (file === 'Applications.jsx') {
            updateApplications(fullPath);
        } else if (file === 'Dashboard.jsx') {
            updateJobs(fullPath); // Simple currency swap
        }
    });
}

walkDir(srcDir);
