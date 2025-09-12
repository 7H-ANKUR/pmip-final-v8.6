import { ArrowRight, MapPin, Clock, Star, Heart } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { useState } from 'react';

const recommendedInternships = [
  {
    id: 1,
    title: "Product Management Intern",
    company: "Stripe",
    location: "San Francisco, CA",
    duration: "12 weeks",
    rating: 4.8,
    logo: "💳",
    match: 95,
    highlights: ["Fintech Experience", "Product Strategy", "Remote Friendly"],
    isBookmarked: false
  },
  {
    id: 2,
    title: "APM Summer Intern",
    company: "Airbnb",
    location: "San Francisco, CA",
    duration: "16 weeks",
    rating: 4.9,
    logo: "🏠",
    match: 92,
    highlights: ["Travel Industry", "User Experience", "Global Impact"],
    isBookmarked: true
  },
  {
    id: 3,
    title: "Product Strategy Intern",
    company: "Spotify",
    location: "New York, NY",
    duration: "14 weeks",
    rating: 4.7,
    logo: "🎵",
    match: 88,
    highlights: ["Music Tech", "Data Analytics", "Creative Collaboration"],
    isBookmarked: false
  }
];

export function RecommendedInternships() {
  const [bookmarkedItems, setBookmarkedItems] = useState<number[]>([2]);

  const toggleBookmark = (id: number) => {
    setBookmarkedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <section className="py-16 bg-secondary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl text-foreground mb-4">
            Recommended For You
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Based on your profile and preferences, here are internships that match your interests and skills.
          </p>
        </div>

        {/* Recommendation Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {recommendedInternships.map((internship) => (
            <Card key={internship.id} className="hover:shadow-lg transition-all duration-300 group">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-3xl">{internship.logo}</div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge 
                          variant="secondary" 
                          className="bg-green-100 text-green-800 border-green-200"
                        >
                          {internship.match}% Match
                        </Badge>
                      </div>
                      <h3 className="text-lg text-foreground group-hover:text-primary transition-colors">
                        {internship.title}
                      </h3>
                      <p className="text-muted-foreground">{internship.company}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleBookmark(internship.id)}
                    className={bookmarkedItems.includes(internship.id) ? 'text-red-500' : ''}
                  >
                    <Heart 
                      className={`h-4 w-4 ${bookmarkedItems.includes(internship.id) ? 'fill-current' : ''}`} 
                    />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Location and Duration */}
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {internship.location}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {internship.duration}
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm text-foreground">{internship.rating}</span>
                  <span className="text-sm text-muted-foreground">(Company Rating)</span>
                </div>

                {/* Highlights */}
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Why it's a great match:</p>
                  <div className="flex flex-wrap gap-1">
                    {internship.highlights.map((highlight) => (
                      <Badge key={highlight} variant="outline" className="text-xs">
                        {highlight}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2 pt-2">
                  <Button size="sm" className="flex-1">
                    Apply Now
                  </Button>
                  <Button variant="outline" size="sm">
                    Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button variant="outline" size="lg">
            View All Recommendations
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}