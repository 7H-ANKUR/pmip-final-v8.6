import { useState } from 'react';
import { Search, Filter, MapPin, Building, Clock, DollarSign, Heart, ExternalLink, Briefcase, Target, Eye, Users, TrendingUp } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader } from './ui/card';

// Mock data for internships
const internships = [
  {
    id: 1,
    title: "Product Management Intern",
    company: "Google",
    location: "Mountain View, CA",
    type: "Summer 2024",
    duration: "12 weeks",
    salary: "$8,000/month",
    description: "Join our product team to work on consumer-facing products used by billions of users worldwide.",
    skills: ["Product Strategy", "Data Analysis", "User Research"],
    logo: "🔍",
    isBookmarked: false
  },
  {
    id: 2,
    title: "Associate Product Manager Intern",
    company: "Meta",
    location: "Menlo Park, CA",
    type: "Summer 2024",
    duration: "16 weeks",
    salary: "$7,500/month",
    description: "Work on products that connect billions of people around the world through our family of apps.",
    skills: ["Product Development", "Analytics", "A/B Testing"],
    logo: "👥",
    isBookmarked: true
  },
  {
    id: 3,
    title: "Product Management Intern",
    company: "Microsoft",
    location: "Redmond, WA",
    type: "Summer 2024",
    duration: "12 weeks",
    salary: "$7,800/month",
    description: "Help shape the future of productivity and collaboration tools used by millions of professionals.",
    skills: ["Product Planning", "Market Research", "Roadmapping"],
    logo: "🪟",
    isBookmarked: false
  },
  {
    id: 4,
    title: "Product Strategy Intern",
    company: "Apple",
    location: "Cupertino, CA",
    type: "Summer 2024",
    duration: "14 weeks",
    salary: "$8,200/month",
    description: "Work on revolutionary products that integrate hardware, software, and services seamlessly.",
    skills: ["Strategic Planning", "Market Analysis", "Product Design"],
    logo: "🍎",
    isBookmarked: false
  }
];

export function InternshipSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [companyFilter, setCompanyFilter] = useState('all');
  const [bookmarkedItems, setBookmarkedItems] = useState<number[]>([2]);

  const toggleBookmark = (id: number) => {
    setBookmarkedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const filteredInternships = internships.filter(internship => {
    const matchesSearch = !searchQuery || 
      internship.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      internship.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      internship.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesLocation = locationFilter === 'all' || internship.location.includes(locationFilter);
    const matchesCompany = companyFilter === 'all' || internship.company === companyFilter;
    
    return matchesSearch && matchesLocation && matchesCompany;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Briefcase className="h-8 w-8 text-primary" />
          <h1 className="text-3xl text-foreground">Browse Internships</h1>
          <Target className="h-8 w-8 text-primary" />
        </div>
        <p className="text-muted-foreground flex items-center gap-2">
          <Users className="h-4 w-4" />
          Discover PM internship opportunities at top tech companies
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-card rounded-lg border border-border p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by role, company, or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Location Filter */}
          <div>
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="CA">California</SelectItem>
                <SelectItem value="WA">Washington</SelectItem>
                <SelectItem value="NY">New York</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Company Filter */}
          <div>
            <Select value={companyFilter} onValueChange={setCompanyFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Company" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Companies</SelectItem>
                <SelectItem value="Google">Google</SelectItem>
                <SelectItem value="Meta">Meta</SelectItem>
                <SelectItem value="Microsoft">Microsoft</SelectItem>
                <SelectItem value="Apple">Apple</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Applied Filters */}
        {(searchQuery || (locationFilter && locationFilter !== 'all') || (companyFilter && companyFilter !== 'all')) && (
          <div className="mt-4 flex flex-wrap gap-2">
            {searchQuery && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Search: {searchQuery}
                <button onClick={() => setSearchQuery('')} className="ml-1 text-xs">×</button>
              </Badge>
            )}
            {locationFilter && locationFilter !== 'all' && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Location: {locationFilter}
                <button onClick={() => setLocationFilter('all')} className="ml-1 text-xs">×</button>
              </Badge>
            )}
            {companyFilter && companyFilter !== 'all' && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Company: {companyFilter}
                <button onClick={() => setCompanyFilter('all')} className="ml-1 text-xs">×</button>
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Results */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="text-xl text-foreground">
              {filteredInternships.length} Internship{filteredInternships.length !== 1 ? 's' : ''} Found
            </h2>
          </div>
          <Select defaultValue="relevance">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Most Relevant</SelectItem>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="salary">Highest Salary</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Internship Cards */}
        <div className="grid gap-6">
          {filteredInternships.map((internship) => (
            <Card key={internship.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="text-4xl">{internship.logo}</div>
                    <div className="flex-1">
                      <h3 className="text-lg text-foreground mb-1">{internship.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Building className="h-4 w-4 mr-1" />
                          {internship.company}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {internship.location}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {internship.duration}
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1" />
                          {internship.salary}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
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
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-muted-foreground mb-4">{internship.description}</p>
                
                {/* Skills */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {internship.skills.map((skill) => (
                      <Badge key={skill} variant="outline">{skill}</Badge>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-3">
                  <Button size="sm">
                    Apply Now
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Eye className="h-3 w-3" />
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}