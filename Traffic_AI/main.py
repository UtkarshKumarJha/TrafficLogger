import cv2
import cvzone
import numpy as np
from sort import Sort
import config
from services.detector import VehicleDetector
from services.logger import TrafficLogger
from services.tracker import VehicleTracker

def main():
    # Configure Video Capture
    cap = cv2.VideoCapture(config.CAMERA_ID if config.USE_LIVE_CAMERA else config.VIDEO_PATH)
    cap.set(3, 640) 
    cap.set(4, 480)
    
    mask = cv2.imread(config.MASK_PATH)
    if mask is None:
        print("Error: Mask image not found!")
        return

    # Initialize Modules
    detector = VehicleDetector()
    tracker = VehicleTracker()
    
    total_count = 0

    # Main Loop
    while True:
        success, img = cap.read()
        if not success:
            print("Video ended or failed to read.")
            break

        # Resize img 
        img = cv2.resize(img, (mask.shape[1], mask.shape[0]))

        # Detector
        detections, temp_labels = detector.detect_frame(img, mask)
        
        # Tracker
        total_count = tracker.track_vehicles(img, detections, temp_labels)
        
        # Display Total Count
        cvzone.putTextRect(img, f'Total: {total_count}', (10, 30), 
                         scale=1, thickness=2, colorR=(255, 0, 255))

        cv2.imshow("Traffic AI", img)
        if cv2.waitKey(1) == ord('q'):
            break
    
    cap.release()
    cv2.destroyAllWindows()
    return total_count

if __name__ == "__main__":
    total_count = main()
    print(total_count)