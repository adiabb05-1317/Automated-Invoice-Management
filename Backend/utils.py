from werkzeug.utils import secure_filename
import PyPDF2
import PIL.Image
import google.generativeai as genai
import os
import csv
import pandas as pd
import json

def extract_text_from_csv(csv_path):
    extracted_text = ""
    with open(csv_path, 'r') as csv_file:
        reader = csv.reader(csv_file)
        for row in reader:
            extracted_text += ", ".join(row) + "\n"
    return extracted_text
# Helper: Extract text from PDF
def extract_text_from_pdf(pdf_path):
    with open(pdf_path, 'rb') as pdf_file:
        pdf_reader = PyPDF2.PdfReader(pdf_file)
        extracted_text = ""
        for page in pdf_reader.pages:
            text = page.extract_text()
            if text:
                extracted_text += text
        return extracted_text
    
#helper to exract text from excel file        
def extract_text_from_excel(excel_path):
    extracted_text = ""
    try:
        df = pd.read_excel(excel_path, engine='openpyxl')
        extracted_text = df.to_csv(index=False)
    except Exception as e:
        print(f"Error reading Excel file: {e}")
    return extracted_text    

# Helper: Convert image to Base64
def convert_image_to_base64(image_path):
    with open(image_path, 'rb') as img_file:
        return base64.b64encode(img_file.read()).decode('utf-8')
