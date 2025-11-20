// Demo product data and render logic
const API_BASE = 'http://127.0.0.1:5000';

window.demoProducts = [
  {name:'Wireless Headphones', price:6640, image:'https://images.unsplash.com/photo-1580894908361-2d4b2c9f6b7f?auto=format&fit=crop&w=800&q=60'},
  {name:'Smart Watch', price:12367, image:'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=800&q=60'},
  {name:'Gaming Mouse', price:3278, image:'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=60'},
  {name:'Portable Speaker', price:4977, image:'https://images.unsplash.com/photo-1585386959984-a4155226aa40?auto=format&fit=crop&w=800&q=60'},
  {name:'Coffee Mug', price:996, image:'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=60'},
];

async function fetchProducts(){
  try {
    const res = await fetch(`${API_BASE}/api/products`);
    const data = await res.json();
    return data;
  } catch (err) {
    // Fallback to demo + localStorage if backend unavailable
    return getDemoProducts();
  }
}

async function renderProducts(){
  const list = await fetchProducts();
  const container = document.getElementById('products');
  const status = document.getElementById('products-status');
  
  console.log('renderProducts called, fetched', list ? list.length : 0, 'products');
  
  if (!container) {
    console.error('products container not found');
    return;
  }
  
  container.innerHTML = '';
  if (status) status.textContent = `Found ${list ? list.length : 0} products.`;
  
  if (!list || !list.length) {
    container.innerHTML = '<p class="muted">No products available right now.</p>';
    if (status) status.textContent = 'No products available.';
    return;
  }
  
  list.forEach((p, idx) => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${p.image || 'https://via.placeholder.com/400'}" alt="${p.name}" />
      <div class="p-body">
        <h4>${p.name}</h4>
        <div class="price">₹${parseInt(p.price).toLocaleString('en-IN')}</div>
        <div style="margin-top:10px">
          <button class="btn buy-btn" data-idx="${idx}">Buy</button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });

  // add listeners
  container.querySelectorAll('.buy-btn').forEach(btn => {
    btn.addEventListener('click', function(){
      const idx = parseInt(this.dataset.idx);
      const product = list[idx];
      // add to cart
      addToCart(product);
      // tiny animation feedback
      this.textContent = 'Added';
      this.disabled = true;
      setTimeout(()=>{ this.textContent = 'Buy'; this.disabled = false }, 900);
    });
  });
  
  console.log('renderProducts complete, rendered', list.length, 'cards');
}

window.renderProducts = renderProducts;
