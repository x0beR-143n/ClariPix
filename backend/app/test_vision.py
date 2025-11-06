from app.vision_client import check_image

url = "https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png"
result = check_image(url)
print(result)
