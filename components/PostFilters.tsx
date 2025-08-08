'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { PostFilters as Filters } from '@/types/database'
import { GAMES, REGIONS, RANKS } from '@/lib/constants'
import { FilterIcon, XIcon } from 'lucide-react'

interface PostFiltersProps {
  filters: Filters
  onFiltersChange: (filters: Filters) => void
}

export default function PostFilters({ filters, onFiltersChange }: PostFiltersProps) {
  const handleFilterChange = (key: keyof Filters, value: string | undefined) => {
    onFiltersChange({ ...filters, [key]: value === 'all' ? undefined : value })
  }

  const clearFilters = () => {
    onFiltersChange({})
  }

  const hasActiveFilters = Object.values(filters).some(value => value !== undefined)

  return (
    <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <FilterIcon className="h-5 w-5 text-purple-400" />
          <h2 className="text-lg font-semibold text-white">Filter Posts</h2>
        </div>
        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearFilters}
            className="text-gray-400 hover:text-white"
          >
            <XIcon className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Game</label>
          <Select value={filters.game || ''} onValueChange={(value) => handleFilterChange('game', value)}>
            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
              <SelectValue placeholder="All Games" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="all">All Games</SelectItem>
              {GAMES.map((game) => (
                <SelectItem key={game} value={game} className="text-gray-300 hover:text-white">
                  {game}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Region</label>
          <Select value={filters.region || ''} onValueChange={(value) => handleFilterChange('region', value)}>
            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
              <SelectValue placeholder="All Regions" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="all">All Regions</SelectItem>
              {REGIONS.map((region) => (
                <SelectItem key={region} value={region} className="text-gray-300 hover:text-white">
                  {region}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Rank</label>
          <Select value={filters.rank || ''} onValueChange={(value) => handleFilterChange('rank', value)}>
            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
              <SelectValue placeholder="All Ranks" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="all">All Ranks</SelectItem>
              {filters.game && RANKS[filters.game as keyof typeof RANKS] ? 
                RANKS[filters.game as keyof typeof RANKS].map((rank) => (
                  <SelectItem key={rank} value={rank} className="text-gray-300 hover:text-white">
                    {rank}
                  </SelectItem>
                )) : 
                Object.values(RANKS).flat().filter((rank, index, array) => array.indexOf(rank) === index).map((rank) => (
                  <SelectItem key={rank} value={rank} className="text-gray-300 hover:text-white">
                    {rank}
                  </SelectItem>
                ))
              }
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}