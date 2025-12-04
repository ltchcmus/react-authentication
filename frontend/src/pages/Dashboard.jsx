import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getMe, updateProfile } from '../services/api';
import {
  Container,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Paper,
  Avatar,
  Divider,
  Chip,
  Fade,
  Slide,
  Zoom,
  Grow,
  Badge,
  Tooltip,
  LinearProgress,
  IconButton,
  Alert,
  Popover,
  keyframes,
  TextField,
  CircularProgress,
} from '@mui/material';
import {
  Logout,
  Email,
  CalendarToday,
  Dashboard as DashboardIcon,
  Person,
  ArrowBack,
  Settings,
  Security,
  Notifications,
  CheckCircle,
  TrendingUp,
  CloudDone,
  Speed,
  VerifiedUser,
  Star,
  EmojiEvents,
  Brightness1,
  Edit,
  Save,
  Home as HomeIcon,
  Cake,
} from '@mui/icons-material';

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

// Predefined particle positions to avoid Math.random in render (React 19 compatibility)
const particleConfigs = [
  { width: 80, height: 80, top: 15, left: 8, duration: 4.2, delay: 0 },
  { width: 100, height: 100, top: 65, left: 90, duration: 3.8, delay: 0.5 },
  { width: 120, height: 120, top: 40, left: 50, duration: 4.5, delay: 1 },
  { width: 90, height: 90, top: 80, left: 20, duration: 4, delay: 1.5 },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { user: authUser, logout, setUser: setAuthUser, setAccessToken } = useAuth();
  
  // State for notification popover
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [editingField, setEditingField] = useState(null); // 'name', 'birthOfDay', 'address', or null
  const [editValue, setEditValue] = useState('');

  // Fetch user profile from server - only when explicitly needed
  // Don't auto-fetch on mount to avoid race condition with login token setup
  const { data: serverData, isLoading, _, refetch } = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const result = await getMe();
      // Check if response contains new accessToken
      if (result.accessToken && setAccessToken) {
        setAccessToken(result.accessToken);
      }
      return result;
    },
    retry: 1,
    enabled: false, // Don't auto-fetch, only fetch when explicitly called
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });

  // Use server data if available, otherwise fallback to auth context
  // Backend returns UserProfileResponse directly, not wrapped in { user: ... }
  const user = serverData || authUser;


  // Mutation for updating profile
  const updateMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      // Check if response contains new accessToken
      if (data.accessToken && setAccessToken) {
        setAccessToken(data.accessToken);
      }
      
      // Refetch user data from server to get latest
      refetch();
      
      // Also update auth context with the returned data (backend returns UserProfileResponse directly)
      setAuthUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      
      // Close editing mode
      setEditingField(null);
      setEditValue('');
    },
  });

  // Handle user logout and redirect to login page
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Open notification popover
  const handleNotificationClick = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  // Close notification popover
  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const openNotification = Boolean(notificationAnchor);

  // Handle inline editing for each field
  const handleEditField = (field, currentValue) => {
    setEditingField(field);
    if (field === 'birthOfDay' && currentValue) {
      // Convert date to YYYY-MM-DD format for input
      setEditValue(new Date(currentValue).toISOString().split('T')[0]);
    } else {
      setEditValue(currentValue || '');
    }
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setEditValue('');
  };

  const handleSaveField = () => {
    const updateData = {};
    updateData[editingField] = editValue;
    updateMutation.mutate(updateData);
  };

  // Format date string to readable format
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <CircularProgress size={60} sx={{ color: 'white' }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: 4,
        px: 2,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Floating particles */}
      {particleConfigs.map((particle, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            width: `${particle.width}px`,
            height: `${particle.height}px`,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.04)',
            top: `${particle.top}%`,
            left: `${particle.left}%`,
            animation: `${float} ${particle.duration}s ease-in-out infinite`,
            animationDelay: `${particle.delay}s`,
            backdropFilter: 'blur(5px)',
          }}
        />
      ))}

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Header - Navigation and action buttons */}
        <Slide direction="down" in={true} timeout={600}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate('/')}
              sx={{
                color: 'white',
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.15)',
                },
              }}
            >
              Back to Home
            </Button>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Tooltip title="Notifications" arrow>
                <IconButton 
                  onClick={handleNotificationClick}
                  sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)' }}
                >
                  <Badge badgeContent={1} color="error">
                    <Notifications />
                  </Badge>
                </IconButton>
              </Tooltip>
              {/* Notification Popover - Shows welcome message when bell icon is clicked */}
              <Popover
                open={openNotification}
                anchorEl={notificationAnchor}
                onClose={handleNotificationClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <Box sx={{ p: 2, minWidth: 300 }}>
                  <Alert 
                    severity="success" 
                    icon={<CheckCircle />}
                    sx={{ 
                      borderRadius: 2,
                      '& .MuiAlert-icon': {
                        color: '#10b981'
                      }
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Welcome back, {user?.email}! Your account is active and secure.
                    </Typography>
                  </Alert>
                </Box>
              </Popover>
              <Button
                variant="contained"
                startIcon={<Logout />}
                onClick={handleLogout}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  textTransform: 'none',
                  fontWeight: 600,
                  backdropFilter: 'blur(10px)',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.3)',
                  },
                }}
              >
                Logout
              </Button>
            </Box>
          </Box>
        </Slide>

        {/* Stats Overview Cards - Display key metrics with gradient backgrounds */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Zoom in={true} timeout={600} style={{ transitionDelay: '100ms' }}>
              <Card
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  borderRadius: 4,
                  overflow: 'visible',
                  position: 'relative',
                  boxShadow: '0 10px 30px rgba(102,126,234,0.3)',
                  mt: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 15px 40px rgba(102,126,234,0.4)',
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, opacity: 0.9 }}>
                      Security
                    </Typography>
                    <Security sx={{ fontSize: 32 }} />
                  </Box>
                  <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                    100%
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={100} 
                    sx={{ 
                      bgcolor: 'rgba(255,255,255,0.2)',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: 'white'
                      },
                      borderRadius: 2,
                      height: 6
                    }} 
                  />
                  <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                    Fully Protected
                  </Typography>
                </CardContent>
                <Chip 
                  label="VERIFIED" 
                  size="small"
                  icon={<VerifiedUser />}
                  sx={{ 
                    position: 'absolute', 
                    top: -10, 
                    right: 16,
                    bgcolor: 'white',
                    color: '#667eea',
                    fontWeight: 700
                  }}
                />
              </Card>
            </Zoom>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Zoom in={true} timeout={600} style={{ transitionDelay: '200ms' }}>
              <Card
                sx={{
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  color: 'white',
                  borderRadius: 4,
                  overflow: 'visible',
                  position: 'relative',
                  boxShadow: '0 10px 30px rgba(240,147,251,0.3)',
                  mt: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 15px 40px rgba(240,147,251,0.4)',
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, opacity: 0.9 }}>
                      Uptime
                    </Typography>
                    <TrendingUp sx={{ fontSize: 32 }} />
                  </Box>
                  <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                    99.9%
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={99.9} 
                    sx={{ 
                      bgcolor: 'rgba(255,255,255,0.2)',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: 'white'
                      },
                      borderRadius: 2,
                      height: 6
                    }} 
                  />
                  <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                    Always Available
                  </Typography>
                </CardContent>
                <Chip 
                  label="ONLINE" 
                  size="small"
                  icon={<Brightness1 sx={{ fontSize: 12 }} />}
                  sx={{ 
                    position: 'absolute', 
                    top: -10, 
                    right: 16,
                    bgcolor: 'white',
                    color: '#f5576c',
                    fontWeight: 700
                  }}
                />
              </Card>
            </Zoom>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Zoom in={true} timeout={600} style={{ transitionDelay: '300ms' }}>
              <Card
                sx={{
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  color: 'white',
                  borderRadius: 4,
                  overflow: 'visible',
                  position: 'relative',
                  boxShadow: '0 10px 30px rgba(79,172,254,0.3)',
                  mt: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 15px 40px rgba(79,172,254,0.4)',
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, opacity: 0.9 }}>
                      Speed
                    </Typography>
                    <Speed sx={{ fontSize: 32 }} />
                  </Box>
                  <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                    Fast
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={95} 
                    sx={{ 
                      bgcolor: 'rgba(255,255,255,0.2)',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: 'white'
                      },
                      borderRadius: 2,
                      height: 6
                    }} 
                  />
                  <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                    Lightning Performance
                  </Typography>
                </CardContent>
                <Chip 
                  label="OPTIMIZED" 
                  size="small"
                  icon={<Star />}
                  sx={{ 
                    position: 'absolute', 
                    top: -10, 
                    right: 16,
                    bgcolor: 'white',
                    color: '#00f2fe',
                    fontWeight: 700
                  }}
                />
              </Card>
            </Zoom>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Zoom in={true} timeout={600} style={{ transitionDelay: '400ms' }}>
              <Card
                sx={{
                  background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                  color: 'white',
                  borderRadius: 4,
                  overflow: 'visible',
                  position: 'relative',
                  boxShadow: '0 10px 30px rgba(67,233,123,0.3)',
                  mt: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 15px 40px rgba(67,233,123,0.4)',
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, opacity: 0.9 }}>
                      Storage
                    </Typography>
                    <CloudDone sx={{ fontSize: 32 }} />
                  </Box>
                  <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                    ∞
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={100} 
                    sx={{ 
                      bgcolor: 'rgba(255,255,255,0.2)',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: 'white'
                      },
                      borderRadius: 2,
                      height: 6
                    }} 
                  />
                  <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                    Unlimited Capacity
                  </Typography>
                </CardContent>
                <Chip 
                  label="PREMIUM" 
                  size="small"
                  icon={<EmojiEvents />}
                  sx={{ 
                    position: 'absolute', 
                    top: -10, 
                    right: 16,
                    bgcolor: 'white',
                    color: '#38f9d7',
                    fontWeight: 700
                  }}
                />
              </Card>
            </Zoom>
          </Grid>
        </Grid>

        {/* Main Dashboard Content - User information card centered on page */}
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} lg={9} xl={8}>
            <Zoom in={true} timeout={1000}>
              <Paper
                elevation={24}
                sx={{
                  borderRadius: 4,
                  overflow: 'hidden',
                  bgcolor: 'white',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                }}
              >
                {/* Header Section - User profile with avatar and status badges */}
                <Fade in={true} timeout={1200}>
                  <Box
                    sx={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      p: 4,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 3,
                    }}
                  >
                    {/* Avatar with online status indicator */}
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      badgeContent={
                        <Box sx={{ 
                          width: 20, 
                          height: 20, 
                          borderRadius: '50%', 
                          bgcolor: '#10b981',
                          border: '3px solid white',
                          animation: `${pulse} 2s ease-in-out infinite`
                        }} />
                      }
                    >
                      <Avatar
                        sx={{
                          width: 100,
                          height: 100,
                          bgcolor: 'white',
                          color: '#667eea',
                          fontSize: '3rem',
                          fontWeight: 700,
                          boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                        }}
                      >
                        {user?.email?.[0]?.toUpperCase() || 'U'}
                      </Avatar>
                    </Badge>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: 'white', mb: 1 }}>
                        Welcome Back!
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', mb: 2 }}>
                        {user?.email}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Chip
                          label="Active User"
                          size="small"
                          sx={{
                            bgcolor: 'rgba(255,255,255,0.2)',
                            color: 'white',
                            fontWeight: 600,
                            backdropFilter: 'blur(10px)',
                          }}
                        />
                        <Chip
                          label="Premium"
                          size="small"
                          icon={<Star sx={{ color: '#fbbf24 !important' }} />}
                          sx={{
                            bgcolor: 'rgba(255,255,255,0.2)',
                            color: 'white',
                            fontWeight: 600,
                            backdropFilter: 'blur(10px)',
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>
                </Fade>

                <CardContent sx={{ p: 4 }}>
                  <Grow in={true} timeout={1400}>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <DashboardIcon sx={{ fontSize: 32, color: '#667eea', mr: 2 }} />
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a202c' }}>
                          Account Information
                        </Typography>
                      </Box>

                      <Divider sx={{ mb: 3 }} />

                      {/* User Information Grid - Display user ID, email, and account creation date */}
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <Slide direction="right" in={true} timeout={800}>
                            <Card
                              sx={{
                                height: '100%',
                                borderRadius: 3,
                                border: '2px solid #e2e8f0',
                                boxShadow: 'none',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  borderColor: '#667eea',
                                  boxShadow: '0 8px 20px rgba(102, 126, 234, 0.2)',
                                  transform: 'translateX(5px)',
                                },
                              }}
                            >
                              <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                  <Person sx={{ fontSize: 30, color: '#667eea', mr: 2 }} />
                                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a202c' }}>
                                    User ID
                                  </Typography>
                                </Box>
                                <Typography
                                  variant="body1"
                                  sx={{
                                    color: '#4a5568',
                                    fontFamily: 'monospace',
                                    fontSize: '0.9rem',
                                    bgcolor: '#f7fafc',
                                    p: 2,
                                    borderRadius: 2,
                                    wordBreak: 'break-all',
                                  }}
                                >
                                  {user?.userId || 'N/A'}
                                </Typography>
                              </CardContent>
                            </Card>
                          </Slide>
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <Slide direction="left" in={true} timeout={800}>
                            <Card
                              sx={{
                                height: '100%',
                                borderRadius: 3,
                                border: '2px solid #e2e8f0',
                                boxShadow: 'none',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  borderColor: '#667eea',
                                  boxShadow: '0 8px 20px rgba(102, 126, 234, 0.2)',
                                  transform: 'translateX(-5px)',
                                },
                              }}
                            >
                              <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                  <Email sx={{ fontSize: 30, color: '#667eea', mr: 2 }} />
                                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a202c' }}>
                                    Email Address
                                  </Typography>
                                </Box>
                                <Typography
                                  variant="body1"
                                  sx={{
                                    color: '#4a5568',
                                    fontSize: '1rem',
                                    bgcolor: '#f7fafc',
                                    p: 2,
                                    borderRadius: 2,
                                    wordBreak: 'break-word',
                                  }}
                                >
                                  {user?.email || 'N/A'}
                                </Typography>
                              </CardContent>
                            </Card>
                          </Slide>
                        </Grid>

                        <Grid item xs={12}>
                          <Slide direction="up" in={true} timeout={1000}>
                            <Card
                              sx={{
                                borderRadius: 3,
                                border: '2px solid #e2e8f0',
                                boxShadow: 'none',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  borderColor: '#667eea',
                                  boxShadow: '0 8px 20px rgba(102, 126, 234, 0.2)',
                                },
              }}
            >
                              <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                  <CalendarToday sx={{ fontSize: 30, color: '#667eea', mr: 2 }} />
                                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a202c' }}>
                                    Account Created
                                  </Typography>
                                </Box>
                                <Typography
                                  variant="body1"
                                  sx={{
                                    color: '#4a5568',
                                    fontSize: '1rem',
                                    bgcolor: '#f7fafc',
                                    p: 2,
                                    borderRadius: 2,
                                  }}
                                >
                                  {formatDate(user?.createdAt)}
                                </Typography>
                              </CardContent>
                            </Card>
                          </Slide>
                        </Grid>

                        {/* Display name */}
                        <Grid item xs={12}>
                          <Slide direction="up" in={true} timeout={1100}>
                            <Card sx={{ borderRadius: 3, border: '2px solid #e2e8f0', boxShadow: 'none', transition: 'all 0.3s ease', '&:hover': { borderColor: '#667eea', boxShadow: '0 8px 20px rgba(102, 126, 234, 0.2)' } }}>
                              <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Person sx={{ fontSize: 30, color: '#667eea', mr: 2 }} />
                                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a202c' }}>
                                      Name
                                    </Typography>
                                  </Box>
                                  {editingField !== 'name' && (
                                    <IconButton 
                                      size="small" 
                                      onClick={() => handleEditField('name', user?.name)}
                                      sx={{ color: '#667eea' }}
                                    >
                                      <Edit fontSize="small" />
                                    </IconButton>
                                  )}
                                </Box>
                                {editingField === 'name' ? (
                                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                    <TextField
                                      fullWidth
                                      size="small"
                                      value={editValue}
                                      onChange={(e) => setEditValue(e.target.value)}
                                      autoFocus
                                    />
                                    <IconButton 
                                      size="small" 
                                      color="primary" 
                                      onClick={handleSaveField}
                                      disabled={updateMutation.isPending}
                                    >
                                      <Save />
                                    </IconButton>
                                    <IconButton 
                                      size="small" 
                                      onClick={handleCancelEdit}
                                      disabled={updateMutation.isPending}
                                    >
                                      <ArrowBack />
                                    </IconButton>
                                  </Box>
                                ) : (
                                  <Typography variant="body1" sx={{ color: '#4a5568', fontSize: '1rem', bgcolor: '#f7fafc', p: 2, borderRadius: 2 }}>
                                    {user?.name || 'N/A'}
                                  </Typography>
                                )}
                              </CardContent>
                            </Card>
                          </Slide>
                        </Grid>

                        {/* Display birthOfDay */}
                        <Grid item xs={12}>
                          <Slide direction="up" in={true} timeout={1200}>
                            <Card sx={{ borderRadius: 3, border: '2px solid #e2e8f0', boxShadow: 'none', transition: 'all 0.3s ease', '&:hover': { borderColor: '#667eea', boxShadow: '0 8px 20px rgba(102, 126, 234, 0.2)' } }}>
                              <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Cake sx={{ fontSize: 30, color: '#667eea', mr: 2 }} />
                                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a202c' }}>
                                      Birth of Day
                                    </Typography>
                                  </Box>
                                  {editingField !== 'birthOfDay' && (
                                    <IconButton 
                                      size="small" 
                                      onClick={() => handleEditField('birthOfDay', user?.birthOfDay)}
                                      sx={{ color: '#667eea' }}
                                    >
                                      <Edit fontSize="small" />
                                    </IconButton>
                                  )}
                                </Box>
                                {editingField === 'birthOfDay' ? (
                                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                    <TextField
                                      fullWidth
                                      size="small"
                                      type="date"
                                      value={editValue}
                                      onChange={(e) => setEditValue(e.target.value)}
                                      InputLabelProps={{ shrink: true }}
                                      autoFocus
                                    />
                                    <IconButton 
                                      size="small" 
                                      color="primary" 
                                      onClick={handleSaveField}
                                      disabled={updateMutation.isPending}
                                    >
                                      <Save />
                                    </IconButton>
                                    <IconButton 
                                      size="small" 
                                      onClick={handleCancelEdit}
                                      disabled={updateMutation.isPending}
                                    >
                                      <ArrowBack />
                                    </IconButton>
                                  </Box>
                                ) : (
                                  <Typography variant="body1" sx={{ color: '#4a5568', fontSize: '1rem', bgcolor: '#f7fafc', p: 2, borderRadius: 2 }}>
                                    {formatDate(user?.birthOfDay)}
                                  </Typography>
                                )}
                              </CardContent>
                            </Card>
                          </Slide>
                        </Grid>

                        {/* Display address */}
                        <Grid item xs={12}>
                          <Slide direction="up" in={true} timeout={1300}>
                            <Card sx={{ borderRadius: 3, border: '2px solid #e2e8f0', boxShadow: 'none', transition: 'all 0.3s ease', '&:hover': { borderColor: '#667eea', boxShadow: '0 8px 20px rgba(102, 126, 234, 0.2)' } }}>
                              <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <HomeIcon sx={{ fontSize: 30, color: '#667eea', mr: 2 }} />
                                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a202c' }}>
                                      Address
                                    </Typography>
                                  </Box>
                                  {editingField !== 'address' && (
                                    <IconButton 
                                      size="small" 
                                      onClick={() => handleEditField('address', user?.address)}
                                      sx={{ color: '#667eea' }}
                                    >
                                      <Edit fontSize="small" />
                                    </IconButton>
                                  )}
                                </Box>
                                {editingField === 'address' ? (
                                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                                    <TextField
                                      fullWidth
                                      size="small"
                                      multiline
                                      rows={3}
                                      value={editValue}
                                      onChange={(e) => setEditValue(e.target.value)}
                                      autoFocus
                                    />
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                      <IconButton 
                                        size="small" 
                                        color="primary" 
                                        onClick={handleSaveField}
                                        disabled={updateMutation.isPending}
                                      >
                                        <Save />
                                      </IconButton>
                                      <IconButton 
                                        size="small" 
                                        onClick={handleCancelEdit}
                                        disabled={updateMutation.isPending}
                                      >
                                        <ArrowBack />
                                      </IconButton>
                                    </Box>
                                  </Box>
                                ) : (
                                  <Typography variant="body1" sx={{ color: '#4a5568', fontSize: '1rem', bgcolor: '#f7fafc', p: 2, borderRadius: 2 }}>
                                    {user?.address || 'N/A'}
                                  </Typography>
                                )}
                              </CardContent>
                            </Card>
                          </Slide>
                        </Grid>
                      </Grid>
                    </Box>
                  </Grow>
                </CardContent>
              </Paper>
            </Zoom>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;
