import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { body, validationResult } from 'express-validator';

const router = express.Router();
const prisma = new PrismaClient();

// Get user's applications
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const { status, page = 1, limit = 10 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const whereClause: any = { userId };
    if (status) {
      whereClause.status = status;
    }

    const applications = await prisma.application.findMany({
      where: whereClause,
      skip,
      take,
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
            }
          }
        }
      },
      orderBy: {
        appliedAt: 'desc'
      }
    });

    const total = await prisma.application.count({ where: whereClause });

    res.json({
      applications,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });

  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// Apply for an internship
router.post('/', authenticateToken, [
  body('internshipId').isUUID().withMessage('Valid internship ID is required'),
  body('notes').optional().isString().isLength({ max: 1000 }).withMessage('Notes must be less than 1000 characters'),
  body('coverLetter').optional().isString().isLength({ max: 5000 }).withMessage('Cover letter must be less than 5000 characters'),
  body('resumeUrl').optional().isURL().withMessage('Valid resume URL is required'),
], async (req: AuthRequest, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const userId = req.user!.id;
    const { internshipId, notes, coverLetter, resumeUrl } = req.body;

    // Check if internship exists and is active
    const internship = await prisma.internship.findUnique({
      where: { id: internshipId }
    });

    if (!internship) {
      return res.status(404).json({
        error: 'Internship not found'
      });
    }

    if (!internship.active) {
      return res.status(400).json({
        error: 'This internship is no longer available'
      });
    }

    // Check if user has already applied
    const existingApplication = await prisma.application.findUnique({
      where: {
        userId_internshipId: {
          userId,
          internshipId
        }
      }
    });

    if (existingApplication) {
      return res.status(400).json({
        error: 'You have already applied for this internship'
      });
    }

    // Create application
    const application = await prisma.application.create({
      data: {
        userId,
        internshipId,
        notes,
        coverLetter,
        resumeUrl,
        status: 'pending'
      },
      include: {
        internship: {
          include: {
            company: {
              select: {
                id: true,
                name: true,
                logo: true
              }
            }
          }
        }
      }
    });

    // Update internship applicant count
    await prisma.internship.update({
      where: { id: internshipId },
      data: {
        applicants: {
          increment: 1
        }
      }
    });

    res.status(201).json({
      message: 'Application submitted successfully',
      application
    });

  } catch (error) {
    console.error('Apply for internship error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// Get specific application
router.get('/:applicationId', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const { applicationId } = req.params;

    const application = await prisma.application.findFirst({
      where: {
        id: applicationId,
        userId // Ensure user can only see their own applications
      },
      include: {
        internship: {
          include: {
            company: {
              select: {
                id: true,
                name: true,
                logo: true,
                location: true,
                website: true
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
            }
          }
        }
      }
    });

    if (!application) {
      return res.status(404).json({
        error: 'Application not found'
      });
    }

    res.json({ application });

  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// Update application (withdraw, add notes, etc.)
router.put('/:applicationId', authenticateToken, [
  body('status').optional().isIn(['pending', 'accepted', 'rejected', 'withdrawn']).withMessage('Invalid status'),
  body('notes').optional().isString().isLength({ max: 1000 }).withMessage('Notes must be less than 1000 characters'),
  body('coverLetter').optional().isString().isLength({ max: 5000 }).withMessage('Cover letter must be less than 5000 characters'),
], async (req: AuthRequest, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const userId = req.user!.id;
    const { applicationId } = req.params;
    const updateData = req.body;

    // Check if application exists and belongs to user
    const existingApplication = await prisma.application.findFirst({
      where: {
        id: applicationId,
        userId
      }
    });

    if (!existingApplication) {
      return res.status(404).json({
        error: 'Application not found'
      });
    }

    // Update application
    const updatedApplication = await prisma.application.update({
      where: { id: applicationId },
      data: updateData,
      include: {
        internship: {
          include: {
            company: {
              select: {
                id: true,
                name: true,
                logo: true
              }
            }
          }
        }
      }
    });

    res.json({
      message: 'Application updated successfully',
      application: updatedApplication
    });

  } catch (error) {
    console.error('Update application error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// Delete/withdraw application
router.delete('/:applicationId', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const { applicationId } = req.params;

    // Check if application exists and belongs to user
    const existingApplication = await prisma.application.findFirst({
      where: {
        id: applicationId,
        userId
      }
    });

    if (!existingApplication) {
      return res.status(404).json({
        error: 'Application not found'
      });
    }

    // Delete application
    await prisma.application.delete({
      where: { id: applicationId }
    });

    // Update internship applicant count
    await prisma.internship.update({
      where: { id: existingApplication.internshipId },
      data: {
        applicants: {
          decrement: 1
        }
      }
    });

    res.json({
      message: 'Application withdrawn successfully'
    });

  } catch (error) {
    console.error('Delete application error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// Get application statistics for user
router.get('/stats/summary', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;

    const stats = await prisma.application.groupBy({
      by: ['status'],
      where: { userId },
      _count: {
        status: true
      }
    });

    const totalApplications = await prisma.application.count({
      where: { userId }
    });

    const statusCounts = stats.reduce((acc, stat) => {
      acc[stat.status] = stat._count.status;
      return acc;
    }, {} as Record<string, number>);

    res.json({
      totalApplications,
      statusBreakdown: {
        pending: statusCounts.pending || 0,
        accepted: statusCounts.accepted || 0,
        rejected: statusCounts.rejected || 0,
        withdrawn: statusCounts.withdrawn || 0
      }
    });

  } catch (error) {
    console.error('Get application stats error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

export default router;
