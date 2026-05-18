export default defineAppConfig({
  ui: {
    primary: 'rose', // Default standard UI color, we'll override using tailwind config or custom CSS
    gray: 'cool',
    button: {
      rounded: 'rounded-full',
      default: {
        size: 'lg'
      }
    }
  }
})
