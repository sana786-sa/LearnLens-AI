// gemini.js

import { GoogleGenerativeAI } from "@google/generative-ai";





const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;



if(!API_KEY){

console.error(
"Gemini API Key missing. Check your .env file"
);

}





const genAI = new GoogleGenerativeAI(API_KEY);





const model = genAI.getGenerativeModel({

model: "gemini-3.1-flash-lite"

});









// ===============================
// TEXT AI FUNCTION
// ===============================


export async function askGemini(prompt){


try{


const result = await model.generateContent(prompt);



const response = result.response;



return response.text();



}

catch(error){


console.error(
"Gemini Text Error:",
error
);



return "AI response generate nahi ho saka ❌";


}


}









// ===============================
// IMAGE AI FUNCTION
// ===============================


export async function askGeminiWithImage(
prompt,
imageFile
){


try{



if(!imageFile){


return "Image missing ❌";


}







const base64Image = await convertImage(imageFile);







const result = await model.generateContent([


{


text:prompt


},



{


inlineData:{


data:base64Image,


mimeType:imageFile.type


}


}


]);






return result.response.text();




}

catch(error){


console.error(

"Gemini Image Error:",

error

);



return "Image analysis failed ❌";


}



}









// ===============================
// IMAGE CONVERTER
// ===============================


function convertImage(file){


return new Promise(

(resolve,reject)=>{


const reader = new FileReader();




reader.onload=()=>{


const base64 =

reader.result.split(",")[1];



resolve(base64);


};




reader.onerror=(error)=>{


reject(error);


};





reader.readAsDataURL(file);



}


);


}