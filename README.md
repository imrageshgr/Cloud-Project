# Online Retail Store using Cloud Services (Demo)

This is a frontend demo project titled "Online Retail Store using Cloud Services." It simulates user registration/login, buying products, adding products for sale, and a cart counter — all implemented on the front-end using HTML/CSS/JavaScript and `localStorage` for persistence. No real cloud services or payments are integrated.

Try it locally by opening the HTML files in a browser (no backend required).

**Folder structure**

- `index.html` — Home page after login; quick actions and welcome.
- `login.html` — Login page with front-end validation.
- `register.html` — Registration page with front-end validation.
- `buy.html` — Browse demo products and click "Buy" to add to the cart.
- `sell.html` — Add a demo product via a form (front-end only) and see it appear.
- `cart.html` — View cart items and remove them.
- `css/styles.css` — Main stylesheet for the site (responsive, animations).
- `js/auth.js` — Authentication helpers: register, login, logout, guard pages.
- `js/app.js` — App-wide helpers: cart operations, navbar updates.
- `js/products.js` — Demo product data and rendering logic for `buy.html`.

Notes:
- This is a demo only — DO NOT use this for production authentication or payment processing.
- Data is persisted in `localStorage` for a simple session-like feel.

If you want, I can add a minimal Flask or Node backend to simulate server authentication and persistence. Ask and I'll scaffold it.
