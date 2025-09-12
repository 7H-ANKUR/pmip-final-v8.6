// Local Authentication Service for Trial Purposes
// This simulates a database using localStorage

class LocalAuthService {
  constructor() {
    this.initializeStorage();
  }

  // Initialize localStorage structure
  initializeStorage() {
    if (!localStorage.getItem('internmatch_users')) {
      localStorage.setItem('internmatch_users', JSON.stringify([]));
    }
    if (!localStorage.getItem('internmatch_sessions')) {
      localStorage.setItem('internmatch_sessions', JSON.stringify([]));
    }
  }

  // Get all users from localStorage
  getUsers() {
    try {
      return JSON.parse(localStorage.getItem('internmatch_users') || '[]');
    } catch (error) {
      console.error('Error parsing users from localStorage:', error);
      return [];
    }
  }

  // Save users to localStorage
  saveUsers(users) {
    try {
      localStorage.setItem('internmatch_users', JSON.stringify(users));
    } catch (error) {
      console.error('Error saving users to localStorage:', error);
    }
  }

  // Generate unique ID
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Hash password (simple for demo - in real apps use bcrypt)
  hashPassword(password) {
    // Simple hash for demonstration - in production use proper hashing
    return btoa(password + 'internmatch_salt');
  }

  // Verify password
  verifyPassword(password, hashedPassword) {
    return this.hashPassword(password) === hashedPassword;
  }

  // Register new user
  async register(userData) {
    try {
      const users = this.getUsers();
      
      // Check if user already exists
      const existingUser = users.find(user => user.email === userData.email);
      if (existingUser) {
        return {
          success: false,
          error: 'User with this email already exists'
        };
      }

      // Create new user
      const newUser = {
        id: this.generateId(),
        email: userData.email,
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        phone: userData.phone || '',
        college: userData.college || '',
        password: this.hashPassword(userData.password),
        createdAt: new Date().toISOString(),
        profile: {
          skills: [],
          interests: [],
          bio: '',
          age: '',
          location: '',
          university: userData.college || '',
          major: '',
          graduationYear: ''
        }
      };

      // Save user
      users.push(newUser);
      this.saveUsers(users);

      // Generate session token
      const token = this.generateId();
      const userWithoutPassword = { ...newUser };
      delete userWithoutPassword.password;

      return {
        success: true,
        user: userWithoutPassword,
        access_token: token,
        message: 'Registration successful'
      };

    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: 'Registration failed. Please try again.'
      };
    }
  }

  // Login user
  async login(credentials) {
    try {
      const users = this.getUsers();
      
      // Find user by email
      const user = users.find(u => u.email === credentials.email);
      if (!user) {
        return {
          success: false,
          error: 'Invalid email or password'
        };
      }

      // Verify password
      if (!this.verifyPassword(credentials.password, user.password)) {
        return {
          success: false,
          error: 'Invalid email or password'
        };
      }

      // Generate session token
      const token = this.generateId();
      const userWithoutPassword = { ...user };
      delete userWithoutPassword.password;

      return {
        success: true,
        user: userWithoutPassword,
        access_token: token,
        message: 'Login successful'
      };

    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'Login failed. Please try again.'
      };
    }
  }

  // Get user profile
  async getProfile(token) {
    try {
      // In a real app, you'd validate the token and get user ID
      // For demo, we'll just return the last logged in user
      const users = this.getUsers();
      if (users.length === 0) {
        return { success: false, error: 'No users found' };
      }

      const user = users[users.length - 1]; // Get last user for demo
      const userWithoutPassword = { ...user };
      delete userWithoutPassword.password;

      return {
        success: true,
        user: userWithoutPassword
      };

    } catch (error) {
      console.error('Get profile error:', error);
      return {
        success: false,
        error: 'Failed to get profile'
      };
    }
  }

  // Update user profile
  async updateProfile(token, profileData) {
    try {
      const users = this.getUsers();
      if (users.length === 0) {
        return { success: false, error: 'No users found' };
      }

      // Find user (in demo, we'll update the last user)
      const userIndex = users.length - 1;
      if (userIndex === -1) {
        return { success: false, error: 'User not found' };
      }

      // Update user profile
      users[userIndex].profile = {
        ...users[userIndex].profile,
        ...profileData
      };

      // Update user basic info if provided
      if (profileData.firstName) users[userIndex].firstName = profileData.firstName;
      if (profileData.lastName) users[userIndex].lastName = profileData.lastName;
      if (profileData.email) users[userIndex].email = profileData.email;

      this.saveUsers(users);

      const userWithoutPassword = { ...users[userIndex] };
      delete userWithoutPassword.password;

      return {
        success: true,
        user: userWithoutPassword,
        message: 'Profile updated successfully'
      };

    } catch (error) {
      console.error('Update profile error:', error);
      return {
        success: false,
        error: 'Failed to update profile'
      };
    }
  }

  // Clear all data (for testing)
  clearData() {
    localStorage.removeItem('internmatch_users');
    localStorage.removeItem('internmatch_sessions');
    this.initializeStorage();
  }

  // Get statistics
  getStats() {
    const users = this.getUsers();
    return {
      totalUsers: users.length,
      recentUsers: users.filter(user => {
        const createdAt = new Date(user.createdAt);
        const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        return createdAt > dayAgo;
      }).length
    };
  }
}

export default new LocalAuthService();