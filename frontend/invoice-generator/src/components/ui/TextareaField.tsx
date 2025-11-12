import type { LucideIcon } from "lucide-react";

interface TextareaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  icon?: LucideIcon;
  label: string;
  name: string;
}

const TextareaField = ({
  icon: Icon,
  label,
  name,
  ...props
}: TextareaFieldProps) => {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-slate-700 mb-2"
      >
        {label}
      </label>

      <div className="relative">
        {Icon && (
          <div className="absolute top-3 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="w-5 h-5 text-slate-400" />
          </div>
        )}

        <textarea
          name={name}
          id={name}
          // rows={3}
          {...props}
          className={`w-full min-h-[100px] pr-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate-400 ${Icon ? "pl-10" : "pl-3"}`}
        >
        </textarea>
      </div>

    </div>
  )
}

export default TextareaField;