# services/detector.py
from ultralytics import YOLO
import cv2
import cvzone
import numpy as np
import config 

class VehicleDetector:
    def __init__(self):
        self.model = YOLO(config.MODEL_PATH)
        self.class_names = config.CLASS_NAMES

    def detect_frame(self, img, mask=None):
        # Apply mask if provided
        img_region = cv2.bitwise_and(img, mask) if mask is not None else img
        
        results = self.model(img_region, stream=True)
        detections = np.empty((0, 5))
        temp_labels = []

        for r in results:
            boxes = r.boxes
            for box in boxes:
                # Extract Box Data
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                conf = int(box.conf[0] * 100)
                cls_id = int(box.cls[0])
                label = self.class_names[cls_id]

                # Filter: Only Vehicles with high confidence
                if conf > config.CONFIDENCE_THRESHOLD and label in config.DB_LABEL_MAP.keys():
                    
                    # Draw visual debug info
                    cv2.rectangle(img, (x1, y1), (x2, y2), (255, 0, 0), 2)
                    cvzone.putTextRect(img, f'{label} {conf}%', (max(0, x1), max(35, y1)), 
                                     scale=1, thickness=2, offset=3)

                    # Prepare for Tracker
                    current_array = np.array([x1, y1, x2, y2, conf/100])
                    detections = np.vstack((detections, current_array))
                    
                    # Store label mapping
                    temp_labels.append(((x1, y1, x2, y2), label))
        
        return detections, temp_labels