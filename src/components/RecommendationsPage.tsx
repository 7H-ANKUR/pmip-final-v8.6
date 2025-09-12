import { useState, useEffect } from 'react';
import { Target, MapPin, Clock, DollarSign, Users, Star, ExternalLink, Heart, Bookmark, TrendingUp, Award, BookOpen, Search, Filter } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ImpactTracker } from './ImpactTracker';
import { CareerPathGuidance } from './CareerPathGuidance';
import { useLanguage } from './LanguageProvider';
import { apiCall } from '../config/api';

interface RecommendationsPageProps {
  onNavigateToProfile: () => void;
}

interface Internship {
  internship_name: string;
  company: string;
  location: string;
  department: string;
  required_skills: string;
  qualification: string;
  similarity_score: number;
  skill_matches: number;
  final_score: number;
}

export function RecommendationsPage({ onNavigateToProfile }: RecommendationsPageProps) {
  const { t } = useLanguage();
  const [savedInternships, setSavedInternships] = useState<string[]>([]);
  const [likedInternships, setLikedInternships] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<Internship[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    qualification: '',
    department: '',
    location: '',
    skills: ''
  });

  // Load user data from localStorage if available
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setFormData({
        qualification: user.university || '',
        department: user.major || '',
        location: user.location || '',
        skills: '' // Skills will be entered manually
      });
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const getRecommendations = async () => {
    if (!formData.qualification || !formData.department || !formData.skills) {
      setError('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('access_token');
      const response = await apiCall('/api/internship-recommendations/recommend', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      setRecommendations(response.recommendations || []);
    } catch (error: any) {
      console.error('Error getting recommendations:', error);
      setError(error.message || 'Failed to get recommendations');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLike = (internshipId: string) => {
    setLikedInternships(prev => 
      prev.includes(internshipId) 
        ? prev.filter(id => id !== internshipId)
        : [...prev, internshipId]
    );
  };

  const toggleSave = (internshipId: string) => {
    setSavedInternships(prev => 
      prev.includes(internshipId) 
        ? prev.filter(id => id !== internshipId)
        : [...prev, internshipId]
    );
  };

  const getMatchColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-blue-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const getMatchBg = (percentage: number) => {
    if (percentage >= 90) return 'bg-green-100';
    if (percentage >= 80) return 'bg-blue-100';
    if (percentage >= 70) return 'bg-yellow-100';
    return 'bg-gray-100';
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <TrendingUp className="h-8 w-8 text-primary" />
            <h1 className="text-3xl md:text-4xl text-foreground">
              {t('rec.title')}
            </h1>
            <Target className="h-8 w-8 text-primary" />
          </div>
          <p className="text-lg text-muted-foreground mb-6 flex items-center justify-center gap-2">
            <Star className="h-5 w-5" />
            {t('rec.subtitle')}
          </p>
          <Button 
            variant="outline" 
            onClick={onNavigateToProfile}
            className="mb-8 flex items-center gap-2"
          >
            <Users className="h-4 w-4" />
            {t('rec.update_profile')}
          </Button>
        </div>

        {/* Recommendation Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Get Personalized Recommendations
            </CardTitle>
            <CardDescription>
              Enter your details to get AI-powered internship recommendations based on your profile
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="qualification">Qualification</Label>
                <Input
                  id="qualification"
                  name="qualification"
                  placeholder="e.g., BTech, MTech, BCA"
                  value={formData.qualification}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department/Field</Label>
                <Input
                  id="department"
                  name="department"
                  placeholder="e.g., Computer Science, Data Science"
                  value={formData.department}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Preferred Location</Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="e.g., Mumbai, Delhi, Bangalore"
                  value={formData.location}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="skills">Skills (comma separated)</Label>
                <Input
                  id="skills"
                  name="skills"
                  placeholder="e.g., Python, React, Machine Learning"
                  value={formData.skills}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            {error && (
              <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
            
            <div className="mt-6">
              <Button 
                onClick={getRecommendations} 
                disabled={isLoading}
                className="w-full md:w-auto"
              >
                {isLoading ? 'Getting Recommendations...' : 'Get Recommendations'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="recommendations" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="recommendations" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Recommendations
            </TabsTrigger>
            <TabsTrigger value="impact" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Impact Tracker
            </TabsTrigger>
            <TabsTrigger value="career" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Career Path
            </TabsTrigger>
          </TabsList>

          <TabsContent value="recommendations" className="space-y-6">
            {recommendations.length > 0 ? (
              <div className="space-y-6">
                {recommendations.map((internship, index) => (
                  <Card key={`${internship.internship_name}-${index}`} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className={`px-3 py-1 rounded-full ${getMatchBg(internship.final_score * 100)}`}>
                            <span className={`text-sm ${getMatchColor(internship.final_score * 100)}`}>
                              #{index + 1}
                            </span>
                          </div>
                          <div>
                            <CardTitle className="text-xl">{internship.internship_name}</CardTitle>
                            <CardDescription className="text-lg text-foreground mt-1">
                              {internship.company}
                            </CardDescription>
                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {internship.location}
                              </div>
                              <div className="flex items-center gap-1">
                                <Award className="h-4 w-4" />
                                {internship.qualification}
                              </div>
                              <div className="flex items-center gap-1">
                                <Target className="h-4 w-4" />
                                {internship.department}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2 mb-2">
                            <Target className="h-4 w-4 text-primary" />
                            <span className={`text-lg ${getMatchColor(internship.final_score * 100)}`}>
                              {(internship.final_score * 100).toFixed(1)}% Match
                            </span>
                          </div>
                          <Progress value={internship.final_score * 100} className="w-32" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm font-medium">{internship.skill_matches} skills match</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" />
                            <span className="text-sm">Similarity: {(internship.similarity_score * 100).toFixed(1)}%</span>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Required Skills:</h4>
                          <div className="flex flex-wrap gap-2">
                            {internship.required_skills.split(',').map((skill, skillIndex) => (
                              <Badge key={skillIndex} variant="secondary">
                                {skill.trim()}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>Department: {internship.department}</span>
                            <span>Qualification: {internship.qualification}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleLike(`${internship.internship_name}-${index}`)}
                              className={likedInternships.includes(`${internship.internship_name}-${index}`) ? 'text-red-500' : ''}
                            >
                              <Heart className={`h-4 w-4 ${likedInternships.includes(`${internship.internship_name}-${index}`) ? 'fill-current' : ''}`} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleSave(`${internship.internship_name}-${index}`)}
                              className={savedInternships.includes(`${internship.internship_name}-${index}`) ? 'text-blue-500' : ''}
                            >
                              <Bookmark className={`h-4 w-4 ${savedInternships.includes(`${internship.internship_name}-${index}`) ? 'fill-current' : ''}`} />
                            </Button>
                            <Button variant="outline" size="sm">
                              <ExternalLink className="h-4 w-4 mr-1" />
                              View Details
                            </Button>
                            <Button size="sm">
                              Apply Now
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No recommendations yet</h3>
                <p className="text-muted-foreground mb-4">
                  Fill in your details above and click "Get Recommendations" to see personalized internship suggestions.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="impact" className="space-y-6">
            <ImpactTracker internships={[]} />
          </TabsContent>

          <TabsContent value="career" className="space-y-6">
            <CareerPathGuidance />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}