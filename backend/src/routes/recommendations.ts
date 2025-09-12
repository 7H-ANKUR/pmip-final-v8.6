import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { getTopRecommendations, calculateMatchScore } from '../utils/matching';

const router = express.Router();
const prisma = new PrismaClient();

// Get personalized recommendations for user
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const limit = parseInt(req.query.limit as string) || 5;

    // Get top recommendations
    const recommendations = await getTopRecommendations(userId, limit);

    // Get detailed internship information for each recommendation
    const detailedRecommendations = await Promise.all(
      recommendations.map(async (rec) => {
        const internship = await prisma.internship.findUnique({
          where: { id: rec.internshipId },
          include: {
            company: {
              select: {
                id: true,
                name: true,
                logo: true,
                location: true,
                industry: true,
                size: true
              }
            },
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
            _count: {
              select: {
                applications: true,
                savedBy: true
              }
            }
          }
        });

        if (!internship) {
          return null;
        }

        // Check if user has saved this internship
        const isSaved = await prisma.savedInternship.findUnique({
          where: {
            userId_internshipId: {
              userId,
              internshipId: rec.internshipId
            }
          }
        });

        // Check if user has already applied
        const hasApplied = await prisma.application.findUnique({
          where: {
            userId_internshipId: {
              userId,
              internshipId: rec.internshipId
            }
          }
        });

        return {
          ...internship,
          matchPercentage: rec.score,
          matchReasons: rec.reasons,
          isSaved: !!isSaved,
          hasApplied: !!hasApplied
        };
      })
    );

    // Filter out null results
    const validRecommendations = detailedRecommendations.filter(rec => rec !== null);

    res.json({
      recommendations: validRecommendations,
      total: validRecommendations.length
    });

  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// Get match score for specific internship
router.get('/match/:internshipId', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const { internshipId } = req.params;

    const matchScore = await calculateMatchScore(userId, internshipId);

    res.json({
      internshipId,
      matchPercentage: matchScore.score,
      reasons: matchScore.reasons
    });

  } catch (error) {
    console.error('Get match score error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// Get recommendations by category
router.get('/category/:category', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const { category } = req.params;
    const limit = parseInt(req.query.limit as string) || 5;

    // Map category to interest or skill
    let whereClause: any = { active: true };

    if (category) {
      whereClause.OR = [
        {
          interests: {
            some: {
              interest: {
                name: {
                  contains: category,
                  mode: 'insensitive'
                }
              }
            }
          }
        },
        {
          skills: {
            some: {
              skill: {
                name: {
                  contains: category,
                  mode: 'insensitive'
                }
              }
            }
          }
        }
      ];
    }

    const internships = await prisma.internship.findMany({
      where: whereClause,
      include: {
        company: {
          select: {
            id: true,
            name: true,
            logo: true,
            location: true,
            industry: true
          }
        },
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
        _count: {
          select: {
            applications: true,
            savedBy: true
          }
        }
      },
      take: limit * 2 // Get more to filter by match score
    });

    // Calculate match scores and sort
    const recommendationsWithScores = await Promise.all(
      internships.map(async (internship) => {
        try {
          const matchScore = await calculateMatchScore(userId, internship.id);
          
          // Check if user has saved this internship
          const isSaved = await prisma.savedInternship.findUnique({
            where: {
              userId_internshipId: {
                userId,
                internshipId: internship.id
              }
            }
          });

          return {
            ...internship,
            matchPercentage: matchScore.score,
            matchReasons: matchScore.reasons,
            isSaved: !!isSaved
          };
        } catch (error) {
          return null;
        }
      })
    );

    // Filter and sort by match score
    const validRecommendations = recommendationsWithScores
      .filter(rec => rec !== null)
      .sort((a, b) => b!.matchPercentage - a!.matchPercentage)
      .slice(0, limit);

    res.json({
      category,
      recommendations: validRecommendations,
      total: validRecommendations.length
    });

  } catch (error) {
    console.error('Get category recommendations error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// Get trending internships
router.get('/trending', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 5;

    const trendingInternships = await prisma.internship.findMany({
      where: { 
        active: true,
        postedDate: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
        }
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            logo: true,
            location: true,
            industry: true
          }
        },
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
        _count: {
          select: {
            applications: true,
            savedBy: true
          }
        }
      },
      orderBy: [
        { applications: 'desc' },
        { postedDate: 'desc' }
      ],
      take: limit
    });

    res.json({
      trendingInternships,
      total: trendingInternships.length
    });

  } catch (error) {
    console.error('Get trending internships error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// Get similar internships based on a specific internship
router.get('/similar/:internshipId', async (req, res) => {
  try {
    const { internshipId } = req.params;
    const limit = parseInt(req.query.limit as string) || 5;

    // Get the reference internship
    const referenceInternship = await prisma.internship.findUnique({
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
        }
      }
    });

    if (!referenceInternship) {
      return res.status(404).json({
        error: 'Internship not found'
      });
    }

    // Find similar internships based on skills and interests
    const skillIds = referenceInternship.skills.map(s => s.skillId);
    const interestIds = referenceInternship.interests.map(i => i.interestId);

    const similarInternships = await prisma.internship.findMany({
      where: {
        active: true,
        id: { not: internshipId },
        OR: [
          {
            skills: {
              some: {
                skillId: {
                  in: skillIds
                }
              }
            }
          },
          {
            interests: {
              some: {
                interestId: {
                  in: interestIds
                }
              }
            }
          }
        ]
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            logo: true,
            location: true,
            industry: true
          }
        },
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
        _count: {
          select: {
            applications: true,
            savedBy: true
          }
        }
      },
      take: limit
    });

    res.json({
      similarInternships,
      total: similarInternships.length
    });

  } catch (error) {
    console.error('Get similar internships error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

export default router;
