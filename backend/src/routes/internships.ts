import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { optionalAuth } from '../middleware/auth';
import { 
  validateInternshipCreate, 
  handleValidationErrors 
} from '../utils/validation';

const router = express.Router();
const prisma = new PrismaClient();

// Get all internships with optional filtering
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      location, 
      remote, 
      company, 
      skills,
      interests,
      search 
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    // Build where clause
    const where: any = {
      active: true
    };

    if (location) {
      where.location = {
        contains: location as string,
        mode: 'insensitive'
      };
    }

    if (remote !== undefined) {
      where.remote = remote === 'true';
    }

    if (company) {
      where.company = {
        name: {
          contains: company as string,
          mode: 'insensitive'
        }
      };
    }

    if (search) {
      where.OR = [
        {
          title: {
            contains: search as string,
            mode: 'insensitive'
          }
        },
        {
          description: {
            contains: search as string,
            mode: 'insensitive'
          }
        }
      ];
    }

    if (skills) {
      const skillArray = (skills as string).split(',');
      where.skills = {
        some: {
          skill: {
            name: {
              in: skillArray,
              mode: 'insensitive'
            }
          }
        }
      };
    }

    if (interests) {
      const interestArray = (interests as string).split(',');
      where.interests = {
        some: {
          interest: {
            name: {
              in: interestArray,
              mode: 'insensitive'
            }
          }
        }
      };
    }

    const internships = await prisma.internship.findMany({
      where,
      skip,
      take,
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
      orderBy: {
        postedDate: 'desc'
      }
    });

    const total = await prisma.internship.count({ where });

    res.json({
      internships,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });

  } catch (error) {
    console.error('Get internships error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// Get internship by ID
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const internship = await prisma.internship.findUnique({
      where: { id },
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
      return res.status(404).json({
        error: 'Internship not found'
      });
    }

    // Check if user has saved this internship
    let isSaved = false;
    if (req.user) {
      const savedInternship = await prisma.savedInternship.findUnique({
        where: {
          userId_internshipId: {
            userId: req.user.id,
            internshipId: id
          }
        }
      });
      isSaved = !!savedInternship;
    }

    res.json({
      internship: {
        ...internship,
        isSaved
      }
    });

  } catch (error) {
    console.error('Get internship error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// Create new internship (admin only)
router.post('/', authenticateToken, validateInternshipCreate, handleValidationErrors, async (req: AuthRequest, res) => {
  try {
    const {
      title,
      description,
      companyId,
      location,
      duration,
      salary,
      requirements,
      teamSize,
      deadline,
      remote = false,
      skillIds = [],
      interestIds = []
    } = req.body;

    // Check if company exists
    const company = await prisma.company.findUnique({
      where: { id: companyId }
    });

    if (!company) {
      return res.status(404).json({
        error: 'Company not found'
      });
    }

    // Create internship
    const internship = await prisma.internship.create({
      data: {
        title,
        description,
        companyId,
        location,
        duration,
        salary,
        requirements,
        teamSize,
        deadline: deadline ? new Date(deadline) : null,
        remote,
        skills: {
          create: skillIds.map((skillId: string) => ({
            skillId,
            required: true
          }))
        },
        interests: {
          create: interestIds.map((interestId: string) => ({
            interestId
          }))
        }
      },
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

    res.status(201).json({
      message: 'Internship created successfully',
      internship
    });

  } catch (error) {
    console.error('Create internship error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// Update internship
router.put('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if internship exists
    const existingInternship = await prisma.internship.findUnique({
      where: { id }
    });

    if (!existingInternship) {
      return res.status(404).json({
        error: 'Internship not found'
      });
    }

    // Update internship
    const updatedInternship = await prisma.internship.update({
      where: { id },
      data: {
        ...updateData,
        deadline: updateData.deadline ? new Date(updateData.deadline) : undefined
      },
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

    res.json({
      message: 'Internship updated successfully',
      internship: updatedInternship
    });

  } catch (error) {
    console.error('Update internship error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// Delete internship
router.delete('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    // Check if internship exists
    const existingInternship = await prisma.internship.findUnique({
      where: { id }
    });

    if (!existingInternship) {
      return res.status(404).json({
        error: 'Internship not found'
      });
    }

    // Soft delete by setting active to false
    await prisma.internship.update({
      where: { id },
      data: { active: false }
    });

    res.json({
      message: 'Internship deleted successfully'
    });

  } catch (error) {
    console.error('Delete internship error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// Save/unsave internship
router.post('/:id/save', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    // Check if internship exists
    const internship = await prisma.internship.findUnique({
      where: { id }
    });

    if (!internship) {
      return res.status(404).json({
        error: 'Internship not found'
      });
    }

    // Check if already saved
    const existingSaved = await prisma.savedInternship.findUnique({
      where: {
        userId_internshipId: {
          userId,
          internshipId: id
        }
      }
    });

    if (existingSaved) {
      // Remove from saved
      await prisma.savedInternship.delete({
        where: {
          userId_internshipId: {
            userId,
            internshipId: id
          }
        }
      });

      res.json({
        message: 'Internship removed from saved',
        saved: false
      });
    } else {
      // Add to saved
      await prisma.savedInternship.create({
        data: {
          userId,
          internshipId: id
        }
      });

      res.json({
        message: 'Internship saved successfully',
        saved: true
      });
    }

  } catch (error) {
    console.error('Save internship error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// Get saved internships for user
router.get('/saved/list', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;

    const savedInternships = await prisma.savedInternship.findMany({
      where: { userId },
      include: {
        internship: {
          include: {
            company: {
              select: {
                id: true,
                name: true,
                logo: true,
                location: true
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
                applications: true
              }
            }
          }
        }
      },
      orderBy: {
        savedAt: 'desc'
      }
    });

    res.json({
      savedInternships: savedInternships.map(item => ({
        ...item.internship,
        savedAt: item.savedAt
      }))
    });

  } catch (error) {
    console.error('Get saved internships error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

export default router;
