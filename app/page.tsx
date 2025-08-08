'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import PostCard from '@/components/PostCard'
import PostFilters from '@/components/PostFilters'
import { Button } from '@/components/ui/button'
import { Post, PostFilters as Filters } from '@/types/database'
import { createClientSupabase } from '@/lib/supabase'
import { PlusIcon, RefreshCwIcon } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([])
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([])
  const [filters, setFilters] = useState<Filters>({})
  const [loading, setLoading] = useState(true)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const supabase = createClientSupabase()

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles (
            username
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      setPosts(data || [])
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setCurrentUserId(user?.id || null)
  }

  useEffect(() => {
    fetchPosts()
    getCurrentUser()

    // Set up real-time subscription
    const channel = supabase
      .channel('posts')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'posts' },
        () => {
          fetchPosts()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  useEffect(() => {
    let filtered = [...posts]

    if (filters.game) {
      filtered = filtered.filter(post => post.game === filters.game)
    }
    if (filters.region) {
      filtered = filtered.filter(post => post.region === filters.region)
    }
    if (filters.rank) {
      filtered = filtered.filter(post => post.rank === filters.rank)
    }

    setFilteredPosts(filtered)
  }, [posts, filters])

  const handlePostDelete = (postId: string) => {
    setPosts(prevPosts => prevPosts.filter(post => post.id !== postId))
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-4">
            Find Your Gaming Squad
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Connect with like-minded gamers, find teammates for your favorite games, and build the ultimate esports squad.
          </p>
          {!currentUserId && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700 text-white glow-animation">
                <Link href="/auth?mode=signup">
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Join the Community
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-slate-600 text-gray-300 hover:text-white">
                <Link href="/auth">Sign In</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Filters */}
        <PostFilters filters={filters} onFiltersChange={setFilters} />

        {/* Posts Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <h2 className="text-2xl font-bold text-white">Latest Posts</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchPosts}
              disabled={loading}
              className="text-gray-400 hover:text-white"
            >
              <RefreshCwIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
          <div className="text-sm text-gray-400">
            {filteredPosts.length} of {posts.length} posts
          </div>
        </div>

        {/* Posts Grid */}
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-slate-800/50 rounded-xl p-6 animate-pulse">
                <div className="h-4 bg-slate-700 rounded mb-4"></div>
                <div className="h-3 bg-slate-700 rounded mb-2"></div>
                <div className="h-3 bg-slate-700 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                currentUserId={currentUserId}
                onDelete={handlePostDelete}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-slate-800/50 rounded-xl p-8 border border-slate-700/50">
              <h3 className="text-xl font-semibold text-white mb-2">No posts found</h3>
              <p className="text-gray-400 mb-6">
                {Object.keys(filters).length > 0 
                  ? 'Try adjusting your filters or create the first post for this combination!'
                  : 'Be the first to post and find your gaming squad!'
                }
              </p>
              {currentUserId && (
                <Button asChild className="bg-purple-600 hover:bg-purple-700 text-white">
                  <Link href="/create">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Create First Post
                  </Link>
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}