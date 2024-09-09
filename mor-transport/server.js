const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const cors = require('cors');
const multer = require('multer');


const app = express(); // Initialize app before using it
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));


const port = 4000;
const JWT_SECRET = 'your_jwt_secret'; 



const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'Punjab123',
  database: 'testing',
  debug: true,
  connectionLimit: 10, // Set the maximum number of connections in the pool
  waitForConnections: true, // Wait for connections instead of throwing an error when the pool is full
  queueLimit: 0, // No limit on the number of queued connection requests
  connectTimeout: 60000,
};


const pool = mysql.createPool(dbConfig);

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
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        const [rows] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);
        const user = rows[0];

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
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
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
  
    try {
      const [rows] = await pool.execute('SELECT * FROM owner_account WHERE username = ?', [username]);
      const user = rows[0];
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
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


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

app.get('/booking', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'booking.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});

app.get('/account', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'account.html'));
});

app.get('/comment', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'comment.html'));
});

app.get('/owner', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'onwer.html'));
});

app.get('/user', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'user.html'));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
