export default function RatingGraph({ ratingDistribution }: { ratingDistribution: Record<number, number> }) {
    const total = Object.values(ratingDistribution).reduce((sum, n) => sum + Number(n), 0)
  
    return (
      <div className="space-y-2">
        {[5,4,3,2,1].map(star => {
          const num = Number(ratingDistribution[star] ?? 0)
          const percent = total ? Math.round((num / total) * 100) : 0
  
          return (
            <div key={star} className="flex items-center gap-2">
              <div className="w-10 font-medium">{star}★</div>
              <div className="flex-1 bg-gray-200 rounded h-3">
                <div className="bg-green-600 h-3 rounded" style={{ width: `${percent}%` }} />
              </div>
              <div className="w-12 text-right text-sm">{percent}%</div>
            </div>
          )
        })}
      </div>
    )
  }
  