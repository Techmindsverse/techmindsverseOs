import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://techmindsverse-os.vercel.app';
  const now = new Date();

  return [
    { url: base, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${base}/academy`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/build`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/services`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/products`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/community`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${base}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/team`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/roadmap`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/faq`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/enroll`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/register`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/privacy-policy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/terms-of-service`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/refund-policy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];
}