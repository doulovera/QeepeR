export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-base border-2 border-base-400 bg-white p-4 text-md font-base shadow-dark">
      {children}
    </div>
  )
}