import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuth';
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
  Checkbox,
  FormControlLabel,
  Paper,
  CircularProgress,
  Fade,
  Slide,
  Zoom,
  Chip,
  LinearProgress,
  keyframes
} from '@mui/material';
import { 
  Login as LoginIcon, 
  Email, 
  Lock, 
  Visibility, 
  VisibilityOff,
  ArrowBack,
  CheckCircle 
} from '@mui/icons-material';
import { loginUser } from '../services/api';

// Predefined particle positions to avoid Math.random in render (React 19 compatibility)
const particleConfigs = [
  { width: 60, height: 60, top: 20, left: 15, duration: 3.2, delay: 0 },
  { width: 80, height: 80, top: 65, left: 85, duration: 4, delay: 0.6 },
  { width: 100, height: 100, top: 40, left: 55, duration: 3.6, delay: 1.2 },
  { width: 120, height: 120, top: 80, left: 30, duration: 4.4, delay: 1.8 },
  { width: 140, height: 140, top: 50, left: 95, duration: 3.9, delay: 0.3 },
];

// Floating animation with rotation for background particles
const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(10deg); }
`;

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  
  // React Hook Form setup with onChange validation mode
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm({
    mode: 'onChange'
  });

  // Mutation for login API call
  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      // Store user data in context and localStorage
      login(data);
      setTimeout(() => {
        navigate('/dashboard');
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
        {/* Back to Home Button */}
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
          {/* Header */}
          <Fade in={true} timeout={1000}>
            <Box sx={{ bgcolor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', p: 4, textAlign: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
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
              <LoginIcon sx={{ fontSize: 35, color: '#667eea' }} />
            </Box>
            <Chip label="Secure Login" size="small" sx={{ mb: 2, bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600 }} />
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'white', mb: 1 }}>
              Welcome Back
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)' }}>
              Sign in to continue to your account
            </Typography>
          </Box>
          </Fade>

          <CardContent sx={{ p: 5 }}>
            {mutation.isSuccess && (
              <Alert 
                severity="success"
                icon={<CheckCircle />}
                sx={{ mb: 3, borderRadius: 2, fontWeight: 500 }}
              >
                Login successful! Redirecting to dashboard...
              </Alert>
            )}

            {mutation.isError && (
              <Alert 
                severity="error" 
                sx={{ mb: 3, borderRadius: 2, fontWeight: 500 }}
              >
                {mutation.error.validationErrors || mutation.error.message || 'Invalid credentials. Please try again.'}
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Email Field */}
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

              {/* Password Field */}
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
                          disabled={mutation.isPending}
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

              {/* Remember Me & Forgot Password */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <FormControlLabel
                  control={
                    <Checkbox 
                      defaultChecked 
                      disabled={mutation.isPending}
                      sx={{
                        color: '#667eea',
                        '&.Mui-checked': {
                          color: '#667eea',
                        },
                      }}
                    />
                  }
                  label={<Typography variant="body2" sx={{ fontWeight: 500 }}>Remember me</Typography>}
                />
                <Typography 
                  variant="body2"
                  sx={{ 
                    color: '#667eea', 
                    cursor: 'pointer',
                    fontWeight: 500,
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                >
                  Forgot Password?
                </Typography>
              </Box>

              {/* Submit Button */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={mutation.isPending}
                startIcon={mutation.isPending ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
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
                {mutation.isPending ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            <Divider sx={{ my: 4 }} />

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: '#4a5568' }}>
                Don&apos;t have an account?{' '}
                <Link 
                  to="/signup" 
                  style={{ 
                    color: '#667eea', 
                    textDecoration: 'none',
                    fontWeight: 600
                  }}
                >
                  Sign Up
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

export default Login;
