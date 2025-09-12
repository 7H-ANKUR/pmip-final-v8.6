import { useState } from 'react';
import { TrendingUp, Award, Clock, Users, Code, Brain, Target, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { useLanguage } from './LanguageProvider';

interface InternshipImpact {
  id: string;
  title: string;
  company: string;
  duration: string;
  skillsGained: {
    technical: string[];
    soft: string[];
    industry: string[];
  };
  knowledgeAreas: {
    name: string;
    proficiency: number;
    description: string;
  }[];
  careerValue: {
    networkGrowth: number;
    industryExposure: number;
    practicalExperience: number;
    portfolioValue: number;
  };
  futureOpportunities: string[];
  mentorshipValue: number;
  projectImpact: string[];
}

interface ImpactTrackerProps {
  internships: InternshipImpact[];
}

export function ImpactTracker({ internships }: ImpactTrackerProps) {
  const { t } = useLanguage();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const getValueColor = (value: number) => {
    if (value >= 80) return 'text-green-600';
    if (value >= 60) return 'text-blue-600';
    if (value >= 40) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const getValueBg = (value: number) => {
    if (value >= 80) return 'bg-green-100';
    if (value >= 60) return 'bg-blue-100';
    if (value >= 40) return 'bg-yellow-100';
    return 'bg-gray-100';
  };

  // Mock data for demonstration
  const mockInternships: InternshipImpact[] = [
    {
      id: '1',
      title: 'Software Engineering Intern',
      company: 'Google',
      duration: '12 weeks',
      skillsGained: {
        technical: ['React.js', 'Node.js', 'TypeScript', 'GraphQL', 'Docker', 'Kubernetes'],
        soft: ['Team Collaboration', 'Code Review', 'Problem Solving', 'Communication'],
        industry: ['Agile Development', 'DevOps', 'System Design', 'Performance Optimization']
      },
      knowledgeAreas: [
        { name: 'Frontend Development', proficiency: 85, description: 'Advanced React patterns and state management' },
        { name: 'Backend Systems', proficiency: 70, description: 'Microservices architecture and API design' },
        { name: 'Cloud Technologies', proficiency: 60, description: 'Google Cloud Platform and containerization' },
        { name: 'Software Testing', proficiency: 75, description: 'Unit testing and integration testing strategies' }
      ],
      careerValue: {
        networkGrowth: 90,
        industryExposure: 95,
        practicalExperience: 88,
        portfolioValue: 92
      },
      futureOpportunities: [
        'Full-time Software Engineer at Google',
        'Senior Frontend Developer roles',
        'Technical Lead positions',
        'Startup CTO opportunities'
      ],
      mentorshipValue: 85,
      projectImpact: [
        'Led development of user analytics dashboard serving 1M+ users',
        'Improved application performance by 40%',
        'Contributed to open-source projects with 10K+ stars'
      ]
    },
    {
      id: '2',
      title: 'Data Science Intern',
      company: 'Microsoft',
      duration: '10 weeks',
      skillsGained: {
        technical: ['Python', 'TensorFlow', 'SQL', 'Power BI', 'Azure ML', 'Pandas'],
        soft: ['Data Storytelling', 'Business Analysis', 'Presentation Skills', 'Critical Thinking'],
        industry: ['Machine Learning', 'Data Mining', 'Statistical Analysis', 'Business Intelligence']
      },
      knowledgeAreas: [
        { name: 'Machine Learning', proficiency: 80, description: 'Deep learning models and neural networks' },
        { name: 'Data Analysis', proficiency: 90, description: 'Statistical modeling and data visualization' },
        { name: 'Cloud Computing', proficiency: 65, description: 'Azure services and data pipelines' },
        { name: 'Business Intelligence', proficiency: 75, description: 'KPI development and dashboard creation' }
      ],
      careerValue: {
        networkGrowth: 85,
        industryExposure: 90,
        practicalExperience: 82,
        portfolioValue: 88
      },
      futureOpportunities: [
        'Data Scientist at Microsoft',
        'ML Engineer positions',
        'Research roles in AI',
        'Data consultant opportunities'
      ],
      mentorshipValue: 80,
      projectImpact: [
        'Built predictive model increasing sales forecast accuracy by 25%',
        'Created automated reporting system saving 20 hours/week',
        'Published research paper on recommendation systems'
      ]
    }
  ];

  const displayInternships = internships.length > 0 ? internships : mockInternships;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          {t('impact.title')}
        </CardTitle>
        <CardDescription>
          {t('impact.subtitle')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {displayInternships.map((internship) => (
            <Card key={internship.id} className="border-l-4 border-l-primary">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{internship.title}</CardTitle>
                    <CardDescription className="text-base">
                      {internship.company} • {internship.duration}
                    </CardDescription>
                  </div>
                  <Collapsible>
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpanded(internship.id)}
                      >
                        {expandedItems.includes(internship.id) ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                  </Collapsible>
                </div>
              </CardHeader>
              <CardContent>
                {/* Career Value Overview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {Object.entries(internship.careerValue).map(([key, value]) => (
                    <div key={key} className="text-center">
                      <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-2 ${getValueBg(value)}`}>
                        <span className={`text-sm ${getValueColor(value)}`}>
                          {value}%
                        </span>
                      </div>
                      <p className="text-xs capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Skills Preview */}
                <div className="mb-4">
                  <h4 className="mb-2 flex items-center gap-2">
                    <Code className="h-4 w-4" />
                    Key Skills Gained
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {internship.skillsGained.technical.slice(0, 6).map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                    {internship.skillsGained.technical.length > 6 && (
                      <Badge variant="outline">
                        +{internship.skillsGained.technical.length - 6} more
                      </Badge>
                    )}
                  </div>
                </div>

                <Collapsible open={expandedItems.includes(internship.id)}>
                  <CollapsibleContent className="space-y-6">
                    {/* Detailed Skills */}
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <h5 className="mb-2 flex items-center gap-1">
                          <Code className="h-3 w-3" />
                          Technical Skills
                        </h5>
                        <div className="flex flex-wrap gap-1">
                          {internship.skillsGained.technical.map((skill, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h5 className="mb-2 flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          Soft Skills
                        </h5>
                        <div className="flex flex-wrap gap-1">
                          {internship.skillsGained.soft.map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h5 className="mb-2 flex items-center gap-1">
                          <Brain className="h-3 w-3" />
                          Industry Knowledge
                        </h5>
                        <div className="flex flex-wrap gap-1">
                          {internship.skillsGained.industry.map((skill, index) => (
                            <Badge key={index} variant="default" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Knowledge Areas */}
                    <div>
                      <h5 className="mb-3 flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        Knowledge Proficiency Growth
                      </h5>
                      <div className="space-y-3">
                        {internship.knowledgeAreas.map((area, index) => (
                          <div key={index}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm">{area.name}</span>
                              <span className={`text-sm ${getValueColor(area.proficiency)}`}>
                                {area.proficiency}%
                              </span>
                            </div>
                            <Progress value={area.proficiency} className="h-2" />
                            <p className="text-xs text-muted-foreground mt-1">
                              {area.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Project Impact */}
                    <div>
                      <h5 className="mb-2 flex items-center gap-2">
                        <Award className="h-4 w-4" />
                        Project Impact
                      </h5>
                      <ul className="space-y-1">
                        {internship.projectImpact.map((impact, index) => (
                          <li key={index} className="text-sm flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            {impact}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Future Opportunities */}
                    <div>
                      <h5 className="mb-2 flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Future Career Opportunities
                      </h5>
                      <div className="grid md:grid-cols-2 gap-2">
                        {internship.futureOpportunities.map((opportunity, index) => (
                          <div key={index} className="text-sm p-2 bg-secondary/50 rounded">
                            {opportunity}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}