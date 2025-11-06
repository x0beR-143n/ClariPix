def moderate_image(safe):
    
    # Ngưỡng vi phạm: từ 'LIKELY' trở lên (tức >= 4)
    THRESHOLD = 4

    if safe.adult >= THRESHOLD:
        return {"status": "quarantined", "reason": "adult"}
    if safe.violence >= THRESHOLD:
        return {"status": "quarantined", "reason": "violence"}
    if safe.racy >= THRESHOLD:
        return {"status": "quarantined", "reason": "racy"}

    return {"status": "approved", "reason": "safe"}
