type SkillCellProps = {
  name: string
  tag: string
}

/**
 * Single skill row. Name + discipline tag. Avocatus border illuminates on hover — the section's only motion state.
 */
export function SkillCell({ name, tag }: SkillCellProps) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5 sm:py-3.5 rounded-sm border border-ash/10 hover:border-avocatus hover:bg-avocatus/10 transition-colors duration-200">
      <span className="text-satin text-sm sm:text-[15px] tracking-[-0.01em] truncate">
        {name}
      </span>
      <span className="font-mono text-[9px] sm:text-[10px] text-ash/85 uppercase tracking-[0.06em] flex-shrink-0">
        {tag}
      </span>
    </div>
  )
}
