const plugin = require('tailwindcss/plugin')

/** @type {import('tailwindcss').Config} */
export default {
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
          maxWidth: theme('columns.7xl'), // Sử dụng maxWidth từ theme
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: theme('spacing.4'), // Sử dụng spacing từ theme
          paddingRight: theme('spacing.4') // Sử dụng spacing từ theme
        }
      })
    }),
    require('@tailwindcss/line-clamp')
  ]
}
