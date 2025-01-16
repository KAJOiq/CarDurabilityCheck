export default function getCroppedImg(imageSrc, cropper) {
  return new Promise((resolve, reject) => {
    const canvas = cropper.getCroppedCanvas({
      fillColor: '#fff', // Set the background color to white (or any other color)
    });
    if (!canvas) {
      reject(new Error("Canvas is empty"));
      return;
    }

    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Canvas is empty"));
        return;
      }
      resolve(URL.createObjectURL(blob));
    }, "image/jpeg");
  });
}