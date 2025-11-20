import type { SelectHTMLAttributes } from "react";

interface SelectfieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  name: string;
  options: string[];
}

const Selectfield = ({ label, name, options, ...props }: SelectfieldProps) => {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-slate-700 mb-2">
        {label}
      </label>

      <select
        name={name}
        id={name}
        {...props}
        className="w-full h-10 px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-900"
      >
        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}
      </select>
    </div>
  )
}

export default Selectfield;