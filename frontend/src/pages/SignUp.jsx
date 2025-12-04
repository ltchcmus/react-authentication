import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  CardContent,
  Alert,
  InputAdornment,
  IconButton,
  Divider,
  Paper,
  CircularProgress,
  Fade,
  Slide,
  Zoom,
  Chip,
  LinearProgress,
  Stepper,
  Step,
  StepLabel,
  keyframes
} from '@mui/material';
import { 
  PersonAdd, 
  Email, 
  Lock, 
  Visibility, 
  VisibilityOff,
  CheckCircle,
  ArrowBack
} from '@mui/icons-material';
import { registerUser } from '../services/api';

// Predefined particle positions to avoid Math.random in render (React 19 compatibility)
const particleConfigs = [
  { width: 60, height: 60, top: 25, left: 12, duration: 3.4, delay: 0 },
  { width: 80, height: 80, top: 70, left: 88, duration: 4.1, delay: 0.7 },
  { width: 100, height: 100, top: 35, left: 48, duration: 3.7, delay: 1.4 },
  { width: 120, height: 120, top: 85, left: 28, duration: 4.3, delay: 2 },
  { width: 140, height: 140, top: 55, left: 92, duration: 3.8, delay: 0.4 },
];

// Floating animation with rotation for background particles
const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(10deg); }
`;

const SignUp = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // React Hook Form setup with onChange validation mode
  const { 
    register, 
    handleSubmit, 
    watch,
    formState: { errors } 
  } = useForm({
    mode: 'onChange'
  });

  // Watch password field for confirmation validation
  const password = watch('password');

  // Mutation for registration API call
  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      setTimeout(() => {
        navigate('/login');
      }, 500);
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', py: 4, px: 2, position: 'relative', overflow: 'hidden' }}>
      {particleConfigs.map((particle, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            width: `${particle.width}px`,
            height: `${particle.height}px`,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
            top: `${particle.top}%`,
            left: `${particle.left}%`,
            animation: `${float} ${particle.duration}s ease-in-out infinite`,
            animationDelay: `${particle.delay}s`,
            backdropFilter: 'blur(5px)',
          }}
        />
      ))}
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Slide direction="right" in={true} timeout={600}>
          <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/')}
          sx={{
            color: 'white',
            mb: 3,
            textTransform: 'none',
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.1)'
            }
          }}
        >
          Back to Home
        </Button>
        </Slide>

        <Zoom in={true} timeout={800}>
          <Paper
          elevation={24}
          sx={{ 
            borderRadius: 4,
            overflow: 'hidden',
            bgcolor: 'white',
            boxShadow: '0 30px 80px rgba(0,0,0,0.4)',
            border: '1px solid rgba(255,255,255,0.2)',
            backdropFilter: 'blur(20px)',
            position: 'relative'
          }}
        >
          {mutation.isPending && (
            <LinearProgress 
              sx={{ 
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                borderRadius: '16px 16px 0 0',
                height: 3,
                bgcolor: 'rgba(102,126,234,0.2)',
                '& .MuiLinearProgress-bar': {
                  bgcolor: '#667eea'
                }
              }} 
            />
          )}
          <Fade in={true} timeout={1000}>
            <Box sx={{ p: 4, textAlign: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
              <Chip label="Join Our Community" size="small" sx={{ mb: 2, bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600 }} />
            <Box
              sx={{
                width: 70,
                height: 70,
                borderRadius: '50%',
                bgcolor: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2
              }}
            >
              <PersonAdd sx={{ fontSize: 35, color: '#667eea' }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'white', mb: 1 }}>
              Create Account
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)' }}>
              Join us today and get started!
            </Typography>
          </Box>
          </Fade>

          <CardContent sx={{ p: 5 }}>
            <Fade in={true} timeout={1200}>
              <Stepper activeStep={1} alternativeLabel sx={{ mb: 4 }}>
                <Step completed={true}>
                  <StepLabel>Enter Email</StepLabel>
                </Step>
                <Step active={true}>
                  <StepLabel>Create Password</StepLabel>
                </Step>
                <Step>
                  <StepLabel>Complete</StepLabel>
                </Step>
              </Stepper>
            </Fade>
            {mutation.isSuccess && (
              <Alert 
                severity="success" 
                icon={<CheckCircle />}
                sx={{ mb: 3, borderRadius: 2, fontWeight: 500 }}
              >
                Account created successfully! Redirecting to login...
              </Alert>
            )}

            {mutation.isError && (
              <Alert 
                severity="error" 
                sx={{ mb: 3, borderRadius: 2, fontWeight: 500 }}
              >
                {mutation.error.validationErrors || mutation.error.message || 'Registration failed. Please try again.'}
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  disabled={mutation.isPending}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: '#667eea' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: '#667eea',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#667eea',
                        borderWidth: 2,
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#667eea',
                    },
                  }}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  disabled={mutation.isPending}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: '#667eea' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{ color: '#667eea' }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: '#667eea',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#667eea',
                        borderWidth: 2,
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#667eea',
                    },
                  }}
                />
              </Box>

              <Box sx={{ mb: 4 }}>
                <TextField
                  fullWidth
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: value =>
                      value === password || 'Passwords do not match'
                  })}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                  disabled={mutation.isPending}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: '#667eea' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                          sx={{ color: '#667eea' }}
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: '#667eea',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#667eea',
                        borderWidth: 2,
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#667eea',
                    },
                  }}
                />
              </Box>

              {/* Submit Button */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={mutation.isPending}
                startIcon={mutation.isPending ? <CircularProgress size={20} color="inherit" /> : <PersonAdd />}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  py: 1.8,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  borderRadius: 2,
                  boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                    boxShadow: '0 12px 35px rgba(102, 126, 234, 0.5)',
                  },
                  '&:disabled': {
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    opacity: 0.6,
                    color: 'white',
                  }
                }}
              >
                {mutation.isPending ? 'Creating Account...' : 'Sign Up'}
              </Button>
            </form>

            <Divider sx={{ my: 4 }} />

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: '#4a5568' }}>
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  style={{ 
                    color: '#667eea', 
                    textDecoration: 'none',
                    fontWeight: 600
                  }}
                >
                  Sign In
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Paper>
        </Zoom>
      </Container>
    </Box>
  );
};

export default SignUp;
