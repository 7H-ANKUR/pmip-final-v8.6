import { ArrowRight, Users, MapPin, TrendingUp } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

const featuredCompanies = [
  {
    id: 1,
    name: "Google",
    logo: "🔍",
    industry: "Technology",
    locations: ["Mountain View", "New York", "Austin"],
    openPositions: 15,
    description: "Join the team that organizes the world's information and makes it universally accessible.",
    features: ["Global Impact", "Innovation Focus", "Learning Opportunities"]
  },
  {
    id: 2,
    name: "Tesla",
    logo: "⚡",
    industry: "Automotive & Energy",
    locations: ["Palo Alto", "Austin", "Berlin"],
    openPositions: 8,
    description: "Accelerate the world's transition to sustainable energy through innovative products.",
    features: ["Sustainability", "Cutting-edge Tech", "Fast Growth"]
  },
  {
    id: 3,
    name: "Netflix",
    logo: "🎬",
    industry: "Entertainment",
    locations: ["Los Gatos", "Los Angeles", "Remote"],
    openPositions: 12,
    description: "Entertainment the world with amazing stories through innovative technology and content.",
    features: ["Creative Freedom", "Global Reach", "Data-Driven"]
  },
  {
    id: 4,
    name: "Shopify",
    logo: "🛍️",
    industry: "E-commerce",
    locations: ["Ottawa", "San Francisco", "Remote"],
    openPositions: 10,
    description: "Make commerce better for everyone by powering entrepreneurs around the world.",
    features: ["Entrepreneurial", "Remote-First", "Impact-Driven"]
  }
];

export function FeaturedCompanies() {
  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl text-foreground mb-4">
            Top Companies Hiring
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore internship opportunities at industry-leading companies that are shaping the future.
          </p>
        </div>

        {/* Company Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {featuredCompanies.map((company) => (
            <Card key={company.id} className="hover:shadow-lg transition-all duration-300 group">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  {/* Company Logo */}
                  <div className="text-4xl flex-shrink-0">{company.logo}</div>
                  
                  {/* Company Info */}
                  <div className="flex-1 space-y-3">
                    <div>
                      <h3 className="text-xl text-foreground group-hover:text-primary transition-colors mb-1">
                        {company.name}
                      </h3>
                      <p className="text-muted-foreground">{company.industry}</p>
                    </div>

                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {company.description}
                    </p>

                    {/* Locations */}
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{company.locations.join(", ")}</span>
                    </div>

                    {/* Open Positions */}
                    <div className="flex items-center space-x-2 text-sm">
                      <Users className="h-4 w-4 text-primary" />
                      <span className="text-foreground">
                        {company.openPositions} open PM internship positions
                      </span>
                    </div>

                    {/* Features */}
                    <div className="flex flex-wrap gap-2">
                      {company.features.map((feature) => (
                        <span 
                          key={feature}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-secondary text-secondary-foreground"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>

                    {/* Action Button */}
                    <div className="pt-2">
                      <Button variant="outline" size="sm">
                        View Openings
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-primary/5 rounded-2xl p-8 mb-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="h-6 w-6 text-primary mr-2" />
                <span className="text-3xl text-foreground">95%</span>
              </div>
              <p className="text-sm text-muted-foreground">Intern satisfaction rate</p>
            </div>
            <div>
              <div className="flex items-center justify-center mb-2">
                <Users className="h-6 w-6 text-primary mr-2" />
                <span className="text-3xl text-foreground">2,500+</span>
              </div>
              <p className="text-sm text-muted-foreground">Successful intern placements</p>
            </div>
            <div>
              <div className="flex items-center justify-center mb-2">
                <MapPin className="h-6 w-6 text-primary mr-2" />
                <span className="text-3xl text-foreground">50+</span>
              </div>
              <p className="text-sm text-muted-foreground">Cities worldwide</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button size="lg">
            Explore All Companies
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}