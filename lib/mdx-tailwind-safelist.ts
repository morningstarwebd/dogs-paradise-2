// This file exists solely to force Tailwind CSS v4 to compile these specific utility classes
// that are used dynamically in MDX pages (like Terms of Service and Privacy Policy).
// Since Tailwind v4 scans files, just having this file in the `src` directory is enough.

export const mdxSafelist = [
    // Layout & Spacing
    "max-w-3xl",
    "mx-auto",
    "py-12",
    "px-6",
    "mb-16",
    "mb-6",
    "mb-4",
    "mt-16",
    "pt-8",
    "space-y-12",
    "space-y-3",
    "p-8",
    "pl-4",
    "pl-6",

    // Typography
    "text-center",
    "text-4xl",
    "md:text-6xl",
    "text-2xl",
    "text-lg",
    "text-sm",
    "font-display",
    "font-bold",
    "font-medium",
    "leading-relaxed",
    "italic",

    // Colors
    "text-foreground",
    "text-muted-foreground",
    "text-accent",
    "text-background",
    "bg-accent/10",
    "bg-card/50",
    "bg-foreground",
    "bg-accent",
    "hover:bg-foreground/90",

    // Borders
    "border",
    "border-t",
    "border-l-2",
    "border-accent/20",
    "border-border/50",
    "border-border",
    "hover:border-accent/30",

    // Flex & Positioning
    "inline-flex",
    "items-center",
    "justify-center",
    "justify-between",
    "flex",
    "flex-col",
    "sm:flex-row",
    "gap-3",
    "gap-4",
    "relative",
    "absolute",
    "left-0",
    "top-2",

    // Sizing & Radius
    "w-8",
    "h-8",
    "w-1.5",
    "h-1.5",
    "h-10",
    "rounded-full",
    "rounded-2xl",

    // Effects & Transitions
    "transition-colors",
    "duration-300",
    "duration-700",

    // Animations (tw-animate-css)
    "animate-in",
    "fade-in",
    "slide-in-from-bottom-8",
    "delay-150",
    "fill-mode-both",

    // Pseudo-elements
    "before:absolute",
    "before:left-0",
    "before:top-2",
    "before:h-1.5",
    "before:w-1.5",
    "before:bg-accent",
    "before:rounded-full"
];
