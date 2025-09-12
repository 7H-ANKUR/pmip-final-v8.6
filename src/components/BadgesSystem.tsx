import { useState, useEffect } from 'react';
import { Award, Star, Trophy, Target, User, FileText, Briefcase, Users, Lock, Crown, Zap, Medal, Shield, Gem } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { useLanguage } from './LanguageProvider';

interface BadgeType {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: 'profile' | 'activity' | 'achievement' | 'milestone';
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  earned: boolean;
  progress: number;
  maxProgress: number;
  unlockedAt?: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface BadgesSystemProps {
  userProfile?: {
    isComplete: boolean;
    resumeUploaded: boolean;
    applicationsCount: number;
    skillsCount: number;
    profileCompleteness: number;
  };
}

export function BadgesSystem({ userProfile }: BadgesSystemProps) {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [badges, setBadges] = useState<BadgeType[]>([]);

  // Initialize badges based on user progress
  useEffect(() => {
    const allBadges: BadgeType[] = [
      // Profile Badges
      {
        id: 'profile-starter',
        name: t('badges.profile_complete'),
        description: 'Complete your basic profile information',
        icon: <User className="h-6 w-6" />,
        category: 'profile',
        difficulty: 'easy',
        points: 100,
        earned: userProfile?.isComplete || false,
        progress: userProfile?.profileCompleteness || 0,
        maxProgress: 100,
        rarity: 'common',
        unlockedAt: userProfile?.isComplete ? new Date() : undefined
      },
      {
        id: 'resume-ready',
        name: t('badges.resume_uploaded'),
        description: 'Upload and analyze your resume',
        icon: <FileText className="h-6 w-6" />,
        category: 'profile',
        difficulty: 'easy',
        points: 150,
        earned: userProfile?.resumeUploaded || false,
        progress: userProfile?.resumeUploaded ? 1 : 0,
        maxProgress: 1,
        rarity: 'common',
        unlockedAt: userProfile?.resumeUploaded ? new Date() : undefined
      },
      {
        id: 'skill-collector',
        name: t('badges.skill_expert'),
        description: 'Add 10 or more skills to your profile',
        icon: <Target className="h-6 w-6" />,
        category: 'profile',
        difficulty: 'medium',
        points: 200,
        earned: (userProfile?.skillsCount || 0) >= 10,
        progress: Math.min(userProfile?.skillsCount || 0, 10),
        maxProgress: 10,
        rarity: 'rare'
      },
      
      // Activity Badges
      {
        id: 'first-application',
        name: t('badges.first_application'),
        description: 'Submit your first internship application',
        icon: <Briefcase className="h-6 w-6" />,
        category: 'activity',
        difficulty: 'easy',
        points: 125,
        earned: (userProfile?.applicationsCount || 0) >= 1,
        progress: Math.min(userProfile?.applicationsCount || 0, 1),
        maxProgress: 1,
        rarity: 'common'
      },
      {
        id: 'application-master',
        name: 'Application Master',
        description: 'Apply to 5 different internships',
        icon: <Trophy className="h-6 w-6" />,
        category: 'activity',
        difficulty: 'medium',
        points: 300,
        earned: (userProfile?.applicationsCount || 0) >= 5,
        progress: Math.min(userProfile?.applicationsCount || 0, 5),
        maxProgress: 5,
        rarity: 'rare'
      },
      {
        id: 'networking-ninja',
        name: 'Networking Ninja',
        description: 'Connect with 3 professionals through internships',
        icon: <Users className="h-6 w-6" />,
        category: 'activity',
        difficulty: 'hard',
        points: 400,
        earned: false,
        progress: 0,
        maxProgress: 3,
        rarity: 'epic'
      },
      
      // Achievement Badges
      {
        id: 'early-bird',
        name: 'Early Bird',
        description: 'Join InternMatch in its first year',
        icon: <Star className="h-6 w-6" />,
        category: 'achievement',
        difficulty: 'easy',
        points: 500,
        earned: true,
        progress: 1,
        maxProgress: 1,
        rarity: 'legendary'
      },
      {
        id: 'trendsetter',
        name: 'Trendsetter',
        description: 'Be among the first 1000 users',
        icon: <Award className="h-6 w-6" />,
        category: 'achievement',
        difficulty: 'medium',
        points: 750,
        earned: true,
        progress: 1,
        maxProgress: 1,
        rarity: 'epic'
      },
      
      // Milestone Badges
      {
        id: 'week-warrior',
        name: 'Week Warrior',
        description: 'Use InternMatch for 7 consecutive days',
        icon: <Target className="h-6 w-6" />,
        category: 'milestone',
        difficulty: 'medium',
        points: 250,
        earned: false,
        progress: 3,
        maxProgress: 7,
        rarity: 'rare'
      },
      {
        id: 'perfect-match',
        name: 'Perfect Match',
        description: 'Find an internship with 95%+ match score',
        icon: <Trophy className="h-6 w-6" />,
        category: 'milestone',
        difficulty: 'hard',
        points: 600,
        earned: false,
        progress: 0,
        maxProgress: 1,
        rarity: 'epic'
      }
    ];

    setBadges(allBadges);
  }, [userProfile, t]);

  const categories = [
    { id: 'all', name: 'All Badges', count: badges.length },
    { id: 'profile', name: 'Profile', count: badges.filter(b => b.category === 'profile').length },
    { id: 'activity', name: 'Activity', count: badges.filter(b => b.category === 'activity').length },
    { id: 'achievement', name: 'Achievements', count: badges.filter(b => b.category === 'achievement').length },
    { id: 'milestone', name: 'Milestones', count: badges.filter(b => b.category === 'milestone').length }
  ];

  const filteredBadges = selectedCategory === 'all' 
    ? badges 
    : badges.filter(badge => badge.category === selectedCategory);

  const earnedBadges = badges.filter(badge => badge.earned);
  const totalPoints = earnedBadges.reduce((sum, badge) => sum + badge.points, 0);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100';
      case 'rare': return 'border-blue-300 bg-gradient-to-br from-blue-50 to-blue-100';
      case 'epic': return 'border-purple-300 bg-gradient-to-br from-purple-50 to-purple-100';
      case 'legendary': return 'border-yellow-300 bg-gradient-to-br from-yellow-50 to-yellow-100';
      default: return 'border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100';
    }
  };

  const getRarityTextColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-700';
      case 'rare': return 'text-blue-700';
      case 'epic': return 'text-purple-700';
      case 'legendary': return 'text-yellow-700';
      default: return 'text-gray-700';
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'common': return <Medal className="h-4 w-4" />;
      case 'rare': return <Gem className="h-4 w-4" />;
      case 'epic': return <Shield className="h-4 w-4" />;
      case 'legendary': return <Crown className="h-4 w-4" />;
      default: return <Medal className="h-4 w-4" />;
    }
  };

  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'shadow-gray-200/50';
      case 'rare': return 'shadow-blue-200/50';
      case 'epic': return 'shadow-purple-200/50';
      case 'legendary': return 'shadow-yellow-200/50';
      default: return 'shadow-gray-200/50';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          {t('badges.title')}
        </CardTitle>
        <CardDescription>
          Track your progress and earn rewards for completing milestones
        </CardDescription>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Trophy className="h-5 w-5 text-blue-600" />
              <div className="text-2xl font-bold text-blue-700">{earnedBadges.length}</div>
            </div>
            <div className="text-sm text-blue-600">Badges Earned</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Star className="h-5 w-5 text-purple-600" />
              <div className="text-2xl font-bold text-purple-700">{totalPoints.toLocaleString()}</div>
            </div>
            <div className="text-sm text-purple-600">Total Points</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Target className="h-5 w-5 text-green-600" />
              <div className="text-2xl font-bold text-green-700">{Math.round((earnedBadges.length / badges.length) * 100)}%</div>
            </div>
            <div className="text-sm text-green-600">Completion</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map(category => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="text-xs"
            >
              {category.name} ({category.count})
            </Button>
          ))}
        </div>

        {/* Badges Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBadges.map(badge => (
            <Card 
              key={badge.id} 
              className={`relative transition-all hover:shadow-lg hover:scale-105 duration-300 ${
                badge.earned 
                  ? `${getRarityColor(badge.rarity)} ${getRarityGlow(badge.rarity)} shadow-lg border-2`
                  : 'border-dashed border-muted bg-muted/20 hover:bg-muted/30'
              }`}
            >
              {/* Sparkle Effects for Earned Badges */}
              {badge.earned && (
                <div className="absolute -top-1 -right-1 z-10">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    badge.rarity === 'legendary' ? 'bg-yellow-400' :
                    badge.rarity === 'epic' ? 'bg-purple-400' :
                    badge.rarity === 'rare' ? 'bg-blue-400' : 'bg-gray-400'
                  } animate-pulse shadow-lg`}>
                    <Star className="h-3 w-3 text-white" />
                  </div>
                </div>
              )}
              
              <CardContent className="p-6 text-center">
                {/* Circular Badge Design */}
                <div className="flex flex-col items-center">
                  <div className={`
                    relative w-20 h-20 rounded-full flex items-center justify-center mb-4 transform transition-transform hover:scale-110
                    ${badge.earned 
                      ? `shadow-xl border-4 ${
                          badge.rarity === 'common' ? 'bg-gradient-to-br from-gray-300 to-gray-500 border-gray-200' :
                          badge.rarity === 'rare' ? 'bg-gradient-to-br from-blue-400 to-blue-600 border-blue-300' :
                          badge.rarity === 'epic' ? 'bg-gradient-to-br from-purple-400 to-purple-600 border-purple-300' :
                          'bg-gradient-to-br from-yellow-400 to-yellow-600 border-yellow-300'
                        }`
                      : 'bg-gradient-to-br from-gray-100 to-gray-200 border-4 border-gray-300 text-muted-foreground'
                    }
                  `}>
                    {/* Decorative Ring */}
                    <div className={`absolute inset-2 rounded-full border-2 ${
                      badge.earned 
                        ? `border-white/30 ${
                            badge.rarity === 'legendary' ? 'shadow-yellow-200' :
                            badge.rarity === 'epic' ? 'shadow-purple-200' :
                            badge.rarity === 'rare' ? 'shadow-blue-200' : 'shadow-gray-200'
                          } shadow-lg`
                        : 'border-gray-400/30'
                    }`} />
                    
                    {/* Inner Circle with Icon */}
                    <div className={`absolute inset-4 rounded-full flex items-center justify-center ${
                      badge.earned 
                        ? 'bg-white/90 text-gray-700'
                        : 'bg-gray-200 text-gray-500'
                    } shadow-inner`}>
                      {badge.earned ? (
                        <div className="text-lg">
                          {badge.icon}
                        </div>
                      ) : (
                        <Lock className="h-5 w-5" />
                      )}
                    </div>

                    {/* Ribbon Effect for High Rarity */}
                    {badge.earned && (badge.rarity === 'epic' || badge.rarity === 'legendary') && (
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                        <div className={`w-8 h-6 ${
                          badge.rarity === 'legendary' ? 'bg-gradient-to-b from-yellow-400 to-yellow-600' : 'bg-gradient-to-b from-purple-400 to-purple-600'
                        } rounded-b-lg relative`}>
                          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-current opacity-60"></div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Badge Info */}
                  <div className="w-full">
                    <h4 className={`font-semibold mb-2 ${badge.earned ? getRarityTextColor(badge.rarity) : 'text-muted-foreground'}`}>
                      {badge.name}
                    </h4>
                    
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                      {badge.description}
                    </p>
                    
                    {/* Points Badge */}
                    <div className="flex justify-center mb-3">
                      <Badge 
                        variant="secondary" 
                        className={`text-xs font-bold flex items-center gap-1 px-3 py-1 ${
                          badge.earned ? `${getRarityTextColor(badge.rarity)} border-current` : 'text-muted-foreground'
                        }`}
                      >
                        <Star className="h-3 w-3" />
                        {badge.points} pts
                      </Badge>
                    </div>
                    
                    {/* Progress Bar */}
                    {!badge.earned && badge.maxProgress > 1 && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs mb-2">
                          <span>Progress</span>
                          <span>{badge.progress}/{badge.maxProgress}</span>
                        </div>
                        <Progress 
                          value={(badge.progress / badge.maxProgress) * 100} 
                          className="h-2"
                        />
                      </div>
                    )}
                    
                    {/* Earned Date */}
                    {badge.earned && badge.unlockedAt && (
                      <div className="text-xs text-muted-foreground mt-3 text-center">
                        Earned {badge.unlockedAt.toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Rarity Indicator */}
                {badge.earned && (
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
                    <Badge 
                      variant="outline" 
                      className={`text-xs capitalize flex items-center gap-1 ${getRarityTextColor(badge.rarity)} border-current bg-white/90 backdrop-blur-sm`}
                    >
                      {getRarityIcon(badge.rarity)}
                      {badge.rarity}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Next Badges to Unlock */}
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-5 w-5 text-yellow-500" />
            <h4 className="font-semibold">Next Badges to Unlock</h4>
          </div>
          <div className="space-y-3">
            {badges
              .filter(badge => !badge.earned && badge.progress > 0)
              .slice(0, 3)
              .map(badge => (
                <div key={badge.id} className="flex items-center gap-4 p-4 bg-gradient-to-r from-secondary/30 to-secondary/10 rounded-xl border border-secondary hover:shadow-md transition-all">
                  {/* Mini Circular Badge */}
                  <div className="relative">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 bg-gradient-to-br ${
                      badge.rarity === 'common' ? 'from-gray-100 to-gray-300 border-gray-300' :
                      badge.rarity === 'rare' ? 'from-blue-100 to-blue-300 border-blue-300' :
                      badge.rarity === 'epic' ? 'from-purple-100 to-purple-300 border-purple-300' :
                      'from-yellow-100 to-yellow-300 border-yellow-300'
                    } shadow-md`}>
                      <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-inner">
                        {badge.icon}
                      </div>
                    </div>
                    {/* Progress Ring */}
                    <div className="absolute inset-0">
                      <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 48 48">
                        <circle
                          cx="24"
                          cy="24"
                          r="20"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          className="text-muted"
                          opacity="0.2"
                        />
                        <circle
                          cx="24"
                          cy="24"
                          r="20"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          className={
                            badge.rarity === 'common' ? 'text-gray-400' :
                            badge.rarity === 'rare' ? 'text-blue-400' :
                            badge.rarity === 'epic' ? 'text-purple-400' :
                            'text-yellow-400'
                          }
                          strokeDasharray={`${(badge.progress / badge.maxProgress) * 125.6} 125.6`}
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{badge.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {badge.progress}/{badge.maxProgress}
                      </Badge>
                    </div>
                    <Progress 
                      value={(badge.progress / badge.maxProgress) * 100} 
                      className="h-2"
                    />
                    <div className="text-xs text-muted-foreground mt-1">
                      {Math.round((badge.progress / badge.maxProgress) * 100)}% complete • {badge.points} points when earned
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </CardContent>
    </Card>
  );
}