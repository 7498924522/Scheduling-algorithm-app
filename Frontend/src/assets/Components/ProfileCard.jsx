import React, { useState } from 'react';
import { CgProfile } from "react-icons/cg";

function ProfileCard() {
  const [image, setImage] = useState(null);

  // Handle file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setImage(imageURL);
    }
  };

  return (
    <div className="relative w-16 h-16">
     
    

{/* Profile Image or Icon */}
<div className="w-16 h-16 rounded-full object-cover border-2 ml-12 border-gray-600 flex items-center justify-center overflow-hidden bg-gray-300">
  {image ? (
    <img
      src={image}
      alt="Profile"
      className="w-full h-full object-cover"
    />
  ) : (
    <CgProfile className="text-gray-400 w-20 h-20 " />
  )}
</div>


      {/* Plus Icon (bottom-right corner) */}
      <div
        onClick={() => document.getElementById('fileInput').click()}
        className="absolute bottom-0 right-0 bg-blue-600 text-white  w-5 h-5 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 text-sm font-bold"
        title="Upload Image"
      >
        +
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        accept="image/*"
        id="fileInput"
        onChange={handleImageChange}
        className="hidden"
      />
    </div>
  );
}

export default ProfileCard;
