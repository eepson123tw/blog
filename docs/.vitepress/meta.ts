import { version } from '../../package.json'

// base info
export const name = 'ChoDocs'
export const site = 'https://chodocs.cn/'
export const logo = 'https://chodocs.cn/chodocs-logo.svg'
export const keywords = '前端開發、React、Vue、Next.js、coding、github'
export const description = ''

// social link
export const github = 'https://github.com/eepson123tw/blog'

// docs version
export const docsVersion = version

/* PWA runtime caching urlPattern regular expressions */
/* eslint-disable prefer-regex-literals */
export const githubSourceContentRegex = new RegExp(
  '^https://(((raw|user-images|camo).githubusercontent.com))/.*',
  'i'
)
export const googleFontRegex = new RegExp(
  '^https://fonts.googleapis.com/.*',
  'i'
)
export const googleStaticFontRegex = new RegExp(
  '^https://fonts.gstatic.com/.*',
  'i'
)
export const jsdelivrCDNRegex = new RegExp('^https://cdn.jsdelivr.net/.*', 'i')
