import { useEffect, useState } from "react";
import {
    Box,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    Switch,
} from "@mui/material";
import instance from "../../service/AxiosOrder";
import Swal from "sweetalert2";

export default function ProductsManagement() {
    const [products, setProducts] = useState([]);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [addDialogOpen, setAddDialogOpen] = useState(false); // State for add product dialog
    const [editDialogOpen, setEditDialogOpen] = useState(false); // State for edit product dialog
    const [newProduct, setNewProduct] = useState({
        name: "",
        price: "",
        description: "",
        stock: "",
        category: "",
        image: null,
        Status: 1, // Default status to enabled
    });
    const [selectedProduct, setSelectedProduct] = useState(null); // Track the product being edited

    // Fetch products from the API
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await instance.get("/products/all");
                console.log("Fetched products:", response.data); // Log the fetched products
                setProducts(response.data); // Assuming the API returns an array of products
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false); // Set loading to false after fetching
            }
        };

        fetchProducts();
    }, []);

    const handleAddProduct = async () => {
        const formData = new FormData();
        formData.append("name", newProduct.name);
        formData.append("price", newProduct.price);
        formData.append("description", newProduct.description);
        formData.append("stock", newProduct.stock);
        formData.append("category", newProduct.category);
        formData.append("image", newProduct.image);
        formData.append("Status", newProduct.Status); // Add status to form data

        try {
            await instance.post("/products/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            setAddDialogOpen(false);
            Swal.fire({
                icon: "success",
                title: "Product Added",
                text: "The product has been added successfully!",
                timer: 2000,
                showConfirmButton: false,
            });
            setNewProduct({
                name: "",
                price: "",
                description: "",
                stock: "",
                category: "",
                image: null,
                Status: 1, // Reset status to enabled
            });
            setImagePreview(null);
            // Refresh the product list
            const response = await instance.get("/products/all");
            setProducts(response.data);
        } catch (error) {
            console.error("Error adding product:", error);
            setAddDialogOpen(false); // Close the dialog on error
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to add product. Please try again.",
            });
        }
    };

    const handleEditProduct = async () => {
        const formData = new FormData();
        formData.append("name", newProduct.name);
        formData.append("price", newProduct.price);
        formData.append("description", newProduct.description);
        formData.append("stock", newProduct.stock);
        formData.append("category", newProduct.category);
        formData.append("Status", newProduct.Status); // Add status to form data
        if (newProduct.image) {
            formData.append("image", newProduct.image);
        } else {
            formData.append("image", selectedProduct.image);
        }  // Use existing image if not changed

        try {
            await instance.put(`/products/${selectedProduct.ID}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            setEditDialogOpen(false);
            Swal.fire({
                icon: "success",
                title: "Product Updated",
                text: "The product has been updated successfully!",
                timer: 2000,
                showConfirmButton: false,
            });
            // Close the dialog
            setNewProduct({
                name: "",
                price: "",
                description: "",
                stock: "",
                category: "",
                image: null,
            });
            setImagePreview(null);
            // Refresh the product list
            const response = await instance.get("/products/all");
            setProducts(response.data);
        } catch (error) {
            console.error("Error updating product:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to update product. Please try again.",
            });
        }
    };

    const handleDeleteProduct = async (productId) => {
        console.log("Deleting product with ID:", productId); // Log the product ID being deleted
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await instance.delete(`products/${productId}`);
                    Swal.fire({
                        icon: "success",
                        title: "Deleted!",
                        text: "The product has been deleted.",
                        timer: 2000,
                        showConfirmButton: false,
                    });
                    // Refresh the product list
                    const response = await instance.get("/products/all");
                    setProducts(response.data);
                } catch (error) {
                    console.error("Error deleting product:", error);
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "Failed to delete product. Please try again.",
                    });
                }
            }
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct((prev) => ({
            ...prev,
            [name]: name === "Status" ? (value === "1" ? 1 : 0) : value, // Ensure Status is set as 1 or 0
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setNewProduct((prev) => ({ ...prev, image: file }));

        // Generate a preview URL for the uploaded image
        const reader = new FileReader();
        reader.onload = () => {
            setImagePreview(reader.result); // Set the preview URL
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const openEditDialog = (product) => {
        setSelectedProduct(product);
        setNewProduct({
            name: product.name,
            price: product.price,
            description: product.description,
            stock: product.stock,
            category: product.category,
            image: product.image, // Reset image for editing
            Status: product.Status,
        });
        setImagePreview(`http://localhost:3000/uploads/${product.image}`); // Set existing image as preview
        setEditDialogOpen(true);
    };

    const handleEnableProduct = async (productId) => {
        try {
            await instance.put(`/products/enable/${productId}`); // Call the enable API
            Swal.fire({
                icon: "success",
                title: "Enabled!",
                text: "The product has been enabled successfully.",
                timer: 2000,
                showConfirmButton: false,
            });
            // Refresh the product list
            const response = await instance.get("/products/all");
            setProducts(response.data);
        } catch (error) {
            console.error("Error enabling product:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to enable the product. Please try again.",
            });
        }
    };

    if (loading) {
        return <p>Loading products...</p>; // Show a loading message while fetching
    }

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" sx={{ marginBottom: 3, color: "#673ab7", fontWeight: "bold" }}>
                Products Management
            </Typography>
            <Button
                variant="contained"
                sx={{
                    backgroundColor: "#673ab7",
                    color: "white",
                    fontWeight: "bold",
                    marginBottom: 3,
                    "&:hover": {
                        backgroundColor: "#5e35b1",
                    },
                }}
                onClick={() => setAddDialogOpen(true)} // Open the add product dialog
            >
                Add Product
            </Button>
            {/* Enabled Products */}
            <Typography variant="h5" sx={{ marginBottom: 2, color: "#673ab7", fontWeight: "bold" }}>
                Enabled Products
            </Typography>
            <Grid container spacing={10}>
                {products
                    .filter((product) => product.Status === 1) // Filter enabled products
                    .map((product, index) => (
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
                                    minWidth: 400,
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
                                        maxWidth: 400,
                                        height: "100%",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                    }}
                                >
                                    <CardMedia
                                        component="img"
                                        height="200"
                                        image={`http://localhost:3000/uploads/${product.image}`}
                                        alt={product.name}
                                        sx={{
                                            maxWidth: "100%", // Ensure the image fits within the dialog width
                                            maxHeight: "400px", // Limit the height to prevent overflow
                                            objectFit: "contain", // Ensure the full image is shown without cropping
                                            borderRadius: "10px",
                                        }}
                                    />
                                    <CardContent sx={{ flexGrow: 1, textAlign: "center" }}>
                                        <Typography gutterBottom variant="h6" component="div">
                                            {product.name}
                                        </Typography>
                                        {/* <Typography variant="body2" color="text.secondary">
                                            {product.description}
                                        </Typography> */}
                                        <Typography variant="body1" sx={{ marginTop: 1, fontWeight: "bold" }}>
                                            ${product.price}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ marginTop: 1 }}>
                                            Stock: {product.stock || "Out of Stock"}
                                        </Typography>
                                    </CardContent>
                                </Card>

                                {/* Overlay for Admin Actions */}
                                <Box
                                    className="overlay"
                                    sx={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        width: "100%",
                                        height: "100%",
                                        backgroundColor: "rgba(103, 58, 183, 0.8)",
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
                                        sx={{
                                            backgroundColor: "white",
                                            color: "purple",
                                            fontWeight: "bold",
                                            marginBottom: 1,
                                            "&:hover": {
                                                backgroundColor: "lightgray",
                                            },
                                        }}
                                        onClick={() => openEditDialog(product)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="contained"
                                        sx={{
                                            backgroundColor: "white",
                                            color: "purple",
                                            fontWeight: "bold",
                                            "&:hover": {
                                                backgroundColor: "lightgray",
                                            },
                                        }}
                                        onClick={() => handleDeleteProduct(product.ID)}
                                    >
                                        Remove
                                    </Button>
                                </Box>
                            </Box>
                        </Grid>
                    ))}
            </Grid>

            {/* Disabled Products */}
            <Typography variant="h5" sx={{ marginTop: 5, marginBottom: 2, color: "#673ab7", fontWeight: "bold" }}>
                Disabled Products
            </Typography>
            <Grid container spacing={10}>
                {products
                    .filter((product) => product.Status === 0) // Filter disabled products
                    .map((product, index) => (
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
                                        height: "100%",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                    }}
                                >
                                    <CardMedia
                                        component="img"
                                        height="200"
                                        image={`http://localhost:3000/uploads/${product.image}`}
                                        alt={product.name}
                                        sx={{ objectFit: "cover" }}
                                    />
                                    <CardContent sx={{ flexGrow: 1, textAlign: "center" }}>
                                        <Typography gutterBottom variant="h6" component="div">
                                            {product.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {product.description}
                                        </Typography>
                                        <Typography variant="body1" sx={{ marginTop: 1, fontWeight: "bold" }}>
                                            ${product.price}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ marginTop: 1 }}>
                                            Stock: {product.stock || "Out of Stock"}
                                        </Typography>
                                    </CardContent>
                                </Card>

                                {/* Overlay for Admin Actions */}
                                <Box
                                    className="overlay"
                                    sx={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        width: "100%",
                                        height: "100%",
                                        backgroundColor: "rgba(103, 58, 183, 0.8)",
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
                                        sx={{
                                            backgroundColor: "white",
                                            color: "purple",
                                            fontWeight: "bold",
                                            marginBottom: 1,
                                            "&:hover": {
                                                backgroundColor: "lightgray",
                                            },
                                        }}
                                        onClick={() => openEditDialog(product)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="contained"
                                        sx={{
                                            backgroundColor: "white",
                                            color: "purple",
                                            fontWeight: "bold",
                                            "&:hover": {
                                                backgroundColor: "lightgray",
                                            },
                                        }}
                                        onClick={() => handleEnableProduct(product.ID)}
                                    >
                                        Enable
                                    </Button>
                                </Box>
                            </Box>
                        </Grid>
                    ))}
            </Grid>

            <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle
                    sx={{
                        backgroundColor: "#673ab7",
                        color: "white",
                        fontWeight: "bold",
                        textAlign: "center",
                    }}
                >
                    Add Product
                </DialogTitle>
                <DialogContent
                    sx={{
                        marginTop: 2, // Add space between the header and content
                    }}
                >
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 2 }}>
                        <TextField
                            label="Name"
                            name="name"
                            value={newProduct.name}
                            onChange={handleInputChange}
                            fullWidth
                        />
                        <TextField
                            label="Price"
                            name="price"
                            type="number"
                            value={newProduct.price}
                            onChange={handleInputChange}
                            fullWidth
                        />
                        <TextField
                            label="Description"
                            name="description"
                            value={newProduct.description}
                            onChange={handleInputChange}
                            multiline
                            rows={3}
                            fullWidth
                        />
                        <TextField
                            label="Stock"
                            name="stock"
                            type="number"
                            value={newProduct.stock}
                            onChange={handleInputChange}
                            fullWidth
                        />
                        <TextField
                            label="Category"
                            name="category"
                            value={newProduct.category}
                            onChange={handleInputChange}
                            fullWidth
                        />
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <Typography variant="body1" sx={{ color: "#673ab7", fontWeight: "bold" }}>
                                Enable Product
                            </Typography>
                            <Switch
                                checked={newProduct.status === 1}
                                onChange={(e) =>
                                    setNewProduct((prev) => ({
                                        ...prev,
                                        status: e.target.checked ? 1 : 0,
                                    }))
                                }
                            />
                        </Box>
                        <Button
                            variant="contained"
                            component="label"
                            sx={{
                                backgroundColor: "#673ab7",
                                color: "white",
                                fontWeight: "bold",
                                "&:hover": {
                                    backgroundColor: "#5e35b1",
                                },
                            }}
                        >
                            Upload Image
                            <input type="file" hidden onChange={handleImageChange} />
                        </Button>
                        {imagePreview && (
                            <Box
                                sx={{
                                    marginTop: 2,
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    style={{
                                        maxWidth: "100%",
                                        maxHeight: "200px",
                                        borderRadius: "10px",
                                        border: "1px solid #673ab7",
                                    }}
                                />
                            </Box>
                        )}
                        <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
                            <Button
                                variant="contained"
                                sx={{
                                    backgroundColor: "#673ab7",
                                    color: "white",
                                    fontWeight: "bold",
                                    "&:hover": {
                                        backgroundColor: "#5e35b1",
                                    },
                                }}
                                onClick={handleAddProduct}
                            >
                                Submit
                            </Button>
                            <Button
                                variant="outlined"
                                sx={{
                                    borderColor: "#673ab7",
                                    color: "#673ab7",
                                    fontWeight: "bold",
                                    "&:hover": {
                                        backgroundColor: "#ede7f6",
                                    },
                                }}
                                onClick={() => setAddDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                        </Box>
                    </Box>
                </DialogContent>
            </Dialog>

            {/* Edit Product Dialog */}
            <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle
                    sx={{
                        backgroundColor: "#673ab7",
                        color: "white",
                        fontWeight: "bold",
                        textAlign: "center",
                    }}
                >
                    Edit Product
                </DialogTitle>
                <DialogContent
                    sx={{
                        marginTop: 2, // Add space between the header and content
                    }}
                >
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 2 }}>
                        <TextField
                            label="Name"
                            name="name"
                            value={newProduct.name}
                            onChange={handleInputChange}
                            fullWidth
                        />
                        <TextField
                            label="Price"
                            name="price"
                            type="number"
                            value={newProduct.price}
                            onChange={handleInputChange}
                            fullWidth
                        />
                        <TextField
                            label="Description"
                            name="description"
                            value={newProduct.description}
                            onChange={handleInputChange}
                            multiline
                            rows={3}
                            fullWidth
                        />
                        <TextField
                            label="Stock"
                            name="stock"
                            type="number"
                            value={newProduct.stock}
                            onChange={handleInputChange}
                            fullWidth
                        />
                        <TextField
                            label="Category"
                            name="category"
                            value={newProduct.category}
                            onChange={handleInputChange}
                            fullWidth
                        />
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <Typography variant="body1" sx={{ color: "#673ab7", fontWeight: "bold" }}>
                                Enable Product
                            </Typography>
                            <Switch
                                checked={newProduct.Status === 1}
                                onChange={(e) =>
                                    setNewProduct((prev) => ({
                                        ...prev,
                                        Status: e.target.checked ? 1 : 0,
                                    }))
                                }
                            />
                        </Box>
                        <Button
                            variant="contained"
                            component="label"
                            sx={{
                                backgroundColor: "#673ab7",
                                color: "white",
                                fontWeight: "bold",
                                "&:hover": {
                                    backgroundColor: "#5e35b1",
                                },
                            }}
                        >
                            Upload Image
                            <input type="file" hidden onChange={handleImageChange} />
                        </Button>
                        {imagePreview && (
                            <Box
                                sx={{
                                    marginTop: 2,
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    style={{
                                        maxWidth: "100%",
                                        maxHeight: "200px",
                                        borderRadius: "10px",
                                        border: "1px solid #673ab7",
                                    }}
                                />
                            </Box>
                        )}
                        <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
                            <Button
                                variant="contained"
                                sx={{
                                    backgroundColor: "#673ab7",
                                    color: "white",
                                    fontWeight: "bold",
                                    "&:hover": {
                                        backgroundColor: "#5e35b1",
                                    },
                                }}
                                onClick={handleEditProduct}
                            >
                                Save Changes
                            </Button>
                            <Button
                                variant="outlined"
                                sx={{
                                    borderColor: "#673ab7",
                                    color: "#673ab7",
                                    fontWeight: "bold",
                                    "&:hover": {
                                        backgroundColor: "#ede7f6",
                                    },
                                }}
                                onClick={() => setEditDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                        </Box>
                    </Box>
                </DialogContent>
            </Dialog>
        </Box>
    );
}