import mongoose from 'mongoose';

// Define the CartItem schema (if not already defined)
const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        default: 1,
        min: 1
    }
}, { timestamps: true });

// Define the User schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: Number,
        default: 0
    },
    cart: [cartItemSchema] // Use CartItem schema here
}, {
    timestamps: true
});


userSchema.methods.addToCart = async function(productId, quantity) {

    // console.log("Entered userModel")
    const parsedQuantity = parseInt(quantity, 10);
    const existingCartItemIndex = this.cart.findIndex(item => item.product.toString() === productId);

    if (existingCartItemIndex > -1) {
        // Item already in cart, update quantity
        this.cart[existingCartItemIndex].quantity += parsedQuantity;
    } else {
        // New item, add to cart
        this.cart.push({ product: productId, quantity });
    }

    return this.save();
};

userSchema.methods.removeFromCart = async function(productId) {
    const existingCartItemIndex = this.cart.findIndex(item => item.product.toString() === productId);

    if (existingCartItemIndex > -1) {
        if (this.cart[existingCartItemIndex].quantity > 1) {
            // Decrease quantity by 1
            this.cart[existingCartItemIndex].quantity -= 1;
        } else {
            // Remove item if quantity is 1
            this.cart.splice(existingCartItemIndex, 1);
        }
    }

    return await this.save();
};

// Create and export the User model
const User = mongoose.model('User', userSchema);
export default User;