const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const multer = require('multer');
const cookieParser = require('cookie-parser');

require('dotenv').config();

const app = express(); 
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));

const port = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET;


const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  debug: false,
  connectionLimit: 10, 
  waitForConnections: true, 
  queueLimit: 0, 
  connectTimeout: 15000
};

const pool = mysql.createPool(dbConfig);




const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    req.userId = decoded.id;
    req.userType = decoded.type;
    next();
  });
};


const checkAuth = (req, res, next) => {
  const token = req.cookies.token;
  console.log('Token from cookies:', token);

  if (!token) {
    console.log('No token provided, redirecting to login');
    return res.redirect('/account.html');
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Decoded JWT:', decoded);
    req.userId = decoded.id;
    req.userType = decoded.type;
    next();
  } catch (error) {
    console.log('Token verification failed:', error.message);
    res.clearCookie('token');
    return res.redirect('/account.html');
  }
};




const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});



const bookingStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/bookings/');
  },
  filename: function (req, file, cb) {
    cb(null, 'screenshot_' + Date.now() + path.extname(file.originalname));
  }
});




const uploadBookingScreenshot = multer({ storage: bookingStorage });
const upload = multer({ storage: storage });

app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  res.status(200).json({ filePath: `/uploads/${req.file.filename}` });
});





app.post('/api/uploadBookingScreenshot', uploadBookingScreenshot.single('bookingScreenshot'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  res.status(200).json({ filePath: `/uploads/bookings/${req.file.filename}` });
});






app.post('/api/auth/signup', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const [existingUsers] = await pool.execute('SELECT * FROM users WHERE username = ? OR email = ?', [username, email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.execute(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );
    res.status(201).json({ message: 'User created successfully', id: result.insertId });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'An error occurred during signup' });
  }
});



app.post('/api/auth/login', async (req, res) => {
  const { identifier, password } = req.body; // Change from username to identifier

  if (!identifier || !password) {
      return res.status(400).json({ message: 'Username/Email and password are required' });
  }

  try {
      // Use SQL to check for both username and email
      const [rows] = await pool.execute(
          'SELECT * FROM users WHERE username = ? OR email = ?',
          [identifier, identifier] // Check against both fields
      );
      const user = rows[0];

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
          return res.status(400).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign({ id: user.id, type: 'user' }, JWT_SECRET, { expiresIn: '3h' });
      res.cookie('token', token, { httpOnly: true, maxAge: 3 * 60 * 60 * 1000 }); // 3 hours
      res.json({ token, userId: user.id });
  } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'An error occurred during login' });
  }
});




  app.post('/api/auth/ownersignup', async (req, res) => {
    const { username, email, password } = req.body;
  
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
  
    try {
      const [existingUsers] = await pool.execute('SELECT * FROM owner_account WHERE username = ? OR email = ?', [username, email]);
      if (existingUsers.length > 0) {
        return res.status(400).json({ message: 'Username or email already exists' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const [result] = await pool.execute(
        'INSERT INTO owner_account (username, email, password) VALUES (?, ?, ?)',
        [username, email, hashedPassword]
      );
      res.status(201).json({ message: 'User created successfully', id: result.insertId });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ message: 'An error occurred during signup' });
    }
  });
  
  





  app.post('/api/auth/ownerlogin', async (req, res) => {
    const { identifier, password } = req.body; // Change from username to identifier

    if (!identifier || !password) {
        return res.status(400).json({ message: 'Username/Email and password are required' });
    }

    try {
        // Use SQL to check for both username and email
        const [rows] = await pool.execute(
            'SELECT * FROM owner_account WHERE username = ? OR email = ?',
            [identifier, identifier] // Check against both fields
        );
        const user = rows[0];

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, type: 'owner' }, JWT_SECRET, { expiresIn: '3h' });
        res.cookie('token', token, { httpOnly: true, maxAge: 3 * 60 * 60 * 1000 }); // 3 hours
        res.json({ token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'An error occurred during login' });
    }
});


  app.post('/api/bookings', async (req, res) => {
    const { name, email, vehicleName, vehiclePrice, numberOfCars, from, to, days, date, paymentMethod, userId, transferAmount, paymentScreenshot } = req.body;

    try {
        let query = 'INSERT INTO bookings (name, email, vehicle_name, vehicle_price, number_of_cars, trip_from, trip_to, number_of_days, trip_date, payment_method, user_id';
        let values = [name, email, vehicleName, vehiclePrice, numberOfCars, from, to, days, date, paymentMethod, userId];
        
        if (paymentMethod === 'bank') {  
            query += ', transfer_amount, payment_screenshot) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
            values.push(transferAmount, paymentScreenshot);
        } else {
            query += ') VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        }

        const [result] = await pool.execute(query, values);
        res.status(201).json({ message: 'Booking successful', bookingId: result.insertId });
    } catch (error) {
        console.error('Booking error:', error);
        res.status(500).json({ message: 'An error occurred while booking' });
    }
});



app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});



