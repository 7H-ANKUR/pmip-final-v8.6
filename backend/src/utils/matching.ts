import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface MatchScore {
  internshipId: string;
  score: number;
  reasons: string[];
}

export const calculateMatchScore = async (
  userId: string,
  internshipId: string
): Promise<MatchScore> => {
  try {
    // Get user profile with skills and interests
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        skills: {
          include: {
            skill: true
          }
        },
        interests: {
          include: {
            interest: true
          }
        }
      }
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Get internship with required skills and interests
    const internship = await prisma.internship.findUnique({
      where: { id: internshipId },
      include: {
        skills: {
          include: {
            skill: true
          }
        },
        interests: {
          include: {
            interest: true
          }
        },
        company: true
      }
    });

    if (!internship) {
      throw new Error('Internship not found');
    }

    let totalScore = 0;
    let maxScore = 100;
    const reasons: string[] = [];

    // 1. Skills matching (40% of total score)
    const userSkillNames = user.skills.map(us => us.skill.name.toLowerCase());
    const requiredSkillNames = internship.skills.map(is => is.skill.name.toLowerCase());
    const matchedSkills = userSkillNames.filter(skill => 
      requiredSkillNames.some(reqSkill => reqSkill.includes(skill) || skill.includes(reqSkill))
    );

    const skillMatchPercentage = (matchedSkills.length / requiredSkillNames.length) * 100;
    const skillScore = (skillMatchPercentage / 100) * 40;
    totalScore += skillScore;

    if (matchedSkills.length > 0) {
      reasons.push(`You have ${matchedSkills.length} out of ${requiredSkillNames.length} required skills`);
    } else {
      reasons.push('Skills gap: Consider developing required skills');
    }

    // 2. Interests matching (25% of total score)
    const userInterestNames = user.interests.map(ui => ui.interest.name.toLowerCase());
    const internshipInterestNames = internship.interests.map(ii => ii.interest.name.toLowerCase());
    const matchedInterests = userInterestNames.filter(interest => 
      internshipInterestNames.some(reqInterest => reqInterest.includes(interest) || interest.includes(reqInterest))
    );

    const interestMatchPercentage = internshipInterestNames.length > 0 
      ? (matchedInterests.length / internshipInterestNames.length) * 100 
      : 100;
    const interestScore = (interestMatchPercentage / 100) * 25;
    totalScore += interestScore;

    if (matchedInterests.length > 0) {
      reasons.push(`Your interests align with ${matchedInterests.length} of the internship's focus areas`);
    }

    // 3. Location preference (15% of total score)
    if (user.location && internship.location) {
      const userLocation = user.location.toLowerCase();
      const internshipLocation = internship.location.toLowerCase();
      
      // Check for exact match or same city/state
      if (userLocation === internshipLocation || 
          userLocation.includes(internshipLocation) || 
          internshipLocation.includes(userLocation)) {
        totalScore += 15;
        reasons.push('Location matches your preference');
      } else if (internship.remote) {
        totalScore += 10;
        reasons.push('Remote opportunity available');
      } else {
        reasons.push('Location may require relocation');
      }
    } else if (internship.remote) {
      totalScore += 10;
      reasons.push('Remote opportunity available');
    }

    // 4. Education level compatibility (10% of total score)
    if (user.university && user.major) {
      totalScore += 10;
      reasons.push('Educational background is suitable');
    }

    // 5. Profile completeness bonus (10% of total score)
    if (user.profileComplete) {
      totalScore += 10;
      reasons.push('Complete profile gives you an advantage');
    } else {
      reasons.push('Complete your profile for better matches');
    }

    // Bonus points for high-demand skills
    const highDemandSkills = ['javascript', 'python', 'react', 'machine learning', 'data analysis'];
    const userHighDemandSkills = userSkillNames.filter(skill => 
      highDemandSkills.some(hds => skill.includes(hds) || hds.includes(skill))
    );

    if (userHighDemandSkills.length > 0) {
      const bonus = Math.min(userHighDemandSkills.length * 2, 10);
      totalScore += bonus;
      reasons.push(`You have ${userHighDemandSkills.length} high-demand skills`);
    }

    // Ensure score doesn't exceed 100
    totalScore = Math.min(Math.round(totalScore), 100);

    // Add overall assessment
    if (totalScore >= 90) {
      reasons.push('Excellent match!');
    } else if (totalScore >= 80) {
      reasons.push('Great match!');
    } else if (totalScore >= 70) {
      reasons.push('Good match with room for improvement');
    } else if (totalScore >= 50) {
      reasons.push('Moderate match - consider skill development');
    } else {
      reasons.push('Low match - focus on required skills and interests');
    }

    return {
      internshipId,
      score: totalScore,
      reasons
    };

  } catch (error) {
    console.error('Error calculating match score:', error);
    throw error;
  }
};

export const getTopRecommendations = async (
  userId: string,
  limit: number = 5
): Promise<MatchScore[]> => {
  try {
    // Get all active internships
    const internships = await prisma.internship.findMany({
      where: { active: true },
      include: {
        company: true,
        skills: {
          include: {
            skill: true
          }
        },
        interests: {
          include: {
            interest: true
          }
        }
      }
    });

    // Calculate match scores for all internships
    const matchScores = await Promise.all(
      internships.map(async (internship) => {
        try {
          return await calculateMatchScore(userId, internship.id);
        } catch (error) {
          console.error(`Error calculating score for internship ${internship.id}:`, error);
          return {
            internshipId: internship.id,
            score: 0,
            reasons: ['Unable to calculate match score']
          };
        }
      })
    );

    // Sort by score and return top matches
    return matchScores
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

  } catch (error) {
    console.error('Error getting recommendations:', error);
    throw error;
  }
};
