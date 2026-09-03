const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

let dresses = [
  { id: 1, name: 'Floral Summer Dress', price: 1299, originalPrice: 2999, size: 'M,L', image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400', details: 'Premium cotton, summer special', rating: '4.8' },
  { id: 2, name: 'Elegant Evening Gown', price: 2499, originalPrice: 4999, size: 'L,XL', image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400', details: 'Party wear gown', rating: '4.9' }
];

let orders = [];

app.get('/api/dresses', (req, res) => {
  res.json(dresses);
});

app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'spybotz123') {
    res.json({ success: true, message: 'Login successful' });
  } else {
    res.json({ success: false, message: 'Invalid Username or Password!' });
  }
});

app.post('/api/dresses', (req, res) => {
  const { name, price, originalPrice, size, image, details, rating } = req.body;
  const newDress = {
    id: Date.now(),
    name,
    price: Number(price),
    originalPrice: Number(originalPrice) || Math.round(Number(price) * 1.8),
    size,
    image,
    details: details || 'Premium quality dress',
    rating: rating || '4.8'
  };
  dresses.push(newDress);
  res.json({ success: true, message: 'Product added successfully!' });
});

app.post('/api/admin/add-dress', (req, res) => {
  const { name, price, size, image, originalPrice, details, rating } = req.body;
  const newDress = {
    id: Date.now(),
    name,
    price: Number(price),
    originalPrice: Number(originalPrice) || Math.round(Number(price) * 1.8),
    size,
    image,
    details: details || 'Premium quality',
    rating: rating || '4.8'
  };
  dresses.push(newDress);
  res.json({ success: true, message: 'Product added successfully!' });
});

app.delete('/api/dresses/:id', (req, res) => {
  const id = Number(req.params.id);
  dresses = dresses.filter(d => d.id != id);
  res.json({ success: true });
});

app.post('/api/order', (req, res) => {
  const { dressId, name, phone, address, location, paymentMethod, finalPrice } = req.body;
  const selectedDress = dresses.find(d => d.id == dressId);
  if (!selectedDress) {
    return res.status(400).json({ success: false, message: 'Invalid product selected!' });
  }
  const newOrder = {
    id: Date.now(),
    orderId: Date.now(),
    dressId,
    dressName: selectedDress.name,
    price: selectedDress.price,
    finalPrice: finalPrice || selectedDress.price,
    customerName: name,
    name,
    phone,
    address,
    location: location || '',
    paymentMethod,
    date: new Date().toLocaleString(),
    status: 'Order Placed',
    currentLocation: 'Order Received - Processing',
    deliveryDate: 'Updating soon',
    deliveryTime: ''
  };
  orders.push(newOrder);
  res.json({ success: true, message: `Order placed! Order ID: ${newOrder.id}` });
});

app.get('/api/orders', (req, res) => {
  const { phone } = req.query;
  if (phone) {
    const filtered = orders.filter(o => o.phone == phone);
    return res.json(filtered.reverse());
  }
  res.json(orders.reverse());
});

app.get('/api/admin/orders', (req, res) => {
  res.json(orders.reverse());
});

app.put('/api/orders/:id/tracking', (req, res) => {
  const id = Number(req.params.id);
  const { currentLocation, deliveryDate, deliveryTime, status } = req.body;
  let order = orders.find(o => o.id == id);
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
  if (currentLocation !== undefined) order.currentLocation = currentLocation;
  if (deliveryDate !== undefined) order.deliveryDate = deliveryDate;
  if (deliveryTime !== undefined) order.deliveryTime = deliveryTime;
  if (status !== undefined) order.status = status;
  res.json({ success: true, message: 'Tracking updated!', order });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
