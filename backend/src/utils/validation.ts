import { body, validationResult, ValidationChain } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array(),
    });
  }
  next();
};

// User validation rules
export const validateSignup: ValidationChain[] = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('firstName')
    .trim()
    .isLength({ min: 1 })
    .withMessage('First name is required'),
  body('lastName')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Last name is required'),
  body('phone')
    .optional()
    .isMobilePhone('any')
    .withMessage('Please provide a valid phone number'),
];

export const validateLogin: ValidationChain[] = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

export const validateProfileUpdate: ValidationChain[] = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('First name cannot be empty'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Last name cannot be empty'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('phone')
    .optional()
    .isMobilePhone('any')
    .withMessage('Please provide a valid phone number'),
  body('age')
    .optional()
    .isInt({ min: 16, max: 100 })
    .withMessage('Age must be between 16 and 100'),
  body('graduationYear')
    .optional()
    .matches(/^(202[4-9]|203[0-5])$/)
    .withMessage('Graduation year must be between 2024 and 2035'),
];

export const validateInternshipCreate: ValidationChain[] = [
  body('title')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Title is required'),
  body('description')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters long'),
  body('companyId')
    .isUUID()
    .withMessage('Valid company ID is required'),
  body('location')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Location is required'),
  body('duration')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Duration is required'),
  body('requirements')
    .isArray({ min: 1 })
    .withMessage('At least one requirement is needed'),
  body('deadline')
    .optional()
    .isISO8601()
    .withMessage('Deadline must be a valid date'),
];
