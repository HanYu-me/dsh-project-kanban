/**
 * Inline SVG icons (stroke = currentColor), so they follow the theme.
 * @module dsh-project-kanban/client/icons
 */
import type { ReactElement } from 'react'

interface IconProps {
  size?: number
  className?: string
}

function svg(size: number, className: string | undefined, children: ReactElement | ReactElement[], strokeWidth = 1.7): ReactElement {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {children}
    </svg>
  )
}

/** Sidebar glyph: a board with three columns of cards. */
export const BoardIcon = ({ size = 16, className }: IconProps) =>
  svg(size, className, [
    <rect key="a" x="3" y="4" width="18" height="16" rx="3" />,
    <path key="b" d="M9 4v16M15 4v16" />,
    <path key="c" d="M5.5 8h1.5M11 8h2M11 11.5h2M17 8h1.5" strokeWidth={2.2} />,
  ])

export const PlusIcon = ({ size = 16, className }: IconProps) => svg(size, className, <path d="M12 5v14M5 12h14" />)

export const ChevronIcon = ({ size = 16, className }: IconProps) => svg(size, className, <path d="m9 6 6 6-6 6" />)

export const MoreIcon = ({ size = 16, className }: IconProps) =>
  svg(size, className, [<circle key="a" cx="5.5" cy="12" r="1.2" />, <circle key="b" cx="12" cy="12" r="1.2" />, <circle key="c" cx="18.5" cy="12" r="1.2" />], 2)

export const PencilIcon = ({ size = 16, className }: IconProps) =>
  svg(size, className, <path d="M4 20h4L19 9a2.1 2.1 0 0 0-3-3L5 17v3Z M14.5 7.5l3 3" />)

