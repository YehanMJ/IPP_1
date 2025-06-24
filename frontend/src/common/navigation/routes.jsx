import Cart from "../../page/Cart/Cart";
import MyOrders from "../../page/MyOrders/MyOrders";
import Orders from "../../page/Orders/Orders";
import Products from "../../page/Products/Products";
import ProductsManagement from "../../page/ProductsManagement/ProductsManagement";


const routes = [
    {
        name : 'Products',
        path : '/products',
        component: <Products />
    },
    {
        name : 'Cart',
        path : '/cart',
        component: <Cart/>
    },
    {
        name : 'My Orders',
        path : '/myorders',
        component: <MyOrders />
    },
    {
        name: "Product Management",
        path: "/product-management",
        component: <ProductsManagement />,
        role: "admin", // Restrict to admin
    },
    {
        name: "Orders",
        path: "/orders",
        component: <Orders />,
        role: "admin", // Restrict to admin
    },
    
]

export default routes;