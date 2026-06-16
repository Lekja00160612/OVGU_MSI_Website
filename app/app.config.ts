export default defineAppConfig({
  ui: {
    colors: {
      primary: 'orange',  // MSI brand orange (#E87722 ≈ Tailwind orange-500)
      neutral: 'slate',
    },

    toast: {
      slots: {
        // Override only the visual properties — structural defaults (flex, gap, ring) are preserved
        // bg-default → our dark navy | ring-default → orange accent ring | rounded-lg → rounded-xl
        root: 'relative group overflow-hidden bg-[#0f2240] shadow-[0_12px_40px_rgba(0,0,0,.55),0_2px_10px_rgba(232,119,34,.12)] rounded-xl ring-1 ring-[rgba(232,119,34,.3)] p-4 flex gap-2.5 focus:outline-none border-l-[3px] border-l-[#e87722]',

        // Structural slots: required because app.config overrides are not deep-merged for slots
        wrapper: 'w-0 flex-1 flex flex-col',
        actions: 'flex gap-1.5 shrink-0',
        avatar: 'shrink-0',
        avatarSize: '2xl',

        // text-highlighted → white | text-sm font-medium preserved
        title: 'text-sm font-bold text-white tracking-tight',

        // text-muted → slate-400
        description: 'text-sm text-slate-400 leading-relaxed',

        // Keep size-5, just set color
        icon: 'shrink-0 size-5 text-[#e87722]',

        // Progress bar — thin orange indicator
        progress: 'absolute inset-x-0 bottom-0',

        // Close button — p-0 is default, keep it, let variant colors handle the rest
        close: 'p-0 hover:text-[#e87722] transition-colors duration-150',
      },

      variants: {
        color: {
          // Override primary color variant to use our orange ring/outline
          primary: {
            root: 'outline-[#e87722]/25 focus-visible:outline-3 focus-visible:ring-[#e87722]',
            icon: 'text-[#e87722]',
          },
        },
        orientation: {
          // Keep vertical as default: actions stacked below description
          vertical: {
            root: 'items-start',
            actions: 'items-start mt-2.5',
          },
          horizontal: {
            root: 'items-center',
            actions: 'items-center',
          },
        },
        title: {
          true: {
            description: 'mt-1',
          },
        },
      },

      defaultVariants: {
        color: 'primary',
        orientation: 'vertical',
      },
    },
  },
})

