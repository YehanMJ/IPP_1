import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import routes from '../../common/navigation/routes';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { Avatar, Button } from '@mui/material';
import HomeIcon from "@mui/icons-material/Home";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CategoryIcon from "@mui/icons-material/Category";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import ChecklistIcon from '@mui/icons-material/Checklist';
import instance from '../../service/AxiosOrder';
import ChevronDownIcon from '@mui/icons-material/ExpandMore';
import ChevronUpIcon from '@mui/icons-material/ExpandLess';
import '@fontsource/courgette';
import bg from '../../assets/bg3.jpg'; // Import the background image
import './WelcomeScreen.css'; // Import the CSS for the welcome screen
import Swal from 'sweetalert2';
import { yellow } from '@mui/material/colors'; // Optional: for MUI yellow palette
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';


const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme }) => ({
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: `-${drawerWidth}px`,
        variants: [
            {
                props: ({ open }) => open,
                style: {
                    transition: theme.transitions.create('margin', {
                        easing: theme.transitions.easing.easeOut,
                        duration: theme.transitions.duration.enteringScreen,
                    }),
                    marginLeft: 0,
                },
            },
        ],
    }),
);

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme }) => ({
    zIndex: theme.zIndex.drawer + 1,
    height: "80px",
    background: "linear-gradient(135deg, #ffe066 50%, #fffde7 50%)", // Yellow to white gradient
    clipPath: "path('M0,0 C50,80 150,80 200,0 L100%,0 L100%,100 L0,100 Z')", // Wavy effect
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    variants: [
        {
            props: ({ open }) => open,
            style: {
                width: `calc(100% - ${drawerWidth}px)`,
                marginLeft: `${drawerWidth}px`,
                transition: theme.transitions.create(['margin', 'width'], {
                    easing: theme.transitions.easing.easeOut,
                    duration: theme.transitions.duration.enteringScreen,
                }),
            },
        },
    ],
}));

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
    background: "linear-gradient(135deg, #000 50%, #fff 50%)", // Yellow to white gradient
    clipPath: "path('M0,0 C50,80 150,80 200,0 L100%,0 L100%,100 L0,100 Z')", // Wavy effect
    borderBottom: "4px solid #ffe066", // Yellow border
}));

