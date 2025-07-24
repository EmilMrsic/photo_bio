import React, { useState } from 'react';
import { useRouter } from 'next/router';

export default function UploadBrainMap() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    age: '',
    symptoms: ''
  });
  const router = useRouter();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedFile) {
      // Handle error: file not selected
      alert('Please upload a PDF Brain Map.');
      return;
    }

    // Additional form data processing logic here, if necessary
    // Send data to backend or process it as needed
    // Mockup processing logic
    const protocolRecommendation = 'Protocol A'; // Mockup decision-making process

    alert(`Recommended Protocol: ${protocolRecommendation}`);

    // Redirect or update UI as needed
    router.push('/dashboard');
  };

  return (
    <div className="upload-page">
      <h1>Upload Brain Map or Fill Questionnaire</h1>
      <form onSubmit={handleSubmit} className="upload-form">
        <div className="file-upload">
          <label htmlFor="file-upload">Upload PDF Brain Map:</label>
          <input type="file" id="file-upload" accept="application/pdf" onChange={handleFileChange} />
        </div>

        <div className="questionnaire">
          <label htmlFor="age">Age:</label>
          <input type="text" id="age" name="age" value={formData.age} onChange={handleInputChange} />

          <label htmlFor="symptoms">Symptoms:</label>
          <input type="text" id="symptoms" name="symptoms" value={formData.symptoms} onChange={handleInputChange} />
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

