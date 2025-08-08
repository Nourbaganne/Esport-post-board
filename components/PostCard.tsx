'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Post } from '@/types/database'
import { createClientSupabase } from '@/lib/supabase'
import { TrashIcon, UserIcon, ClockIcon, MapPinIcon, GamepadIcon, StarIcon } from 'lucide-react'
import { toast } from 'sonner'
import { formatDistanceToNow } from 'date-fns'

interface PostCardProps {
  post: Post
  currentUserId?: string
  onDelete?: (postId: string) => void
}

export default function PostCard({ post, currentUserId, onDelete }: PostCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const supabase = createClientSupabase()
  
  const isOwner = currentUserId === post.user_id

  const handleDelete = async () => {
    if (!isOwner) return

    setIsDeleting(true)
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', post.id)

      if (error) throw error

      toast.success('Post deleted successfully')
      onDelete?.(post.id)
    } catch (error) {
      toast.error('Failed to delete post')
      console.error('Error deleting post:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700/50 hover:bg-slate-800/70 transition-all duration-300 slide-in-up hover:border-purple-500/30">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-600/20 p-2 rounded-lg">
              <GamepadIcon className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <Badge variant="secondary" className="bg-purple-600/20 text-purple-300 border-purple-500/30">
                  {post.game}
                </Badge>
                <Badge variant="outline" className="border-slate-600 text-slate-300">
                  {post.role}
                </Badge>
                {post.rank && (
                  <Badge variant="outline" className="border-yellow-600/50 text-yellow-300">
                    <StarIcon className="h-3 w-3 mr-1" />
                    {post.rank}
                  </Badge>
                )}
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <MapPinIcon className="h-4 w-4" />
                <span>{post.region}</span>
              </div>
            </div>
          </div>
          
          {isOwner && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-red-400 hover:text-red-300 hover:bg-red-950/30"
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          )}
        </div>

        <p className="text-gray-300 mb-4 leading-relaxed">
          {post.description}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <UserIcon className="h-4 w-4" />
            <span>{post.profiles?.username || 'Unknown User'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <ClockIcon className="h-4 w-4" />
            <span>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}