import { Briefcase, Mail, Twitter, Linkedin, Github } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-secondary/20 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Briefcase className="h-6 w-6 text-primary" />
              <span className="text-lg text-foreground">InternMatch</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Connecting talented students with amazing PM internship opportunities at top companies worldwide.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="h-4 w-4" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* For Students */}
          <div className="space-y-4">
            <h3 className="text-foreground">For Students</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Browse Internships</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Career Resources</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Resume Builder</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Interview Prep</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Success Stories</a></li>
            </ul>
          </div>

          {/* For Companies */}
          <div className="space-y-4">
            <h3 className="text-foreground">For Companies</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Post Internships</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Talent Search</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Company Profiles</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Recruitment Tools</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-foreground">Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground">
              © 2024 InternMatch. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">Privacy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms</a>
              <a href="#" className="hover:text-primary transition-colors">Accessibility</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}