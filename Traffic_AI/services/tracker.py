import cv2
import numpy as np
from sort import Sort
from services.logger import TrafficLogger

class VehicleTracker:
    def __init__(self):
        self.tracker = Sort(max_age=20, min_hits=2, iou_threshold=0.3)
        self.counted_ids = set()
        self.id_to_label = {}
        self.total_count = 0
    def track_vehicles(self, img, detections, temp_labels):
        
        logger = TrafficLogger()
        track_results = self.tracker.update(detections)
        line_height = 270
        cv2.line(img, (100, line_height), (580, line_height), (0, 255, 255), 2)

        for result in track_results:
            x1, y1, x2, y2, obj_id = map(int, result)
            cx, cy = (x1 + x2) // 2, (y1 + y2) // 2
            
            cv2.circle(img, (cx, cy), 5, (0, 0, 255), cv2.FILLED)

            if obj_id not in self.id_to_label:
                for ((bx1, by1, bx2, by2), lbl) in temp_labels:
                    if bx1 < cx < bx2 and by1 < cy < by2:
                        self.id_to_label[obj_id] = lbl
                        break
            
            if 100 < cx < 580 and (line_height - 10) < cy < (line_height + 10):
                if obj_id not in self.counted_ids:
                    self.total_count += 1
                    self.counted_ids.add(obj_id)
                    
                    # logging the vehicle
                    label = self.id_to_label.get(obj_id, 'car')
                    logger.log_vehicle(label)
                    
        return self.total_count