export default function Dashboard({ setLogin }) {
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const navigate = useNavigate();
    const [userDetails, setUserDetails] = React.useState(null); // State to store user details
    const [showDetails, setShowDetails] = React.useState(false);
    const [userRole, setUserRole] = React.useState(null);
    const [showWelcomeScreen, setShowWelcomeScreen] = React.useState(true); // State for the welcome screen
    const [animationClass, setAnimationClass] = React.useState("fade-in");
    const [categories, setCategories] = React.useState([]);
    const [categoryAnchorEl, setCategoryAnchorEl] = React.useState(null);

    // Fetch user details from the API
    React.useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await instance.get('/user/auth'); // Use instance for the API call
                console.log("User details:", response.data); // Log the user details
                setUserDetails(response.data); // Set user details
                setUserRole(response.data.role);
            } catch (error) {
                console.error("Error fetching user details:", error);
            }
        };

        fetchUserDetails();
        const fadeOutTimer = setTimeout(() => {
            setAnimationClass("fade-out"); // Trigger fade-out animation
        }, 1500);

        // Remove the welcome screen after the animation completes (2 seconds total)
        const removeScreenTimer = setTimeout(() => {
            setShowWelcomeScreen(false);
        }, 2000);

        return () => {
            clearTimeout(fadeOutTimer);
            clearTimeout(removeScreenTimer);
        };
    }, []);

    // Fetch categories from products API on mount
    React.useEffect(() => {
        const fetchCategories = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await instance.get("/products/", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const products = response.data || [];
                // Extract unique categories from products
                const uniqueCategories = [
                    ...new Set(products.map((p) => p.category).filter(Boolean)),
                ];
                setCategories(uniqueCategories);
            } catch (error) {
                setCategories([]);
            }
        };
        fetchCategories();
    }, []);

    // Handle category dropdown open/close
    const handleCategoryMenuOpen = (event) => {
        setCategoryAnchorEl(event.currentTarget);
    };
    const handleCategoryMenuClose = () => {
        setCategoryAnchorEl(null);
    };

    // Handle category selection
    const handleCategorySelect = (category) => {
        setCategoryAnchorEl(null);
        // Navigate to products with category as query param
        navigate(`/products?category=${encodeURIComponent(category)}`);
    };

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handleLogout = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "You will be logged out of your account.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33", // Red for confirm
            cancelButtonColor: "#3085d6", // Blue for cancel
            confirmButtonText: "Yes, log me out!",
            cancelButtonText: "Cancel",
        }).then((result) => {
            if (result.isConfirmed) {
                sessionStorage.clear();
                localStorage.removeItem("token"); // Remove the token
                setLogin(false); // Update login state
                navigate("/login"); // Redirect to login page
                Swal.fire({
                    title: "Logged Out",
                    text: "You have been successfully logged out.",
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false,
                });
            }
        });
    };

    const getIconForRoute = (routeName) => {
        switch (routeName.toLowerCase()) {
            case "product management":
                return <CategoryIcon />;
            case "products":
                return <CategoryIcon />;
            case "cart":
                return <ShoppingCartIcon />;
            case "orders":
                return <ChecklistIcon />;
            case "my orders":
                return <ChecklistIcon />;
            default:
                return <InboxIcon />;
        }
    };

    return (
        <Box sx={{ display: "flex", backgroundColor: "white" /* Light blue background */ }}>
            <CssBaseline />
            {showWelcomeScreen && (
                <div
                    className={`welcome-screen ${animationClass}`}
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        background: "#000", // Black background
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 9999,
                    }}
                >
                    <Typography
                        variant="h3"
                        sx={{
                            color: "#fff", // White text
                            fontWeight: "bold",
                            fontFamily: "Courgette, sans-serif",
                            textAlign: "center",
                        }}
                    >
                        Welcome to the E-com Platform!
                    </Typography>
                </div>
            )}
            {!showWelcomeScreen && (
                <>
                    <AppBar
                        position="fixed"
                        open={open}
                        sx={{
                            background: "#000", // Black background
                            color: "#fff",      // White text
                        }}
                    >
                        <Toolbar>
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                onClick={handleDrawerOpen}
                                edge="start"
                                sx={[
                                    {
                                        mr: 2,
                                    },
                                    open && { display: "none" },
                                ]}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    width: "100%",
                                    height: "100%",
                                    alignItems: "center",
                                }}
                            >
                                <Typography
                                    variant="h4"
                                    noWrap
                                    component="div"
                                    sx={{
                                        fontFamily: 'Courgette, sans-serif', // Apply Courgette font
                                        fontWeight: '700',
                                        color: "white=", // Dark purple text
                                    }}
                                >
                                    E-commerce Platform
                                </Typography>
                                {/* Category Button */}
                                <Box sx={{ ml: "auto" }}>
                                    <Button
                                        color="inherit"
                                        startIcon={<CategoryIcon />}
                                        onMouseEnter={handleCategoryMenuOpen}
                                        onClick={handleCategoryMenuOpen}
                                        sx={{
                                            color: "#fff",
                                            fontWeight: "bold",
                                            textTransform: "none",
                                            border: "1px solid #fff",
                                            borderRadius: "8px",
                                            ml: 2,
                                            background: "transparent",
                                            "&:hover": {
                                                background: "#222",
                                            },
                                        }}
                                        aria-controls={Boolean(categoryAnchorEl) ? "category-menu" : undefined}
                                        aria-haspopup="true"
                                        aria-expanded={Boolean(categoryAnchorEl) ? "true" : undefined}
                                    >
                                        Category
                                    </Button>
                                    <Menu
                                        id="category-menu"
                                        anchorEl={categoryAnchorEl}
                                        open={Boolean(categoryAnchorEl)}
                                        onClose={handleCategoryMenuClose}
                                        MenuListProps={{
                                            onMouseLeave: handleCategoryMenuClose,
                                            sx: { backgroundColor: "#fff", color: "#000" },
                                        }}
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'right',
                                        }}
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                    >
                                        <MenuItem
                                            key="all"
                                            onClick={() => handleCategorySelect("all")}
                                            sx={{
                                                "&:hover": { backgroundColor: "#000", color: "#fff" }
                                            }}
                                        >
                                            All
                                        </MenuItem>
                                        {categories.length === 0 && (
                                            <MenuItem disabled>No categories</MenuItem>
                                        )}
                                        {categories.map((cat) => (
                                            <MenuItem
                                                key={cat}
                                                onClick={() => handleCategorySelect(cat)}
                                                sx={{
                                                    "&:hover": { backgroundColor: "#000", color: "#fff" }
                                                }}
                                            >
                                                {cat}
                                            </MenuItem>
                                        ))}
                                    </Menu>
                                </Box>
                            </Box>
                        </Toolbar>
                    </AppBar>
                    <Drawer
                        sx={{
                            width: 240,
                            flexShrink: 0,
                            "& .MuiDrawer-paper": {
                                width: 240,
                                boxSizing: "border-box",
                                backgroundColor: "#000", // White background
                                color: "#000",           // Black text
                            },
                        }}
                        variant="persistent"
                        anchor="left"
                        open={open}
                    >
                        <DrawerHeader>
                            <IconButton onClick={handleDrawerClose}>
                                {theme.direction === "ltr" ? <ChevronLeftIcon sx={{ color: "#fff" }} /> : <ChevronRightIcon sx={{ color: "#fff" }} />}
                            </IconButton>
                        </DrawerHeader>
                        <Divider sx={{ backgroundColor: "#fff" }} />
                        {/* User Details Section */}
                        {userDetails && (
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    padding: 2,
                                    backgroundColor: "#fffff", // White background
                                    borderRadius: "8px",
                                    margin: "16px",
                                    flexDirection: "column", // Stack details vertically
                                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", // Add a subtle shadow
                                }}
                            >
                                <Avatar
                                    alt={userDetails.name}
                                    src={userDetails.avatar} // Assuming the API returns an avatar URL
                                    sx={{
                                        width: 64,
                                        height: 64,
                                        marginBottom: 1,
                                        border: "2px solid #fff", // black border
                                    }}
                                />
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: "bold",
                                        color: "#fff",
                                        marginBottom: "4px",
                                        fontFamily: 'Courgette, sans-serif', // Apply Courgette font
                                    }}
                                >
                                    {userDetails.name}
                                </Typography>
                                <IconButton
                                    onClick={() => setShowDetails((prev) => !prev)} // Toggle visibility
                                    sx={{
                                        marginTop: 1,
                                        color: "#fff", // Match the theme color
                                    }}
                                >
                                    {showDetails ? <ChevronUpIcon /> : <ChevronDownIcon />}
                                </IconButton>
                                {showDetails && (
                                    <Box
                                        sx={{
                                            marginTop: 1,
                                            textAlign: "left",
                                            width: "100%",
                                            padding: "8px",
                                            backgroundColor: "#fff", // Light purple background
                                            borderRadius: "8px",
                                        }}
                                    >
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: "#000",
                                                marginBottom: "4px",
                                            }}
                                        >
                                            {userDetails.email}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: "#000",
                                                marginBottom: "4px",
                                            }}
                                        >
                                            ID: {userDetails.ID}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: "#000",
                                            }}
                                        >
                                            Role: {userDetails.role}
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        )}
                        <Divider />
                        <List>
                            {routes
                                .filter((route) => !route.role || route.role === userRole) // Filter routes based on userRole
                                .map((route) => (
                                    <ListItem key={route.name} disablePadding>
                                        <ListItemButton
                                            onClick={() => navigate(route.path)}
                                            sx={{
                                                backgroundColor: route.role === "admin" ? "#FAA0A0" : "inherit", // Gray background for admin-only
                                                color: "#fff",
                                                "&:hover": {
                                                    backgroundColor: "#222", // Lighter yellow on hover
                                                },
                                            }}
                                        >
                                            <ListItemIcon
                                                sx={{
                                                    color: "#fff",
                                                }}
                                            >
                                                {getIconForRoute(route.name)}
                                            </ListItemIcon>
                                            <ListItemText primary={route.name} />
                                        </ListItemButton>
                                    </ListItem>
                                ))}
                        </List>
                        <Box sx={{ padding: 2, marginTop: "auto" }}>
                            <Button
                                onClick={handleLogout}
                                variant="outlined"
                                fullWidth
                                startIcon={<LogoutIcon />}
                                sx={{
                                    borderColor: "#fff",
                                    color: "#fff",
                                    "&:hover": {
                                        backgroundColor: "red",
                                        borderColor: "#fff",
                                    },
                                }}
                            >
                                Log Out
                            </Button>
                        </Box>
                    </Drawer>
                    <Main open={open}>
                        <DrawerHeader />
                        <Routes>
                            <Route path={"*"} element={<Navigate to="/products" />} />
                            {routes
                                .filter((route) => !route.role || route.role === userRole) // Filter routes based on userRole
                                .map((route) => (
                                    <Route key={route.name} path={route.path} element={route.component} />
                                ))}
                        </Routes>
                    </Main>
                </>)}

        </Box>
    );
}