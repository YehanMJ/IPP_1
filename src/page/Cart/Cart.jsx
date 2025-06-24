import React, { useState, useEffect } from "react";
import { Box, Card, CardContent, CardMedia, Grid, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, clearCart, setUserID } from "../../store/cartSlice";
import Loader from "../../common/loader/Loader"; // Import the Loader component
import "./Cart.css"; // Import the CSS for animations
import instance from "../../service/AxiosOrder";
import Swal from "sweetalert2";

export default function Cart() {
    const cart = useSelector((state) => state.cart.items); // Use .items
    const userID = useSelector((state) => state.cart.userID); // Use .userID
    const dispatch = useDispatch();
    const [orderID, setOrderID] = useState(null); // State to store order ID
    const [loading, setLoading] = useState(true); // Track loading state
    const [dialogOpen, setDialogOpen] = useState(false); // State to control the popup
    const [orderDetails, setOrderDetails] = useState(null); // State to store order details
    // const [userID, setUserID] = useState(null);
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await instance.get("/user/auth"); // Fetch user data
                console.log("User data:", response.data);
                dispatch(setUserID(response.data.ID)); // Set the user ID from the API response
            } catch (error) {
                console.error("Error fetching user data:", error);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Failed to fetch user data. Please log in again.",
                });
            } finally {
                setLoading(false); // Stop loading after the API call
            }
        };

        fetchUserData();
    }, [dispatch]);

    const handleRemoveFromCart = (product) => {
        dispatch(removeFromCart(product));
    };

    const handleClearCart = () => {
        dispatch(clearCart());
    };

    const handleCheckout = () => {
        if (!userID) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "User ID is missing. Please log in again.",
            });
            return;
        }

        const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0); // Calculate total price
        const orderItems = cart.map((item) => ({
            productID: item.ID,
            quantity: item.quantity || 1, // Default to 1 if quantity is not set
            price: item.price,
        }));

        const orderData = {
            userID: userID,
            totalAmount: totalAmount,
            status: "pending",
            orderItems: orderItems,
        };

        console.log("Order Data:", orderData); // Debugging log

        instance.post("orders/", orderData)
            .then((response) => {
                console.log("Order created successfully:", response.data);
                setOrderID(response.data.orderId); // Store the order ID
                setOrderDetails(orderData); // Store the order details
                setDialogOpen(true); // Open the popup
                Swal.fire({
                    icon: "success",
                    title: "Order Created",
                    text: "Your order has been created successfully!",
                    timer: 2000,
                    showConfirmButton: false,
                });
            })
            .catch((error) => {
                console.error("Error creating order:", error);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Failed to create order. Please try again later.",
                });
            });
    };

    const handlePayment = (orderID, totalAmount) => {
        instance
            .put(`orders/${orderID}`, {
                totalAmount: totalAmount,
                status: "paid",
            })
            .then(() => {
                Swal.fire({
                    icon: "success",
                    title: "Payment Successful",
                    text: "Your payment has been processed successfully!",
                    timer: 2000,
                    showConfirmButton: false,
                });
                dispatch(clearCart()); // Clear the cart after successful payment
                setDialogOpen(false); // Close the popup
            })
            .catch((error) => {
                console.error("Error processing payment:", error);
                Swal.fire({
                    icon: "error",
                    title: "Payment Failed",
                    text: "Failed to process payment. Please try again.",
                });
            });
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 800); // 0.8 seconds delay

        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return <Loader />; // Show the custom loader while loading
    }

    return (
        <Box sx={{ padding: 3, backgroundColor: "white" /* Light gray background */ }}>
            <Typography
                variant="h4"
                sx={{
                    marginBottom: 3,
                    textAlign: "center",
                    color: "#574be8", // Dark purple text
                    fontWeight: "bold",
                    fontFamily: "Courgette, sans-serif", // Apply Courgette font
                }}
            >
                Your Cart
            </Typography>

            {cart.length > 0 ? (
                <Grid container spacing={3}>
                    {cart.map((product, index) => (
                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                            key={product.id}
                            className="fade-in"
                            style={{ animationDelay: `${index * 0.1}s` }} // Add delay for staggered animation
                        >
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
                                    backgroundColor: "#ffffff", // White background to match Products
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
                                        backgroundColor: "#ffffff",
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
                                        sx={{ color: "#000", fontWeight: "bold" }} // Black text
                                    >
                                        {product.name}
                                    </Typography>
                                    {/* <Typography variant="body2" sx={{ color: "#000" }}>
                                        {product.description}
                                    </Typography> */}
                                    <Typography
                                        variant="body1"
                                        sx={{ marginTop: 1, fontWeight: "bold", color: "#000" }} // Black text
                                    >
                                        ${product.price} x {product.quantity || 1} = $
                                        {(product.price * (product.quantity || 1)).toFixed(2)}
                                    </Typography>
                                </CardContent>
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={() => handleRemoveFromCart(product)}
                                    sx={{
                                        marginBottom: 2,
                                        backgroundColor: "#ffe066", // Yellow
                                        color: "#000", // Black text
                                        fontWeight: "bold",
                                        "&:hover": {
                                            backgroundColor: "#fffde7", // Light yellow
                                        },
                                    }}
                                >
                                    Remove
                                </Button>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Typography
                    variant="body1"
                    sx={{ textAlign: "center", color: "#574be8", height: "100vh" }} // Dark purple text
                >
                    Your cart is empty.
                </Typography>
            )}

            {cart.length > 0 && (
                <Box sx={{ textAlign: "center", marginTop: 3 }}>
                    <Button
                        variant="contained"
                        onClick={handleClearCart}
                        sx={{
                            backgroundColor: "#b9a5fe", // Light purple
                            color: "#574be8", // Dark purple text
                            "&:hover": {
                                backgroundColor: "#a58dfd", // Slightly darker purple
                            },
                        }}
                    >
                        Clear Cart
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleCheckout}
                        sx={{
                            marginLeft: 2,
                            backgroundColor: "#574be8", // Dark purple
                            "&:hover": {
                                backgroundColor: "#3e3ab3", // Darker purple
                            },
                        }}
                    >
                        Checkout
                    </Button>
                </Box>
            )}

            {/* Order Details Popup */}
            <Dialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                maxWidth="md"
                fullWidth
                sx={{
                    "& .MuiDialog-paper": {
                        backgroundColor: "#e1dee5", // Light gray background
                        borderRadius: "10px",
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        backgroundColor: "#574be8", // Dark purple background
                        color: "white", // White text
                        fontWeight: "bold",
                        textAlign: "center",
                        fontFamily: "Courgette, sans-serif", // Apply Courgette font
                    }}
                >
                    Order Details
                </DialogTitle>
                <DialogContent>
                    {orderDetails && (
                        <Box>
                            <Typography variant="h6" sx={{ color: "#574be8" }}>
                                Order ID: {orderID}
                            </Typography>
                            <Typography variant="h6" sx={{ color: "#574be8" }}>
                                Total Amount: ${orderDetails.totalAmount.toFixed(2)}
                            </Typography>
                            <Typography variant="h6" sx={{ color: "#574be8" }}>
                                Status: {orderDetails.status}
                            </Typography>
                            <Typography variant="h6" sx={{ marginTop: 2, color: "#574be8" }}>
                                Items:
                            </Typography>
                            <Grid container spacing={2}>
                                {orderDetails.orderItems.map((item) => {
                                    const product = cart.find((p) => p.ID === item.productID); // Match by ID
                                    return (
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
                                                    backgroundColor: "#ffffff", // White background to match Cart/Products
                                                    borderRadius: "10px",
                                                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                                                }}
                                            >
                                                <CardMedia
                                                    component="img"
                                                    height="200"
                                                    image={`http://localhost:3000/uploads/${product?.image || "placeholder.jpg"}`}
                                                    alt={product?.name || "Unknown Product"}
                                                    sx={{
                                                        objectFit: "contain",
                                                        width: "100%",
                                                        borderRadius: "10px 10px 0 0",
                                                        backgroundColor: "#ffffff",
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
                                                        variant="body1"
                                                        sx={{ color: "#000", fontWeight: "bold" }} // Black text
                                                    >
                                                        {product?.name || "Unknown Product"}
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ color: "#000" }}>
                                                        Quantity: {item.quantity}
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ color: "#000" }}>
                                                        Price: ${Number(item.price || 0).toFixed(2)}
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    );
                                })}
                            </Grid>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        onClick={() => handlePayment(orderID, orderDetails.totalAmount)}
                        sx={{
                            backgroundColor: "#574be8", // Dark purple
                            "&:hover": {
                                backgroundColor: "#3e3ab3", // Darker purple
                            },
                        }}
                    >
                        Pay
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={() => setDialogOpen(false)}
                        sx={{
                            borderColor: "#574be8", // Dark purple border
                            color: "#574be8", // Dark purple text
                            "&:hover": {
                                backgroundColor: "#e1dee5", // Light gray background
                            },
                        }}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}