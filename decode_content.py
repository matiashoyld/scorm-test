import base64
import json
import re

# Read the und.js file
with open('scormcontent/locales/und.js', 'r', encoding='utf-8') as file:
    content = file.read()

# Extract the base64 string using regex
# Looking for content between __resolveJsonp("course:und"," and ")
pattern = r'__resolveJsonp\("course:und","(.+?)"\)'
match = re.search(pattern, content)

if match:
    encoded_str = match.group(1)
    
    # Decode base64
    decoded_bytes = base64.b64decode(encoded_str)
    decoded_str = decoded_bytes.decode('utf-8')
    
    # Parse JSON
    course_content = json.loads(decoded_str)
    
    # Save to a JSON file with nice formatting
    with open('course_content.json', 'w', encoding='utf-8') as outfile:
        json.dump(course_content, outfile, indent=2, ensure_ascii=False)
    
    print("Content has been saved to course_content.json")
else:
    print("Could not find encoded content in und.js")