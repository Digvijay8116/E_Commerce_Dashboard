const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "https://e-comm-front-two.vercel.app", //just give the local host:3000 not the complete path
    method: ["GET", "POST", "PUT", "DELETE"],
  },
});

const path = require("path");
const cors = require("cors");
require("./db/config");
const User = require("./db/User");
const Product = require("./db/product");
const Messages = require("./db/messages");
const otpMail = require("./nodemailer");
const Jwt = require("jsonwebtoken");
const jwtKey = "e-com";
const otp = require("./otpgenerate");

app.use(express.json());
app.use(cors());

// // swagger
const swaggerJSdoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "E-Comm",
      version: "1.0.0",
    },
    servers: [
      {
        // url: "http://localhost:9002",
        url: "https://digvijay-m1back.mobiloitte.io",
      },
    ],
  },
  apis: ["./index.js"],
};

const swaggerSpec = swaggerJSdoc(options);
app.use("/api", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

//// /loginotp
/**
 * @swagger
 * /loginotp:
 *   post:
 *     summary: Send OTP for update password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *     responses:
 *       '200':
 *         description: OTP sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: OTP sent successfully
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Please provide an email
 *       '404':
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: No user found with this email
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */

//this api is used to send otp in the bacend and update that otp in the backend
app.post("/loginotp", async (req, res) => {
  // console.log(req.body);
  try {
    const { email } = req.body;
    if (email) {
      let user = await User.findOne({ email });
      if (user) {
        otpMail();
        res
          .status(200)
          .json({ success: true, message: "OTP sent successfully" });
        let result = await User.updateOne(
          { email: req.body.email },
          {
            $set: { otp: otp },
          }
        );
      } else {
        res
          .status(404)
          .json({ success: false, message: "No user found with this email" });
      }
    } else {
      res
        .status(400)
        .json({ success: false, message: "Please provide an email" });
    }
  } catch (error) {
    console.error("Error in generating OTP:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

//swagger
// // /profile/:email
/**
 * @swagger
 * /profile/{email}:
 *   get:
 *     summary: Get user profile by email
 *     description: Retrieve user profile details based on the provided email address.
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         description: Email address of the user whose profile is to be retrieved.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User profile successfully retrieved.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User with the provided email not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Server error occurred.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Server error
 */

//this api is used to send data of profile in  the backend
app.get("/profile/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email }).select(
      "-password"
    );

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// swagger
// ///verifyotp/:email
/**
 * @swagger
 * /verifyotp/{email}:
 *   put:
 *     summary: Verify OTP for login
 *     description: Verify the OTP sent to the provided email address for login authentication.
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         description: Email address of the user to verify OTP.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               otp:
 *                 type: string
 *                 description: The one-time password (OTP) to verify.
 *                 example: 123456
 *     responses:
 *       200:
 *         description: OTP successfully verified.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: string
 *                   example: OTP matched
 *                 value:
 *                   type: boolean
 *                   example: true
 *       404:
 *         description: User not found with the provided email.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Internal server error occurred.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */

//this api is used to verify otp at the backend
app.put("/verifyotp/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    if (user.otp === req.body.otp) {
      return res.send({ result: "OTP matched", value: true });
    } else {
      return res.send({ result: "OTP did not match", value: false });
    }
  } catch (error) {
    console.error("Error while verifying OTP:", error);
    return res.status(500).send({ error: "Internal server error" });
  }
});

// //swagger
// /updatepassword/:email
/**
 * @swagger
 * /updatepassword/{email}:
 *   put:
 *     summary: Update user password
 *     description: Update the password for the user identified by the provided email address.
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         description: Email address of the user whose password is to be updated.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 description: The new password for the user.
 *                 example: newPassword123
 *     responses:
 *       200:
 *         description: Password updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: string
 *                   example: Password updated
 *       404:
 *         description: User not found with the provided email.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Internal server error occurred.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */

//this api is used to update password in the backend
app.put("/updatepassword/:email", async (req, res) => {
  try {
    const result = await User.updateOne(
      { email: req.params.email },
      { $set: req.body }
    );

    if (result.matchedCount > 0) {
      return res.send({ result: "Password updated" });
    } else {
      return res.send({ result: "Password did not update" });
    }
  } catch (error) {
    console.error("Error while updating password:", error);
    return res.status(500).send({ error: "Internal server error" });
  }
});

// // swagger
// // /register
/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     description: Register a new user with the provided name, email, password, latitude, and longitude.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the user.
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address of the user.
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 description: The password of the user.
 *                 example: Password123
 *               lat:
 *                 type: number
 *                 format: float
 *                 description: The latitude of the user's location.
 *                 example: 51.509865
 *               long:
 *                 type: number
 *                 format: float
 *                 description: The longitude of the user's location.
 *                 example: -0.118092
 *     responses:
 *       200:
 *         description: User registered successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   $ref: '#/components/schemas/User'
 *                 auth:
 *                   type: string
 *                   description: JWT token for authentication.
 *       400:
 *         description: Bad request. Missing or invalid parameters provided.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: string
 *                   example: Please provide name
 *       409:
 *         description: Conflict. User already exists with the provided email.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: string
 *                   example: User already exists
 *       500:
 *         description: Internal server error occurred.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: string
 *                   example: Internal server error
 */

//this api is used to register a new user in the data base
app.post("/register", async (req, res) => {
  try {
    const { name, email, password, lat, long } = req.body;

    if (!name) {
      return res.status(400).send({ result: "Please provide name" });
    } else if (!email) {
      return res.status(400).send({ result: "Please provide email" });
    } else if (!password) {
      return res.status(400).send({ result: "Please provide password" });
    } else if (!lat) {
      return res.status(400).send({ result: "Please provide latitude" });
    } else if (!long) {
      return res.status(400).send({ result: "Please provide longitude" });
    } else {
      let user = await User.findOne({ email });

      if (user) {
        return res.status(400).send({ result: "User already exists" });
      } else {
        let newUser = new User({
          name: name,
          email: email,
          password: password,
          location: {
            coordinates: [lat, long],
          },
        });

        let result = await newUser.save();
        result = result.toObject();
        delete result.password;

        Jwt.sign({ result }, jwtKey, { expiresIn: "2h" }, (err, token) => {
          if (err) {
            return res.status(500).send({
              result: "Something went wrong. Please try again later",
            });
          }
          return res.send({ result, auth: token });
        });
      }
    }
  } catch (error) {
    console.error("Error while registering user:", error);
    return res.status(500).send({ result: "Internal server error" });
  }
});

// swagger
// // /login
/**
 * @swagger
 * /login:
 *   post:
 *     summary: User login
 *     description: Authenticate user with email and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address of the user.
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 description: The password of the user.
 *                 example: Password123
 *     responses:
 *       200:
 *         description: User authenticated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 auth:
 *                   type: string
 *                   description: JWT token for authentication.
 *       400:
 *         description: Bad request. Missing or invalid parameters provided.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: string
 *                   example: Please provide an email
 *       401:
 *         description: Unauthorized. Incorrect email or password.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: string
 *                   example: Password did not match
 *       404:
 *         description: User not found. Sign up first.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: string
 *                   example: No user found. Sign up first
 *       500:
 *         description: Internal server error occurred.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: string
 *                   example: Something went wrong. Please try again later
 */

//this api is  used for login authentication
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).send({ result: "Please provide an email" }); // Status 400: Bad Request
    }

    let user = await User.findOne({ email });

    if (user) {
      if (!password) {
        return res.status(400).send({ result: "Please provide a password" }); // Status 400: Bad Request
      }

      if (user.password === password) {
        Jwt.sign({ user }, jwtKey, { expiresIn: "2h" }, (err, token) => {
          if (err) {
            return res.status(500).send({
              result: "Something went wrong. Please try again later",
            }); // Status 500: Internal Server Error
          }
          return res.status(200).send({ user, auth: token }); // Status 200: OK
        });
      } else {
        return res.status(401).send({ result: "Password did not match" }); // Status 401: Unauthorized
      }
    } else {
      return res.status(404).send({ result: "No user found. Sign up first" }); // Status 404: Not Found
    }
  } catch (error) {
    console.error("Error during login:", error);
    return res
      .status(500)
      .send({ result: "Something went wrong. Please try again later" }); // Status 500: Internal Server Error
  }
});

