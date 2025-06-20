
import React, { useState } from 'react';
import { Search, Star, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SOUTH_AFRICAN_UNIVERSITIES } from '@/constants/universityRules';

export const UniversitySearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);

  const filteredUniversities = SOUTH_AFRICAN_UNIVERSITIES.filter(university =>
    university.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    university.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleFavorite = (universityName: string) => {
    setFavorites(prev => 
      prev.includes(universityName)
        ? prev.filter(name => name !== universityName)
        : [...prev, universityName]
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Search className="h-5 w-5" />
          <span>Find Universities</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search universities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredUniversities.map((university) => (
            <Card key={university.name} className="border border-gray-200">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{university.name}</h3>
                    <Badge variant="secondary" className="mt-1 text-xs">
                      {university.category}
                    </Badge>
                    {university.apsRequirement && (
                      <p className="text-sm text-gray-600 mt-2">
                        Min APS: {university.apsRequirement}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleFavorite(university.name)}
                      className={`p-2 ${favorites.includes(university.name) ? 'text-yellow-500' : 'text-gray-400'}`}
                    >
                      <Star className={`h-4 w-4 ${favorites.includes(university.name) ? 'fill-current' : ''}`} />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(university.applicationUrl, '_blank')}
                      className="flex items-center space-x-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span>Apply</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredUniversities.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Search className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No universities found matching your search.</p>
          </div>
        )}

        {favorites.length > 0 && (
          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">
              Favorites ({favorites.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {favorites.map((name) => (
                <Badge key={name} variant="outline" className="text-green-700 border-green-300">
                  {name}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
