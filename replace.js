const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk(path.join(process.cwd(), 'src'));
let replacements = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;
  
  // Replace Azure link
  content = content.replace(/https:\/\/engram1\.blob\.core\.windows\.net\/tuc-homepage\/Medallions\//g, 'https://storage.googleapis.com/tgl_cdn/images/Medallions/');
  
  // Replace local /Medallions/ links (e.g. '/Medallions/BasaltM.png' or "/Medallions/...")
  content = content.replace(/([\"'\`])\/Medallions\/([a-zA-Z0-9_\-\.]+)([\"'\`])/g, '$1https://storage.googleapis.com/tgl_cdn/images/Medallions/$2$3');
  
  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    replacements++;
    console.log('Fixed ' + file);
  }
}
console.log('Done! Modified ' + replacements + ' files.');