app.get('/userdashboard.html', checkAuth, (req, res) => {
  if (req.userType !== 'user') {
    return res.redirect('/account.html');
  }
  res.sendFile(path.join(__dirname, 'public', 'userdashboard.html'));
});

app.get('/ownerdashboard.html', checkAuth, (req, res) => {
  if (req.userType !== 'owner') {
    return res.redirect('/ownerlogin.html');
  }
  res.sendFile(path.join(__dirname, 'public', 'ownerdashboard.html'));
});









app.get('/api/bookings', async (req, res) => {
  const { userId } = req.query;
  try {
      let query = 'SELECT * FROM bookings';
      const params = [];

      if (userId) {
          query += ' WHERE user_id = ?';
          params.push(userId);
      }

      const [rows] = await pool.execute(query, params);
      res.status(200).json(rows);
  } catch (error) {
      console.error('Error fetching bookings:', error);
      res.status(500).json({ message: 'An error occurred while fetching bookings' });
  }
});


app.post('/api/vehicles', upload.single('vehicleImage'), (req, res) => {
  const { vehicleName, vehiclePrice } = req.body;
  const vehicleImage = req.file ? req.file.filename : null;

  const query = 'INSERT INTO vehicles (vehicle_name, vehicle_price, vehicle_image) VALUES (?, ?, ?)';
  pool.execute(query, [vehicleName, vehiclePrice, vehicleImage], (err, result) => {
    if (err) {
      console.error('Error inserting vehicle:', err);
      res.status(500).json({ error: 'Failed to add vehicle' });
    } else {
      console.log('Vehicle added successfully'); 
      res.status(201).json({ message: 'Vehicle added successfully' });
    }
  });
});




app.get('/api/vehicles', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM vehicles');
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching vehicles:', error);
        res.status(500).json({ message: 'An error occurred while fetching vehicles' });
    }
});

app.put('/api/vehicles/:id', async (req, res) => {
  const { vehicle_price } = req.body; 
  const vehicleId = req.params.id;

  try {
    
      const [existingVehicle] = await pool.execute('SELECT * FROM vehicles WHERE id = ?', [vehicleId]);

      if (existingVehicle.length === 0) {
          return res.status(404).json({ message: 'Vehicle not found' });
      }

      const query = 'UPDATE vehicles SET vehicle_price = ? WHERE id = ?';
      await pool.execute(query, [vehicle_price, vehicleId]);

      res.status(200).json({ message: 'Vehicle updated successfully' });
  } catch (error) {
      console.error('Error updating vehicle:', error);
      res.status(500).json({ message: 'Failed to update vehicle' });
  }
});



app.delete('/api/vehicles/:id', async (req, res) => {
  const { id } = req.params;

  try {
      const [result] = await pool.execute('DELETE FROM vehicles WHERE id = ?', [id]);

      if (result.affectedRows === 0) {
          return res.status(404).json({ message: 'Vehicle not found' });
      }

      res.status(200).json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
      console.error('Error deleting vehicle:', error);
      res.status(500).json({ message: 'An error occurred while deleting the vehicle' });
  }
});

app.use(express.static(path.join(__dirname, 'public')));




app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
