import { useState } from 'react';
import { Target, MapPin, Clock, DollarSign, Users, Star, ExternalLink, Heart, Bookmark, TrendingUp, Award, BookOpen } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ImpactTracker } from './ImpactTracker';
import { CareerPathGuidance } from './CareerPathGuidance';
import { useLanguage } from './LanguageProvider';
import { motion } from "motion/react";
import { AnimatedButton, AnimatedCard, RotatingIcon, AnimatedBadge } from './animated';

interface RecommendationsPageProps {
  onNavigateToProfile: () => void;
}

interface Internship {
  id: string;
  title: string;
  company: string;
  location: string;
  duration: string;
  salary: string;
  matchPercentage: number;
  description: string;
  requirements: string[];
  skills: string[];
  teamSize: string;
  rating: number;
  applicants: number;
  postedDate: string;
  deadline: string;
  remote: boolean;
}

export function RecommendationsPage({ onNavigateToProfile }: RecommendationsPageProps) {
  const { t } = useLanguage();
  const [savedInternships, setSavedInternships] = useState<string[]>([]);
  const [likedInternships, setLikedInternships] = useState<string[]>([]);

  const recommendations: Internship[] = [
    {
      id: '1',
      title: 'Software Engineering Intern',
      company: 'Google',
      location: 'Mountain View, CA',
      duration: '12 weeks',
      salary: '$8,000/month',
      matchPercentage: 95,
      description: 'Join our engineering team to work on cutting-edge web technologies and contribute to products used by billions of users worldwide.',
      requirements: ['Strong programming skills', 'Computer Science background', 'Problem-solving abilities'],
      skills: ['JavaScript', 'Python', 'React', 'Data Structures'],
      teamSize: '8-12 engineers',
      rating: 4.8,
      applicants: 2500,
      postedDate: '2 days ago',
      deadline: 'March 15, 2025',
      remote: false
    },
    {
      id: '2',
      title: 'Data Science Intern',
      company: 'Microsoft',
      location: 'Seattle, WA',
      duration: '10 weeks',
      salary: '$7,500/month',
      matchPercentage: 92,
      description: 'Work with our AI research team to develop machine learning models and analyze large datasets to drive business insights.',
      requirements: ['Statistics knowledge', 'Python proficiency', 'ML experience'],
      skills: ['Python', 'Machine Learning', 'SQL', 'Data Analysis'],
      teamSize: '5-8 data scientists',
      rating: 4.7,
      applicants: 1800,
      postedDate: '1 week ago',
      deadline: 'March 20, 2025',
      remote: true
    },
    {
      id: '3',
      title: 'Product Management Intern',
      company: 'Meta',
      location: 'Menlo Park, CA',
      duration: '12 weeks',
      salary: '$7,800/month',
      matchPercentage: 88,
      description: 'Collaborate with cross-functional teams to define product requirements and drive feature development for our social platforms.',
      requirements: ['Leadership skills', 'Analytical thinking', 'Communication skills'],
      skills: ['Project Management', 'Communication', 'Data Analysis', 'Leadership'],
      teamSize: '3-5 PMs',
      rating: 4.6,
      applicants: 3200,
      postedDate: '3 days ago',
      deadline: 'March 10, 2025',
      remote: false
    },
    {
      id: '4',
      title: 'UX Design Intern',
      company: 'Apple',
      location: 'Cupertino, CA',
      duration: '16 weeks',
      salary: '$6,500/month',
      matchPercentage: 85,
      description: 'Design intuitive user experiences for our next-generation products, working closely with design and engineering teams.',
      requirements: ['Design portfolio', 'Figma proficiency', 'User research experience'],
      skills: ['UI/UX Design', 'Figma', 'User Research', 'Prototyping'],
      teamSize: '6-10 designers',
      rating: 4.9,
      applicants: 1500,
      postedDate: '5 days ago',
      deadline: 'March 25, 2025',
      remote: false
    },
    {
      id: '5',
      title: 'Cybersecurity Intern',
      company: 'Amazon',
      location: 'Austin, TX',
      duration: '12 weeks',
      salary: '$7,200/month',
      matchPercentage: 82,
      description: 'Help secure AWS infrastructure and develop security tools to protect customer data and cloud services.',
      requirements: ['Security fundamentals', 'Networking knowledge', 'Programming skills'],
      skills: ['Cybersecurity', 'Python', 'Networking', 'AWS'],
      teamSize: '4-6 security engineers',
      rating: 4.5,
      applicants: 900,
      postedDate: '1 week ago',
      deadline: 'March 18, 2025',
      remote: true
    }
  ];

  const toggleSaved = (internshipId: string) => {
    setSavedInternships(prev => 
      prev.includes(internshipId) 
        ? prev.filter(id => id !== internshipId)
        : [...prev, internshipId]
    );
  };

  const toggleLiked = (internshipId: string) => {
    setLikedInternships(prev => 
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 py-8 px-4">
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

            <div className="space-y-6">
              {recommendations.map((internship, index) => (
            <Card key={internship.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className={`px-3 py-1 rounded-full ${getMatchBg(internship.matchPercentage)}`}>
                      <span className={`text-sm ${getMatchColor(internship.matchPercentage)}`}>
                        #{index + 1}
                      </span>
                    </div>
                    <div>
                      <CardTitle className="text-xl">{internship.title}</CardTitle>
                      <CardDescription className="text-lg text-foreground mt-1">
                        {internship.company}
                      </CardDescription>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {internship.location}
                          {internship.remote && <Badge variant="secondary" className="ml-1">Remote</Badge>}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {internship.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          {internship.salary}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-4 w-4 text-primary" />
                      <span className={`text-lg ${getMatchColor(internship.matchPercentage)}`}>
                        {internship.matchPercentage}% {t('rec.match')}
                      </span>
                    </div>
                    <Progress value={internship.matchPercentage} className="w-32" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  {internship.description}
                </p>
                
                <div className="grid md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <h4 className="mb-2">Required Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {internship.skills.map((skill, skillIndex) => (
                        <Badge key={skillIndex} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="mb-2">Requirements</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {internship.requirements.map((req, reqIndex) => (
                        <li key={reqIndex}>• {req}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      {internship.rating}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {internship.teamSize}
                    </div>
                    <div>
                      {internship.applicants.toLocaleString()} {t('rec.applicants')}
                    </div>
                    <div>
                      {t('rec.deadline')}: {internship.deadline}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleLiked(internship.id)}
                      className={likedInternships.includes(internship.id) ? 'text-red-500' : ''}
                    >
                      <Heart className={`h-4 w-4 ${likedInternships.includes(internship.id) ? 'fill-current' : ''}`} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleSaved(internship.id)}
                      className={savedInternships.includes(internship.id) ? 'text-blue-500' : ''}
                    >
                      <Bookmark className={`h-4 w-4 ${savedInternships.includes(internship.id) ? 'fill-current' : ''}`} />
                    </Button>
                    <Button>
                      {t('rec.apply_now')}
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

            <div className="mt-12 text-center">
              <Card className="p-8">
                <CardHeader>
                  <CardTitle className="flex items-center justify-center gap-2">
                    <Award className="h-6 w-6 text-primary" />
                    {t('rec.more_recommendations')}
                  </CardTitle>
                  <CardDescription className="flex items-center justify-center gap-2">
                    <Target className="h-4 w-4" />
                    {t('rec.enhance_desc')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={onNavigateToProfile} className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {t('rec.enhance_profile')}
                  </Button>
                </CardContent>
              </Card>
            </div>
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