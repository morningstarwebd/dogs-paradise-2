import fs from 'fs';

const dogMap = {
  1: 'photo-1552053831-71594a27632d',
  2: 'photo-1633722715463-d30f4f325e24',
  3: 'photo-1612774412771-005ed8e861d2',
  4: 'photo-1591160690555-5debfba0c36a',
  5: 'photo-1587300003388-59208cc962cb',
  6: 'photo-1579213838826-4e8728e3a0ab',
  7: 'photo-1589941013453-ec89f33b5e95',
  8: 'photo-1568572933382-74d440642b75',
  9: 'photo-1619447510631-5148cc3e517c',
  10: 'photo-1605568427561-40dd23c2acea',
  11: 'photo-1585559604959-6388fe69e1c4',
  12: 'photo-1587559045816-8b0a54d1ce3c',
  13: 'photo-1558929996-da64ba858215',
  14: 'photo-1546527868-ccb7ee7dfa6a',
  15: 'photo-1583511655857-d19b40a7a54e',
  16: 'photo-1583337130417-13104dec14a5',
  17: 'photo-1560807707-8cc77767d783',
  18: 'photo-1576201836106-db1758fd1c97',
  19: 'photo-1537151625747-768eb6cf92b2',
  20: 'photo-1561037404-61cd46aa615b',
  21: 'photo-1544568100-847a948585b9',
  22: 'photo-1530281700549-e82e7bf110d6',
  23: 'photo-1477884213360-7e9d7dcc8f9b',
  24: 'photo-1518020382113-a7e8fc38eac9',
  25: 'photo-1494947665470-20322015e3a8',
  26: 'photo-1615497001839-b0a0eac3274c',
  27: 'photo-1588943211346-0908a1fb0b01',
  28: 'photo-1568393691622-c7ba131d63b4',
  29: 'photo-1517849845537-4d257902454a',
  30: 'photo-1598133894008-61f7fdb8cc3a',
  31: 'photo-1596492784531-6e6eb5ea9993',
  32: 'photo-1583512603805-3cc6b41f3edb',
  33: 'photo-1587764379873-97837921fd44',
  34: 'photo-1477884213360-7e9d7dcc8f9b',
  35: 'photo-1568572933382-74d440642b75',
  36: 'photo-1586671267731-da2cf3ceeb80',
};

const blogMap = {
  50: 'photo-1587300003388-59208cc962cb',
  51: 'photo-1552053831-71594a27632d',
  52: 'photo-1601758228041-f3b2795255f1',
  53: 'photo-1548199973-03cce0bbc87b',
  54: 'photo-1537151625747-768eb6cf92b2',
};

// Fix dogs.ts
let dogsContent = fs.readFileSync('data/dogs.ts', 'utf-8');

// Replace corrupted ones like ?id=13crop0 to a clean state first if they exist, but let's do regex replace 
// We will replace placedog URLs.
for (const [id, photo] of Object.entries(dogMap)) {
  // Use regex to avoid replacing `?id=1` inside `?id=10`
  const regex = new RegExp(`https://placedog.net/800/600\\?id=${id}\\b`, 'g');
  // Also we must fix the broken 1591160690555
  let replacement = photo === 'photo-1591160690555-5debfba0c36a' 
    ? 'photo-1579213838826-4e8728e3a0ab' : photo;
  dogsContent = dogsContent.replace(regex, `https://images.unsplash.com/${replacement}?w=800&h=600&q=80&auto=format&fit=crop`);
}

// Ensure the broken 404 is fixed anywhere else
dogsContent = dogsContent.replace(/photo-1591160690555-5debfba0c36a/g, 'photo-1579213838826-4e8728e3a0ab');

fs.writeFileSync('data/dogs.ts', dogsContent);
console.log('✅ dogs.ts updated');

// Fix blog-posts.ts
let blogContent = fs.readFileSync('data/blog-posts.ts', 'utf-8');
for (const [id, photo] of Object.entries(blogMap)) {
  const regex = new RegExp(`https://placedog.net/1200/675\\?id=${id}\\b`, 'g');
  blogContent = blogContent.replace(regex, `https://images.unsplash.com/${photo}?w=1200&h=675&q=80&auto=format&fit=crop`);
}
fs.writeFileSync('data/blog-posts.ts', blogContent);
console.log('✅ blog-posts.ts updated');

console.log('Done! All placedog.net URLs replaced with Unsplash.');
