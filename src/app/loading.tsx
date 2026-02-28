export default function Loading() {
    return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
            <div className="h-12 w-12 border-4 border-crimson-600/30 border-t-crimson-600 rounded-full animate-spin"></div>
            <p className="text-muted-foreground animate-pulse text-sm">Loading...</p>
        </div>
    )
}
