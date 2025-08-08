export interface Profile {
  id: string
  username: string
  created_at: string
}

export interface Post {
  id: string
  user_id: string
  game: string
  role: string
  rank?: string
  region: string
  description: string
  created_at: string
  profiles?: Profile
}

export interface PostFilters {
  game?: string
  region?: string
  rank?: string
}