from google.cloud import vision
from app.moderation import moderate_image
import os
"""
import json
import boto3
def get_gcp_credentials_from_secret():
    sm = boto3.client("secretsmanager", region_name="ap-southeast-1")
    secret_arn = os.getenv("GCP_SECRET_ARN")
    secret = sm.get_secret_value(SecretId=secret_arn)
    return json.loads(secret["SecretString"])

creds = get_gcp_credentials_from_secret()
client = vision.ImageAnnotatorClient.from_service_account_info(creds)
"""
client = vision.ImageAnnotatorClient.from_service_account_json("keys/gcp_service_account.json")

def analyze_image(image_url: str):
    """
    Gọi Vision API và trả về đối tượng SafeSearchAnnotation.
    """
    image = vision.Image()
    image.source.image_uri = image_url
    response = client.safe_search_detection(image=image)

    if response.error.message:
        raise RuntimeError(f"Vision API error: {response.error.message}")

    return response.safe_search_annotation


def check_image(image_url: str):
    """
    Hàm kết hợp analyze_image + moderate_image
    """
    safe = analyze_image(image_url)
    decision = moderate_image(safe)
    return {
        "adult": safe.adult,
        "violence": safe.violence,
        "racy": safe.racy,
        "status": decision["status"],
        "reason": decision["reason"]
    }
