import { Loader2Icon } from "lucide-react"

type Variant = "primary" | "secondary" | "ghost";
type Size = "small" | "medium" | "large";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
  children?: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
}


const Button = ({
  variant = "primary",
  size = "medium",
  isLoading = false,
  children,
  icon: Icon,
  ...props
}: ButtonProps) => {

  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"

  const variantClasses = {
    primary: "bg-blue-900 hover:bg-blue-800 text-white",
    secondary: "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200",
    ghost: "bg-transparent hover:bg-slate-100 text-slate-700"
  }

  const sizeClasses = {
    small: "px-3 py-1 h-8 text-sm",
    medium: "px-4 py-2 h-10 text-sm",
    large: "px-6 py-3 h-12 text-base",
  }

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2Icon className="w-5 h-5 animate-spin" />
      ) : (
        <>
          {Icon && <Icon className="w-4 h-4 mr-2" />}
          {children}
        </>
      )}
    </button>
  )
}

export default Button