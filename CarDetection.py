from ultralytics import YOLO
import cv2
import cvzone
import torch
from sort import *
from datetime import datetime
import csv 
import os
from pymongo import MongoClient
import requests

client = MongoClient("mongodb://localhost:27017/")
db = client["CarDetection"]
collection = db["CarDetection"]

USE_LIVE = False 
CAMERA_SOURCE = 0  

cap = cv2.VideoCapture(CAMERA_SOURCE if USE_LIVE else "./Cars.mp4")
cap.set(3,640)
cap.set(4,480)

model = YOLO("./Yolo_Weights/yolov8n.pt")

classNames = ['person', 'bicycle', 'car', 'motorcycle', 'airplane', 'bus', 'train',
    'truck', 'boat', 'traffic light', 'fire hydrant', 'stop sign', 'parking meter', 'bench',
    'bird', 'cat', 'dog', 'horse', 'sheep', 'cow', 'elephant', 'bear', 'zebra', 'giraffe',
    'backpack', 'umbrella', 'handbag', 'tie', 'suitcase', 'frisbee', 'skis', 'snowboard',
    'sports ball', 'kite', 'baseball bat', 'baseball glove', 'skateboard', 'surfboard',
    'tennis racket', 'bottle', 'wine glass', 'cup', 'fork', 'knife', 'spoon', 'bowl',
    'banana', 'apple', 'sandwich', 'orange', 'broccoli', 'carrot', 'hot dog', 'pizza',
    'donut', 'cake', 'chair', 'couch', 'potted plant', 'bed', 'dining table', 'toilet',
    'tv', 'laptop', 'mouse', 'remote', 'keyboard', 'cell phone', 'microwave', 'oven',
    'toaster', 'sink', 'refrigerator', 'book', 'clock', 'vase', 'scissors', 'teddy bear',
    'hair drier', 'toothbrush'
]

mask = cv2.imread("mask.png")


tracker = Sort(max_age=20, min_hits=2, iou_threshold=0.3)

countedIDs = set()
id_to_label = {}
totalCount = 0


while True:
    success, img = cap.read()
    if not success:
        break
    
    img = cv2.resize(img, (mask.shape[1], mask.shape[0]))
    imgRegion = cv2.bitwise_and(img,mask)
    results = model(imgRegion, stream=True)
    detections = np.empty((0, 5))
    temp_labels = []
    for r in results:
        boxes = r.boxes
        for box in boxes:
            #Bounding Box
            x1,y1,x2,y2 = box.xyxy[0]
            x1,y1,x2,y2 = int(x1),int(y1),int(x2),int(y2)
            conf = (int(box.conf*100))
            cls = int(box.cls[0])
            label = classNames[cls]
            if conf > 40 and label in ['car', 'bus', 'truck', 'motorcycle']:
                cv2.rectangle(img, (x1, y1), (x2, y2), (255, 0, 0), 2)
                cvzone.putTextRect(img, f'{label}', (max(0, x1), max(35, y1)), scale=1, thickness=2, offset=3)

                currentArray = np.array([x1,y1,x2,y2,conf/100])
                detections = np.vstack((detections, currentArray))
                temp_labels.append(((x1, y1, x2, y2), label ))


    resultTracker = tracker.update(detections)

    cvzone.putTextRect(img, f'Total Count:{totalCount}', (10,20), scale=1, thickness=2, offset=3, colorR=(255, 0, 255))

    for result in resultTracker:
        x1, y1, x2, y2, Id = map(int, result)
        cx, cy = (x1 + x2) // 2, (y1 + y2) // 2
        cv2.circle(img, (cx, cy), 5, (0, 0, 255), cv2.FILLED)
        
        if Id not in id_to_label:
            for((bx1, by1, bx2, by2), lbl) in temp_labels:
                if abs(bx1-x1)<20 and abs(by1-y1)<20:
                    id_to_label[Id] = lbl
                    break
        
        if 100 < cx < 580 and 265 < cy < 275:
            if Id not in countedIDs:
                totalCount += 1
                countedIDs.add(Id)
                label = id_to_label.get(Id, 'Unknown')
                
                data = {
                    'vehicle_type': label,
                    'timestamp': datetime.now().isoformat(),
                    'location': "Location A"
                }
                try:
                    response = requests.post('http://localhost:5000/api/log', json=data)
                    if response.status_code == 201:
                        print('Log entry sent successfully')
                    else:
                        print('Failed to send log:', response.text)
                except Exception as e:
                    print('Error sending log:', str(e))

        cvzone.putTextRect(img, f'ID:{Id}', (x1, y1 - 20), scale=1, thickness=2, offset=3, colorR=(0, 255, 0))
    
    cv2.line(img, (100, 270), (580, 270), (0, 255, 255), 2)
    cv2.imshow("Image",img)
    key = cv2.waitKey(1)  # waits indefinitely for a key press
    if key == ord('q'):  # press 'q' to quit
        break
