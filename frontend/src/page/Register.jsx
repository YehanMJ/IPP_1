import * as React from 'react';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { Box, Typography, FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton, Button, useMediaQuery } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Link, useNavigate } from 'react-router-dom';
import instance from '../service/AxiosOrder';
import bg from '../assets/bg7.jpeg'; // Import the same background image as in Login
import "@fontsource/courgette";

export default function Register() {
    const [username, setUsername] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [role, setRole] = React.useState('');
    const [showPassword, setShowPassword] = React.useState(false);
    const navigate = useNavigate();
    const isMobile = useMediaQuery('(max-width:600px)'); // Check if the screen size is mobile

    React.useEffect(() => {
        const hello = document.querySelector(".hello__div");

        function hello__function() {
            if (hello) {
                hello.style.display = "none";
                setTimeout(() => {
                    hello.style.display = "flex";
                }, 10);
            }
        }

        const interval = setInterval(hello__function, 20000);

        // Cleanup the interval on component unmount
        return () => clearInterval(interval);
    }, []); // Empty dependency array to run only once after the component mounts

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleRegister = () => {
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        instance.post('/user/register', {
            name: username,
            email: email,
            password: password,
            role: role,
        })
            .then((response) => {
                console.log('Registration successful:', response.data);
                alert('Registration successful!');
                navigate('/login');
            })
            .catch((error) => {
                console.error('Error during registration:', error);
                alert('Registration failed. Please try again.');
            });
    };

    return (
        <Box
            display="flex"
            sx={{
                height: '100vh',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Dimmed Background Image */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundImage: `url(${bg})`, // Use imported image
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    zIndex: -2, // Place behind all content
                }}
            />
            {/* Overlay for Dimming */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Black overlay with 50% opacity
                    zIndex: -1, // Place above the background image
                }}
            />

            {/* Left Side Image */}
            {!isMobile && (
                <Box
                    sx={{
                        width: '550px',
                        height: '60%',
                        position: 'relative', // To position the text inside
                        borderTopLeftRadius: '10px',
                        borderBottomLeftRadius: '10px',
                        backgroundImage: `url(${bg})`, // Use the same image without dimming
                        backgroundSize: 'cover',
                        backgroundPosition: 'left center',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    {/* New Animated Path Text */}
                    <Box
                        className=""
                        sx={{
                            height: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <svg className="hello__svg" viewBox="0 0 1230.94 414.57">
                            <path
                                d="M-293.58-104.62S-103.61-205.49-60-366.25c9.13-32.45,9-58.31,0-74-10.72-18.82-49.69-33.21-75.55,31.94-27.82,70.11-52.22,377.24-44.11,322.48s34-176.24,99.89-183.19c37.66-4,49.55,23.58,52.83,47.92a117.06,117.06,0,0,1-3,45.32c-7.17,27.28-20.47,97.67,33.51,96.86,66.93-1,131.91-53.89,159.55-84.49,31.1-36.17,31.1-70.64,19.27-90.25-16.74-29.92-69.47-33-92.79,16.73C62.78-179.86,98.7-93.8,159-81.63S302.7-99.55,393.3-269.92c29.86-58.16,52.85-114.71,46.14-150.08-7.44-39.21-59.74-54.5-92.87-8.7-47,65-61.78,266.62-34.74,308.53S416.62-58,481.52-130.31s133.2-188.56,146.54-256.23c14-71.15-56.94-94.64-88.4-47.32C500.53-375,467.58-229.49,503.3-127a73.73,73.73,0,0,0,23.43,33.67c25.49,20.23,55.1,16,77.46,6.32a111.25,111.25,0,0,0,30.44-19.87c37.73-34.23,29-36.71,64.58-127.53C724-284.3,785-298.63,821-259.13a71,71,0,0,1,13.69,22.56c17.68,46,6.81,80-6.81,107.89-12,24.62-34.56,42.72-61.45,47.91-23.06,4.45-48.37-.35-66.48-24.27a78.88,78.88,0,0,1-12.66-25.8c-14.75-51,4.14-88.76,11-101.41,6.18-11.39,37.26-69.61,103.42-42.24,55.71,23.05,100.66-23.31,100.66-23.31"
                                transform="translate(311.08 476.02)"
                                style={{
                                    fill: 'none',
                                    stroke: '#fff',
                                    strokeLinecap: 'round',
                                    strokeMiterlimit: 10,
                                    strokeWidth: '35px',
                                    strokeDasharray: '5800px',
                                    strokeDashoffset: '5800px',
                                    animation: 'anim__hello linear 5s forwards',
                                }}
                            />
                        </svg>
                    </Box>
                </Box>
            )}

            {/* Register Form */}
            <Box
                sx={{
                    color: '#000', // Black text
                    height: isMobile ? 'auto' : '60%',
                    width: isMobile ? '90%' : '550px',
                    background: '#fff', // White background
                    borderRadius: '10px',
                    borderTopLeftRadius: '0',
                    borderBottomLeftRadius: '0',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: isMobile ? '20px' : '50px',
                    padding: isMobile ? 3 : 0,
                    boxShadow: '0px 4px 12px rgba(0,0,0,0.2)',
                }}
            >
                <Box
                    sx={{
                        color: '#000', // Black text
                        fontFamily: 'courgette',
                        fontWeight: '700',
                        fontSize: isMobile ? '20px' : '24px',
                        textAlign: 'center',
                    }}
                >
                    <h1>Register</h1>
                </Box>

                <Stack spacing={2} sx={{ width: '80%' }}>
                    {/* Username Field */}
                    <TextField
                        id="username"
                        label="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        multiline
                        maxRows={4}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: '#000', // Black border
                                },
                                '&:hover fieldset': {
                                    borderColor: '#222', // Slightly lighter black
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#000', // Black
                                },
                            },
                            '& .MuiInputLabel-root': {
                                color: '#000', // Black label
                            },
                            '& .MuiInputBase-input': {
                                color: '#000', // Black text
                            },
                        }}
                    />

                    {/* Email Field */}
                    <TextField
                        id="email"
                        label="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        multiline
                        maxRows={4}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: '#000', // Black border
                                },
                                '&:hover fieldset': {
                                    borderColor: '#222', // Slightly lighter black
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#000', // Black
                                },
                            },
                            '& .MuiInputLabel-root': {
                                color: '#000', // Black label
                            },
                            '& .MuiInputBase-input': {
                                color: '#000', // Black text
                            },
                        }}
                    />

                    {/* Password Field */}
                    <FormControl
                        sx={{
                            width: '100%',
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: '#000', // Black border
                                },
                                '&:hover fieldset': {
                                    borderColor: '#222', // Slightly lighter black
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#000', // Black
                                },
                            },
                            '& .MuiInputLabel-root': {
                                color: '#000', // Black label
                            },
                            '& .MuiInputBase-input': {
                                color: '#000', // Black text
                            },
                        }}
                        variant="outlined"
                    >
                        <InputLabel htmlFor="outlined-adornment-password" sx={{ color: '#000' }}>
                            Password
                        </InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-password"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label={showPassword ? 'hide the password' : 'display the password'}
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                        sx={{ color: '#000' }}
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Password"
                        />
                    </FormControl>

                    {/* Confirm Password Field */}
                    <FormControl
                        sx={{
                            width: '100%',
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: '#000', // Black border
                                },
                                '&:hover fieldset': {
                                    borderColor: '#222', // Slightly lighter black
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#000', // Black
                                },
                            },
                            '& .MuiInputLabel-root': {
                                color: '#000', // Black label
                            },
                            '& .MuiInputBase-input': {
                                color: '#000', // Black text
                            },
                        }}
                        variant="outlined"
                    >
                        <InputLabel htmlFor="outlined-adornment-confirm-password" sx={{ color: '#000' }}>
                            Confirm Password
                        </InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-confirm-password"
                            type={showPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label={showPassword ? 'hide the password' : 'display the password'}
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                        sx={{ color: '#000' }}
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Confirm Password"
                        />
                    </FormControl>

                    {/* Role Field */}
                    <TextField
                        id="role"
                        label="Role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        multiline
                        maxRows={4}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: '#000', // Black border
                                },
                                '&:hover fieldset': {
                                    borderColor: '#222', // Slightly lighter black
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#000', // Black
                                },
                            },
                            '& .MuiInputLabel-root': {
                                color: '#000', // Black label
                            },
                            '& .MuiInputBase-input': {
                                color: '#000', // Black text
                            },
                        }}
                    />

                    {/* Register Button */}
                    <Button
                        onClick={handleRegister}
                        variant="contained"
                        size="large"
                        sx={{
                            backgroundColor: '#000', // Black
                            color: '#fff',           // White text
                            fontWeight: '700',
                            borderRadius: '10px',
                            '&:hover': {
                                backgroundColor: '#222', // Slightly lighter black
                            },
                        }}
                    >
                        Register
                    </Button>

                    {/* Login Link */}
                    <Typography sx={{ color: '#000', textAlign: 'center' }}>
                        Already have an account?{' '}
                        <Link
                            to={'/login'}
                            style={{
                                color: '#000', // Black
                                textDecoration: 'underline',
                                fontWeight: 'bold',
                            }}
                        >
                            Login Here
                        </Link>
                    </Typography>
                </Stack>
            </Box>
        </Box>
    );
}