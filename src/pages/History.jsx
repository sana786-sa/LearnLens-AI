import { useEffect, useState } from "react";

import {
  collection,
  query,
  where,
  getDocs
} from "firebase/firestore";

import { db, auth } from "../services/firebase";

import { onAuthStateChanged } from "firebase/auth";



function History(){


const [history,setHistory]=useState([]);

const [loading,setLoading]=useState(true);






const loadHistory = async(user)=>{


try{


setLoading(true);


const uid = user.uid;


let allData=[];





// NOTES

const notesSnap = await getDocs(

query(

collection(db,"notes"),

where("userId","==",uid)

)

);



notesSnap.forEach(doc=>{


const data=doc.data();


allData.push({

id:doc.id,

type:"📚 AI Explanation",

title:data.question || "AI Note",

date:data.createdAt

});


});









// QUIZZES


const quizSnap = await getDocs(

query(

collection(db,"quizzes"),

where("userId","==",uid)

)

);



quizSnap.forEach(doc=>{


const data=doc.data();


allData.push({

id:doc.id,

type:"📝 AI Quiz",

title:data.topic || "Quiz",

date:data.createdAt

});


});









// FLASHCARDS


const flashSnap = await getDocs(

query(

collection(db,"flashcards"),

where("userId","==",uid)

)

);



flashSnap.forEach(doc=>{


const data=doc.data();


allData.push({

id:doc.id,

type:"🎴 Flashcards",

title:data.topic || "Flashcards",

date:data.createdAt

});


});









// STUDY PLAN


const planSnap = await getDocs(

query(

collection(db,"studyPlans"),

where("userId","==",uid)

)

);



planSnap.forEach(doc=>{


const data=doc.data();


allData.push({

id:doc.id,

type:"📅 Study Plan",

title:data.subject || "Study Plan",

date:data.createdAt

});


});









// SORT


allData.sort(

(a,b)=>

(b.date?.seconds || 0)

-

(a.date?.seconds || 0)

);



setHistory(allData);



}

catch(error){


console.log(
"History Error:",
error
);


}

finally{


setLoading(false);


}



};










useEffect(()=>{


const unsubscribe = onAuthStateChanged(

auth,

(user)=>{


if(user){

loadHistory(user);

}

else{

setLoading(false);

}


}

);



return ()=>unsubscribe();



},[]);











return(


<div className="
min-h-screen
bg-gradient-to-br
from-indigo-600
to-purple-600
p-10
pt-28
">


<div className="
max-w-5xl
mx-auto
bg-white
rounded-3xl
shadow-xl
p-8
">


<h1 className="
text-4xl
font-bold
text-purple-700
mb-8
">

📜 Learning History

</h1>







{

loading ?


<p>

Loading history...

</p>


:


history.length===0 ?


<p className="text-gray-500">

No activity found.

</p>



:


history.map(item=>(



<div

key={item.id}

className="
bg-gray-100
rounded-2xl
p-5
mb-5
shadow
"

>


<h2 className="
text-xl
font-bold
text-indigo-700
">

{item.type}

</h2>



<p className="
mt-2
text-gray-700
">

{item.title}

</p>




<p className="
text-sm
text-gray-500
mt-3
">


{

item.date

?

new Date(
item.date.seconds * 1000
)
.toLocaleDateString()


:

"New"

}



</p>



</div>



))


}





</div>


</div>


);


}



export default History;