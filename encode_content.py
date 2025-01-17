import base64
import json

# Read the JSON file
with open('course_content.json', 'r', encoding='utf-8') as file:
    content = json.load(file)

# Convert JSON to string and encode to base64
json_str = json.dumps(content, ensure_ascii=False)
encoded_bytes = base64.b64encode(json_str.encode('utf-8'))
encoded_str = encoded_bytes.decode('utf-8')

# Create the und.js content with the proper wrapper
und_js_content = f'__resolveJsonp("course:und","{encoded_str}")'

# Save to und.js
with open('scormcontent/locales/und.js', 'w', encoding='utf-8') as outfile:
    outfile.write(und_js_content)

print("Content has been encoded and saved to scormcontent/locales/und.js") 