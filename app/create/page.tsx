'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClientSupabase } from '@/lib/supabase'
import { GAMES, REGIONS, ROLES, RANKS } from '@/lib/constants'
import { toast } from 'sonner'
import { GamepadIcon, SendIcon } from 'lucide-react'

export default function CreatePost() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    game: '',
    role: '',
    rank: '',
    region: '',
    description: ''
  })
  const router = useRouter()
  const supabase = createClientSupabase()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/auth')
        return
      }

      // Check if user has a profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (!profile) {
        // Create profile if it doesn't exist
        const username = user.email?.split('@')[0] || 'User'
        await supabase
          .from('profiles')
          .insert({ id: user.id, username })
      }

      setUser(user)
    }

    getUser()
  }, [supabase, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      toast.error('Please sign in to create a post')
      return
    }

    if (!formData.game || !formData.role || !formData.region || !formData.description) {
      toast.error('Please fill in all required fields')
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          game: formData.game,
          role: formData.role,
          rank: formData.rank || null,
          region: formData.region,
          description: formData.description
        })

      if (error) throw error

      toast.success('Post created successfully!')
      router.push('/')
    } catch (error: any) {
      toast.error(error.message || 'Failed to create post')
      console.error('Error creating post:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Reset role and rank when game changes
    if (field === 'game') {
      setFormData(prev => ({
        ...prev,
        role: '',
        rank: ''
      }))
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Please Sign In</h1>
          <p className="text-gray-400">You need to be signed in to create a post.</p>
        </div>
      </div>
    )
  }

  const availableRoles = formData.game ? ROLES[formData.game as keyof typeof ROLES] || [] : []
  const availableRanks = formData.game ? RANKS[formData.game as keyof typeof RANKS] || [] : []

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Create LFG Post
          </h1>
          <p className="text-gray-400">
            Find your perfect gaming squad by posting your requirements
          </p>
        </div>

        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <GamepadIcon className="h-5 w-5 text-purple-400" />
              <span>Post Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="game" className="text-gray-300">Game *</Label>
                  <Select value={formData.game} onValueChange={(value) => handleInputChange('game', value)}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Select a game" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="none" disabled className="text-gray-500">Select a game</SelectItem>
                      {GAMES.map((game) => (
                        <SelectItem key={game} value={game} className="text-gray-300 hover:text-white">
                          {game}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="role" className="text-gray-300">Role *</Label>
                  <Select 
                    value={formData.role} 
                    onValueChange={(value) => handleInputChange('role', value)}
                    disabled={!formData.game}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder={formData.game ? "Select a role" : "Select game first"} />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="none" disabled className="text-gray-500">{formData.game ? "Select a role" : "Select game first"}</SelectItem>
                      {availableRoles.map((role) => (
                        <SelectItem key={role} value={role} className="text-gray-300 hover:text-white">
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="rank" className="text-gray-300">Rank (Optional)</Label>
                  <Select 
                    value={formData.rank} 
                    onValueChange={(value) => handleInputChange('rank', value)}
                    disabled={!formData.game}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder={formData.game ? "Select your rank" : "Select game first"} />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="none" disabled className="text-gray-500">{formData.game ? "Select your rank" : "Select game first"}</SelectItem>
                      {availableRanks.map((rank) => (
                        <SelectItem key={rank} value={rank} className="text-gray-300 hover:text-white">
                          {rank}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="region" className="text-gray-300">Region *</Label>
                  <Select value={formData.region} onValueChange={(value) => handleInputChange('region', value)}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Select your region" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="none" disabled className="text-gray-500">Select your region</SelectItem>
                      {REGIONS.map((region) => (
                        <SelectItem key={region} value={region} className="text-gray-300 hover:text-white">
                          {region}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="text-gray-300">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what kind of teammates you're looking for, your playstyle, availability, etc."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  maxLength={200}
                  className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 resize-none h-24"
                />
                <div className="text-right text-sm text-gray-400 mt-1">
                  {formData.description.length}/200 characters
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/')}
                  className="border-slate-600 text-gray-300 hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {loading ? (
                    'Creating...'
                  ) : (
                    <>
                      <SendIcon className="h-4 w-4 mr-2" />
                      Create Post
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}