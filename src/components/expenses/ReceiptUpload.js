import React, { useState } from "react";
import { Form, ProgressBar, Alert } from "react-bootstrap";
import { storage } from "../../services/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const ReceiptUpload = ({ onUpload, expenseId }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "application/pdf",
    ];
    if (!validTypes.includes(file.type)) {
      setError("Please upload an image (JPG, PNG, GIF) or PDF file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size should be less than 5MB");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const storageRef = ref(storage, `receipts/${expenseId}/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);
        },
        (error) => {
          setError("Error uploading file. Please try again.");
          setUploading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          onUpload(downloadURL);
          setUploading(false);
        }
      );
    } catch (err) {
      setError("Error uploading file. Please try again.");
      setUploading(false);
    }
  };

  return (
    <Form.Group>
      <Form.Label>Upload Receipt</Form.Label>
      <Form.Control
        type="file"
        onChange={handleFileUpload}
        accept="image/*, application/pdf"
        disabled={uploading}
      />
      {error && (
        <Alert variant="danger" className="mt-2">
          {error}
        </Alert>
      )}
      {uploading && <ProgressBar now={progress} className="mt-2" />}
      <Form.Text className="text-muted">
        Max file size: 5MB. Supported formats: JPG, PNG, GIF, PDF
      </Form.Text>
    </Form.Group>
  );
};

export default ReceiptUpload;
