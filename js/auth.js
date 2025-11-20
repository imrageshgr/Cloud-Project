// Front-end auth: tries backend API first, falls back to localStorage if backend unavailable
const API_BASE = 'http://127.0.0.1:5000';

function _getUsers(){
  return JSON.parse(localStorage.getItem('users') || '[]');
}
function _saveUsers(u){ localStorage.setItem('users', JSON.stringify(u)); }

async function auth_register({name, email, password}){
  try {
    const res = await fetch(`${API_BASE}/api/register`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({name, email, password})
    });
    const data = await res.json();
    if (data.success) {
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      return {success:true, user:data.user};
    } else {
      return {success:false, message:data.message};
    }
  } catch (err) {
    // Fallback to localStorage if backend is down
    const users = _getUsers();
    if (users.find(u=>u.email===email)) return {success:false, message:'Email already registered'};
    const user = {id:Date.now(), name, email, password};
    users.push(user);
    _saveUsers(users);
    localStorage.setItem('currentUser', JSON.stringify(user));
    return {success:true, user};
  }
}

async function auth_login(email, password){
  try {
    const res = await fetch(`${API_BASE}/api/login`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({email, password})
    });
    const data = await res.json();
    if (data.success) {
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      return true;
    } else {
      return false;
    }
  } catch (err) {
    // Fallback to localStorage if backend is down
    const users = _getUsers();
    const u = users.find(x=>x.email===email && x.password===password);
    if (!u) return false;
    localStorage.setItem('currentUser', JSON.stringify(u));
    return true;
  }
}

function auth_logout(){
  localStorage.removeItem('currentUser');
  // preserve cart but redirect to login
  window.location.href = 'login.html';
}

function auth_checkAuth(){
  return !!localStorage.getItem('currentUser');
}

function auth_getCurrent(){
  return JSON.parse(localStorage.getItem('currentUser') || 'null');
}

// Expose for pages
window.auth_register = auth_register;
window.auth_login = auth_login;
window.auth_logout = auth_logout;
window.auth_checkAuth = auth_checkAuth;
window.auth_getCurrent = auth_getCurrent;