// swagger
// // /add-product

//this api is used to add products in the data base
app.post("/add-product", verifyToken, async (req, res) => {
  try {
    const { name, price, category, company, userId } = req.body;
    if (!name) {
      res.send({ result: "provide Product name" });
    } else if (!price) {
      res.send({ result: "provide price" });
    } else if (!category) {
      res.send({ result: "provide category" });
    } else if (!company) {
      res.send({ result: "provide company" });
    } else if (!userId) {
      res.send({ result: "provide your userId" });
    } else if (userId) {
      try {
        let user = await User.findOne({ _id: userId });
        // console.log(user);
        const product = new Product({ name, price, category, company, userId });
        const result = await product.save();
        res.status(201).send(result);
      } catch (error) {
        res.send({ result: "not a valid user" });
      }
    }
  } catch (error) {
    console.error("Error while adding product:", error);
    res.status(500).send({ result: "Internal server error" });
  }
});

//this api is  used to display all the products in the frontend
// Route to fetch all products
app.get("/products", verifyToken, async (req, res) => {
  try {
    const products = await Product.find({});

    if (products.length > 0) {
      res.status(200).send(products);
    } else {
      res.status(404).send({ result: "No products found" });
    }
  } catch (error) {
    console.error("Error while fetching products:", error);
    res.status(500).send({ result: "Internal server error" });
  }
});

