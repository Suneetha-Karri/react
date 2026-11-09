
import './App.css';
import { useState } from 'react';

import electricalImage from '../electrical.jpg';
import plumbingImage from '../plumbing.jpg';
import cleaningImage from '../cleaning.jpg';
import acImage from '../ac-repair.jpg';
import paintingImage from '../painting.jpg';
import carpentryImage from '../carpentry.jpg';

function App() {
  const services = [
    { name: 'Electrical Repair', image: electricalImage, price: '₹299' },
    { name: 'Plumbing', image: plumbingImage, price: '₹249' },
    { name: 'Home Cleaning', image: cleaningImage, price: '₹499' },
    { name: 'AC Repair', image: acImage, price: '₹449' },
    { name: 'Painting', image: paintingImage, price: '₹799' },
    { name: 'Carpentry', image: carpentryImage, price: '₹399' }
  ];

  const slots = [
    '09:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '12:00 PM - 01:00 PM',
    '02:00 PM - 03:00 PM',
    '03:00 PM - 04:00 PM',
    '04:00 PM - 05:00 PM',
    '05:00 PM - 06:00 PM'
  ];

  const today = new Date();
  const minDate =
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const [page, setPage] = useState('home');

  const [users, setUsers] = useState(() =>
    JSON.parse(localStorage.getItem('homeease_users') || '[]')
  );

  const [currentUser, setCurrentUser] = useState(() =>
    JSON.parse(localStorage.getItem('homeease_session') || 'null')
  );

  const [bookings, setBookings] = useState(() =>
    JSON.parse(localStorage.getItem('homeease_bookings') || '[]')
  );

  const [selectedService, setSelectedService] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [message, setMessage] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function goTo(nextPage) {
    setMessage('');
    setPage(nextPage);
  }

  function openBooking(serviceName) {
    setSelectedService(serviceName);
    setSelectedDate('');
    setMessage('');

    if (currentUser) {
      setPage('booking');
    } else {
      setMessage('Please login to book your service.');
      setPage('login');
    }
  }

  function signup(e) {
    e.preventDefault();

    if (users.some(user => user.email.toLowerCase() === email.toLowerCase())) {
      setMessage('Email already registered. Please login.');
      return;
    }

    const newUser = {
      name,
      email,
      password,
      role: 'user'
    };

    const updatedUsers = [...users, newUser];

    setUsers(updatedUsers);
    localStorage.setItem('homeease_users', JSON.stringify(updatedUsers));

    setMessage('Registration successful! Please login.');
    setEmail('');
    setPassword('');
    setName('');
    setPage('login');
  }

  function login(e) {
    e.preventDefault();

    const admin = {
      name: 'Admin',
      email: 'admin@homeease.com',
      password: 'admin123',
      role: 'admin'
    };

    const allUsers = [...users, admin];

    const foundUser = allUsers.find(
      user =>
        user.email.toLowerCase() === email.toLowerCase() &&
        user.password === password
    );

    if (!foundUser) {
      setMessage('Invalid email or password.');
      return;
    }

    setCurrentUser(foundUser);
    localStorage.setItem('homeease_session', JSON.stringify(foundUser));

    setEmail('');
    setPassword('');
    setMessage('');

    if (foundUser.role === 'user' && selectedService) {
      setPage('booking');
    } else {
      setPage('dashboard');
    }
  }

  function logout() {
    localStorage.removeItem('homeease_session');
    setCurrentUser(null);
    setSelectedService('');
    setPage('home');
    setMessage('');
  }

  function confirmBooking(e) {
    e.preventDefault();

    const form = new FormData(e.target);

    const bookingDate = form.get('date');
    const bookingSlot = form.get('slot');

    const alreadyBooked = bookings.some(
      booking =>
        booking.service === selectedService &&
        booking.date === bookingDate &&
        booking.slot === bookingSlot
    );

    if (alreadyBooked) {
      setMessage('Sorry! This slot is already booked. Choose another slot.');
      return;
    }

    const newBooking = {
      id: Date.now(),
      customerName: form.get('customerName'),
      phone: form.get('phone'),
      email: form.get('email'),
      house: form.get('house'),
      street: form.get('street'),
      city: form.get('city'),
      district: form.get('district'),
      state: form.get('state'),
      pincode: form.get('pincode'),
      landmark: form.get('landmark'),
      service: selectedService,
      date: bookingDate,
      slot: bookingSlot,
      instructions: form.get('instructions'),
      status: 'Confirmed'
    };

    const updatedBookings = [...bookings, newBooking];

    setBookings(updatedBookings);
    localStorage.setItem(
      'homeease_bookings',
      JSON.stringify(updatedBookings)
    );

    setMessage('Your booking has been confirmed!');
    setSelectedService('');
    setSelectedDate('');
    setPage('mybookings');
  }

  const availableSlots = slots.filter(slot =>
    !bookings.some(
      booking =>
        booking.service === selectedService &&
        booking.date === selectedDate &&
        booking.slot === slot
    )
  );

  return (
    <div>
      <nav className="navbar">
        <h2 onClick={() => goTo('home')}>🏠 HomeEase</h2>

        <div>
          <button onClick={() => goTo('home')}>Home</button>
          <button onClick={() => goTo('services')}>Services</button>

          {currentUser && currentUser.role === 'user' && (
            <button onClick={() => goTo('mybookings')}>
              My Bookings
            </button>
          )}

          {!currentUser ? (
            <>
              <button onClick={() => goTo('login')}>Login</button>
              <button onClick={() => goTo('signup')}>Sign Up</button>
            </>
          ) : (
            <button onClick={logout}>Logout</button>
          )}
        </div>
      </nav>

      {page === 'home' && (
        <>
          <section className="hero" id="home">
            <h1>Book Professional Home Services</h1>
            <p>Your Trusted Home Services Partner</p>
            <p>Reliable professionals for all your household needs.</p>
            <button className="button" onClick={() => goTo('services')}>
              Explore Services
            </button>
          </section>

          <section className="services" id="services">
            <h2>Our Popular Services</h2>

            <div className="service-grid">
              {services.map(service => (
                <div className="service-card" key={service.name}>
                  <img
                    src={service.image}
                    alt={service.name}
                    className="service-image"
                  />
                  <h3>{service.name}</h3>
                  <p>Starting from {service.price}</p>
                  <button onClick={() => openBooking(service.name)}>
                    Book Now
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="about" id="about">
            <h2>Why Choose HomeEase?</h2>
            <p className="about-description">
              Making your home happier with trusted professionals and
              hassle-free services!
            </p>

            <div className="why-grid">
              <div className="why-card">
                <div className="why-icon">🏆</div>
                <h3>Trusted Professionals</h3>
                <p>Skilled and experienced experts for your home.</p>
              </div>

              <div className="why-card">
                <div className="why-icon">💰</div>
                <h3>Affordable Pricing</h3>
                <p>Quality services at budget-friendly prices.</p>
              </div>

              <div className="why-card">
                <div className="why-icon">⚡</div>
                <h3>Quick Service</h3>
                <p>Fast booking and reliable home assistance.</p>
              </div>

              <div className="why-card">
                <div className="why-icon">❤️</div>
                <h3>Customer Satisfaction</h3>
                <p>Your comfort and happiness are our priority.</p>
              </div>
            </div>
          </section>
        </>
      )}

      {page === 'services' && (
        <section className="services">
          <h2>All Home Services</h2>

          <div className="service-grid">
            {services.map(service => (
              <div className="service-card" key={service.name}>
                <img
                  src={service.image}
                  alt={service.name}
                  className="service-image"
                />
                <h3>{service.name}</h3>
                <p>Starting from {service.price}</p>
                <button onClick={() => openBooking(service.name)}>
                  Book Now
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {page === 'signup' && (
        <section className="auth">
          <h2>Create Account</h2>

          <form onSubmit={signup}>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />

            <button type="submit">Sign Up</button>
          </form>

          <p>{message}</p>
          <p>
            Already have an account?{' '}
            <button onClick={() => goTo('login')}>Login</button>
          </p>
        </section>
      )}

      {page === 'login' && (
        <section className="auth">
          <h2>Welcome Back</h2>

          <form onSubmit={login}>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />

            <button type="submit">Login</button>
          </form>

          <p>{message}</p>
          <p>
            Don't have an account?{' '}
            <button onClick={() => goTo('signup')}>Sign Up</button>
          </p>
        </section>
      )}

      {page === 'booking' && currentUser && currentUser.role === 'user' && (
        <section className="auth booking-form">
          <h2>Book Your Service</h2>
          <h3>{selectedService}</h3>

          <form onSubmit={confirmBooking}>
            <h3>Personal Details</h3>

            <input
              name="customerName"
              placeholder="Full Name"
              defaultValue={currentUser.name}
              required
            />

            <input
              name="phone"
              type="tel"
              placeholder="10-digit Mobile Number"
              pattern="[0-9]{10}"
              title="Enter a valid 10-digit mobile number"
              required
            />

            <input
              name="email"
              type="email"
              placeholder="Email Address"
              defaultValue={currentUser.email}
              required
            />

            <h3>Address Details</h3>

            <input
              name="house"
              placeholder="House / Door Number"
              required
            />

            <input
              name="street"
              placeholder="Street / Area"
              required
            />

            <input
              name="city"
              placeholder="Village / City"
              required
            />

            <input
              name="district"
              placeholder="District"
              required
            />

            <input
              name="state"
              placeholder="State"
              defaultValue="Andhra Pradesh"
              required
            />

            <input
              name="pincode"
              placeholder="6-digit PIN Code"
              pattern="[0-9]{6}"
              title="Enter a valid 6-digit PIN code"
              required
            />

            <input
              name="landmark"
              placeholder="Nearby Landmark"
            />

            <h3>Booking Details</h3>

            <label>Select Date</label>
            <input
              type="date"
              name="date"
              min={minDate}
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              required
            />

            <label>Select Time Slot</label>
            <select name="slot" required defaultValue="">
              <option value="" disabled>
                Choose a time slot
              </option>

              {availableSlots.map(slot => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>

            {selectedDate && availableSlots.length === 0 && (
              <p>All slots are booked for this service on this date.</p>
            )}

            <textarea
              name="instructions"
              placeholder="Additional instructions (optional)"
              rows="4"
            />

            <button type="submit" disabled={!selectedDate || availableSlots.length === 0}>
              Confirm Booking
            </button>
          </form>

          <p>{message}</p>
          <button onClick={() => goTo('services')}>Back to Services</button>
        </section>
      )}

      {page === 'mybookings' && currentUser && (
        <section className="services">
          <h2>My Bookings</h2>

          {bookings.filter(b => b.email === currentUser.email).length === 0 ? (
            <p>You have no bookings yet.</p>
          ) : (
            bookings
              .filter(b => b.email === currentUser.email)
              .map(booking => (
                <div className="service-card booking-card" key={booking.id}>
                  <h3>{booking.service}</h3>
                  <p><b>Booking ID:</b> {booking.id}</p>
                  <p><b>Date:</b> {booking.date}</p>
                  <p><b>Time:</b> {booking.slot}</p>
                  <p><b>Address:</b> {booking.house}, {booking.street}, {booking.city}, {booking.district}, {booking.state} - {booking.pincode}</p>
                  <p><b>Status:</b> {booking.status}</p>
                </div>
              ))
          )}
        </section>
      )}

      {page === 'dashboard' && currentUser && (
        <section className="services">
          <h2>Welcome, {currentUser.name}!</h2>

          {currentUser.role === 'admin' ? (
            <>
              <h3>Admin Dashboard</h3>
              <p>Total Registered Users: {users.length}</p>
              <p>Total Bookings: {bookings.length}</p>

              <h2>Customer Bookings</h2>

              {bookings.length === 0 ? (
                <p>No bookings available.</p>
              ) : (
                bookings.map(booking => (
                  <div className="service-card booking-card" key={booking.id}>
                    <h3>{booking.service}</h3>
                    <p><b>Customer:</b> {booking.customerName}</p>
                    <p><b>Phone:</b> {booking.phone}</p>
                    <p><b>Email:</b> {booking.email}</p>
                    <p><b>Address:</b> {booking.house}, {booking.street}, {booking.city}, {booking.district}, {booking.state} - {booking.pincode}</p>
                    <p><b>Landmark:</b> {booking.landmark || 'Not provided'}</p>
                    <p><b>Date:</b> {booking.date}</p>
                    <p><b>Time:</b> {booking.slot}</p>
                    <p><b>Instructions:</b> {booking.instructions || 'None'}</p>
                    <p><b>Status:</b> {booking.status}</p>
                  </div>
                ))
              )}
            </>
          ) : (
            <>
              <h3>User Dashboard</h3>
              <p>Welcome to your HomeEase account.</p>
              <button onClick={() => goTo('services')}>
                View Services
              </button>
              <button onClick={() => goTo('mybookings')}>
                My Bookings
              </button>
            </>
          )}
        </section>
      )}

      <footer>
        <p>© 2026 HomeEase - Home Services Booking</p>
      </footer>
    </div>
  );
}

export default App;
