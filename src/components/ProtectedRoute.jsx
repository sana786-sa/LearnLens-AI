import { Navigate, useLocation } from "react-router-dom";

import { useAuthState } from "react-firebase-hooks/auth";

import { auth } from "../services/firebase";





function ProtectedRoute({children}){


const [user,loading]=useAuthState(auth);

const location=useLocation();







if(loading){


return(


<div className="
min-h-screen
flex
items-center
justify-center
bg-gradient-to-br
from-indigo-700
via-purple-700
to-pink-600
">


<div className="
bg-white/90
backdrop-blur-xl
rounded-3xl
shadow-2xl
px-10
py-8
text-center
">


<div className="
text-6xl
animate-spin
mb-5
">

🔐

</div>




<h2 className="
text-2xl
font-bold
text-indigo-700
">

Verifying Account...

</h2>




<p className="
text-gray-500
mt-3
">

Checking authentication status...

</p>



</div>



</div>


);


}









if(!user){


return(


<Navigate

to="/"

replace

state={{

from:location.pathname

}}

/>


);


}








return children;



}



export default ProtectedRoute;