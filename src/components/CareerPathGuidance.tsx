import { useState } from 'react';
import { Route, MapPin, Clock, Star, CheckCircle, ArrowRight, Target, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useLanguage } from './LanguageProvider';

interface CareerStep {
  id: string;
  title: string;
  duration: string;
  description: string;
  skills: string[];
  milestones: string[];
  salary: string;
  completed: boolean;
  current: boolean;
}

interface CareerPath {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  timeframe: string;
  averageSalary: string;
  marketDemand: number;
  steps: CareerStep[];
  matchScore: number;
}

export function CareerPathGuidance() {
  const { t } = useLanguage();
  const [selectedPath, setSelectedPath] = useState<string>('software-engineer');

  const careerPaths: CareerPath[] = [
    {
      id: 'software-engineer',
      title: 'Software Engineer',
      description: 'Build applications and systems that power the digital world',
      difficulty: 'Intermediate',
      timeframe: '3-5 years',
      averageSalary: '$95,000 - $150,000',
      marketDemand: 95,
      matchScore: 92,
      steps: [
        {
          id: 'intern',
          title: 'Software Engineering Intern',
          duration: '3-6 months',
          description: 'Gain hands-on experience with programming and software development',
          skills: ['JavaScript', 'Python', 'Git', 'Problem Solving'],
          milestones: ['Complete internship project', 'Learn version control', 'Basic programming skills'],
          salary: '$5,000 - $8,000/month',
          completed: false,
          current: true
        },
        {
          id: 'junior',
          title: 'Junior Software Engineer',
          duration: '1-2 years',
          description: 'Develop features and fix bugs under senior guidance',
          skills: ['React/Angular', 'Database Design', 'API Development', 'Testing'],
          milestones: ['Ship first feature', 'Complete code reviews', 'Learn frameworks'],
          salary: '$70,000 - $90,000',
          completed: false,
          current: false
        },
        {
          id: 'mid',
          title: 'Mid-Level Engineer',
          duration: '2-3 years',
          description: 'Own features end-to-end and mentor junior developers',
          skills: ['System Design', 'Architecture', 'Leadership', 'DevOps'],
          milestones: ['Lead project team', 'Design system architecture', 'Mentor interns'],
          salary: '$90,000 - $130,000',
          completed: false,
          current: false
        },
        {
          id: 'senior',
          title: 'Senior Software Engineer',
          duration: '3+ years',
          description: 'Technical leadership and complex system design',
          skills: ['Advanced Architecture', 'Team Leadership', 'Strategy', 'Innovation'],
          milestones: ['Tech lead role', 'Cross-team collaboration', 'Technical decisions'],
          salary: '$130,000 - $200,000+',
          completed: false,
          current: false
        }
      ]
    },
    {
      id: 'data-scientist',
      title: 'Data Scientist',
      description: 'Extract insights from data to drive business decisions',
      difficulty: 'Advanced',
      timeframe: '4-6 years',
      averageSalary: '$100,000 - $160,000',
      marketDemand: 88,
      matchScore: 85,
      steps: [
        {
          id: 'intern',
          title: 'Data Science Intern',
          duration: '3-6 months',
          description: 'Learn data analysis and basic machine learning',
          skills: ['Python', 'SQL', 'Statistics', 'Data Visualization'],
          milestones: ['Complete analysis project', 'Learn ML basics', 'Create dashboards'],
          salary: '$4,500 - $7,500/month',
          completed: false,
          current: true
        },
        {
          id: 'analyst',
          title: 'Data Analyst',
          duration: '1-2 years',
          description: 'Analyze data and create reports for business teams',
          skills: ['Advanced SQL', 'Tableau/PowerBI', 'Business Intelligence', 'A/B Testing'],
          milestones: ['Business impact', 'Advanced analytics', 'Stakeholder communication'],
          salary: '$65,000 - $85,000',
          completed: false,
          current: false
        },
        {
          id: 'scientist',
          title: 'Data Scientist',
          duration: '2-3 years',
          description: 'Build predictive models and machine learning solutions',
          skills: ['Machine Learning', 'Deep Learning', 'Model Deployment', 'MLOps'],
          milestones: ['Deploy ML model', 'Research publication', 'Cross-functional leadership'],
          salary: '$100,000 - $140,000',
          completed: false,
          current: false
        },
        {
          id: 'senior-scientist',
          title: 'Senior Data Scientist',
          duration: '3+ years',
          description: 'Lead data science initiatives and strategy',
          skills: ['AI Strategy', 'Team Leadership', 'Research', 'Innovation'],
          milestones: ['Lead DS team', 'Strategic initiatives', 'Thought leadership'],
          salary: '$140,000 - $200,000+',
          completed: false,
          current: false
        }
      ]
    },
    {
      id: 'product-manager',
      title: 'Product Manager',
      description: 'Drive product strategy and work with cross-functional teams',
      difficulty: 'Intermediate',
      timeframe: '3-5 years',
      averageSalary: '$110,000 - $170,000',
      marketDemand: 82,
      matchScore: 78,
      steps: [
        {
          id: 'intern',
          title: 'Product Management Intern',
          duration: '3-6 months',
          description: 'Support product teams and learn product development',
          skills: ['Product Analytics', 'User Research', 'Communication', 'Strategy'],
          milestones: ['Complete product analysis', 'User interviews', 'Feature specification'],
          salary: '$5,500 - $8,500/month',
          completed: false,
          current: true
        },
        {
          id: 'associate',
          title: 'Associate Product Manager',
          duration: '1-2 years',
          description: 'Own small features and support senior PMs',
          skills: ['Product Strategy', 'Data Analysis', 'Project Management', 'Design Thinking'],
          milestones: ['Ship feature', 'User feedback', 'Cross-team collaboration'],
          salary: '$80,000 - $100,000',
          completed: false,
          current: false
        },
        {
          id: 'pm',
          title: 'Product Manager',
          duration: '2-3 years',
          description: 'Own product areas and drive product roadmap',
          skills: ['Strategic Planning', 'Leadership', 'Market Research', 'Growth'],
          milestones: ['Product roadmap', 'Team leadership', 'Business impact'],
          salary: '$110,000 - $150,000',
          completed: false,
          current: false
        },
        {
          id: 'senior-pm',
          title: 'Senior Product Manager',
          duration: '3+ years',
          description: 'Lead product strategy and multiple product areas',
          skills: ['Executive Communication', 'Vision Setting', 'Team Building', 'Innovation'],
          milestones: ['Product vision', 'Strategic leadership', 'Organizational impact'],
          salary: '$150,000 - $220,000+',
          completed: false,
          current: false
        }
      ]
    }
  ];

  const selectedCareerPath = careerPaths.find(path => path.id === selectedPath) || careerPaths[0];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStepStatus = (step: CareerStep) => {
    if (step.completed) return 'completed';
    if (step.current) return 'current';
    return 'upcoming';
  };

  const getStepIcon = (step: CareerStep) => {
    if (step.completed) return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (step.current) return <Target className="h-5 w-5 text-primary" />;
    return <MapPin className="h-5 w-5 text-muted-foreground" />;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Route className="h-5 w-5" />
          {t('career.title')}
        </CardTitle>
        <CardDescription>
          {t('career.subtitle')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedPath} onValueChange={setSelectedPath}>
          {/* Career Path Selection */}
          <TabsList className="grid w-full grid-cols-3">
            {careerPaths.map(path => (
              <TabsTrigger key={path.id} value={path.id} className="text-center">
                <div>
                  <div>{path.title}</div>
                  <div className="text-xs text-muted-foreground">{path.matchScore}% match</div>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>

          {careerPaths.map(path => (
            <TabsContent key={path.id} value={path.id} className="space-y-6">
              {/* Path Overview */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-xl">{path.title}</CardTitle>
                      <CardDescription className="text-base">
                        {path.description}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="h-4 w-4 text-primary" />
                        <span className="text-lg text-primary">{path.matchScore}% Match</span>
                      </div>
                      <Progress value={path.matchScore} className="w-32" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <Badge className={getDifficultyColor(path.difficulty)}>
                        {path.difficulty}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">Difficulty</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">{path.timeframe}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Timeline</p>
                    </div>
                    <div className="text-center">
                      <div className="text-sm">{path.averageSalary}</div>
                      <p className="text-xs text-muted-foreground mt-1">Salary Range</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-600">{path.marketDemand}%</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Market Demand</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Career Steps Timeline */}
              <div className="space-y-4">
                <h3 className="text-lg">Your Career Roadmap</h3>
                
                {path.steps.map((step, index) => (
                  <Card key={step.id} className={`
                    ${getStepStatus(step) === 'completed' ? 'border-green-200 bg-green-50/50' : ''}
                    ${getStepStatus(step) === 'current' ? 'border-primary bg-primary/5' : ''}
                    ${getStepStatus(step) === 'upcoming' ? 'border-muted' : ''}
                  `}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="flex flex-col items-center">
                          {getStepIcon(step)}
                          {index < path.steps.length - 1 && (
                            <div className="w-px h-16 bg-border mt-2" />
                          )}
                        </div>
                        
                        <div className="flex-1 space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="text-base">{step.title}</h4>
                              <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {step.duration}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="text-sm">{step.salary}</div>
                              <p className="text-xs text-muted-foreground">Expected Salary</p>
                            </div>
                          </div>
                          
                          <p className="text-sm">{step.description}</p>
                          
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <h5 className="text-xs mb-1">Key Skills</h5>
                              <div className="flex flex-wrap gap-1">
                                {step.skills.map((skill, skillIndex) => (
                                  <Badge key={skillIndex} variant="outline" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h5 className="text-xs mb-1">Milestones</h5>
                              <ul className="text-xs space-y-1">
                                {step.milestones.map((milestone, milestoneIndex) => (
                                  <li key={milestoneIndex} className="flex items-start gap-1">
                                    <span className="text-primary mt-0.5">•</span>
                                    {milestone}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Action Button */}
              <div className="text-center">
                <Button size="lg" className="px-8">
                  Start Your Journey
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}