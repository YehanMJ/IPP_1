import { useEffect, useState } from "react";
import {
    Box,
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
} from "@mui/material";
import instance from "../../service/AxiosOrder";

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [orderDetails, setOrderDetails] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    // Fetch all orders
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await instance.get("/orders/");
                const sortedOrders = response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); // Sort by date
                setOrders(sortedOrders); // Set the sorted orders
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

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
                setDialogOpen(true); // Open the popup
            })
            .catch((error) => {
                console.error("Error fetching order details:", error);
                alert("Failed to fetch order details. Please try again later.");
            });
    };
    if (loading) {
        return <Typography>Loading orders...</Typography>;
    }

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" sx={{ marginBottom: 3, color: "#00000", fontWeight: "bold" }}>
                Orders
            </Typography>
            {orders.length > 0 ? (
                <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2, overflow: "hidden" }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: "#000" /* Black */ }}>
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
                                            "&:nth-of-type(odd)": { backgroundColor: "#fff" }, // White
                                            "&:nth-of-type(even)": { backgroundColor: "#f5f5f5" }, // Light gray for contrast
                                            "&:hover": { backgroundColor: "#e0e0e0" }, // Slightly darker on hover
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
                                                    backgroundColor: "#000", // Black
                                                    color: "#fff",
                                                    fontWeight: "bold",
                                                    "&:hover": {
                                                        backgroundColor: "#333",
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
                <Typography variant="body1" sx={{ textAlign: "center", color: "#673ab7" }}>
                    No orders available.
                </Typography>
            )}

            {/* Order Details Popup */}
            <Dialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                maxWidth="md"
                fullWidth
                height="80vh"
                sx={{
                    "& .MuiDialog-paper": {
                        backgroundColor: "#ffffff", // White background
                        borderRadius: "10px",
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                        padding: 2,
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        backgroundColor: "#000", // Black background
                        borderRadius: "10px 10px 0 0",
                        color: "white",
                        fontWeight: "bold",
                        textAlign: "center",
                        marginBottom: 2,
                    }}
                >
                    Order Details
                </DialogTitle>
                <DialogContent>
                    {orderDetails.length > 0 ? (
                        <Grid container spacing={3} sx={{ marginTop: 2 }}>
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
                                            backgroundColor: "#fff", // White background
                                            borderRadius: "10px",
                                            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                                            border: "1px solid #000", // Optional: black border for contrast
                                        }}
                                    >
                                        <CardMedia
                                            component="img"
                                            height="200"
                                            image={
                                                item.product && item.product.image
                                                    ? `http://localhost:3000/uploads/${item.product.image}`
                                                    : "http://localhost:3000/uploads/placeholder.jpg"
                                            }
                                            alt={item.product && item.product.name ? item.product.name : "Unknown Product"}
                                            sx={{
                                                objectFit: "contain",
                                                width: "100%",
                                                borderRadius: "10px 10px 0 0",
                                                backgroundColor: "#fff",
                                                borderBottom: "1px solid #000", // Optional: black line under image
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
                                                sx={{
                                                    fontWeight: "bold",
                                                    color: "#000", // Black text
                                                    textAlign: "center",
                                                }}
                                            >
                                                {item.product && item.product.name ? item.product.name : "Unknown Product"}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: "#000",
                                                    textAlign: "center",
                                                }}
                                            >
                                                Quantity: {item.quantity || "N/A"}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: "#000",
                                                    textAlign: "center",
                                                }}
                                            >
                                                Price: ${item.price ? Number(item.price).toFixed(2) : "0.00"}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    ) : (
                        <Typography
                            variant="body1"
                            sx={{
                                textAlign: "center",
                                color: "#000",
                            }}
                        >
                            No details available for this order.
                        </Typography>
                    )}
                </DialogContent>
            </Dialog>
        </Box>
    );
}