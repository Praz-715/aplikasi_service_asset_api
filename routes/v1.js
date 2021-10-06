const express = require('express')
const router = express.Router();
const auth = require("../middleware/auth");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

// importing user model
require("../config/database").connect();
const User = require("../model/user");

router.get("/", auth, (req, res) => {
    res.json({ berhasil: true })
});

router.post("/register", async(req, res) => {

    // Our register logic starts here
    try {
        // Get user input
        const { nama, email, password, divisi, jabatan } = req.body;

        // Validate user input
        if (!(nama && email && password && divisi && jabatan)) {
            res.status(400).send("nama, email, password, divisi, jabatan harus diisi");
        }

        // check if user already exist
        // Validate if user exist in our database
        const oldUser = await User.findOne({ email });

        if (oldUser) {
            return res.status(409).send("User Telah Tersedia. Silahkan Login");
        }

        //Encrypt user password
        encryptedPassword = await bcrypt.hash(password, 10);

        // Create user in our database
        const user = await User.create({
            nama,
            email: email.toLowerCase(), // sanitize: convert email to lowercase
            password: encryptedPassword,
            divisi,
            jabatan,
        });

        // Create token
        const token = jwt.sign({ user_id: user._id, email },
            process.env.TOKEN_KEY, {
                expiresIn: "2h",
            }
        );
        // save user token
        user.token = token;

        // return new user
        res.status(201).json({ message: `Welcome ${user.jabatan}`, token });
    } catch (err) {
        console.log(err);
    }
    // Our register logic ends here
});


router.post("/login", async(req, res) => {

    // Our login logic starts here
    try {
        // Get user input
        const { email, password } = req.body;

        // Validate user input
        if (!(email && password)) {
            res.status(400).send("All input is required");
        }
        // Validate if user exist in our database
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            // Create token
            const token = jwt.sign({ user_id: user._id, email },
                process.env.TOKEN_KEY, {
                    expiresIn: "2h",
                }
            );

            // save user token
            user.token = token;

            // user
            res.status(200).json({ message: `Welcome ${user.jabatan}`, token });
        }
        res.status(400).send("Invalid Credentials").end();
    } catch (err) {
        console.log(err);
    }
    // Our register logic ends here
});

module.exports = router;