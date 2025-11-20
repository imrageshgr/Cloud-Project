import json
import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
USERS_FILE = os.path.join(BASE_DIR, 'users.json')
USER_PRODUCTS_FILE = os.path.join(BASE_DIR, 'user_products.json')
ORDERS_FILE = os.path.join(BASE_DIR, 'orders.json')

app = Flask(__name__, static_folder=os.path.join(BASE_DIR, '..'), static_url_path='')
CORS(app)

DEMO_PRODUCTS = [
    {"name": "Wireless Headphones", "price": 6640, "image": "https://images.unsplash.com/photo-1580894908361-2d4b2c9f6b7f?auto=format&fit=crop&w=800&q=60"},
    {"name": "Smart Watch", "price": 12367, "image": "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=800&q=60"},
    {"name": "Gaming Mouse", "price": 3278, "image": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=60"},
    {"name": "Portable Speaker", "price": 4977, "image": "https://images.unsplash.com/photo-1585386959984-a4155226aa40?auto=format&fit=crop&w=800&q=60"},
    {"name": "Coffee Mug", "price": 996, "image": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=60"},
]

def read_json(path, default):
    try:
        with open(path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        return default
    except Exception:
        return default

def write_json(path, data):
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)

@app.route('/api/products', methods=['GET'])
def api_products():
    users = read_json(USER_PRODUCTS_FILE, [])
    # merge demo + user products (user products appear first)
    return jsonify(users + DEMO_PRODUCTS)

@app.route('/api/user-products', methods=['GET','POST','DELETE'])
def api_user_products():
    if request.method == 'GET':
        return jsonify(read_json(USER_PRODUCTS_FILE, []))
    elif request.method == 'DELETE':
        data = request.get_json() or {}
        idx = data.get('index')
        if idx is None:
            return jsonify({'success': False, 'message': 'index required'}), 400
        lst = read_json(USER_PRODUCTS_FILE, [])
        if 0 <= idx < len(lst):
            lst.pop(idx)
            write_json(USER_PRODUCTS_FILE, lst)
            return jsonify({'success': True})
        return jsonify({'success': False, 'message': 'index out of range'}), 400
    else:  # POST
        data = request.get_json() or {}
        name = data.get('name')
        price = data.get('price')
        image = data.get('image')
        if not name or price is None:
            return jsonify({'success': False, 'message': 'name and price required'}), 400
        lst = read_json(USER_PRODUCTS_FILE, [])
        item = {'name': name, 'price': float(price), 'image': image}
        lst.insert(0, item)
        write_json(USER_PRODUCTS_FILE, lst)
        return jsonify({'success': True, 'item': item})

@app.route('/api/register', methods=['POST'])
def api_register():
    data = request.get_json() or {}
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    if not email or not password:
        return jsonify({'success': False, 'message': 'email and password required'}), 400
    users = read_json(USERS_FILE, [])
    if any(u.get('email') == email for u in users):
        return jsonify({'success': False, 'message': 'Email already registered'}), 400
    user = {'id': int(__import__('time').time()*1000), 'name': name, 'email': email, 'password': password}
    users.append(user)
    write_json(USERS_FILE, users)
    return jsonify({'success': True, 'user': {'id': user['id'], 'name': user['name'], 'email': user['email']}})

@app.route('/api/login', methods=['POST'])
def api_login():
    data = request.get_json() or {}
    email = data.get('email')
    password = data.get('password')
    users = read_json(USERS_FILE, [])
    user = next((u for u in users if u.get('email')==email and u.get('password')==password), None)
    if not user:
        return jsonify({'success': False, 'message': 'Invalid credentials'}), 401
    return jsonify({'success': True, 'user': {'id': user['id'], 'name': user.get('name'), 'email': user.get('email')}})

@app.route('/')
def root_index():
    # serve index.html from project root
    return send_from_directory(app.static_folder, 'login.html')

@app.route('/api/orders', methods=['GET','POST'])
def api_orders():
    if request.method == 'GET':
        return jsonify(read_json(ORDERS_FILE, []))
    else:  # POST - create order from cart
        data = request.get_json() or {}
        items = data.get('items', [])
        if not items:
            return jsonify({'success': False, 'message': 'items required'}), 400
        total = sum(float(item.get('price', 0)) for item in items)
        order = {
            'id': int(__import__('time').time() * 1000),
            'items': items,
            'total': total,
            'timestamp': __import__('datetime').datetime.now().isoformat()
        }
        orders = read_json(ORDERS_FILE, [])
        orders.insert(0, order)
        write_json(ORDERS_FILE, orders)
        return jsonify({'success': True, 'order': order})

if __name__ == '__main__':
    # ensure storage files exist
    if not os.path.exists(USERS_FILE):
        write_json(USERS_FILE, [])
    if not os.path.exists(USER_PRODUCTS_FILE):
        write_json(USER_PRODUCTS_FILE, [])
    if not os.path.exists(ORDERS_FILE):
        write_json(ORDERS_FILE, [])
    print('Starting demo Flask API on http://127.0.0.1:5000')
    app.run(host='127.0.0.1', port=5000, debug=True)
