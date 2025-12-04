import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
  Button, Container, Box, Typography, Card, CardContent, Grid, Paper,
  Fade, Slide, Zoom, Grow, Chip, Avatar, Tooltip, LinearProgress,
  useScrollTrigger, Fab, keyframes, Badge
} from '@mui/material';
import { 
  PersonAdd, Login as LoginIcon, Security, Speed, CloudDone, 
  Dashboard as DashboardIcon, Logout, KeyboardArrowUp, Star,
  TrendingUp, Verified, EmojiEvents
} from '@mui/icons-material';

// Predefined particle positions to avoid Math.random in render (React 19 compatibility)
const particleConfigs = [
  { width: 60, height: 60, top: 15, left: 10, duration: 3.5, delay: 0 },
  { width: 75, height: 75, top: 60, left: 80, duration: 4.2, delay: 0.5 },
  { width: 90, height: 90, top: 30, left: 50, duration: 3.8, delay: 1 },
  { width: 105, height: 105, top: 75, left: 25, duration: 4.5, delay: 1.5 },
  { width: 120, height: 120, top: 45, left: 90, duration: 4, delay: 0.8 },
];

// Floating animation for background particles
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
`;

// Pulse animation for background elements
const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const Home = () => {
  const { isAuthenticated, user, logout } = useAuth();
  
  // Scroll trigger for showing scroll-to-top button
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  // Handle user logout
  const handleLogout = () => {
    logout();
  };

  // Smooth scroll to top of page
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', position: 'relative', overflow: 'hidden' }}>
      {/* Floating particles */}
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
          }}
        />
      ))}
      
      {/* Animated background elements */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          background: 'radial-gradient(circle at 20% 50%, white 0%, transparent 50%), radial-gradient(circle at 80% 80%, white 0%, transparent 50%)',
          animation: `${pulse} 4s ease-in-out infinite`
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: 8 }}>
        {/* User Info Bar - Displayed only when user is authenticated */}
        {isAuthenticated && (
          <Slide direction="down" in={true} timeout={600}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 2, gap: 2 }}>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  <Box sx={{ 
                    width: 12, 
                    height: 12, 
                    borderRadius: '50%', 
                    bgcolor: '#4ade80',
                    border: '2px solid white'
                  }} />
                }
              >
                <Avatar sx={{ bgcolor: 'white', color: '#667eea', fontWeight: 600 }}>
                  {user?.email?.charAt(0).toUpperCase()}
                </Avatar>
              </Badge>
              <Typography variant="body1" sx={{ color: 'white', fontWeight: 500 }}>
                {user?.email}
              </Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<Logout />}
                onClick={handleLogout}
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255,255,255,0.1)',
                  }
                }}
              >
                Logout
              </Button>
            </Box>
          </Slide>
        )}

        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', pt: { xs: 6, md: 10 }, pb: 8 }}>
          <Zoom in={true} timeout={800}>
            <Typography
              variant="h1"
            sx={{
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
              fontWeight: 800,
              color: 'white',
              mb: 3,
              textShadow: '0 4px 20px rgba(0,0,0,0.2)',
              lineHeight: 1.2
            }}
          >
            Welcome to UserHub
          </Typography>
          </Zoom>
          
          <Slide direction="up" in={true} timeout={1000}>
            <Typography
            variant="h5"
            sx={{
              fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
              color: 'rgba(255,255,255,0.95)',
              mb: 6,
              maxWidth: '700px',
              mx: 'auto',
              lineHeight: 1.6,
              px: 2
            }}
          >
            A modern, secure authentication system built with cutting-edge technologies
          </Typography>
          </Slide>

          <Grow in={true} timeout={1200}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, justifyContent: 'center', alignItems: 'center', px: 2 }}>
            {isAuthenticated ? (
              <Link to="/dashboard" style={{ textDecoration: 'none', width: '100%', maxWidth: '250px' }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<DashboardIcon />}
                  fullWidth
                  sx={{
                    bgcolor: 'white',
                    color: '#667eea',
                    py: 1.8,
                    px: 5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    borderRadius: 3,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                    '&:hover': {
                      bgcolor: '#f8f9fa',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 15px 40px rgba(0,0,0,0.4)',
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/signup" style={{ textDecoration: 'none', width: '100%', maxWidth: '250px' }}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<PersonAdd />}
                    fullWidth
                    sx={{
                      bgcolor: 'white',
                      color: '#667eea',
                      py: 1.8,
                      px: 5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      borderRadius: 3,
                      boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                      '&:hover': {
                        bgcolor: '#f8f9fa',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 15px 40px rgba(0,0,0,0.4)',
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Get Started
                  </Button>
                </Link>

                <Link to="/login" style={{ textDecoration: 'none', width: '100%', maxWidth: '250px' }}>
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<LoginIcon />}
                    fullWidth
                    sx={{
                      borderColor: 'white',
                      color: 'white',
                      py: 1.8,
                      px: 5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      borderRadius: 3,
                      borderWidth: 2,
                      '&:hover': {
                        borderWidth: 2,
                        borderColor: 'white',
                        bgcolor: 'rgba(255,255,255,0.1)',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </Box>
          </Grow>
        </Box>        {/* Features Section */}
        <Grid container spacing={4} sx={{ mt: 4, mb: 8 }}>
          <Grid item xs={12} md={4}>
            <Zoom in={true} timeout={600} style={{ transitionDelay: '100ms' }}>
              <Card
              sx={{
                height: '100%',
                bgcolor: 'rgba(255,255,255,0.95)',
                borderRadius: 4,
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'visible',
                '&:hover': {
                  transform: 'translateY(-10px)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                }
              }}
            >
              <Chip 
                label="VERIFIED" 
                color="success"
                size="small"
                icon={<Verified />}
                sx={{ position: 'absolute', top: -12, right: 16, fontWeight: 600 }}
              />
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <Tooltip title="Bank-grade Security" arrow placement="top">
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 3,
                      cursor: 'pointer'
                    }}
                  >
                    <Security sx={{ fontSize: 40, color: 'white' }} />
                  </Box>
                </Tooltip>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: '#1a202c' }}>
                  Secure & Safe
                </Typography>
                <Typography variant="body1" sx={{ color: '#4a5568', lineHeight: 1.7 }}>
                  Advanced encryption and security measures to protect your data
                </Typography>
              </CardContent>
            </Card>
            </Zoom>
          </Grid>

          <Grid item xs={12} md={4}>
            <Zoom in={true} timeout={600} style={{ transitionDelay: '200ms' }}>
              <Card
                sx={{
                  height: '100%',
                  bgcolor: 'rgba(255,255,255,0.95)',
                  borderRadius: 4,
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'visible',
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                  }
                }}
              >
                <Chip 
                  label="FAST" 
                  color="primary"
                  size="small"
                  icon={<TrendingUp />}
                  sx={{ position: 'absolute', top: -12, right: 16, fontWeight: 600 }}
                />
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <Tooltip title="Optimized Performance" arrow placement="top">
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 3,
                        cursor: 'pointer'
                      }}
                    >
                      <Speed sx={{ fontSize: 40, color: 'white' }} />
                    </Box>
                  </Tooltip>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: '#1a202c' }}>
                  Lightning Fast
                </Typography>
                <Typography variant="body1" sx={{ color: '#4a5568', lineHeight: 1.7 }}>
                  Optimized performance for the best user experience
                </Typography>
              </CardContent>
            </Card>
            </Zoom>
          </Grid>

          <Grid item xs={12} md={4}>
            <Zoom in={true} timeout={600} style={{ transitionDelay: '300ms' }}>
              <Card
              sx={{
                height: '100%',
                bgcolor: 'rgba(255,255,255,0.95)',
                borderRadius: 4,
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'visible',
                '&:hover': {
                  transform: 'translateY(-10px)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                }
              }}
            >
              <Chip 
                label="PREMIUM" 
                color="warning"
                size="small"
                icon={<EmojiEvents />}
                sx={{ position: 'absolute', top: -12, right: 16, fontWeight: 600 }}
              />
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <Tooltip title="Scalable Cloud Infrastructure" arrow placement="top">
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 3,
                      cursor: 'pointer'
                    }}
                  >
                    <CloudDone sx={{ fontSize: 40, color: 'white' }} />
                  </Box>
                </Tooltip>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: '#1a202c' }}>
                  Cloud Ready
                </Typography>
                <Typography variant="body1" sx={{ color: '#4a5568', lineHeight: 1.7 }}>
                  Deploy anywhere with modern cloud infrastructure
                </Typography>
              </CardContent>
            </Card>
            </Zoom>
          </Grid>
        </Grid>

        {/* Stats Section */}
        <Slide direction="up" in={true} timeout={1000}>
          <Paper
          elevation={0}
          sx={{
            bgcolor: 'rgba(255,255,255,0.95)',
            borderRadius: 4,
            p: 6,
            mb: 8
          }}
        >
          <Grid container spacing={4} justifyContent="center" alignItems="center">
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h2" sx={{ fontWeight: 800, color: '#667eea', mb: 1 }}>
                  100%
                </Typography>
                <Typography variant="h6" sx={{ color: '#4a5568', fontWeight: 500, mb: 2 }}>
                  Secure
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={100} 
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    bgcolor: 'rgba(102, 126, 234, 0.2)',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: '#667eea',
                      borderRadius: 4
                    }
                  }} 
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h2" sx={{ fontWeight: 800, color: '#f093fb', mb: 1 }}>
                  24/7
                </Typography>
                <Typography variant="h6" sx={{ color: '#4a5568', fontWeight: 500, mb: 2 }}>
                  Available
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={100} 
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    bgcolor: 'rgba(240, 147, 251, 0.2)',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: '#f093fb',
                      borderRadius: 4
                    }
                  }} 
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h2" sx={{ fontWeight: 800, color: '#4facfe', mb: 1 }}>
                  ∞
                </Typography>
                <Typography variant="h6" sx={{ color: '#4a5568', fontWeight: 500, mb: 2 }}>
                  Scalable
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={100} 
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    bgcolor: 'rgba(79, 172, 254, 0.2)',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: '#4facfe',
                      borderRadius: 4
                    }
                  }} 
                />
              </Box>
            </Grid>
          </Grid>
        </Paper>
        </Slide>
      </Container>

      {/* Footer */}
      <Box sx={{ bgcolor: 'rgba(0,0,0,0.3)', py: 4, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <Container>
          <Typography variant="body1" sx={{ textAlign: 'center', color: 'rgba(255,255,255,0.9)' }}>
            © 2025 UserHub. Built with React, Material UI & Tailwind CSS
          </Typography>
        </Container>
      </Box>

      {/* Scroll to top button */}
      <Zoom in={trigger}>
        <Fab
          onClick={scrollToTop}
          size="medium"
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            '&:hover': {
              background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
              transform: 'scale(1.1)',
            },
          }}
        >
          <KeyboardArrowUp />
        </Fab>
      </Zoom>
    </Box>
  );
};

export default Home;
