import type { ToggleSwitchProps } from '@/features/folders/types'

export function ToggleSwitch({
  label,
  checked = false,
  onChange,
  disabled = false,
  description,
  size = 'md',
  'aria-label': ariaLabel,
  ...props
}: ToggleSwitchProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const sizeClasses = {
    sm: {
      switch: 'h-5 w-9',
      thumb: 'h-4 w-4',
      translate: 'translate-x-4',
    },
    md: {
      switch: 'h-6 w-11',
      thumb: 'h-5 w-5',
      translate: 'translate-x-5',
    },
    lg: {
      switch: 'h-7 w-13',
      thumb: 'h-6 w-6',
      translate: 'translate-x-6',
    },
  }

  const currentSize = sizeClasses[size]

  const handleClick = () => {
    if (!disabled) {
      onChange?.(!checked)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      handleClick()
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={ariaLabel || label}
        disabled={disabled}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={`
          relative inline-flex flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
          transition-colors duration-200 ease-in-out 
          focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed
          ${currentSize.switch}
          ${checked ? 'bg-cyan-600' : 'bg-gray-200'}
        `}
        {...props}
      >
        <span
          aria-hidden="true"
          className={`
            pointer-events-none inline-block transform rounded-full bg-white shadow ring-0 
            transition duration-200 ease-in-out
            ${currentSize.thumb}
            ${checked ? currentSize.translate : 'translate-x-0'}
          `}
        />
      </button>

      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        {description && <span className="text-xs text-gray-500">{description}</span>}
      </div>
    </div>
  )
}
