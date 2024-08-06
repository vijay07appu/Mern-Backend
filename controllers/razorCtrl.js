import Razorpay from 'razorpay';
import crypto from 'crypto';

const razorpay = new Razorpay({

    key_id: 'rzp_test_gFmZy0XkxZ46RI', // Replace with your Razorpay key
    key_secret: '5NiYRCEZFb0zE7YhnXHUGkdk' // Replace with your Razorpay secret
});



export const razorCtrl={

    createorder:async (req, res) => {
        try {
            const { amount } = req.body; // Amount in paise
    
            const order = await razorpay.orders.create({
                amount,
                currency: 'INR',
                receipt: crypto.randomBytes(16).toString('hex')
            });
    
            res.json({
                orderId: order.id,
                amount: order.amount
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}