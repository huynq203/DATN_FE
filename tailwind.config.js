const plugin = require('tailwindcss/plugin')
const withMT = require('@material-tailwind/react/utils/withMT') // ✅ Bổ sung dòng này

/** @type {import('tailwindcss').Config} */
module.exports = withMT({
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  corePlugins: {
    container: false
  },
  theme: {
    extend: {
      fontFamily: {
        Josephin: ['Josefin Sans', 'sans-serif']
      }
    }
  },
  plugins: [
    plugin(function ({ addComponents, theme }) {
      addComponents({
        '.container': {
          maxWidth: theme('columns.7xl'),
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: theme('spacing.4'),
          paddingRight: theme('spacing.4')
        }
      })
    }),
    require('@tailwindcss/line-clamp')
  ]
})
