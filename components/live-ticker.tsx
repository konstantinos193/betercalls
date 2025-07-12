type TickerItem = {
  id: number | string
  text: string
}

type LiveTickerProps = {
  items: TickerItem[]
}

export function LiveTicker({ items }: LiveTickerProps) {
  return (
    <div className="bg-black/50 border-y border-gray-800/50 w-full overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap py-2">
        {items.map((item) => (
          <span key={item.id} className="text-sm mx-4 text-gray-400">
            <span className="text-green-400">WIN</span> &mdash; {item.text.split(" - WIN")[0]}
          </span>
        ))}
        {/* Duplicate for seamless scroll */}
        {items.map((item) => (
          <span key={`${item.id}-dup`} className="text-sm mx-4 text-gray-400">
            <span className="text-green-400">WIN</span> &mdash; {item.text.split(" - WIN")[0]}
          </span>
        ))}
      </div>
    </div>
  )
}
