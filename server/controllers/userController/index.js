const User = require('../../models/usermodel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cookie = require('cookie-parser')

require('dotenv').config()

const registerUser = async (req, res) => {
    const { name, email, password } = req.body
    try {
        const hashed = await bcrypt.hash(password, 10)
        const user = new User({ name, email, password: hashed })
        await user.save()
        res.status(201).json({ message: 'User registered successfully', user: { id: user._id, name: user.name, email: user.email } })
    } catch (error) {
        res.status(400).json({ message: 'not registered...' })
    }
}

const loginUser = async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email })
        if (!user) return res.status(400).json({ message: 'User not found' })

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' })

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' })
        res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'Lax' })

        res.status(201).json({ message: 'User loggedin successfully', user: { id: user._id, name: user.name, email: user.email } })
    } catch (error) {
        res.status(400).json({ message: 'Server 201 error', error: error })
    }
}

const updateUserProfile = async (req, res) => {
    const { name, email, bio } = req.body
    try {
        const id = req.params.id
        const user = await User.findById(id)
        
        if (!user) return res.status(404).json({ message: 'User not found' })

        if (email && email !== user.email) {
            const emailExists = await User.findOne({ email })
            if (emailExists) {
                return res.status(400).json({ message: 'Email already in use' })
            }
            user.email = email
        }

        user.name = name || user.name;
        user.bio = bio || user.bio

        const updatedUser = await user.save();
        res.status(200).json({ message: 'Profile updated', user: updatedUser })

    } catch (error) {
        res.status(500).json({ message: 'Server error' })
    }
}

const middleWare = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(400).json({ message: 'Not authenticated' })
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.userId = decoded.id
        next()
    } catch (error) {
        res.status(400).json({ message: 'token issue', error: { error } })
    }
}


const logoutUser = async (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: true,
        sameSite: 'None'
    }).status(200).json({ message: 'logout successfully' })
}
module.exports = { registerUser, loginUser, middleWare, logoutUser, updateUserProfile }