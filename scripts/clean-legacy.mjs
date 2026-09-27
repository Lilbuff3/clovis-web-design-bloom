import fs from 'node:fs';
import path from 'node:path';

const filesToDelete = [
  'src/components/Preloader.tsx',
  'src/lib/smooth.ts',
  'src/lib/motion.ts',
  'src/main.tsx',
  'src/App.tsx',
  'vite.config.ts',
  'index.html',
];

for (const rel of filesToDelete) {
  const fullPath = path.resolve(rel);
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
    console.log(`Deleted: ${rel}`);
  } else {
    console.log(`Already removed: ${rel}`);
  }
}
