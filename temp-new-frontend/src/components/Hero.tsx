import { Search, ArrowRight, Star, Users, Building } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface HeroProps {
  onStartSearch: () => void;
}

export function Hero({ onStartSearch }: HeroProps) {
  return (
    <div className="relative bg-background">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/10"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl text-foreground leading-tight">
                Find Your Perfect
                <span className="text-primary block">PM Internship</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Get personalized internship recommendations from top tech companies. 
                Build your product management career with opportunities tailored to your skills and interests.
              </p>
            </div>

            {/* Quick Search */}
            <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
              <h3 className="text-foreground mb-4">Quick Search</h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <Input 
                    type="text" 
                    placeholder="Search companies, roles, or skills..." 
                    className="w-full"
                  />
                </div>
                <Button onClick={onStartSearch} className="sm:w-auto w-full">
                  <Search className="h-4 w-4 mr-2" />
                  Search Internships
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-6">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Building className="h-5 w-5 text-primary mr-2" />
                  <span className="text-2xl text-foreground">500+</span>
                </div>
                <p className="text-sm text-muted-foreground">Partner Companies</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="h-5 w-5 text-primary mr-2" />
                  <span className="text-2xl text-foreground">10K+</span>
                </div>
                <p className="text-sm text-muted-foreground">Successful Matches</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Star className="h-5 w-5 text-primary mr-2" />
                  <span className="text-2xl text-foreground">4.9</span>
                </div>
                <p className="text-sm text-muted-foreground">Average Rating</p>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={onStartSearch} size="lg" className="sm:w-auto w-full">
                Get Started
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <Button variant="outline" size="lg" className="sm:w-auto w-full">
                Learn More
              </Button>
            </div>
          </div>

          {/* Image */}
          <div className="lg:order-last">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-2xl transform rotate-3"></div>
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1736066331155-c95740b0bd6c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjB3b3Jrc3BhY2UlMjBsYXB0b3B8ZW58MXx8fHwxNzU2NTEyNTQzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Modern workspace with laptop"
                className="relative rounded-2xl shadow-2xl w-full h-96 object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}