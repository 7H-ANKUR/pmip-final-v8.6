import { useState } from 'react';
import { User, Briefcase, Heart, Settings, Calendar, TrendingUp, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

const applications = [
  {
    id: 1,
    title: "Product Management Intern",
    company: "Google",
    logo: "🔍",
    status: "Interview Scheduled",
    statusType: "progress" as const,
    appliedDate: "2024-01-15",
    nextStep: "Technical Interview - Jan 25",
    progress: 60
  },
  {
    id: 2,
    title: "APM Summer Intern",
    company: "Meta",
    logo: "👥",
    status: "Application Submitted",
    statusType: "pending" as const,
    appliedDate: "2024-01-20",
    nextStep: "Waiting for response",
    progress: 25
  },
  {
    id: 3,
    title: "Product Strategy Intern",
    company: "Microsoft",
    logo: "🪟",
    status: "Offer Received",
    statusType: "success" as const,
    appliedDate: "2024-01-10",
    nextStep: "Respond by Jan 30",
    progress: 100
  }
];

const bookmarkedJobs = [
  {
    id: 1,
    title: "Product Marketing Intern",
    company: "Airbnb",
    logo: "🏠",
    location: "San Francisco, CA",
    match: 92
  },
  {
    id: 2,
    title: "Product Analytics Intern",
    company: "Spotify",
    logo: "🎵",
    location: "New York, NY",
    match: 87
  }
];

const profileStats = {
  profileCompletion: 85,
  applicationsSubmitted: 12,
  interviewsScheduled: 3,
  offersReceived: 1
};

export function UserDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const getStatusIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl text-foreground mb-2">My Dashboard</h1>
        <p className="text-muted-foreground">
          Track your applications, manage your profile, and discover new opportunities.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-2xl text-foreground">{profileStats.applicationsSubmitted}</p>
                    <p className="text-sm text-muted-foreground">Applications</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-2xl text-foreground">{profileStats.interviewsScheduled}</p>
                    <p className="text-sm text-muted-foreground">Interviews</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-2xl text-foreground">{profileStats.offersReceived}</p>
                    <p className="text-sm text-muted-foreground">Offers</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-2xl text-foreground">{profileStats.profileCompletion}%</p>
                    <p className="text-sm text-muted-foreground">Profile Complete</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Applications */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Applications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {applications.slice(0, 3).map((app) => (
                <div key={app.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">{app.logo}</div>
                    <div>
                      <h4 className="text-foreground">{app.title}</h4>
                      <p className="text-sm text-muted-foreground">{app.company}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={getStatusColor(app.statusType)}>
                      {getStatusIcon(app.statusType)}
                      <span className="ml-1">{app.status}</span>
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">{app.nextStep}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Applications Tab */}
        <TabsContent value="applications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>All Applications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {applications.map((app) => (
                <div key={app.id} className="border border-border rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <div className="text-3xl">{app.logo}</div>
                      <div>
                        <h3 className="text-lg text-foreground">{app.title}</h3>
                        <p className="text-muted-foreground">{app.company}</p>
                        <p className="text-sm text-muted-foreground">Applied on {app.appliedDate}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(app.statusType)}>
                      {getStatusIcon(app.statusType)}
                      <span className="ml-1">{app.status}</span>
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Application Progress</span>
                        <span className="text-foreground">{app.progress}%</span>
                      </div>
                      <Progress value={app.progress} className="h-2" />
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-muted-foreground">Next Step: {app.nextStep}</p>
                      <Button variant="outline" size="sm">View Details</Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bookmarks Tab */}
        <TabsContent value="bookmarks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="h-5 w-5 mr-2" />
                Saved Internships
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {bookmarkedJobs.map((job) => (
                <div key={job.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">{job.logo}</div>
                    <div>
                      <h4 className="text-foreground">{job.title}</h4>
                      <p className="text-sm text-muted-foreground">{job.company} • {job.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant="secondary">{job.match}% Match</Badge>
                    <Button size="sm">Apply</Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Profile Completion
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Profile Completion</span>
                  <span className="text-foreground">{profileStats.profileCompletion}%</span>
                </div>
                <Progress value={profileStats.profileCompletion} className="h-3" />
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">✅ Basic Information</span>
                  <span className="text-green-600">Complete</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">✅ Education & Experience</span>
                  <span className="text-green-600">Complete</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">⏳ Skills & Interests</span>
                  <Button variant="link" size="sm" className="h-auto p-0">Add Skills</Button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">⏳ Portfolio/Projects</span>
                  <Button variant="link" size="sm" className="h-auto p-0">Upload Portfolio</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground">Preferred Locations</label>
                  <p className="text-foreground">San Francisco, New York, Remote</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Industry Focus</label>
                  <p className="text-foreground">Technology, Fintech, Healthcare</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Company Size</label>
                  <p className="text-foreground">Startup to Large Enterprise</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Salary Range</label>
                  <p className="text-foreground">$6,000 - $10,000/month</p>
                </div>
              </div>
              <Button variant="outline">Edit Preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}