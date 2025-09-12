import { useState, useCallback } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle, TrendingUp, Target, Star } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { useLanguage } from './LanguageProvider';

interface ResumeAnalysis {
  overallScore: number;
  skillsMatch: number;
  improvements: string[];
  missingSkills: string[];
  strengths: string[];
  sections: {
    contact: number;
    summary: number;
    experience: number;
    education: number;
    skills: number;
  };
}

export function ResumeEnhancer() {
  const { t } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (isValidFileType(droppedFile)) {
        setFile(droppedFile);
      }
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (isValidFileType(selectedFile)) {
        setFile(selectedFile);
      }
    }
  };

  const isValidFileType = (file: File) => {
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    return validTypes.includes(file.type);
  };

  const analyzeResume = async () => {
    if (!file) return;
    setIsAnalyzing(true);
    try {
      const form = new FormData();
      form.append('file', file);
      // Optionally pass JD from UI later
      // form.append('job_description', jobDescription);

      const res = await fetch('/api/resume-ai/analyze', {
        method: 'POST',
        body: form
      });

      const data = await res.json();
      const a = data?.analysis;
      if (!a) throw new Error('No analysis');

      // Map AI analysis to existing UI shape
      const mapped: ResumeAnalysis = {
        overallScore: typeof a.match_score === 'number' ? a.match_score : 0,
        skillsMatch: typeof a.match_score === 'number' ? a.match_score : 0,
        improvements: Array.isArray(a.recommendations) ? a.recommendations : [],
        missingSkills: Array.isArray(a.gaps) ? a.gaps : [],
        strengths: Array.isArray(a.strengths) ? a.strengths : [],
        sections: {
          contact: 80,
          summary: 80,
          experience: 80,
          education: 80,
          skills: 80
        }
      };
      setAnalysis(mapped);
    } catch (e) {
      setAnalysis({
        overallScore: 50,
        skillsMatch: 50,
        improvements: ['Could not reach AI. Please try again.'],
        missingSkills: [],
        strengths: [],
        sections: { contact: 50, summary: 50, experience: 50, education: 50, skills: 50 }
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          {t('resume.title')}
        </CardTitle>
        <CardDescription>
          {t('resume.subtitle')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* File Upload */}
        {!file && (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive ? 'border-primary bg-primary/5' : 'border-border'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <div className="space-y-2">
              <p className="text-lg">{t('resume.drag_drop')}</p>
              <p className="text-sm text-muted-foreground">{t('resume.supported_formats')}</p>
            </div>
            <Button className="mt-4" onClick={() => document.getElementById('resume-upload')?.click()}>
              {t('resume.upload')}
            </Button>
            <input
              id="resume-upload"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        )}

        {/* File Selected */}
        {file && !analysis && (
          <div className="space-y-4">
            <Alert>
              <FileText className="h-4 w-4" />
              <AlertDescription>
                File selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </AlertDescription>
            </Alert>
            <Button 
              onClick={analyzeResume} 
              disabled={isAnalyzing}
              className="w-full"
            >
              {isAnalyzing ? t('common.loading') : t('resume.analyze')}
            </Button>
            {isAnalyzing && (
              <div className="space-y-2">
                <Progress value={66} className="w-full" />
                <p className="text-sm text-center text-muted-foreground">
                  Analyzing your resume...
                </p>
              </div>
            )}
          </div>
        )}

        {/* Analysis Results */}
        {analysis && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg mb-4">{t('resume.analysis_title')}</h3>
            </div>

            {/* Score Overview */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-2 ${getScoreBg(analysis.overallScore)}`}>
                    <span className={`text-xl ${getScoreColor(analysis.overallScore)}`}>
                      {analysis.overallScore}%
                    </span>
                  </div>
                  <p className="text-sm">{t('resume.overall_score')}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-2 ${getScoreBg(analysis.skillsMatch)}`}>
                    <span className={`text-xl ${getScoreColor(analysis.skillsMatch)}`}>
                      {analysis.skillsMatch}%
                    </span>
                  </div>
                  <p className="text-sm">{t('resume.skills_match')}</p>
                </CardContent>
              </Card>
            </div>

            {/* Section Scores */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Section Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(analysis.sections).map(([section, score]) => (
                  <div key={section} className="flex items-center justify-between">
                    <span className="capitalize">{section}</span>
                    <div className="flex items-center gap-2 w-32">
                      <Progress value={score} className="flex-1" />
                      <span className={`text-sm ${getScoreColor(score)}`}>{score}%</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Improvements */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {t('resume.improvements')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.improvements.map((improvement, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Target className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      {improvement}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Missing Skills */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t('resume.missing_skills')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {analysis.missingSkills.map((skill, index) => (
                    <Badge key={index} variant="outline" className="border-yellow-300 text-yellow-700">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Strengths */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Your Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Star className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      {strength}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Action Button */}
            <div className="text-center">
              <Button 
                onClick={() => {
                  setFile(null);
                  setAnalysis(null);
                }}
                variant="outline"
              >
                Analyze Another Resume
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}