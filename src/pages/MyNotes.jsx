import { useEffect, useState } from "react";

import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp
} from "firebase/firestore";

import { db, auth } from "../services/firebase";




function MyNotes(){


const [notes,setNotes]=useState([]);

const [search,setSearch]=useState("");

const [favoriteOnly,setFavoriteOnly]=useState(false);

const [loading,setLoading]=useState(true);

const [editId,setEditId]=useState(null);

const [editText,setEditText]=useState("");

const [message,setMessage]=useState("");







const fetchNotes=async()=>{


if(!auth.currentUser)
return;



try{


setLoading(true);



const q=query(

collection(db,"notes"),

where(
"userId",
"==",
auth.currentUser.uid
)

);



const snapshot=await getDocs(q);



let data=snapshot.docs.map(doc=>({

id:doc.id,

...doc.data()

}));





data.sort((a,b)=>{


const aTime=a.createdAt?.seconds || 0;

const bTime=b.createdAt?.seconds || 0;


return bTime-aTime;


});




setNotes(data);



}

catch(error){


console.log(error);


setMessage(
"Unable to load notes ❌"
);


}

finally{


setLoading(false);


}



};







useEffect(()=>{


fetchNotes();


},[]);








const deleteNote=async(id)=>{


if(!window.confirm(
"Delete this note?"
))
return;



await deleteDoc(

doc(db,"notes",id)

);



setNotes(prev=>

prev.filter(note=>note.id!==id)

);



};










const updateNote=async(id)=>{


await updateDoc(

doc(db,"notes",id),

{

answer:editText,

updatedAt:serverTimestamp()

}

);



setEditId(null);

setEditText("");

fetchNotes();



};










const favoriteNote=async(note)=>{


await updateDoc(

doc(db,"notes",note.id),

{

favorite:!note.favorite

}

);



fetchNotes();



};









const filteredNotes=notes.filter(note=>{


const text=

(note.question || "")+

(note.answer || "");



return (

text
.toLowerCase()
.includes(
search.toLowerCase()
)

&&

(
favoriteOnly
?
note.favorite
:
true
)

);


});
return(

<div className="
min-h-screen
bg-gradient-to-br
from-slate-900
via-indigo-900
to-purple-900
p-6
pt-28
">


<div className="
max-w-7xl
mx-auto
">






{/* HEADER */}

<div className="
bg-white/90
backdrop-blur-xl
rounded-[35px]
shadow-2xl
p-8
mb-8
border
border-white/30
">


<div className="
flex
flex-col
md:flex-row
justify-between
items-center
gap-5
">


<div>


<h1 className="
text-4xl
font-extrabold
text-indigo-700
">

📚 My AI Notes

</h1>


<p className="
text-gray-500
mt-2
">

Manage your saved AI explanations and learning material 🚀

</p>


</div>





<div className="
bg-indigo-100
px-6
py-4
rounded-3xl
text-center
">


<h2 className="
text-3xl
font-bold
text-indigo-700
">

{notes.length}

</h2>


<p className="
text-gray-600
">

Total Notes

</p>


</div>




</div>


</div>









{/* SEARCH AREA */}


<div className="
bg-white/90
backdrop-blur-xl
rounded-3xl
shadow-xl
p-6
mb-8
">


<div className="
flex
flex-col
md:flex-row
gap-4
">



<input


type="text"


placeholder="🔍 Search your AI notes..."


value={search}


onChange={(e)=>setSearch(e.target.value)}


className="
flex-1
p-4
rounded-2xl
border
focus:outline-none
focus:ring-2
focus:ring-indigo-500
"

 />





<button

onClick={fetchNotes}

className="
bg-indigo-600
hover:bg-indigo-700
text-white
px-6
py-3
rounded-2xl
font-semibold
transition
"

>

🔄 Refresh

</button>



<button


onClick={()=>setFavoriteOnly(!favoriteOnly)}


className="
bg-yellow-500
hover:bg-yellow-600
text-white
px-6
py-3
rounded-2xl
font-semibold
transition
"


>

{

favoriteOnly

?

"⭐ All Notes"

:

"⭐ Favorites"

}


</button>




</div>



</div>









{
message &&


<div className="
bg-red-100
text-red-700
p-4
rounded-xl
mb-5
font-semibold
">

{message}

</div>


}









{
loading ?


<div className="
bg-white/90
rounded-3xl
p-10
text-center
text-indigo-700
font-bold
text-xl
">

🔄 Loading Notes...

</div>



:

filteredNotes.length===0 ?



<div className="
bg-white/90
rounded-3xl
p-12
text-center
shadow-xl
">


<h2 className="
text-3xl
font-bold
text-gray-700
">

📂 No Notes Found

</h2>


<p className="
text-gray-500
mt-3
">

Generate notes from AI Scanner and save them here.

</p>


</div>





:




<div className="
grid
md:grid-cols-2
gap-6
">


{


filteredNotes.map(note=>(


<div

key={note.id}

className="
bg-white/95
rounded-[30px]
shadow-xl
p-6
hover:scale-[1.02]
transition
border
border-white
"

>





<div className="
flex
justify-between
items-start
">


<div>


<h2 className="
text-xl
font-bold
text-indigo-700
">

📖 {note.question}

</h2>



<p className="
text-sm
text-gray-400
mt-2
">

AI Explanation Note

</p>


</div>






<button


onClick={()=>favoriteNote(note)}


className="
text-4xl
hover:scale-110
transition
"

>


{

note.favorite

?

"⭐"

:

"☆"

}


</button>



</div>









{

editId===note.id ?



<textarea


rows="8"


value={editText}


onChange={(e)=>setEditText(e.target.value)}


className="
w-full
mt-5
p-4
border
rounded-2xl
focus:ring-2
focus:ring-indigo-500
"


/>




:



<p className="
mt-5
text-gray-700
leading-8
whitespace-pre-line
line-clamp-6
">


{note.answer}


</p>



}









<div className="
flex
flex-wrap
gap-3
mt-6
">


{

editId===note.id ?


<>


<button

onClick={()=>updateNote(note.id)}

className="
bg-green-600
text-white
px-5
py-2
rounded-xl
hover:bg-green-700
"

>

💾 Save

</button>



<button

onClick={()=>{

setEditId(null);

setEditText("");

}}

className="
bg-gray-500
text-white
px-5
py-2
rounded-xl
"

>

Cancel

</button>


</>



:


<button


onClick={()=>{

setEditId(note.id);

setEditText(note.answer);

}}


className="
bg-blue-600
text-white
px-5
py-2
rounded-xl
hover:bg-blue-700
"

>

✏ Edit

</button>


}







<button


onClick={()=>deleteNote(note.id)}


className="
bg-red-600
text-white
px-5
py-2
rounded-xl
hover:bg-red-700
"


>

🗑 Delete

</button>



</div>





</div>


))


}



</div>


}




</div>


</div>


);


}


export default MyNotes;