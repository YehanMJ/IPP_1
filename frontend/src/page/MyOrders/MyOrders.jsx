import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../../service/AxiosOrder";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    Grid,
    Card,
    CardMedia,
    CardContent,
    TextField,
    Rating,
    Box,
} from "@mui/material";
import Loader from "../../common/loader/Loader";
import Swal from "sweetalert2";
import "@fontsource/courgette"; // Import Courgette font

export default function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [orderDetails, setOrderDetails] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(true); // Add loading state
    const [userID, setUserID] = useState(null); // State to store user ID
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await instance.get("/user/auth"); // Fetch user data
                console.log("User data:", response.data);
                setUserID(response.data.ID); // Set the user ID from the API response
            } catch (error) {
                console.error("Error fetching user data:", error);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Failed to fetch user data. Please log in again.",
                });
                navigate("/login"); // Redirect to login if user data cannot be fetched
            }
        };

        fetchUserData();
    }, [navigate]);

    useEffect(() => {
        if (!userID) return;

        // Fetch the user's orders
        instance
            .get(`orders/${userID}`)
            .then((response) => {
                setOrders(response.data);
            })
            .catch((error) => {
                console.error("Error fetching orders:", error);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Failed to fetch orders. Please try again later.",
                });
            })
            .finally(() => {
                setTimeout(() => {
                    setLoading(false);
                }, 800);
            });
    }, [userID]);

    const handleViewDetails = (orderID) => {
        // Fetch order items
        instance
            .get(`order-items/${orderID}`)
            .then(async (response) => {
                const items = response.data;
                const detailedItems = await Promise.all(
                    items.map(async (item) => {
                        const productResponse = await instance.get(`products/${item.productID}`);
                        return {
                            ...item,
                            product: productResponse.data,
                        };
                    })
                );
                setOrderDetails(detailedItems);
                setDialogOpen(true);
            })
            .catch((error) => {
                console.error("Error fetching order details:", error);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Failed to fetch order details. Please try again later.",
                });
            });
    };

    const handleRateAndReview = (product) => {
        setSelectedProduct(product);
        setRating(0); // Reset rating
        setComment(""); // Reset comment
        setReviewDialogOpen(true); // Open the review popup
    };

    const handleSubmitReview = () => {
        const reviewData = {
            userID: userID,
            productID: selectedProduct.ID,
            rating: rating,
            comment: comment,
        };
        console.log("Review data:", reviewData); // Log the review data
        console.log("Selected product:", selectedProduct); // Log the selected product

        instance
            .post("/reviews/", reviewData)
            .then(() => {
                // Close both dialogs
                setReviewDialogOpen(false);
                setDialogOpen(false);

                // Fire SweetAlert2 after dialogs are closed
                Swal.fire({
                    icon: "success",
                    title: "Review Submitted",
                    text: "Your review has been submitted successfully!",
                    timer: 2000,
                    showConfirmButton: false,
                });
            })
            .catch((error) => {
                console.error("Error submitting review:", error);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Failed to submit review. Please try again later.",
                });
            });
    };

    if (loading) {
        return <Loader />; // Show the loader while loading
    }

    return (
        <div>
            <Typography
                variant="h4"
                sx={{
                    marginBottom: 3,
                    textAlign: "center",
                    color: "#000", // Black text
                    fontWeight: "bold",
                    fontFamily: "Courgette, sans-serif",
                }}
            >
                My Orders
            </Typography>
            {orders.length > 0 ? (
                <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2, overflow: "hidden" }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: "#000" }}>
                                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Order ID</TableCell>
                                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Total Amount</TableCell>
                                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Status</TableCell>
                                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Date</TableCell>
                                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders
                                .slice()
                                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                                .map((order, index) => (
                                    <TableRow
                                        key={order.ID}
                                        sx={{
                                            "&:nth-of-type(odd)": { backgroundColor: "#fff" },
                                            "&:nth-of-type(even)": { backgroundColor: "#f5f5f5" },
                                            "&:hover": { backgroundColor: "#e0e0e0" },
                                            animation: `fadeIn 0.5s ease-in-out ${index * 0.1}s`,
                                            "@keyframes fadeIn": {
                                                from: { opacity: 0, transform: "translateY(10px)" },
                                                to: { opacity: 1, transform: "translateY(0)" },
                                            },
                                        }}
                                    >
                                        <TableCell sx={{ color: "#000", fontWeight: "bold" }}>{order.ID}</TableCell>
                                        <TableCell sx={{ color: "#000" }}>
                                            ${order.totalAmount ? Number(order.totalAmount).toFixed(2) : "0.00"}
                                        </TableCell>
                                        <TableCell sx={{ color: "#000" }}>{order.status}</TableCell>
                                        <TableCell sx={{ color: "#000" }}>
                                            {order.created_at
                                                ? new Date(order.created_at.replace(" ", "T")).toLocaleString()
                                                : "N/A"}
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                sx={{
                                                    backgroundColor: "#000",
                                                    color: "#fff",
                                                    fontWeight: "bold",
                                                    "&:hover": {
                                                        backgroundColor: "#222",
                                                    },
                                                }}
                                                onClick={() => handleViewDetails(order.ID)}
                                            >
                                                View Details
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Typography variant="body1" sx={{ textAlign: "center", color: "#000" }}>
                    You have no past orders.
                </Typography>
            )}

            {/* Order Details Dialog */}
            <Dialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                maxWidth="md"
                fullWidth
                sx={{
                    "& .MuiDialog-paper": {
                        backgroundColor: "#fff",
                        borderRadius: "10px",
                        padding: 2,
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        backgroundColor: "#000",
                        color: "#fff",
                        fontFamily: "Courgette, sans-serif",
                        textAlign: "center",
                    }}
                >
                    Order Details
                </DialogTitle>
                <DialogContent>
                    {orderDetails.length > 0 ? (
                        <Grid container spacing={2}>
                            {orderDetails.map((item) => (
                                <Grid item xs={12} sm={6} md={4} key={item.productID}>
                                    <Card
                                        sx={{
                                            width: "100%",
                                            minWidth: 300,
                                            maxWidth: 300,
                                            height: 400,
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            margin: "auto",
                                            backgroundColor: "#fff",
                                            borderRadius: "10px",
                                            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                                            border: "1px solid #000",
                                        }}
                                    >
                                        <CardMedia
                                            component="img"
                                            height="200"
                                            image={`http://localhost:3000/uploads/${item.product.image}`}
                                            alt={item.product.name}
                                            sx={{
                                                objectFit: "contain",
                                                width: "100%",
                                                borderRadius: "10px 10px 0 0",
                                                backgroundColor: "#fff",
                                                borderBottom: "1px solid #000",
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
                                                variant="h8"
                                                sx={{ color: "#000", fontWeight: "bold" }}
                                            >
                                                {item.product.name}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: "#000" }}>
                                                Quantity: {item.quantity}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: "#000" }}>
                                                Price: ${Number(item.price || 0).toFixed(2)}
                                            </Typography>
                                            <Button
                                                variant="contained"
                                                sx={{
                                                    marginTop: 2,
                                                    backgroundColor: "#000",
                                                    color: "#fff",
                                                    fontWeight: "bold",
                                                    "&:hover": { backgroundColor: "#222" },
                                                }}
                                                onClick={() => handleRateAndReview(item.product)}
                                            >
                                                Rate & Review
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    ) : (
                        <Typography variant="body1" sx={{ textAlign: "center", color: "#000" }}>
                            No details available for this order.
                        </Typography>
                    )}
                </DialogContent>
            </Dialog>

            {/* Rate & Review Dialog */}
            <Dialog
                open={reviewDialogOpen}
                onClose={() => setReviewDialogOpen(false)}
                maxWidth="sm"
                fullWidth
                sx={{
                    "& .MuiDialog-paper": {
                        backgroundColor: "#fff",
                        borderRadius: "10px",
                        padding: 2,
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        backgroundColor: "#000",
                        color: "#fff",
                        fontFamily: "Courgette, sans-serif",
                        textAlign: "center",
                    }}
                >
                    Rate & Review
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <Typography variant="h6" sx={{ color: "#000", fontWeight: "bold" }}>
                            {selectedProduct?.name || "Product Name"}
                        </Typography>
                        <Rating
                            value={rating}
                            onChange={(event, newValue) => setRating(newValue)}
                            precision={0.5}
                            sx={{ color: "#000" }}
                        />
                        <TextField
                            label="Leave a comment"
                            multiline
                            rows={4}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    "& fieldset": { borderColor: "#000" },
                                    "&:hover fieldset": { borderColor: "#222" },
                                    "&.Mui-focused fieldset": { borderColor: "#000" },
                                },
                                "& .MuiInputLabel-root": { color: "#000" },
                                "& .MuiInputLabel-root.Mui-focused": { color: "#000" },
                            }}
                        />
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Button
                                variant="contained"
                                sx={{
                                    backgroundColor: "#000",
                                    color: "#fff",
                                    "&:hover": { backgroundColor: "#222" },
                                }}
                                onClick={handleSubmitReview}
                            >
                                Submit
                            </Button>
                            <Button
                                variant="outlined"
                                sx={{
                                    borderColor: "#000",
                                    color: "#000",
                                    "&:hover": { backgroundColor: "#f5f5f5" },
                                }}
                                onClick={() => setReviewDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                        </Box>
                    </Box>
                </DialogContent>
            </Dialog>
        </div>
    );
}