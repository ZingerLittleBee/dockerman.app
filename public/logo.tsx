import { cx } from "@/lib/utils"

const LogoIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg fill="currentColor" width="800px" height="800px" viewBox="0 0 32 32" id="icon" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <style>{`.cls-1 {fill: none;}`}</style>
    </defs>
    <path d="M28,12H20V4h8Zm-6-2h4V6H22Z" />
    <path d="M17,15V9H9V23H23V15Zm-6-4h4v4H11Zm4,10H11V17h4Zm6,0H17V17h4Z" />
    <path
      d="M26,28H6a2.0023,2.0023,0,0,1-2-2V6A2.0023,2.0023,0,0,1,6,4H16V6H6V26H26V16h2V26A2.0023,2.0023,0,0,1,26,28Z" />
    <rect id="_Transparent_Rectangle_" data-name="&lt;Transparent Rectangle&gt;" className="cls-1" width="32" height="32" />
  </svg>
)

export const Logo = ({ className }: { className?: string }) => (
  <div className={cx("flex items-center gap-1", className)}>
    <LogoIcon className="size-8 text-indigo-600 dark:text-indigo-500" />
    <p className="text-lg font-bold">Dockerman</p>
  </div>
)