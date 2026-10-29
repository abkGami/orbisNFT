import { useState } from 'react'
import { cn } from '../../lib/cn'

type AccordionItem = { q: string; a: string }

type AccordionProps = {
  items: readonly AccordionItem[]
  className?: string
}

/** Single-open accordion using native buttons and the grid-rows height trick. */
export function Accordion({ items, className }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {items.map((item, index) => {
        const open = openIndex === index
        const buttonId = `faq-question-${index}`
        const panelId = `faq-answer-${index}`
        return (
          <div key={item.q} className="liquid-glass rounded-[24px] px-6 py-5">
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenIndex(open ? -1 : index)}
                className="flex min-h-11 w-full items-center justify-between gap-6 text-left font-grotesk text-[20px] uppercase leading-tight text-cream transition-colors duration-200 hover:text-neon md:text-[26px]"
              >
                <span>{item.q}</span>
                <span
                  aria-hidden="true"
                  className={cn(
                    'shrink-0 font-mono text-[26px] font-light leading-none text-neon transition-transform duration-300 ease-out-expo',
                    open && 'rotate-45',
                  )}
                >
                  +
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className="grid transition-[grid-template-rows] duration-[400ms] ease-out-expo"
              style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
            >
              <div className="overflow-hidden">
                <p className="whitespace-pre-line pt-4 font-mono text-[14px] uppercase leading-relaxed text-cream/80">
                  {item.a}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
