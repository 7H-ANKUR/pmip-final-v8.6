import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { 
  validateProfileUpdate, 
  handleValidationErrors 
} from '../utils/validation';

const router = express.Router();
const prisma = new PrismaClient();

// Get user profile
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        university: true,
        major: true,
        graduationYear: true,
        location: true,
        bio: true,
        age: true,
        profileComplete: true,
        createdAt: true,
        updatedAt: true,
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
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// Update user profile
router.put('/', authenticateToken, validateProfileUpdate, handleValidationErrors, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const updateData = req.body;

    // Check if email is being updated and if it's already taken
    if (updateData.email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email: updateData.email,
          NOT: { id: userId }
        }
      });

      if (existingUser) {
        return res.status(400).json({
          error: 'Email is already taken'
        });
      }
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        university: true,
        major: true,
        graduationYear: true,
        location: true,
        bio: true,
        age: true,
        profileComplete: true,
        updatedAt: true,
      }
    });

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// Add skill to user profile
router.post('/skills', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const { skillId, level = 'beginner' } = req.body;

    if (!skillId) {
      return res.status(400).json({
        error: 'Skill ID is required'
      });
    }

    // Check if skill exists
    const skill = await prisma.skill.findUnique({
      where: { id: skillId }
    });

    if (!skill) {
      return res.status(404).json({
        error: 'Skill not found'
      });
    }

    // Check if user already has this skill
    const existingUserSkill = await prisma.userSkill.findUnique({
      where: {
        userId_skillId: {
          userId,
          skillId
        }
      }
    });

    if (existingUserSkill) {
      return res.status(400).json({
        error: 'Skill already added to profile'
      });
    }

    // Add skill to user
    const userSkill = await prisma.userSkill.create({
      data: {
        userId,
        skillId,
        level
      },
      include: {
        skill: true
      }
    });

    res.status(201).json({
      message: 'Skill added successfully',
      userSkill
    });

  } catch (error) {
    console.error('Add skill error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// Remove skill from user profile
router.delete('/skills/:skillId', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const { skillId } = req.params;

    // Check if user has this skill
    const userSkill = await prisma.userSkill.findUnique({
      where: {
        userId_skillId: {
          userId,
          skillId
        }
      }
    });

    if (!userSkill) {
      return res.status(404).json({
        error: 'Skill not found in profile'
      });
    }

    // Remove skill
    await prisma.userSkill.delete({
      where: {
        userId_skillId: {
          userId,
          skillId
        }
      }
    });

    res.json({
      message: 'Skill removed successfully'
    });

  } catch (error) {
    console.error('Remove skill error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// Add interest to user profile
router.post('/interests', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const { interestId } = req.body;

    if (!interestId) {
      return res.status(400).json({
        error: 'Interest ID is required'
      });
    }

    // Check if interest exists
    const interest = await prisma.interest.findUnique({
      where: { id: interestId }
    });

    if (!interest) {
      return res.status(404).json({
        error: 'Interest not found'
      });
    }

    // Check if user already has this interest
    const existingUserInterest = await prisma.userInterest.findUnique({
      where: {
        userId_interestId: {
          userId,
          interestId
        }
      }
    });

    if (existingUserInterest) {
      return res.status(400).json({
        error: 'Interest already added to profile'
      });
    }

    // Add interest to user
    const userInterest = await prisma.userInterest.create({
      data: {
        userId,
        interestId
      },
      include: {
        interest: true
      }
    });

    res.status(201).json({
      message: 'Interest added successfully',
      userInterest
    });

  } catch (error) {
    console.error('Add interest error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// Remove interest from user profile
router.delete('/interests/:interestId', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const { interestId } = req.params;

    // Check if user has this interest
    const userInterest = await prisma.userInterest.findUnique({
      where: {
        userId_interestId: {
          userId,
          interestId
        }
      }
    });

    if (!userInterest) {
      return res.status(404).json({
        error: 'Interest not found in profile'
      });
    }

    // Remove interest
    await prisma.userInterest.delete({
      where: {
        userId_interestId: {
          userId,
          interestId
        }
      }
    });

    res.json({
      message: 'Interest removed successfully'
    });

  } catch (error) {
    console.error('Remove interest error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// Get available skills
router.get('/available-skills', async (req, res) => {
  try {
    const skills = await prisma.skill.findMany({
      orderBy: { name: 'asc' }
    });

    res.json({ skills });

  } catch (error) {
    console.error('Get skills error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// Get available interests
router.get('/available-interests', async (req, res) => {
  try {
    const interests = await prisma.interest.findMany({
      orderBy: { name: 'asc' }
    });

    res.json({ interests });

  } catch (error) {
    console.error('Get interests error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// Mark profile as complete
router.post('/complete', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;

    // Check if user has minimum required fields
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        skills: true,
        interests: true
      }
    });

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    const hasRequiredFields = user.firstName && 
                            user.lastName && 
                            user.email && 
                            user.university && 
                            user.major;

    if (!hasRequiredFields) {
      return res.status(400).json({
        error: 'Please complete all required fields before marking profile as complete'
      });
    }

    // Update profile complete status
    await prisma.user.update({
      where: { id: userId },
      data: { profileComplete: true }
    });

    res.json({
      message: 'Profile marked as complete'
    });

  } catch (error) {
    console.error('Complete profile error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

export default router;
