import { FloatingPortal, useFloating, arrow, offset, shift, type Placement } from '@floating-ui/react-dom-interactions'
import { AnimatePresence, motion } from 'framer-motion'
import { useRef, useState, useId, ElementType } from 'react'
interface Props {
  className?: string
  children: React.ReactNode
  renderPopover: React.ReactNode
  as?: ElementType
  initialOpen?: boolean
  placement?: Placement
}

export default function Popover({
  children,
  renderPopover,
  className,
  as: Element = 'div',
  initialOpen,
  placement = 'bottom-end'
}: Props) {
  const [open, setOpen] = useState(initialOpen || false)
  const arrowRef = useRef<HTMLElement>(null)
  const { x, y, reference, floating, strategy, middlewareData } = useFloating({
    middleware: [
      offset(6),
      shift(),
      arrow({
        element: arrowRef
      })
    ]
  })
  const showPopover = () => {
    setOpen(true)
  }
  const hidePopover = () => {
    setOpen(false)
  }
  const id = useId()
  return (
    <>
      <Element className={className} ref={reference} onMouseEnter={showPopover} onMouseLeave={hidePopover}>
        {children}
        <FloatingPortal id={id}>
          <AnimatePresence>
            {open && (
              <motion.div
                ref={floating}
                style={{
                  position: strategy,
                  top: y ?? 0,
                  left: x ?? 0,
                  width: 'max-content',
                  transformOrigin: `${middlewareData.arrow?.x}px top`
                }}
                initial={{ opacity: 0, transform: 'scale(0)' }}
                animate={{ opacity: 1, transform: 'scale(1)' }}
                exit={{ opacity: 0, transform: 'scale(0)' }}
                transition={{ duration: 0.2 }}
              >
                <span
                  ref={arrowRef}
                  className='border-x-transparent border-t-transparent border-b-white border-[11px] absolute z-10 -translate-y-6 '
                  style={{
                    left: middlewareData.arrow?.x,
                    top: middlewareData.arrow?.y
                  }}
                />
                {renderPopover}
              </motion.div>
            )}
          </AnimatePresence>
        </FloatingPortal>
      </Element>
    </>
  )
}
