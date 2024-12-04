from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
from werkzeug.utils import secure_filename
import PyPDF2
import PIL.Image
import google.generativeai as genai
import os
import csv
import pandas as pd
import json
from utils import extract_text_from_csv, extract_text_from_pdf, extract_text_from_excel, convert_image_to_base64

# Configure Flask and Gemini API
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = '/tmp'
CORS(app, resources={r"/*": {"origins": "*"}})
genai.configure(api_key='AIzaSyDWVGsgZDRLGhg-hEG031TAeuIzS0UQQE8')


# Route: Upload and process files
@app.route('/invoice/upload', methods=['POST'])
def upload_files():
    try:
        if 'files[]' not in request.files:
            return jsonify({'error': 'No file part'}), 400

        uploaded_files = request.files.getlist('files[]')
        prompts = []
        files_to_process = []

        for file in uploaded_files:
          
            filename = secure_filename(file.filename)
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(file_path)

            # extracting text from different file types based on input
            if filename.lower().endswith('.pdf'):
                 extracted_text = extract_text_from_pdf(file_path)
                 files_to_process.append(extracted_text)
            elif filename.lower().endswith('.csv'):
                 extracted_text = extract_text_from_csv(file_path)  
                 files_to_process.append(extracted_text)
            elif filename.lower().endswith(('.xls', '.xlsx')):
                  extracted_text = extract_text_from_excel(file_path)
                  files_to_process.append(extracted_text)   
            elif filename.lower().endswith(('.jpg', '.jpeg', '.png')):  
                 img_obj=PIL.Image.open(file_path)         
                 files_to_process.append(img_obj)
            else:
                return jsonify({'error': f'Unsupported file type: {filename}'}), 400     
 
 
        prompt = """
            Analyze the provided files and extract structured data. Return the response strictly as a JSON array of objects in the following format, replacing any missing data with null:
            [
                {
                    "id": null,
                    "serialNumber": null,
                    "customerName": null,
                    "phone": null,
                    "totalPurchases": null,
                    "productName": null,
                    "quantity": null,
                    "unitPrice": null,
                    "priceWithTax": null,
                    "discount": null,
                    "tax": null,
                    "totalAmount": null,
                    "date": null
                }
            ]
            Guidelines:
            - Read from all files sent in the request (images, PDFs, CSV, Excel).
            - Each object represents a unique invoice, customer, or product from the input files.
            - Calculate `totalPurchases` for each customer as the sum of `totalAmount` for all their products.
            - Set any missing field explicitly to `null`.
            - Exclude extra charges or unrelated data (e.g., service charges).
            - Ensure accuracy in quantity, unit price, tax, and total amount calculations.
            - Re-check the response before sending.
            - Return an empty array `[]` if no valid data is found.
            - Dont return duplicate data which has same product name and only return if it has same customer name and etc.
            - Please get all details and all products and dont repeate anything be careful with the data.
        """

        
        #appending all files to the request along with the prompt
        model = genai.GenerativeModel(model_name="gemini-1.5-pro")
        files_to_process.insert(0,prompt)
        response = model.generate_content(
          files_to_process,
        )
        clean_response = response.text.strip("```json").strip("```")
        try:
            parsed_response = json.loads(clean_response)
        except json.JSONDecodeError:
            return jsonify({'error': 'Invalid JSON format in Gemini API response'}), 500
        for item in parsed_response:
           try:
             unit_price = item.get('unitPrice', 0)
             quantity = item.get('quantity', 0)
             tax = item.get('tax', 0)
             if unit_price and quantity:
              price_with_tax = round(unit_price * quantity * (1 + tax / 100), 2)
              item['priceWithTax'] = price_with_tax
           except Exception as e:
                print(f"Error calculating price with tax: {e}")
                item['priceWithTax'] = None   

        print("Gemini API Response:", response.text)
        return parsed_response, 200


    except Exception as e:
       
        print("Error occurred:", str(e))
        return jsonify({"error": "An error occurred while processing the files", "details": str(e)}), 500



if __name__ == '__main__':
        app.run(host='0.0.0.0', port=8000, debug=True)
