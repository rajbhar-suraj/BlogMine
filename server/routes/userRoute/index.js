const express = require('express')
const { registerUser, loginUser, middleWare, logoutUser, updateUserProfile } = require('../../controllers/userController')
const User = require('../../models/usermodel')

const router = express.Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/me', middleWare, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password')
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({ message: 'user not found' })
    }
})
router.post('/logout',logoutUser)
router.put('/userprofile/:id',middleWare,updateUserProfile)

module.exports = router