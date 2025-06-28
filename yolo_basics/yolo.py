from ultralytics import YOLO

model = YOLO("../../Yolo-Weights/yolov8n.pt")
exported = model.export(format="onnx", opset=12)
print("ONNX file path:", exported)
