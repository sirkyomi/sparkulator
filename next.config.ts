const isProd = process.env.NODE_ENV === 'production'
const basePath = isProd ? '/sparkulator' : ''

export default {
  basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
}
