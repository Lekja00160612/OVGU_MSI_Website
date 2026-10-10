export default defineAppConfig({
  ui: {
    colors: {
      primary: 'primary',    // MSI / VGU Brand Orange (#E87722)
      secondary: 'secondary',// OVGU Cyan (#009FDF)
      neutral: 'neutral',    // Slate Neutral scale
    },
    button: {
      slots: {
        base: 'font-bold rounded-xl transition-all duration-200 cursor-pointer shadow-xs active:scale-[0.98] inline-flex items-center justify-center',
      },
      variants: {
        size: {
          xs: { base: 'px-2.5 py-1 text-xs gap-1' },
          sm: { base: 'px-3.5 py-1.5 text-xs gap-1.5' },
          md: { base: 'px-4 py-2 text-sm gap-2' },
          lg: { base: 'px-5 py-2.5 text-base gap-2.5' },
          xl: { base: 'px-6 py-3 text-lg gap-3' },
        },
      },
      defaultVariants: {
        color: 'primary',
        variant: 'solid',
        size: 'md',
      },
    },
    card: {
      defaultVariants: {
        variant: 'outline',
      },
    },
    badge: {
      defaultVariants: {
        size: 'sm',
        variant: 'subtle',
      },
    },
    tabs: {
      defaultVariants: {
        color: 'primary',
        variant: 'pill',
        size: 'md',
      },
    },
  },
})
