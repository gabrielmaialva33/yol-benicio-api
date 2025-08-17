import {useEffect, useRef, useState} from 'react'

export const useDetectOutsideClick = (initialState: boolean) => {
	const triggerRef = useRef<HTMLButtonElement>(null)
	const nodeRef = useRef<HTMLDivElement>(null)

	const [isActive, setIsActive] = useState(initialState)

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (triggerRef.current?.contains(event.target as Node)) {
				return setIsActive(!isActive)
			}

			if (!nodeRef.current?.contains(event.target as Node)) {
				return setIsActive(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)

		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [isActive])

	return {triggerRef, nodeRef, isActive, setIsActive}
}
