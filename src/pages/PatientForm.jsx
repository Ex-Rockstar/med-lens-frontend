import React, { useState } from 'react';

function PatientForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    gender: '',
    contactNumber: '',
    email: '',
    symptoms: '',
    symptomDuration: '',
    selfTreatment: '',
    otherMedicalConditions: '',
    otherMedicinesTaken: '',
    recentExposure: '',
    skinChanges: '',
    familyHistory: '',
    triggers: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log('handleChange', name, value); 
    setFormData({
      ...formData,
      [name]: value
    });
  };
  const handleSubmit = (e) => {
    // e.preventDefault();
    console.log('Form submitted');
    // Print formData as JSON in console
    console.log(JSON.stringify(formData, null, 2));
    // Clear the form after submission
    setFormData({
      firstName: '',
      lastName: '',
      age: '',
      gender: '',
      contactNumber: '',
      email: '',
      symptoms: '',
      symptomDuration: '',
      selfTreatment: '',
      otherMedicalConditions: '',
      otherMedicinesTaken: '',
      recentExposure: '',
      skinChanges: '',
      familyHistory: '',
      triggers: ''
    });
  };


  return (
    <div className="bg-yellow-200 p-8 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">MedLens Patient Information Form</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="block mb-4">
          First Name:
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="bg-yellow-50 border-yellow-400 border-solid border-2 rounded-md p-2 w-full mt-1"
          />
        </label>
        <label className="block mb-4">
          Last Name:
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="bg-yellow-50 border-yellow-400 border-solid border-2 rounded-md p-2 w-full mt-1"
          />
        </label>
        <label className="block mb-4">
          Age:
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className="bg-yellow-50 border-yellow-400 border-solid border-2 rounded-md p-2 w-full mt-1"
          />
        </label>
        <label className="block mb-4">
          Gender:
          <select name="gender" value={formData.gender} onChange={handleChange} className="border-yellow-400 border-solid border-2 rounded-md p-2 w-full mt-1 bg-yellow-50">
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </label>
        <label className="block mb-4">
          Phone Number:
          <input
            type="text"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            className="bg-yellow-50 border-yellow-400 border-solid border-2 rounded-md p-2 w-full mt-1"
          />
        </label>
        <label className="block mb-4">
          Mail ID:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="bg-yellow-50 border-yellow-400 border-solid border-2 rounded-md p-2 w-full mt-1"
          />
        </label>
        <label className="block mb-4">
          Symptoms:
          <textarea
            name="symptoms"
            value={formData.symptoms}
            onChange={handleChange}
            className="bg-yellow-50 border-yellow-400 border-solid border-2 rounded-md p-2 w-full mt-1"
          />
        </label>
        <label className="block mb-4">
          Duration of Symptoms (in days):
          <input
            type="number"
            name="symptomDuration"
            value={formData.symptomDuration}
            onChange={handleChange}
            className="bg-yellow-50 border-yellow-400 border-solid border-2 rounded-md p-2 w-full mt-1"
          />
        </label>
        <label className="block mb-4">
          Self Treatment (if any):
          <input
            type="text"
            name="selfTreatment"
            value={formData.selfTreatment}
            onChange={handleChange}
            className="bg-yellow-50 border-yellow-400 border-solid border-2 rounded-md p-2 w-full mt-1"
          />
        </label>
        <label className="block mb-4">
          Other Medical Conditions:
          <textarea
            name="otherMedicalConditions"
            value={formData.otherMedicalConditions}
            onChange={handleChange}
            className="bg-yellow-50 border-yellow-400 border-solid border-2 rounded-md p-2 w-full mt-1"
          />
        </label>
        <label className="block mb-4">
          Other Medicines Taken:
          <textarea
            name="otherMedicinesTaken"
            value={formData.otherMedicinesTaken}
            onChange={handleChange}
            className="bg-yellow-50 border-yellow-400 border-solid border-2 rounded-md p-2 w-full mt-1"
          />
        </label>
        <label className="block mb-4">
          Recent Exposure to Skincare Products, Chemicals, or Environmental Factors:
          <textarea
            name="recentExposure"
            value={formData.recentExposure}
            onChange={handleChange}
            className="bg-yellow-50 border-yellow-400 border-solid border-2 rounded-md p-2 w-full mt-1"
          />
        </label>
        <label className="block mb-4">
          Specific Areas of Skin Concern or Changes:
          <textarea
            name="skinChanges"
            value={formData.skinChanges}
            onChange={handleChange}
            className="bg-yellow-50 border-yellow-400 border-solid border-2 rounded-md p-2 w-full mt-1"
          />
        </label>
        <label className="block mb-4">
          Family History of Skin Conditions:
          <textarea
            name="familyHistory"
            value={formData.familyHistory}
            onChange={handleChange}
            className="bg-yellow-50 border-yellow-400 border-solid border-2 rounded-md p-2 w-full mt-1"
          />
        </label>
        <label className="block mb-4">
          Triggers that Worsen Your Skin Condition:
          <textarea
            name="triggers"
            value={formData.triggers}
            onChange={handleChange}
            className="bg-yellow-50 border-yellow-400 border-solid border-2 rounded-md p-2 w-full mt-1"
          />
        </label>
        <div className="flex justify-center">
          <button type="submit" className="bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600">Submit</button>
        </div>
      </form>
    </div>
  );
}

export default PatientForm;