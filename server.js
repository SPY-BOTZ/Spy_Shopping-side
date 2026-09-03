const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ডিফল্ট কিছু ড্রেস
let dresses = [
  { id: 1, name: 'Floral Summer Dress', price: 1299, size: 'M', image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400' },
  { id: 2, name: 'Elegant Evening Gown', price: 2499, size: 'L', image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400' }
];

let orders = [];

// প্রোডাক্ট দেখার API
app.get('/api/dresses', (req, res) => {
  res.json(dresses);
});

// অ্যাডমিন প্যানেল থেকে নতুন প্রোডাক্ট (ছবি ও দাম সহ) যোগ করার API
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

// অর্ডারের ডাটা দেখার API
app.get('/api/admin/orders', (req, res) => {
  res.json(orders);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
