import { Box, Card, CardContent, CardMedia, Grid, Typography, Button, Dialog, DialogTitle, DialogContent, TextField, Rating } from "@mui/material";
import { useEffect, useState } from "react";
import instance from "../../service/AxiosOrder";
import { useDispatch } from "react-redux";
import { addToCart } from "../../store/cartSlice";
import Loader from "../../common/loader/Loader";
import "./Products.css"; // Import the CSS for animations
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

export default function Products() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]); // Track filtered products
    const [searchTerm, setSearchTerm] = useState(""); // Track the search term
    const [loading, setLoading] = useState(true); // Track loading state
    const [selectedProduct, setSelectedProduct] = useState(null); // Track the selected product for the popup
    const [dialogOpen, setDialogOpen] = useState(false); // Track the dialog state
    const [reviews, setReviews] = useState([]); // Track reviews for the selected product
    const [userDetails, setUserDetails] = useState([]);
    const [quantityDialogOpen, setQuantityDialogOpen] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [cartProduct, setCartProduct] = useState(null);
    const dispatch = useDispatch();
    const location = useLocation();

    const handleAddToCart = (product) => {
        dispatch(addToCart(product)); // Add product to Redux store
        Swal.fire({
            icon: "success",
            title: "Added to Cart",
            text: `${product.name} has been added to your cart.`,
            timer: 2000,
            showConfirmButton: false,
        });
    };

    const handleViewDetails = async (product) => {
        setSelectedProduct(product); // Set the selected product
        setDialogOpen(true); // Open the dialog

        // Fetch reviews for the selected product
        try {
            const response = await instance.get(`/reviews/${product.ID}`);
            setReviews(response.data); // Set the reviews in state
        } catch (error) {
            console.error("Error fetching reviews:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to fetch reviews. Please try again later.",
            });
            setReviews([]); // Clear reviews if there's an error
        }
    };
    const handleCloseDialog = () => {
        setDialogOpen(false); // Close the dialog
        setSelectedProduct(null); // Clear the selected product
        setReviews([]); // Clear reviews
    };

    const handleSearch = (event) => {
        const term = event.target.value.toLowerCase();
        setSearchTerm(term);

        // Filter products based on the search term
        const filtered = products.filter((product) =>
            product.name.toLowerCase().includes(term)
        );

        // Reset animation by toggling a class
        const productContainer = document.querySelector(".product-container");
        if (productContainer) {
            productContainer.classList.remove("fade-in-reset");
            void productContainer.offsetWidth; // Trigger reflow to restart animation
            productContainer.classList.add("fade-in-reset");
        }

        setFilteredProducts(filtered);
    };

    // Helper to get query param
    const getCategoryFromQuery = () => {
        const params = new URLSearchParams(location.search);
        return params.get("category") || "";
    };

    // Fetch products from the API
    const fetchProducts = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Token not available. Cannot fetch products.");
            setLoading(false);
            Swal.fire({
                icon: "error",
                title: "Unauthorized",
                text: "You are not authorized to view products. Please log in.",
            });
            return;
        }

        try {
            const response = await instance.get("/products/", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProducts(response.data);
            // Filter by category if present in query and not "all"
            const category = getCategoryFromQuery();
            if (category && category !== "all") {
                setFilteredProducts(response.data.filter((p) => p.category === category));
            } else {
                setFilteredProducts(response.data);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to fetch products. Please try again later.",
            });
        } finally {
            setTimeout(() => setLoading(false), 1000);
        }
    };

    // Fetch user details for mapping reviews
    const fetchUserDetails = async () => {
        try {
            const response = await instance.get("/user/users"); // Fetch all users
            setUserDetails(response.data); // Assuming the API returns an array of user details
            console.log("User details fetched:", response.data);
        } catch (error) {
            console.error("Error fetching user details:", error);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchUserDetails();
        // eslint-disable-next-line
    }, [location.search]); // Re-run when category changes

    if (loading) {
        return <Loader />; // Show the custom loader while loading
    }

    // Open quantity dialog when Add to Cart is clicked
    const handleAddToCartClick = (product) => {
        setCartProduct(product);
        setQuantity(1);
        setQuantityDialogOpen(true);
    };

    // Confirm add to cart with selected quantity
    const handleConfirmAddToCart = () => {
        if (cartProduct) {
            dispatch(addToCart({ ...cartProduct, quantity }));
            Swal.fire({
                icon: "success",
                title: "Added to Cart",
                text: `${cartProduct.name} (x${quantity}) has been added to your cart.`,
                timer: 2000,
                showConfirmButton: false,
            });
        }
        setQuantityDialogOpen(false);
        setCartProduct(null);
    };

    return (
        <Box sx={{ padding: 3, backgroundColor: "#fff" }}>
            {/* Header */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 3,
                }}
            >
                <Typography
                    variant="h4"
                    sx={{
                        color: "#000", // Black text
                        fontWeight: "bold",
                        fontFamily: "Courgette, sans-serif",
                    }}
                >
                    Product List
                </Typography>
                <TextField
                    label="Search Products"
                    variant="outlined"
                    size="small"
                    value={searchTerm}
                    onChange={handleSearch}
                    sx={{
                        width: "300px",
                        backgroundColor: "#fff", // White background
                        borderRadius: "60px",
                        "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                                border: "1px solid #000", // Black border
                            },
                        },
                        "& .MuiInputLabel-root": {
                            color: "#000", // Black label
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                            color: "#000", // Black label when focused
                        },
                    }}
                />
            </Box>

            <Box className="product-container">
                {/* Product Tiles */}
                <Grid container spacing={8}>
                    {filteredProducts.map((product, index) => (
                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                            key={product.id}
                            className="fade-in"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <Box
                                sx={{
                                    position: "relative",
                                    width: "100%",
                                    maxWidth: 300,
                                    height: 400,
                                    margin: "auto",
                                    "&:hover .overlay": {
                                        opacity: 1,
                                    },
                                }}
                            >
                                <Card
                                    sx={{
                                        width: "100%",
                                        minWidth: 300,
                                        height: 400,
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        backgroundColor: "#fff",
                                        borderRadius: "10px",
                                        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                                    }}
                                >
                                    <CardMedia
                                        component="img"
                                        height="200"
                                        image={`http://localhost:3000/uploads/${product.image}`}
                                        alt={product.name}
                                        sx={{
                                            objectFit: "contain",
                                            width: "100%",
                                            borderRadius: "10px 10px 0 0",
                                            backgroundColor: "#fff",
                                        }}
                                    />
                                    <CardContent
                                        sx={{
                                            flexGrow: 1,
                                            textAlign: "center",
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <Typography
                                            gutterBottom
                                            variant="h8"
                                            component="div"
                                            sx={{ color: "#000", fontWeight: "bold" }}
                                        >
                                            {product.name}
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            sx={{ marginTop: 1, fontWeight: "bold", color: "#000" }}
                                        >
                                            ${product.price}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ marginTop: 1, color: "#000" }}
                                        >
                                            Remaining items: {product.stock || "Out of Stock"}
                                        </Typography>
                                    </CardContent>
                                </Card>
                                {/* Overlay */}
                                <Box
                                    className="overlay"
                                    sx={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        width: "100%",
                                        height: "100%",
                                        borderRadius: "10px",
                                        backgroundColor: "rgba(0,0,0,0.85)",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        opacity: 0,
                                        transition: "opacity 0.3s ease-in-out",
                                    }}
                                >
                                    <Button
                                        variant="contained"
                                        onClick={() => handleAddToCartClick(product)}
                                        sx={{
                                            backgroundColor: "#000",
                                            color: "#fff",
                                            fontWeight: "bold",
                                            marginBottom: 1,
                                            "&:hover": {
                                                backgroundColor: "#222",
                                            },
                                        }}
                                    >
                                        Add to Cart
                                    </Button>
                                    <Button
                                        variant="contained"
                                        onClick={() => handleViewDetails(product)}
                                        sx={{
                                            backgroundColor: "#000",
                                            color: "#fff",
                                            fontWeight: "bold",
                                            "&:hover": {
                                                backgroundColor: "#222",
                                            },
                                        }}
                                    >
                                        View Details
                                    </Button>
                                </Box>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {/* Quantity Dialog */}
            <Dialog
                open={quantityDialogOpen}
                onClose={() => setQuantityDialogOpen(false)}
                maxWidth="xs"
                fullWidth
                sx={{
                    "& .MuiDialog-paper": {
                        backgroundColor: "#fff",
                        borderRadius: "10px",
                        padding: 3,
                        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        backgroundColor: "#000",
                        color: "#fff",
                        fontWeight: "bold",
                        textAlign: "center",
                        fontFamily: "Courgette, sans-serif",
                    }}
                >
                    Select Quantity
                </DialogTitle>
                <DialogContent sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <Typography sx={{ color: "#000", mb: 2 }}>
                        {cartProduct?.name}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <IconButton
                            aria-label="decrease"
                            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                            sx={{ color: "#000", border: "1px solid #000", borderRadius: "50%" }}
                        >
                            <RemoveIcon />
                        </IconButton>
                        <TextField
                            value={quantity}
                            inputProps={{ min: 1, style: { textAlign: "center" } }}
                            sx={{
                                width: 60,
                                mx: 2,
                                "& .MuiInputBase-input": { color: "#000", fontWeight: "bold", textAlign: "center" },
                                "& .MuiOutlinedInput-root": {
                                    "& fieldset": { borderColor: "#000" },
                                },
                            }}
                            size="small"
                            disabled
                        />
                        <IconButton
                            aria-label="increase"
                            onClick={() => setQuantity((q) => q + 1)}
                            sx={{ color: "#000", border: "1px solid #000", borderRadius: "50%" }}
                        >
                            <AddIcon />
                        </IconButton>
                    </Box>
                    <Button
                        variant="contained"
                        onClick={handleConfirmAddToCart}
                        sx={{
                            backgroundColor: "#000",
                            color: "#fff",
                            fontWeight: "bold",
                            borderRadius: "8px",
                            "&:hover": {
                                backgroundColor: "#222",
                            },
                        }}
                        fullWidth
                    >
                        Add to Cart
                    </Button>
                </DialogContent>
            </Dialog>

            {/* Product Details Popup */}
            <Dialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                maxWidth="sm"
                fullWidth
                sx={{
                    "& .MuiDialog-paper": {
                        backgroundColor: "#fff", // White background
                        borderRadius: "10px",
                        padding: 3,
                        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        backgroundColor: "#000", // Black background
                        color: "#fff",
                        fontWeight: "bold",
                        textAlign: "center",
                        fontFamily: "Courgette, sans-serif",
                    }}
                >
                    Product Details
                </DialogTitle>
                <DialogContent>
                    {selectedProduct && (
                        <Box>
                            {/* Product Image */}
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    marginBottom: 3,
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    image={`http://localhost:3000/uploads/${selectedProduct.image}`}
                                    alt={selectedProduct.name}
                                    sx={{
                                        maxWidth: "100%",
                                        maxHeight: "400px",
                                        objectFit: "contain",
                                        borderRadius: "10px",
                                    }}
                                />
                            </Box>

                            {/* Product Information */}
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: "bold",
                                    color: "#000", // Black text
                                    marginBottom: 2,
                                    fontFamily: "Courgette, sans-serif",
                                }}
                            >
                                {selectedProduct.name}
                            </Typography>

                            {/* Description with Bullets */}
                            <Typography variant="body1" sx={{ marginBottom: 2, color: "#000" }}>
                                <ul>
                                    {selectedProduct.description
                                        ?.split(",")
                                        .map((sentence, index) => (
                                            <li key={index} style={{ marginBottom: "8px" }}>
                                                {sentence.trim()}
                                            </li>
                                        ))}
                                </ul>
                            </Typography>

                            <Typography variant="body2" sx={{ marginBottom: 2, color: "#000" }}>
                                Category: {selectedProduct.category || "N/A"}
                            </Typography>
                            <Typography variant="body2" sx={{ marginBottom: 2, color: "#000" }}>
                                Price: ${selectedProduct.price}
                            </Typography>
                            <Typography variant="body2" sx={{ color: "#000", marginBottom: 2 }}>
                                Stock: {selectedProduct.stock || "Out of Stock"}
                            </Typography>

                            {/* Reviews Section */}
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: "bold",
                                    color: "#000", // Black text
                                    marginTop: 3,
                                    marginBottom: 2,
                                    fontFamily: "Courgette, sans-serif",
                                }}
                            >
                                Reviews
                            </Typography>
                            {reviews.length > 0 ? (
                                reviews.map((review, index) => {
                                    const reviewer = userDetails.find(
                                        (user) => user.ID === review.userID
                                    );
                                    return (
                                        <Box
                                            key={index}
                                            sx={{
                                                backgroundColor: "#f5f5f5", // Light gray background
                                                padding: 2,
                                                borderRadius: "8px",
                                                marginBottom: 2,
                                                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                                            }}
                                        >
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    fontWeight: "bold",
                                                    color: "#000",
                                                    marginBottom: 1,
                                                }}
                                            >
                                                {reviewer ? reviewer.name : "Unknown User"}
                                            </Typography>
                                            <Rating
                                                value={review.rating}
                                                precision={0.5}
                                                readOnly
                                                sx={{
                                                    color: "#000", // Black stars
                                                    marginBottom: 1,
                                                }}
                                            />
                                            <Typography variant="body2" sx={{ color: "#000" }}>
                                                {review.comment}
                                            </Typography>
                                        </Box>
                                    );
                                })
                            ) : (
                                <Typography variant="body2" sx={{ color: "#000" }}>
                                    No reviews available for this product.
                                </Typography>
                            )}
                        </Box>
                    )}
                </DialogContent>
            </Dialog>
        </Box>
    );
}