import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Button,
  Alert,
  ScrollView,
} from 'react-native';
import instance from '../../service/axiosOrder';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [quantityModalVisible, setQuantityModalVisible] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [cartProduct, setCartProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [userDetails, setUserDetails] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchUserDetails();
  }, []);

  const fetchProducts = async () => {
    try {
      // Replace with your token logic if needed
      const response = await instance.get('/products/');
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch products.');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDetails = async () => {
    try {
      const response = await instance.get('/user/users');
      setUserDetails(response.data);
    } catch (error) {
      // Ignore for now
    }
  };

  const handleSearch = (text) => {
    setSearchTerm(text);
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const handleViewDetails = async (product) => {
    setSelectedProduct(product);
    setDetailsModalVisible(true);
    try {
      const response = await instance.get(`/reviews/${product.ID}`);
      setReviews(response.data);
    } catch (error) {
      setReviews([]);
    }
  };

  const handleAddToCartClick = (product) => {
    setCartProduct(product);
    setQuantity(1);
    setQuantityModalVisible(true);
  };

  const handleConfirmAddToCart = () => {
    // Implement your add to cart logic here
    Alert.alert('Added to Cart', `${cartProduct.name} (x${quantity}) has been added to your cart.`);
    setQuantityModalVisible(false);
    setCartProduct(null);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const renderProduct = ({ item }) => (
    <View style={styles.productCard}>
      <Image
        source={{ uri: `http://localhost:3000/uploads/${item.image}` }}
        style={styles.productImage}
        resizeMode="contain"
      />
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productPrice}>${item.price}</Text>
      <Text style={styles.productStock}>Remaining: {item.stock || 'Out of Stock'}</Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleAddToCartClick(item)}
        >
          <Text style={styles.buttonText}>Add to Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleViewDetails(item)}
        >
          <Text style={styles.buttonText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Product List</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search Products"
        value={searchTerm}
        onChangeText={handleSearch}
        placeholderTextColor="#888"
      />
      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.ID?.toString() || item.id?.toString()}
        contentContainerStyle={styles.listContent}
      />

      {/* Quantity Modal */}
      <Modal
        visible={quantityModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setQuantityModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Quantity</Text>
            <Text style={styles.modalProductName}>{cartProduct?.name}</Text>
            <View style={styles.quantityRow}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Text style={styles.quantityButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantityValue}>{quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setQuantity(quantity + 1)}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
            <Button title="Add to Cart" onPress={handleConfirmAddToCart} color="#000" />
            <Button title="Cancel" onPress={() => setQuantityModalVisible(false)} color="#888" />
          </View>
        </View>
      </Modal>

      {/* Product Details Modal */}
      <Modal
        visible={detailsModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setDetailsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <Text style={styles.modalTitle}>Product Details</Text>
            {selectedProduct && (
              <>
                <Image
                  source={{ uri: `http://localhost:3000/uploads/${selectedProduct.image}` }}
                  style={styles.productImageLarge}
                  resizeMode="contain"
                />
                <Text style={styles.productName}>{selectedProduct.name}</Text>
                <Text style={styles.productPrice}>${selectedProduct.price}</Text>
                <Text style={styles.productStock}>Stock: {selectedProduct.stock || 'Out of Stock'}</Text>
                <Text style={styles.productCategory}>Category: {selectedProduct.category || 'N/A'}</Text>
                <Text style={styles.productDescription}>
                  {selectedProduct.description}
                </Text>
                <Text style={styles.reviewsHeader}>Reviews</Text>
                {reviews.length > 0 ? (
                  reviews.map((review, idx) => {
                    const reviewer = userDetails.find((u) => u.ID === review.userID);
                    return (
                      <View key={idx} style={styles.reviewBox}>
                        <Text style={styles.reviewerName}>
                          {reviewer ? reviewer.name : 'Unknown User'}
                        </Text>
                        <Text style={styles.reviewRating}>Rating: {review.rating}</Text>
                        <Text style={styles.reviewComment}>{review.comment}</Text>
                      </View>
                    );
                  })
                ) : (
                  <Text style={styles.noReviews}>No reviews available for this product.</Text>
                )}
              </>
            )}
            <Button title="Close" onPress={() => setDetailsModalVisible(false)} color="#000" />
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 12 },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Courgette-Regular',
    marginBottom: 12,
    color: '#000',
    textAlign: 'center',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 30,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 12,
    color: '#000',
    backgroundColor: '#fff',
  },
  listContent: { paddingBottom: 100 },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  productImage: { width: 120, height: 120, borderRadius: 8, marginBottom: 8 },
  productImageLarge: { width: 220, height: 220, borderRadius: 8, marginBottom: 8, alignSelf: 'center' },
  productName: { fontSize: 18, fontWeight: 'bold', color: '#000', marginBottom: 4 },
  productPrice: { fontSize: 16, color: '#000', marginBottom: 4 },
  productStock: { fontSize: 14, color: '#000', marginBottom: 4 },
  productCategory: { fontSize: 14, color: '#000', marginBottom: 4 },
  productDescription: { fontSize: 14, color: '#000', marginBottom: 8 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  actionButton: {
    backgroundColor: '#000',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 4,
    marginTop: 8,
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: '90%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalProductName: { fontSize: 18, fontWeight: 'bold', color: '#000', marginBottom: 8 },
  quantityRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  quantityButton: {
    backgroundColor: '#eee',
    borderRadius: 20,
    padding: 10,
    marginHorizontal: 10,
  },
  quantityButtonText: { fontSize: 20, color: '#000' },
  quantityValue: { fontSize: 18, fontWeight: 'bold', color: '#000' },
  reviewsHeader: { fontSize: 16, fontWeight: 'bold', color: '#000', marginTop: 16, marginBottom: 8 },
  reviewBox: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    width: '100%',
  },
  reviewerName: { fontWeight: 'bold', color: '#000' },
  reviewRating: { color: '#000' },
  reviewComment: { color: '#000' },
  noReviews: { color: '#888', fontStyle: 'italic', marginBottom: 8 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});