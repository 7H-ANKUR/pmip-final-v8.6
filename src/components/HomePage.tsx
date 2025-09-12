import {
  Target,
  Users,
  TrendingUp,
  ArrowRight,
  Briefcase,
  Award,
  Star,
  CheckCircle,
  Rocket,
  BookOpen,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { useLanguage } from "./LanguageProvider";
import { ChatBot } from "./ChatBot";

interface HomePageProps {
  onNavigateToProfile: () => void;
  onNavigateToRecommendations: () => void;
}

function HomePage({ onNavigateToProfile }: HomePageProps) {
  const { t } = useLanguage();

  const features = [
    {
      icon: Target,
      title: t("home.feature1_title"),
      description: t("home.feature1_desc"),
    },
    {
      icon: Users,
      title: t("home.feature2_title"),
      description: t("home.feature2_desc"),
    },
    {
      icon: TrendingUp,
      title: t("home.feature3_title"),
      description: t("home.feature3_desc"),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background to-secondary/20 py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-4 mb-6">
              <Briefcase className="h-12 w-12 md:h-16 md:w-16 text-primary" />
              <h1 className="text-4xl md:text-6xl text-foreground font-bold">
                <span className="text-primary">InternMatch</span>
              </h1>
              <Award className="h-12 w-12 md:h-16 md:w-16 text-primary" />
            </div>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
              {t("home.tagline")}
            </p>
            <div className="flex justify-center">
              <Button
                size="lg"
                onClick={onNavigateToProfile}
                className="px-8 py-3 flex items-center gap-3"
              >
                <Rocket className="h-5 w-5" />
                {t("home.get_started")}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section (Shifted Down Slightly) */}
      <section className="pt-24 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Star className="h-8 w-8 text-primary" />
              <h2 className="text-3xl md:text-4xl text-foreground">
                {t("home.why_choose")}
              </h2>
              <Star className="h-8 w-8 text-primary" />
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("home.why_subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="mx-auto mb-4 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-secondary/20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <h2 className="text-3xl md:text-4xl text-foreground">
              {t("home.ready_title")}
            </h2>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
          <p className="text-lg text-muted-foreground mb-8">
            {t("home.ready_subtitle")}
          </p>
          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={onNavigateToProfile}
              className="px-8 py-3 flex items-center gap-3"
            >
              <BookOpen className="h-5 w-5" />
              {t("home.get_started")}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* ChatBot Component */}
      <ChatBot />
    </div>
  );
}

export default HomePage;