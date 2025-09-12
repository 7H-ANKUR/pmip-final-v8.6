import express from 'express';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { generateToken } from '../utils/jwt';
import { 
  validateSignup, 
  validateLogin, 
  handleValidationErrors 
} from '../utils/validation';

const router = express.Router();
const prisma = new PrismaClient();

// Register new user
router.post('/signup', validateSignup, handleValidationErrors, async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({
        error: 'User with this email already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        profileComplete: true,
        createdAt: true,
      }
    });

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email
    });

    res.status(201).json({
      message: 'User created successfully',
      user,
      token
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// Login user
router.post('/login', validateLogin, handleValidationErrors, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({
        error: 'Invalid email or password'
      });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email
    });

    // Return user data (excluding password)
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: 'Login successful',
      user: userWithoutPassword,
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// Get current user profile
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const { verifyToken } = require('../utils/jwt');
    const decoded = verifyToken(token);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
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
    console.error('Get user error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// Verify token endpoint
router.get('/verify', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const { verifyToken } = require('../utils/jwt');
    const decoded = verifyToken(token);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        profileComplete: true,
      }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    res.json({ 
      valid: true, 
      user 
    });

  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ 
      error: 'Invalid or expired token' 
    });
  }
});

export default router;
