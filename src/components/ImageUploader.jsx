import { useState } from "react";


function ImageUploader({ onImageSelect }) {


const [preview,setPreview] = useState(null);





const handleImageChange = (e)=>{


const file = e.target.files[0];



if(!file) return;





// IMAGE SIZE CHECK (5MB)

if(file.size > 5 * 1024 * 1024){


alert(
"Image size should be less than 5MB"
);


return;


}






setPreview(
URL.createObjectURL(file)
);



onImageSelect(file);



};







const removeImage = ()=>{


setPreview(null);

onImageSelect(null);


};









return(



<div className="mb-6">





<h2 className="text-xl font-bold text-indigo-700 mb-3">

📷 Upload Notes Image

</h2>







<input


type="file"


accept="image/*"


onChange={handleImageChange}


className="w-full border rounded-xl p-3 bg-gray-50"


/>









{

preview &&


<div className="mt-5 bg-indigo-50 p-5 rounded-2xl">





<p className="font-semibold mb-3">

Image Preview 👇

</p>







<img


src={preview}


alt="Notes Preview"


className="w-72 rounded-2xl shadow-lg"


/>









<button


onClick={removeImage}


className="mt-4 bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl"


>


❌ Remove Image

</button>





</div>



}







</div>



);


}



export default ImageUploader;