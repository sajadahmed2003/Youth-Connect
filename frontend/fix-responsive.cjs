const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/admin/Desktop/minoor/frontend/src/pages';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace style={{ display: 'grid' ... with className="responsive-grid" style={{ display: 'grid' ...
  // Need to handle both spacing variations
  content = content.replace(/style=\{\{\s*display:\s*'grid'/g, 'className="responsive-grid" style={{ display: \'grid\'');
  
  fs.writeFileSync(filePath, content);
});

// Also do Auth.jsx
const authPath = 'c:/Users/admin/Desktop/minoor/frontend/src/pages/Auth.jsx';
if (fs.existsSync(authPath)) {
  let content = fs.readFileSync(authPath, 'utf8');
  content = content.replace(/style=\{\{\s*display:\s*'grid'/g, 'className="responsive-grid" style={{ display: \'grid\'');
  fs.writeFileSync(authPath, content);
}

// App.jsx for flex containers
const appPath = 'c:/Users/admin/Desktop/minoor/frontend/src/App.jsx';
if (fs.existsSync(appPath)) {
  let content = fs.readFileSync(appPath, 'utf8');
  content = content.replace(/style=\{\{\s*display:\s*'flex',\s*justifyContent:\s*'space-between'/g, 'className="responsive-flex-between" style={{ display: \'flex\', justifyContent: \'space-between\'');
  fs.writeFileSync(appPath, content);
}

console.log("Done");
