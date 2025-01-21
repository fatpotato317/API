from flask import Flask, request, jsonify, render_template
from supabase import create_client, Client
import random
from decouple import config

app = Flask(__name__)

SUPABASE_URL = config("URL")
SUPABASE_KEY = config("KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Home route to render the documentation
@app.route('/')
def home():
    return render_template('index.html')  

# THESE ARE MY Get requests
@app.route('/<animal>', methods=['GET'])
def get_random_picture(animal):
    if animal not in ['dog', 'cat', 'capybara']:
        return jsonify({"error": "Invalid animal type. Please use 'dog', 'cat', or 'capybara'!"}), 400

    try:
        response = supabase.table(animal).select("*").execute()
        data = response.data
        if not data:
            return jsonify({"error": f"No pictures available for {animal}."}), 404

        random_picture = data[random.randint(0, len(data) - 1)]
        return jsonify({"url": random_picture['url']})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# THESE ARE MY Post requests
@app.route('/add_picture', methods=['POST'])
def add_picture():
    data = request.json
    animal = data.get('animal')
    url = data.get('url')

    if animal not in ['dog', 'cat', 'capybara']:
        return jsonify({"error": "Invalid animal type! Use 'dog', 'cat', or 'capybara'."}), 400
    if not url:
        return jsonify({"error": "Picture URL is missing!"}), 400
    try:
        supabase.table(animal).insert({"url": url}).execute()
        return jsonify({"status": "Thanks for the picture!"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run()  


