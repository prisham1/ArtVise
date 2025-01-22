import gradio as gr
import tensorflow as tf
import numpy as np
from PIL import Image

# Load the model
model_path = "model.h5"
model = tf.keras.models.load_model(model_path)

print(tf.keras.__version__)
print(tf.__version__)

# List of categories (classes)
categories = [
    "Academic_Art", "Art_Nouveau", "Baroque", "Expressionism",
    "Japanese_Art", "Neoclassicism", "Primitivism", "Realism",
    "Renaissance", "Rococo", "Romanticism", "Symbolism", "Western_Medieval"
]

def classify_image(image):
    # Preprocess the image
    image = image.resize((256, 256))  # Resize to match model input size
    image = np.array(image) / 255.0   # Normalize the image
    image = np.expand_dims(image, axis=0)  # Add batch dimension

    # Make prediction
    predictions = model.predict(image)
    predicted_class = np.argmax(predictions, axis=1)[0]
    predicted_label = categories[predicted_class]
    
    return f"The image has been classified as: {predicted_label}"

# Create Gradio interface
iface = gr.Interface(
    fn=classify_image,
    inputs=gr.Image(type="pil", label="Upload an image"),
    outputs=gr.Textbox(label="Classification Result"),
    title="Image Style Classifier",
    description="Upload an image to classify its art style",
    live=False
)

# Launch the app
if __name__ == "__main__":
    iface.launch()