// this api is used to delete a product from the backend
app.delete("/product/:id", verifyToken, async (req, res) => {
  try {
    const result = await Product.deleteOne({ _id: req.params.id });

    if (result.deletedCount > 0) {
      res.status(200).send({ result: "Product deleted successfully" }); // Status 200: OK
    } else {
      res.status(404).send({ result: "No product found with the provided ID" }); // Status 404: Not Found
    }
  } catch (error) {
    console.error("Error while deleting product:", error);
    res.status(500).send({ result: "Internal server error" }); // Status 500: Internal Server Error
  }
});

//this api is used to find the product based on the id
app.get("/product/:id", verifyToken, async (req, res) => {
  try {
    const result = await Product.findOne({ _id: req.params.id });

    if (result) {
      res.status(200).send(result); // Status 200: OK
    } else {
      res.status(404).send({ result: "No product found with the provided ID" }); // Status 404: Not Found
    }
  } catch (error) {
    console.error("Error while fetching product:", error);
    res.status(500).send({ result: "Internal server error" }); // Status 500: Internal Server Error
  }
});

//this api is used to update the product based on the id
app.put("/product/:id", verifyToken, async (req, res) => {
  try {
    const result = await Product.updateOne(
      { _id: req.params.id },
      { $set: req.body }
    );

    if (result) {
      res.status(200).send({ result: "Product updated successfully" }); // Status 200: OK
    } else {
      res.status(404).send({ result: "No product found with the provided ID" }); // Status 404: Not Found
    }
  } catch (error) {
    console.error("Error while updating product:", error);
    res.status(500).send({ result: "Internal server error" }); // Status 500: Internal Server Error
  }
});

//this api is used to search data in the backend and send that data
app.get("/search/:key", verifyToken, async (req, res) => {
  try {
    const result = await Product.find({
      $or: [
        { name: { $regex: req.params.key, $options: "i" } }, // Case-insensitive search
        { company: { $regex: req.params.key, $options: "i" } },
        { category: { $regex: req.params.key, $options: "i" } },
      ],
    });

    if (result.length > 0) {
      res.status(200).send(result); // Status 200: OK
    } else {
      res
        .status(404)
        .send({ result: "No products found matching the search key" }); // Status 404: Not Found
    }
  } catch (error) {
    console.error("Error while searching products:", error);
    res.status(500).send({ result: "Internal server error" }); // Status 500: Internal Server Error
  }
});

//this function is used jwt verification token
function verifyToken(req, res, next) {
  // let token = req.headers["authorization"];
  let token = req.headers.jwt;
  if (token) {
    // token = token.split(" ")[1];
    // console.log("Middleware called", token);
    Jwt.verify(token, jwtKey, (err, valid) => {
      if (err) {
        res.status(401).send({ result: "please provide valid token" });
      } else {
        next();
      }
    });
  } else {
    res.status(403).send({ result: "please add token with header" });
  }
}

// app.listen(4000, () => {
//   console.log("i am on the port number 4000");
// });
// this api is used to check that user is present or not in the backend

// Route to fetch chats by user ID
app.get("/chats/:id", async (req, res) => {
  try {
    const result = await User.find({ _id: req.params.id });

    if (result.length > 0 && result[0].name) {
      res.status(200).send({ result }); // Status 200: OK
    } else {
      res.status(404).send({ result: "No user found with the provided ID" }); // Status 404: Not Found
    }
  } catch (error) {
    console.error("Error while fetching chats:", error);
    res.status(500).send({ result: 0 }); // Status 500: Internal Server Error
  }
});

//find all users
app.get("/alluser/:id", async (req, res) => {
  try {
    const result = await User.find({ _id: { $ne: req.params.id } });

    res.status(200).send(result); // Status 200: OK
  } catch (error) {
    console.error("Error while fetching users:", error);
    res.status(500).send({ result: "Internal server error" }); // Status 500: Internal Server Error
  }
});
// all socket related code are present below this
io.on("connection", (socket) => {
  console.log(`user connected ${socket.id}`);

  socket.on("message", (msg) => {
    const message = new Messages({
      sender: msg.sender,
      receiver: msg.receiver,
      message: msg.message,
      img: msg.image,
    });

    message
      .save()
      .then(() => {
        console.log("message saved");
        socket.broadcast.emit("message", msg); // this code will broadcast to all user
        // io.to(msg.receiver).emit('message',msg)
        console.log("msg is ", msg);
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

// Route to fetch users within 3km radius based on provided latitude and longitude
app.put("/3kmUser", async (req, res) => {
  try {
    let { lat, long } = req.body;
    lat = parseFloat(lat);
    long = parseFloat(long);

    let result = await User.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [long, lat], // MongoDB expects coordinates in [longitude, latitude] format
          },
          $maxDistance: 3000, // Maximum distance in meters (3km)
        },
      },
    });

    res.status(200).send(result); // Status 200: OK
  } catch (error) {
    console.error("Error while fetching users:", error);
    res.status(500).send({ result: "Internal server error" }); // Status 500: Internal Server Error
  }
});
app.get("/",(req,res)=>{
  res.send("Hello")
})
server.listen(9002, () => {
  console.log("I am on at the port 9002");
});
