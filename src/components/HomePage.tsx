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
import { motion } from "motion/react";
import { useState } from "react";

interface HomePageProps {
  onNavigateToProfile: () => void;
  onNavigateToRecommendations: () => void;
}

function HomePage({ onNavigateToProfile }: HomePageProps) {
  const { t } = useLanguage();
  const [buttonClicked, setButtonClicked] = useState("");

  const handleButtonClick = (buttonId: string, callback: () => void) => {
    setButtonClicked(buttonId);
    setTimeout(() => {
      setButtonClicked("");
      callback();
    }, 300);
  };

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-4 mb-6">
              <Briefcase className="h-12 w-12 md:h-16 md:w-16 text-blue-600 dark:text-blue-400" />
              <h1 className="text-4xl md:text-6xl font-bold">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">InternMatch</span>
              </h1>
              <Award className="h-12 w-12 md:h-16 md:w-16 text-purple-600 dark:text-purple-400" />
            </div>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
              {t("home.tagline")}
            </p>
            <div className="flex justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={buttonClicked === "getStarted" ? { scale: [1, 1.1, 1] } : {}}
              >
                <Button
                  size="lg"
                  onClick={() => handleButtonClick("getStarted", onNavigateToProfile)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 flex items-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                    <Rocket className="h-5 w-5" />
                  </motion.div>
                  {t("home.get_started")}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section (Shifted Down Slightly) */}
      <section className="pt-24 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Star className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <h2 className="text-3xl md:text-4xl bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                {t("home.why_choose")}
              </h2>
              <Star className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("home.why_subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -10 }}
              >
                <Card className="text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer">
                  <CardHeader>
                    <motion.div 
                      className="mx-auto mb-4 w-12 h-12 bg-gradient-to-r from-blue-600/10 to-purple-600/10 dark:from-blue-400/10 dark:to-purple-400/10 rounded-lg flex items-center justify-center"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <feature.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </motion.div>
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
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600/5 to-purple-600/5 dark:from-blue-400/5 dark:to-purple-400/5">
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
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={buttonClicked === "ctaGetStarted" ? { scale: [1, 1.1, 1] } : {}}
            >
              <Button
                size="lg"
                onClick={() => handleButtonClick("ctaGetStarted", onNavigateToProfile)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 flex items-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.3 }}>
                  <BookOpen className="h-5 w-5" />
                </motion.div>
                {t("home.get_started")}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;