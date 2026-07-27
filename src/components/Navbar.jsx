import { 
useState 
} from "react";


import {
useAuthState
} from "react-firebase-hooks/auth";


import {
auth
} from "../services/firebase";


import {
signOut
} from "firebase/auth";


import {
useNavigate,
useLocation
} from "react-router-dom";





function Navbar(){



const [user]=useAuthState(auth);


const navigate=useNavigate();

const location=useLocation();



const [open,setOpen]=useState(false);

const [profileOpen,setProfileOpen]=useState(false);



const hideNavbar =

location.pathname === "/" ||

location.pathname === "/signup";





if(hideNavbar){

return null;

}







const logout=async()=>{


await signOut(auth);

navigate("/");


};







const menu=[


{
name:"Dashboard",
icon:"🏠",
path:"/dashboard"
},


{
name:"AI Studio",
icon:"🤖",
path:"/scanner"
},


{
name:"Notes",
icon:"📚",
path:"/notes"
},


{
name:"Flashcards",
icon:"🎴",
path:"/flashcards"
},


{
name:"Quiz",
icon:"📝",
path:"/quizzes"
},


{
name:"Planner",
icon:"📅",
path:"/planner"
},


{
name:"Profile",
icon:"👤",
path:"/profile"
}


];









return(


<nav className="
fixed
top-0
left-0
w-full
z-50
bg-slate-900/70
backdrop-blur-xl
border-b
border-white/10
shadow-2xl
">






<div className="
max-w-7xl
mx-auto
px-6
py-4
flex
justify-between
items-center
">







{/* LOGO */}



<div

onClick={()=>navigate("/dashboard")}

className="
flex
items-center
gap-3
cursor-pointer
"


>


<div className="
w-12
h-12
rounded-2xl
bg-gradient-to-r
from-indigo-500
to-purple-600
flex
items-center
justify-center
text-3xl
shadow-lg
">

🤖

</div>




<div>


<h1 className="
text-xl
font-extrabold
text-white
">

LearnLens AI

</h1>


<p className="
text-xs
text-indigo-300
">

Smart Learning Platform

</p>


</div>



</div>









{/* DESKTOP MENU */}



<div className="
hidden
lg:flex
items-center
gap-2
">


{


menu.map(item=>(


<button

key={item.path}

onClick={()=>navigate(item.path)}

className={`

flex
items-center
gap-2
px-4
py-2
rounded-xl
transition-all
duration-300


${

location.pathname===item.path

?

"bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg"

:

"text-gray-300 hover:bg-white/10 hover:text-white"

}


`}


>


<span>

{item.icon}

</span>


<span className="
font-medium
">

{item.name}

</span>



</button>



))


}



</div>









{/* USER PROFILE */}



{

user &&


<div className="
hidden
lg:flex
items-center
gap-4
relative
">


<button

onClick={()=>setProfileOpen(!profileOpen)}

className="
flex
items-center
gap-3
bg-white/10
px-4
py-2
rounded-2xl
hover:bg-white/20
transition
"


>


<div className="
w-10
h-10
rounded-full
bg-gradient-to-r
from-pink-500
to-purple-600
flex
items-center
justify-center
text-xl
">

👤

</div>



<div className="
text-left
">


<p className="
text-white
text-sm
font-bold
max-w-[150px]
truncate
">

{user.email}

</p>


<p className="
text-xs
text-gray-300
">

Student

</p>


</div>



</button>







{


profileOpen &&


<div className="
absolute
right-0
top-16
w-56
bg-white
rounded-2xl
shadow-2xl
p-3
">


<button

onClick={()=>navigate("/profile")}

className="
w-full
text-left
px-4
py-3
rounded-xl
hover:bg-indigo-50
text-gray-700
"


>

👤 My Profile

</button>





<button

onClick={logout}

className="
w-full
text-left
px-4
py-3
rounded-xl
hover:bg-red-50
text-red-600
"


>

🚪 Logout

</button>



</div>



}



</div>


}








{/* MOBILE BUTTON */}



<button

onClick={()=>setOpen(!open)}

className="
lg:hidden
text-white
text-3xl
"


>

☰

</button>







</div>









{/* MOBILE MENU */}



{


open &&


<div className="
lg:hidden
mx-5
mb-5
bg-white/10
backdrop-blur-xl
rounded-3xl
p-5
">


{


menu.map(item=>(


<button

key={item.path}

onClick={()=>{

navigate(item.path);

setOpen(false);

}}


className={`

flex
gap-3
items-center
w-full
py-3
px-4
rounded-xl
text-white


${

location.pathname===item.path

?

"bg-white/20"

:

"hover:bg-white/10"

}


`}

>


{item.icon}

{item.name}


</button>



))


}



<button

onClick={logout}

className="
mt-4
w-full
bg-red-500
text-white
py-3
rounded-xl
font-bold
"

>

🚪 Logout

</button>



</div>


}




</nav>


);


}



export default Navbar;