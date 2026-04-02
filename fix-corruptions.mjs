import fs from 'fs';

let content = fs.readFileSync('data/dogs.ts', 'utf-8');

// Fix the cropX appendings from the bad replace
content = content.replace(/fit=crop\d+/g, 'fit=crop');

// Fix the 404 image
content = content.replace(/photo-1579213838826-4e8728e3a0ab/g, 'photo-1583511655857-d19b40a7a54e');

fs.writeFileSync('data/dogs.ts', content);
console.log('✅ Fixes applied to dogs.ts');
