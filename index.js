import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectToDb } from "./utils/db.utils.js";
import authRoutes from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js";
import adminRoutes from "./routes/admin.route.js";
import orderRoutes from "./routes/order.route.js";
import fakestoreRoutes from "./routes/fakestore.route.js";
import wishlistRoutes from "./routes/wishlist.route.js";
import cartRoutes from "./routes/cart.route.js";
import cookieParser from "cookie-parser";
import path from 'path';
import methodOverride from 'method-override';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

connectToDb();

app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'views'));

const corsOptions = {
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
}

app.use(cookieParser());

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.use("/api/auth", authRoutes);
app.use("/api/product", productRoutes);
app.use("/admin", adminRoutes);
app.use("/api/addproducts", fakestoreRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);

app.get('/', (req, res) => {
    res.render('default');
});


app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;