export default function Hover({ children }: { children: React.ReactNode }) {
    return <div className="relative before:absolute before:origin-left before:w-full before:scale-x-0 hover:before:scale-x-100 before:transition-all before:h-[1px] before:bottom-0 before:bg-blue-400">{children}</div>
}