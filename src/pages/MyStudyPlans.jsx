import { useEffect, useState } from "react";

import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
} from "firebase/firestore";

import { db, auth } from "../services/firebase";



function MyStudyPlans(){


const [plans,setPlans]=useState([]);

const [search,setSearch]=useState("");

const [loading,setLoading]=useState(true);

const [message,setMessage]=useState("");







const fetchPlans=async()=>{


try{


setLoading(true);



const q=query(

collection(db,"studyPlans"),

where(

"userId",

"==",

auth.currentUser.uid

)

);





const snapshot=await getDocs(q);





const data=snapshot.docs.map(doc=>(

{

id:doc.id,

...doc.data()

}

));




setPlans(data);



}

catch(error){


console.log(

"Study Plans Fetch Error:",

error

);


setMessage(

"Unable to load study plans ❌"

);


}



setLoading(false);


};









useEffect(()=>{


if(auth.currentUser){

fetchPlans();

}


},[]);









// DELETE PLAN


const deletePlan=async(id)=>{


const confirmDelete=window.confirm(

"Delete this study plan?"

);



if(!confirmDelete) return;




try{


await deleteDoc(

doc(

db,

"studyPlans",

id

)

);




setPlans(

prev=>

prev.filter(

plan=>plan.id!==id

)

);




setMessage(

"Study plan deleted successfully ✅"

);



}

catch(error){


console.log(error);


}



};











// FAVORITE PLAN


const favoritePlan=async(plan)=>{


try{


await updateDoc(

doc(

db,

"studyPlans",

plan.id

),

{

favorite:!plan.favorite

}

);



fetchPlans();



}

catch(error){


console.log(error);


}



};









return(



<div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-600 p-10 pt-28">



<div className="max-w-5xl mx-auto bg-white rounded-3xl p-8 shadow-2xl">






<h1 className="text-4xl font-bold text-blue-700 mb-6">

📅 My Study Plans

</h1>









<input

type="text"

placeholder="🔍 Search subject..."

className="w-full border rounded-xl p-4 mb-6"

value={search}

onChange={(e)=>setSearch(e.target.value)}

/>









{

message &&

<p className="text-green-600 font-semibold mb-5">

{message}

</p>

}









{

loading ?


<p className="text-indigo-600 font-semibold">

Loading study plans...

</p>



:



plans

.filter(plan=>

plan.subject

?.toLowerCase()

.includes(

search.toLowerCase()

)

)

.map(plan=>(






<div

key={plan.id}

className="bg-gray-100 p-6 rounded-2xl mb-6 shadow"

>







<div className="flex justify-between items-center">


<h2 className="text-2xl font-bold text-blue-700">

{plan.subject}

</h2>






<button

onClick={()=>favoritePlan(plan)}

className="text-3xl"

>


{

plan.favorite

?

"⭐"

:

"☆"

}


</button>



</div>









<div className="mt-4 text-gray-600">


<p>

📅 Exam Date: {plan.examDate}

</p>



<p>

⏰ Daily Study Hours: {plan.dailyHours}

</p>



</div>









<div className="mt-5 bg-white p-5 rounded-xl">


<h3 className="font-bold text-blue-700 mb-3">

AI Study Plan

</h3>



<p className="whitespace-pre-line leading-7">

{plan.plan}

</p>



</div>









<button


onClick={()=>deletePlan(plan.id)}


className="mt-5 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl"


>

🗑 Delete Plan

</button>






</div>



))


}









{

!loading && plans.length===0 &&


<div className="text-center py-10">


<h2 className="text-xl font-bold text-gray-600">

No Study Plans Yet 📚

</h2>



<p className="text-gray-500 mt-2">

Generate your first AI study plan.

</p>



</div>


}








</div>


</div>



);


}


export default MyStudyPlans;