export const TrashIcon = ({ size = 16, className }: IconProps) =>
  svg(size, className, <path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3" />)

export const ArrowRightIcon = ({ size = 16, className }: IconProps) => svg(size, className, <path d="M5 12h14M13 6l6 6-6 6" />)

export const UndoIcon = ({ size = 16, className }: IconProps) => svg(size, className, <path d="M9 14 4 9l5-5M4 9h10a6 6 0 0 1 0 12h-3" />)

export const CheckIcon = ({ size = 16, className }: IconProps) => svg(size, className, <path d="m5 12.5 4.5 4.5L19 7.5" />, 2.2)

export const CloseIcon = ({ size = 16, className }: IconProps) => svg(size, className, <path d="M6 6l12 12M18 6 6 18" />)

export const NoteIcon = ({ size = 16, className }: IconProps) => svg(size, className, <path d="M5 6h14M5 12h14M5 18h9" />)

export const ArrowUpIcon = ({ size = 16, className }: IconProps) => svg(size, className, <path d="M12 19V5M6 11l6-6 6 6" />)

export const ArrowDownIcon = ({ size = 16, className }: IconProps) => svg(size, className, <path d="M12 5v14M6 13l6 6 6-6" />)

export const AlertIcon = ({ size = 16, className }: IconProps) =>
  svg(size, className, <path d="M12 8v5M12 16.5v.01M10.3 3.9 2.6 17.3A2 2 0 0 0 4.3 20h15.4a2 2 0 0 0 1.7-2.7L13.7 3.9a2 2 0 0 0-3.4 0Z" />)

export const ArrowLeftIcon = ({ size = 16, className }: IconProps) => svg(size, className, <path d="M19 12H5M11 6l-6 6 6 6" />)

/** A group of things: a folder. */
export const FolderIcon = ({ size = 16, className }: IconProps) =>
  svg(size, className, <path d="M3 7a2 2 0 0 1 2-2h4l2 2.5h8a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />)

export const FolderPlusIcon = ({ size = 16, className }: IconProps) =>
  svg(size, className, [<path key="a" d="M3 7a2 2 0 0 1 2-2h4l2 2.5h8a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />, <path key="b" d="M12 11v5M9.5 13.5h5" />])

/** A piece of data: a file. */
export const FileIcon = ({ size = 16, className }: IconProps) =>
  svg(size, className, <path d="M7 3h7l5 5v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2ZM14 3v5h5" />)

/** A result: bars. */
export const ChartIcon = ({ size = 16, className }: IconProps) => svg(size, className, <path d="M5 20v-7M12 20V5M19 20v-10" />, 2)

export const LinkIcon = ({ size = 16, className }: IconProps) =>
  svg(size, className, <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />)

export const CopyIcon = ({ size = 16, className }: IconProps) =>
  svg(size, className, [<rect key="a" x="9" y="9" width="11" height="11" rx="2" />, <path key="b" d="M5 15V6a2 2 0 0 1 2-2h8" />])

/** Data on the left, a result on the right, lines between. */
export const RecordsIcon = ({ size = 16, className }: IconProps) =>
  svg(size, className, [
    <circle key="a" cx="5.5" cy="6.5" r="2" />,
    <circle key="b" cx="5.5" cy="17.5" r="2" />,
    <circle key="c" cx="18.5" cy="12" r="2" />,
    <path key="d" d="M7.5 6.5h3a3 3 0 0 1 3 3v.5a2 2 0 0 0 2 2h1M7.5 17.5h3a3 3 0 0 0 3-3V14a2 2 0 0 1 2-2" />,
  ])

export const IndentIcon = ({ size = 16, className }: IconProps) => svg(size, className, <path d="M3 6h18M11 12h10M11 18h10M3 9l4 3-4 3Z" />)

export const OutdentIcon = ({ size = 16, className }: IconProps) => svg(size, className, <path d="M3 6h18M11 12h10M11 18h10M7 9l-4 3 4 3Z" />)

/** A star, hollow or filled (filled follows the star colour of the page). */
export const StarIcon = ({ size = 16, className, filled = false }: IconProps & { filled?: boolean }) =>
  svg(size, className, <path d="m12 3.8 2.5 5.1 5.6.8-4.1 4 1 5.6-5-2.7-5 2.7 1-5.6-4.1-4 5.6-.8L12 3.8Z" fill={filled ? 'currentColor' : 'none'} />, 1.6)

export const RedoIcon = ({ size = 16, className }: IconProps) => svg(size, className, <path d="m15 14 5-5-5-5M20 9H10a6 6 0 0 0 0 12h3" />)

export const PaletteIcon = ({ size = 16, className }: IconProps) =>
  svg(size, className, [
    <path key="a" d="M12 3a9 9 0 1 0 0 18c1.1 0 1.9-.8 1.9-1.8 0-.5-.2-.9-.5-1.3-.3-.4-.5-.8-.5-1.3 0-1 .8-1.8 1.8-1.8H17a4 4 0 0 0 4-4C21 6 17 3 12 3Z" />,
    // Dots as round-capped zero-length strokes, not <circle>s: dsh-oh-my-claude looks for two adjacent circles to find its usage ring.
    <path key="b" d="M7.6 11.2h.01M10.2 7.4h.01M14.6 7.4h.01" strokeWidth={2.2} />,
  ])

/** Swap the two ends of a line. */
export const SwapIcon = ({ size = 16, className }: IconProps) => svg(size, className, <path d="m7 4-4 4 4 4M3 8h14M17 20l4-4-4-4M21 16H7" />)

/** A line with no arrow. */
export const MinusIcon = ({ size = 16, className }: IconProps) => svg(size, className, <path d="M5 12h14" />)

/** Column status glyphs. */
export const StatusIcon = ({ column, size = 14 }: { column: 'todo' | 'doing' | 'review' | 'done'; size?: number }) => {
  switch (column) {
    case 'todo':
      return svg(size, undefined, <circle cx="12" cy="12" r="8" strokeDasharray="3 2.6" />, 2)
    case 'doing':
      return svg(size, undefined, [<circle key="a" cx="12" cy="12" r="8" />, <path key="b" d="M12 4a8 8 0 0 1 0 16Z" fill="currentColor" stroke="none" />], 2)
    case 'review':
      return svg(size, undefined, [<circle key="a" cx="12" cy="12" r="8" />, <path key="b" d="M12 8v4.5l3 1.8" />], 2)
    case 'done':
      return svg(size, undefined, [<circle key="a" cx="12" cy="12" r="9" fill="currentColor" stroke="none" />, <path key="b" d="m8 12.3 2.8 2.8L16.2 9.6" stroke="var(--kb-on-accent, #fff)" />], 2.2)
  }
}

/** Empty-state illustration: four soft columns with a few cards. */
export const EmptyIllustration = () => (
  <svg width="168" height="104" viewBox="0 0 168 104" aria-hidden="true" focusable="false" className="kb-empty-art">
    {[0, 1, 2, 3].map((i) => (
      <g key={i} transform={`translate(${4 + i * 41} 4)`}>
        <rect width="37" height="96" rx="8" className="kb-art-col" />
        <rect x="5" y="9" width="18" height="4" rx="2" className={`kb-art-head kb-art-c${i}`} />
        {Array.from({ length: [3, 2, 1, 2][i]! }, (_, j) => (
          <rect key={j} x="5" y={20 + j * 20} width="27" height="15" rx="4" className="kb-art-card" />
        ))}
      </g>
    ))}
  </svg>
)
