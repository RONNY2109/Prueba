const textInfo= document.querySelector("#text-info");

(async() =>{
   
    try {
        // con esto lo enviamos al back-end
        const token = window.location.pathname.split("/")[3]
        
        const id = window.location.pathname.split("/")[2]
        
         await axios.patch(`/api/users/${id}/${token}`)
        
        window.location.pathname ="/login/"
        
    } catch (error) {
        
        
        
         const mensajeError=error.response.data.error;
         textInfo.innerHTML = mensajeError

        

        
    }
   
        
    


})()