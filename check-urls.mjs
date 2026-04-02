import fs from 'fs';
import https from 'https';

const content = fs.readFileSync('data/dogs.ts', 'utf-8');
const urls = [...content.matchAll(/https:\/\/images\.unsplash\.com\/photo-[a-zA-Z0-9-]+\?w=800&h=600&q=80&auto=format&fit=crop/g)].map(m => m[0]);
// Also get 1200x675
const contentBlog = fs.readFileSync('data/blog-posts.ts', 'utf-8');
const urlsBlog = [...contentBlog.matchAll(/https:\/\/images\.unsplash\.com\/photo-[a-zA-Z0-9-]+\?w=1200&h=675&q=80&auto=format&fit=crop/g)].map(m => m[0]);

const allUrls = [...new Set([...urls, ...urlsBlog])];

console.log(`Testing ${allUrls.length} unique Unsplash URLs...`);

let badCount = 0;
let checkedCount = 0;

allUrls.forEach(url => {
  https.get(url, (res) => {
    checkedCount++;
    if (res.statusCode !== 200 && res.statusCode !== 301 && res.statusCode !== 302) {
       console.log(`BROKEN [${res.statusCode}]: ${url.split('?')[0]}`);
       badCount++;
    }
    if (checkedCount === allUrls.length) {
       console.log(`Done. ${badCount} broken URLs found.`);
    }
  }).on('error', (e) => {
    checkedCount++;
    console.log(`ERROR checking ${url.split('?')[0]}: ${e.message}`);
    if (checkedCount === allUrls.length) {
       console.log(`Done. ${badCount} broken URLs found.`);
    }
  });
});
