export const dashboardConfig = {
  widgets: [
    // Document List Widget - Recent Posts
    {
      name: 'sanity-plugin-dashboard-widget-document-list',
      options: {
        title: 'Recent Blog Posts',
        order: '_createdAt desc',
        types: ['post'],
        limit: 10,
      },
      layout: {x: 0, y: 0, w: 2, h: 2},
    },
    
    // Document List Widget - Recent Authors
    {
      name: 'sanity-plugin-dashboard-widget-document-list', 
      options: {
        title: 'Authors',
        order: '_createdAt desc',
        types: ['author'],
        limit: 5,
      },
      layout: {x: 2, y: 0, w: 1, h: 2},
    },
    
    // Document List Widget - Recent Media
    {
      name: 'sanity-plugin-dashboard-widget-document-list',
      options: {
        title: 'Recent Media Assets',
        order: '_createdAt desc', 
        types: ['mediaAsset'],
        limit: 8,
      },
      layout: {x: 0, y: 2, w: 3, h: 2},
    },
    
    // Vercel deployments widget
    {
      name: 'sanity-plugin-dashboard-widget-vercel',
      options: {
        title: 'Vercel Deployments',
        // You'll need to configure this with your Vercel project details
      },
      layout: {x: 0, y: 4, w: 3, h: 1},
    },
  ],
}
