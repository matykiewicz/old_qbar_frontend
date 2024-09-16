
importScripts('/{{country_code_lc}}/static/_url_workbox/workbox-sw.js')

if (workbox) {

  console.log(`Yay! Workbox is loaded`);

  workbox.setConfig({
    modulePathPrefix: '/{{country_code_lc}}/static/_url_workbox/',
    debug: true
  });

  workbox.loadModule('workbox-expiration');
  workbox.loadModule('workbox-routing');
  workbox.loadModule('workbox-strategies');


  workbox.core.setCacheNameDetails({
    prefix: 'qbar',
    suffix: 'v1.1',
    precache: 'precache',
    runtime: 'runtime'
  })

  workbox.precaching.precacheAndRoute([
    // precached file list
    {url: '/{{country_code_lc}}/static/android-chrome-192x192.png', revision: 1},
    {url: '/{{country_code_lc}}/static/android-chrome-512x512.png', revision: 2},
    {url: '/{{country_code_lc}}/static/apple-touch-icon-precomposed.png', revision: 1},
    {url: '/{{country_code_lc}}/static/apple-touch-icon.png', revision: 1},
    {url: '/{{country_code_lc}}/static/favicon.ico', revision: 1},
    {url: '/{{country_code_lc}}/static/favicon-16x16.png', revision: 1},
    {url: '/{{country_code_lc}}/static/favicon-32x32.png', revision: 1},
    {url: '/{{country_code_lc}}/static/_url_bootstrap/bootstrap.min.js', revision: 1},
    {url: '/{{country_code_lc}}/static/_url_darkly/bootstrap.min.css', revision: 1},
    {url: '/{{country_code_lc}}/static/_url_flatly/bootstrap.min.css', revision: 1},
    {url: '/{{country_code_lc}}/static/_url_popper/popper.min.js', revision: 1},
    {url: '/{{country_code_lc}}/static/_url_jquery/jquery.min.js', revision: 1},
    {url: '/{{country_code_lc}}/static/_url_qbartech/glg.js', revision: 1},
    {url: '/{{country_code_lc}}/static/_url_qbartech/theme.js', revision: 1},
    {url: '/{{country_code_lc}}/static/_url_bootswatch_custom/custom.min.css', revision: 1},
    {url: '/{{country_code_lc}}/static/_url_font_awesome/font-awesome.min.css', revision: 1},
    {url: '/{{country_code_lc}}/static/fonts/fontawesome-webfont.ttf', revision: 1},
    {url: '/{{country_code_lc}}/static/fonts/fontawesome-webfont.woff', revision: 1},
    {url: '/{{country_code_lc}}/static/fonts/fontawesome-webfont.woff2', revision: 1},
    {url: '/{{country_code_lc}}/app.js', revision: 1},
    {url: '/{{country_code_lc}}/site.webmanifest', revision: 1},
    {url: '/{{country_code_lc}}/', revision: 1}
  ])

  workbox.routing.registerRoute(
    ({url}) => url.origin === 'https://fonts.googleapis.com' ||
               url.origin === 'https://fonts.gstatic.com',
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'google-fonts',
      plugins: [
        new workbox.expiration.ExpirationPlugin({maxEntries: 20}),
      ],
    }),
  );

  // Serve all css files with StaleWhileRevalidate strategy
  workbox.routing.registerRoute(
    /\.js$/,
    new workbox.strategies.StaleWhileRevalidate()
  )

  // Serve all css files with StaleWhileRevalidate strategy
  workbox.routing.registerRoute(
    /\.css$/,
    new workbox.strategies.StaleWhileRevalidate()
  )

  // Serve all other assets with CacheFirst strategy
  workbox.routing.registerRoute(
    /\.(?:png|jpg|jpeg|svg|gif|ico|eot,ttf,woff,woff2)$/,
    new workbox.strategies.CacheFirst({
      cacheName: 'image-cache',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 20,
          maxAgeSeconds: 30 * 24 * 60 * 60
        })
      ]
    })
  )

  var theme = "flatly"

  addEventListener('message', (event) => {
    if (event.data && event.data["theme"]) {
      theme = event.data["theme"]
    }
  });

  const headerPlugin = {
    requestWillFetch: async ({request, event, state}) => {
      headers = new Headers({"X-Theme": theme});
      new_request = new Request(event.request, {headers: headers});
      return new_request;
    }
  }

  workbox.routing.registerRoute(
    new RegExp('.*'),
    new workbox.strategies.NetworkFirst({
      plugins: [
        headerPlugin,
      ]
    })
  );

  workbox.core.clientsClaim();
  self.skipWaiting();

}