export type DiscussionMessage = {
  id: string
  content: string
  created_at: string
  author: {
    id: string
    name: string | null
    avatarUrl: string | null
  }
}

export type Call = {
  id: string
  expert: {
    id: string
    name: string
    avatarUrl: string | null
  }
  timestamp: string
  sport: "Football"
  match: { homeTeam: string; awayTeam: string; time: string }
  betType: string
  pick: string
  odds: string
  units: number
  status: "Upcoming" | "Won" | "Lost" | "Push"
  analysis: string
  discussion: DiscussionMessage[]
}
