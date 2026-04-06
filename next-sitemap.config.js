module.exports = {
  siteUrl: 'https://dogsparadisebangalore.com',
  generateRobotsTxt: true,
  changefreq: 'weekly',
  exclude: ['/cart', '/admin', '/admin/*', '/auth', '/auth/*'],
  additionalPaths: async (config) => {
    const publicRoutes = ['/', '/about', '/blog', '/breeds', '/contact', '/happy-customers'];
    return Promise.all(publicRoutes.map((route) => config.transform(config, route)));
  },
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/auth'],
      },
    ],
  },
};
