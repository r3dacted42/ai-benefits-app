import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      style={{
        '--normal-bg': 'var(--popover)',
        '--normal-text': 'var(--popover-foreground)',
        '--normal-border': 'var(--border)',
        '--toast-icon-margin-start': 'calc(var(--spacing) * 1)',
        '--toast-icon-margin-end': 'calc(var(--spacing) * 4)',
      } as React.CSSProperties}
      className="toaster group"
      {...props}
    />
  )
}

export { Toaster }
