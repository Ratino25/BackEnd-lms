import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js'
import TranscationModel from '../models/transactionModel.js'

export const signUpAction = async (req, res) => {

    const midtransUrl = process.env.MIDTRANS_URL
    const midtransAuthString = process.env.MIDTRANS_AUTH_STRING

    try {
        const body = req.body

        const hashPassword = bcrypt.hashSync(body.password, 12)

        const user = new userModel({
            name: body.name,
            email: body.email,
            photo: 'default.png',
            password: hashPassword,
            role: 'manager'
        })

        // action payment gateway midtrans

        const transaction = new TranscationModel({
            user: user._id,
            price: 280000
        })

        const midtrans = await fetch(midtransUrl, {
            method: 'POST',
            body: JSON.stringify({
                transaction_details: {
                    order_id: transaction._id.toString(),
                    gross_amount: transaction.price
                },
                credit_card: {
                    secure: true
                },
                customer_details: {
                    email: user.email
                },
                callbacks: {
                    finish: 'http://localhost:5173/success-checkout'
                }
                
            }),
            headers: {
                'Content-type': 'application/json',
                Authorization: `Basic ${midtransAuthString}`                
            }
        })

        const resMidtrans = await midtrans.json()
        
        await user.save()
        await transaction.save()

        return res.json({
            message: 'Sign Up Success',
            data: {
                midtrans_payment_url: resMidtrans.redirect_url
            }
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Internal server error'
        })
    }
}