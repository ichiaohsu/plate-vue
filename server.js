const fs = require('fs')
const path = require('path')
const LRU = require('lru-cache')
const express = require('express')
const favicon = require('serve-favicon')
const compression = require('compression')
const requestIp = require('request-ip')
const resolve = file => path.resolve(__dirname, file)
const { createBundleRenderer } = require('vue-server-renderer')

const isProd = process.env.NODE_ENV === 'production'
// const useMicroCache = process.env.MICRO_CACHE !== 'false'
const serverInfo =
  `express/${require('express/package.json').version} ` +
  `vue-server-renderer/${require('vue-server-renderer/package.json').version}`

const app = express()

const template = fs.readFileSync(resolve('./src/index.template.html'), 'utf-8')

function createRenderer (bundle, options) {
  // https://github.com/vuejs/vue/blob/dev/packages/vue-server-renderer/README.md#why-use-bundlerenderer
  return createBundleRenderer(bundle, Object.assign(options, {
    template,
    // for component caching
    cache: LRU({
      max: 1000,
      maxAge: 1000 * 60 * 15
    }),
    // this is only needed when vue-server-renderer is npm-linked
    basedir: resolve('./dist'),
    // recommended for performance
    runInNewContext: false
  }))
}

app.use(requestIp.mw())
app.set('views', path.join(__dirname, 'src/views'))
app.set('view engine', 'ejs')

let renderer
let readyPromise
if (isProd) {
  // In production: create server renderer using built server bundle.
  // The server bundle is generated by vue-ssr-webpack-plugin.
  const bundle = require('./dist/vue-ssr-server-bundle.json')
  // The client manifests are optional, but it allows the renderer
  // to automatically infer preload/prefetch links and directly add <script>
  // tags for any async chunks used during render, avoiding waterfall requests.
  const clientManifest = require('./dist/vue-ssr-client-manifest.json')
  renderer = createRenderer(bundle, {
    clientManifest
  })
} else {
  // In development: setup the dev server with watch and hot-reload,
  // and create a new renderer on bundle / index template update.
  readyPromise = require('./build/setup-dev-server')(app, (bundle, options) => {
    renderer = createRenderer(bundle, options)
  })
}

const serve = (path, cache) => express.static(resolve(path), {
  maxAge: cache && isProd ? 1000 * 60 * 60 * 24 * 30 : 0
})

app.use(compression({ threshold: 0 }))
app.use(favicon('./public/favicon-48x48.png'))
app.use('/dist', serve('./dist', true))
app.use('/public', serve('./public', true))
app.use('/manifest.json', serve('./manifest.json', true))
app.use('/service-worker.js', serve('./dist/service-worker.js'))

// 1-second microcache.
// https://www.nginx.com/blog/benefits-of-microcaching-nginx/
// const microCache = LRU({
//   max: 100,
//   maxAge: 1000
// })

// since this app has no user-specific content, every page is micro-cacheable.
// if your app involves user-specific content, you need to implement custom
// logic to determine whether a request is cacheable based on its url and
// headers.
// const isCacheable = req => useMicroCache

function render (req, res, next) {
  if (req.url.indexOf('/api/') === 0) {
    next()
    return
  } else if (req.url.indexOf('/404') === 0) {
    res.status(404).render('404')
    return
  }
  const s = Date.now()
  let isPageNotFound = false
  let isErrorOccurred = false  

  const isPreview = req.url.indexOf('preview=true') > -1
  !isPreview && res.setHeader('Cache-Control', 'public, max-age=3600')
  console.log('request ip:', req.clientIp)
  res.setHeader("Content-Type", "text/html")
  res.setHeader("Server", serverInfo)

  const handleError = err => {
    if (err.url) {
      res.redirect(err.url)
    } else if (err && err.code == 404) {
      isPageNotFound = true
      res.status(404).render('404')
      console.log('##########REQUEST URL(404)############')
      console.log('REQUEST URL:', req.url)
      console.error(err)
      console.log('######################')
      console.log('######################')
      return
    } else {
      console.error(`error during renderToString() error : ${req.url}`)
      console.error(err)
      isErrorOccurred = true
      
      if ('403' == err.status) {
        res.status(403).end('403 | Forbidden')
        return
      }
      res.status(500).render('500')
      return 
    } 
  }

  // const cacheable = isCacheable(req)
  // if (cacheable) {
  //   const hit = microCache.get(req.url)
  //   if (hit) {
  //     if (!isProd) {
  //       console.log(`cache hit!`)
  //     }
  //     return res.end(hit)
  //   }
  // }

  const context = {
    title: '',
    meta: '',    
    url: req.url
  }

  res.on('finish', function () {
    if (isPageNotFound || isErrorOccurred) {
      process.exit(1)
    }
  })

  renderer.renderToString(context, (err, html) => {
    if (err) {
      return handleError(err)
    }
    res.end(html)
    // if (cacheable) {
    //   microCache.set(req.url, html)
    // }
    if (!isProd) {
      console.log(`whole request: ${Date.now() - s}ms`)
    }
  })
}

app.get('*', isProd ? render : (req, res, next) => {
  readyPromise.then(() => render(req, res, next))
})

app.use('/api', require('./api/index'))

const port = process.env.PORT || 8080
app.listen(port, () => {
  console.log(`server started at localhost:${port}`)
})