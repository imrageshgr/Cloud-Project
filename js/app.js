// App-level helpers for cart and navbar
function getCartItems(){
  return JSON.parse(localStorage.getItem('cart') || '[]');
}

function saveCart(items){ localStorage.setItem('cart', JSON.stringify(items)); }

function addToCart(product){
  const items = getCartItems();
  items.push(product);
  saveCart(items);
  renderCartBadge();
}

function removeFromCart(idx){
  const items = getCartItems();
  items.splice(idx,1);
  saveCart(items);
}

function clearCart(){ localStorage.removeItem('cart'); }

function renderCartBadge(){
  const count = getCartItems().length;
  document.querySelectorAll('#cart-badge').forEach(e=>e.textContent = count);
}

function getDemoProducts(){
  // merge demo + userProducts
  const demo = (window.demoProducts || []).slice();
  const user = JSON.parse(localStorage.getItem('userProducts') || '[]');
  return demo.concat(user);
}

window.getCartItems = getCartItems;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.clearCart = clearCart;
window.renderCartBadge = renderCartBadge;
window.getDemoProducts = getDemoProducts;
