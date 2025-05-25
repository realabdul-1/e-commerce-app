from pathlib import Path
from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
import os
from dotenv import load_dotenv

# Load environment variables from .env file
env_path = Path('.') / '.env'
load_dotenv(dotenv_path=env_path)

app = Flask(__name__)
CORS(app)

def get_db_connection():
    return psycopg2.connect(
        host=os.environ.get("DB_HOST"),
        database=os.environ.get("DB_NAME"),
        user=os.environ.get("DB_USER"),
        password=os.environ.get("DB_PASS"),
        port=os.environ.get("DB_PORT", 5432),
        sslmode='require'
    )

@app.route('/products/<int:id>', methods=['GET'])
def get_product(id):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT * FROM products WHERE id = %s;', (id,))
    row = cur.fetchone()
    cur.close()
    conn.close()

    if row is None:
        return jsonify({'error': 'Product not found'}), 404

    product = {
        'id': row[0],
        'name': row[1],
        'description': row[2],
        'price': float(row[3]),
        'stock': row[4],
        'image_url': row[5],
        'category': row[6],
        'purchased_count': row[7]
    }
    return jsonify(product)

@app.route('/products', methods=['GET'])
def get_products():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT * FROM products;')
    rows = cur.fetchall()
    cur.close()
    conn.close()

    products = []
    for row in rows:
        products.append({
            'id': row[0],
            'name': row[1],
            'description': row[2],
            'price': float(row[3]),
            'stock': row[4],
            'image_url': row[5],
            'category': row[6],
            'purchased_count': row[7]
        })
    return jsonify(products)

@app.route('/products', methods=['POST'])
def add_product():
    data = request.get_json()
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        'INSERT INTO products (name, description, price, stock, image_url, category, purchased_count) '
        'VALUES (%s, %s, %s, %s, %s, %s, %s)',
        (data['name'], data['description'], data['price'], data['stock'],
         data['image_url'], data.get('category'), data.get('purchased_count', 0))
    )
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'message': 'Product added successfully'}), 201

@app.route('/products/<int:id>', methods=['PUT'])
def update_product(id):
    data = request.get_json()
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        'UPDATE products SET name=%s, description=%s, price=%s, stock=%s, image_url=%s, category=%s, purchased_count=%s '
        'WHERE id=%s',
        (data['name'], data['description'], data['price'], data['stock'],
         data['image_url'], data.get('category'), data.get('purchased_count', 0), id)
    )
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'message': 'Product updated successfully'})

@app.route('/products/<int:id>', methods=['DELETE'])
def delete_product(id):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('DELETE FROM products WHERE id = %s', (id,))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'message': 'Product deleted successfully'})

@app.route('/')
def index():
    return "E-commerce Flask API is running."

if __name__ == '__main__':
    app.run(debug=True)
