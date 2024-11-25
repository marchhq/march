import { SidebarItem } from "./SidebarItem"

interface SidebarSectionProps {
  items: Array<{ _id: string; name?: string; title?: string }>
  basePath: string
}

export const SidebarSection = ({ items, basePath }: SidebarSectionProps) => {
  if (items.length === 0) return null

  return (
    <div className="flex flex-col border-l border-border pl-4">
      {items
        .sort((a, b) =>
          (a.name || a.title || "").localeCompare(b.name || b.title || "")
        )
        .map((item) => (
          <SidebarItem key={item._id} href={`/space/${basePath}/${item._id}`}>
            {item.name || item.title}
          </SidebarItem>
        ))}
    </div>
  )
}
