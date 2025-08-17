import { useState } from 'react'

interface SidebarItemProps {
  icon: string
  text: string
  active?: boolean | undefined
  isCollapsed: boolean
  color?: string | undefined
  badge?: number | undefined
  hasSubItems?: boolean
  isOpen?: boolean
  asButton?: boolean
}

const getIconClasses = (isCollapsed: boolean, active = false) => {
  if (active && !isCollapsed) {
    return 'w-6 h-6 brightness-0 invert'
  }
  if (active && isCollapsed) {
    return 'w-6 h-6 filter-orange'
  }
  return 'w-6 h-6'
}

const renderIcon = (props: SidebarItemProps) => {
  // Only render color dot if there's text to go with it
  if (props.color && props.text) {
    return (
      <span
        className="w-2.5 h-2.5 rounded-full"
        style={{ backgroundColor: props.color }}
      />
    )
  }

  // Only render icon if there's one provided
  if (props.icon) {
    return (
      <img
        alt={props.text}
        className={getIconClasses(props.isCollapsed, props.active)}
        height={24}
        src={props.icon}
        width={24}
      />
    )
  }

  return null
}

export function SidebarItem(props: SidebarItemProps) {
  const [showTooltip, setShowTooltip] = useState(false)

  // Don't render if there's no text
  if (!props.text) {
    return null
  }

  let activeClasses = 'text-white hover:bg-gray-700'
  if (props.active && !props.isCollapsed) {
    activeClasses = 'bg-orange-500 text-white'
  }

  const className = `
    relative flex items-center py-[14px] px-3 gap-[7px]
    font-semibold rounded-[10px] cursor-pointer
    transition-colors group text-base w-full
    ${props.isCollapsed ? 'justify-center' : ''}
    ${activeClasses}
  `

  const content = (
    <>
      {renderIcon(props)}
      <span
        className={`overflow-hidden text-ellipsis whitespace-nowrap transition-all ${props.isCollapsed ? 'w-0' : 'w-52'}`}
      >
        {props.text}
      </span>
      {props.hasSubItems && !props.isCollapsed && (
        <img
          alt="Dropdown"
          className={`w-5 h-5 ml-auto transition-transform ${props.isOpen ? 'rotate-180' : ''}`}
          height={20}
          src="/icons/down.svg"
          width={20}
        />
      )}
      {!props.isCollapsed && props.badge && (
        <div className="ml-auto text-xs bg-[#BABBC1] text-[#1E293B] font-semibold rounded-md px-2 py-1.5">
          {props.badge}
        </div>
      )}
      {/* Tooltip */}
      {showTooltip && props.isCollapsed && (
        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded whitespace-nowrap z-50">
          {props.text}
          {props.badge && <span className="ml-2">({props.badge})</span>}
        </div>
      )}
    </>
  )

  return (
    <div
      className={className}
      onMouseEnter={() => props.isCollapsed && setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {content}
    </div>
  )
}