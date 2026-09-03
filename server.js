const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ডিফল্ট প্রোডাক্ট
let dresses = [
  { id: 1, name: 'Floral Summer Dress', price: 1299, size: 'M', image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400' },
  { id: 2, name: 'Elegant Evening Gown', price: 2499, size: 'L', image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400' }
];

let orders = [];

// শপ পেজের জন্য প্রোডাক্ট API
app.get('/api/dresses', (req, res) => {
  res.json(dresses);
});

// অ্যাডমিন লগইন API (এখানে আপনার ইউজারনেম ও পাসওয়ার্ড সেট করা আছে)
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  // ইউজারনেম: admin, পাসওয়ার্ড: spybotz123 (আপনি চাইলে নিচের কোড থেকে বদলাতে পারেন)
  if (username === 'admin' && password === 'spybotz123') {
    res.json({ success: true, message: 'Login successful' });
  } else {
    res.json({ success: false, message: 'Invalid Username or Password!' });
  }
});

// নতুন প্রোডাক্ট যোগ করার API
app.post('/api/admin/add-dress', (req, res) => {
  const { name, price, size, image } = req.body;
  const newDress = {
    id: Date.now(),
    name,
    price: Number(price),
    size,
    image
  };
  dresses.push(newDress);
  res.json({ success: true, message: 'Product added successfully!' });
});

// অর্ডার প্লেস করার API
app.post('/api/order', (req, res) => {
  const { dressId, name, phone, address, paymentMethod } = req.body;
  const selectedDress = dresses.find(d => d.id == dressId);

  if (!selectedDress) {
    return res.status(400).json({ success: false, message: 'Invalid product selected!' });
  }

  const newOrder = {
    orderId: Date.now(),
    dressName: selectedDress.name,
    price: selectedDress.price,
    customerName: name,
    phone,
    address,
    paymentMethod,
    date: new Date().toLocaleString()
  };

  orders.push(newOrder);
  res.json({ success: true, message: `Order placed! Order ID: ${newOrder.orderId}` });
});

// অর্ডার দেখার API
app.get('/api/admin/orders', (req, res) => {
  res.json(orders);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
