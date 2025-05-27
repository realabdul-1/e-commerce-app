from pathlib import Path
from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
import os
import logging
from dotenv import load_dotenv
import pg8000

# Load environment variables
env_path = Path('.') / '.env'
load_dotenv(dotenv_path=env_path)

# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={
    r"/api/*": {
        "origins": [
            "https://e-commerce-app-rouge-three.vercel.app/",
            "http://127.0.0.1:3000", 
            "http://localhost:3000"
        ]
    }
})

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def get_db_connection():
    """Create and return a secure database connection."""
    try:
        conn = pg8000.connect(
        host=os.getenv("DB_HOST"),
        database=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASS"),
        port=int(os.getenv("DB_PORT", 5432)),
        ssl=True,
        timeout=10
    )
        logger.info("Successfully connected to database")
        return conn
    except psycopg2.OperationalError as e:
        logger.error(f"Database connection failed: {str(e)}")
        raise
    except Exception as e:
        logger.error(f"Unexpected connection error: {str(e)}")
        raise

@app.errorhandler(404)
def resource_not_found(e):
    return jsonify(error=str(e)), 404

@app.errorhandler(500)
def internal_server_error(e):
    return jsonify(error="Internal server error"), 500

@app.route('/api/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    """Get single product by ID"""
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    'SELECT * FROM products WHERE id = %s;',
                    (product_id,)
                )
                product = cur.fetchone()
                
                if not product:
                    return jsonify(error="Product not found"), 404
                
                return jsonify({
                    'id': product[0],
                    'name': product[1],
                    'description': product[2],
                    'price': float(product[3]),
                    'stock': product[4],
                    'image_url': product[5],
                    'category': product[6],
                    'purchased_count': product[7]
                })
                
    except Exception as e:
        logger.error(f"Error fetching product {product_id}: {str(e)}")
        return jsonify(error="Failed to retrieve product"), 500

@app.route('/api/products', methods=['GET'])
def get_all_products():
    """Get all products with optional filters"""
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute('SELECT * FROM products;')
                products = [
                    {
                        'id': row[0],
                        'name': row[1],
                        'description': row[2],
                        'price': float(row[3]),
                        'stock': row[4],
                        'image_url': row[5],
                        'category': row[6],
                        'purchased_count': row[7]
                    } for row in cur.fetchall()
                ]
                return jsonify(products)
                
    except Exception as e:
        logger.error(f"Error fetching products: {str(e)}")
        return jsonify(error="Failed to retrieve products"), 500

@app.route('/api/products', methods=['POST'])
def create_product():
    """Create new product"""
    try:
        data = request.get_json()
        required_fields = ['name', 'description', 'price', 'stock']
        
        if not all(field in data for field in required_fields):
            return jsonify(error="Missing required fields"), 400
            
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute('''
                    INSERT INTO products 
                    (name, description, price, stock, image_url, category, purchased_count)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                    RETURNING id;
                ''', (
                    data['name'],
                    data['description'],
                    data['price'],
                    data['stock'],
                    data.get('image_url'),
                    data.get('category'),
                    data.get('purchased_count', 0)
                ))
                product_id = cur.fetchone()[0]
                conn.commit()
                
                return jsonify({
                    'message': 'Product created successfully',
                    'product_id': product_id
                }), 201
                
    except Exception as e:
        logger.error(f"Error creating product: {str(e)}")
        return jsonify(error="Failed to create product"), 500

@app.route('/api/products/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    """Update existing product"""
    try:
        data = request.get_json()
        
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute('''
                    UPDATE products SET
                    name = %s,
                    description = %s,
                    price = %s,
                    stock = %s,
                    image_url = %s,
                    category = %s,
                    purchased_count = %s
                    WHERE id = %s
                ''', (
                    data.get('name'),
                    data.get('description'),
                    data.get('price'),
                    data.get('stock'),
                    data.get('image_url'),
                    data.get('category'),
                    data.get('purchased_count'),
                    product_id
                ))
                
                if cur.rowcount == 0:
                    return jsonify(error="Product not found"), 404
                    
                conn.commit()
                return jsonify(message="Product updated successfully")
                
    except Exception as e:
        logger.error(f"Error updating product {product_id}: {str(e)}")
        return jsonify(error="Failed to update product"), 500

@app.route('/api/products/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    """Delete product"""
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    'DELETE FROM products WHERE id = %s',
                    (product_id,)
                )
                
                if cur.rowcount == 0:
                    return jsonify(error="Product not found"), 404
                    
                conn.commit()
                return jsonify(message="Product deleted successfully")
                
    except Exception as e:
        logger.error(f"Error deleting product {product_id}: {str(e)}")
        return jsonify(error="Failed to delete product"), 500

@app.route('/api/health')
def health_check():
    """Service health check"""
    return jsonify(
        status="OK",
        service="E-commerce API",
        version="1.0.0"
    )

# Vercel serverless compatibility
handler = app
if __name__ == "__main__":
    app.run(debug=True)
