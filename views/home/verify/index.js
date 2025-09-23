(async()=>{
    try {
        const token = windows.location.pathname.split('/')[3];
        const id = windows.location.pathname.split('/')[2];
        console.log(token);
        console.log(windows.location.pathname.split('/'));
        console.log(id);
        const {data} = await axios.post(`/api/users/${}/${token}`);
        console.log(data);
        }catch(error){
            console.log(error.response.data.error);
            
        };
        })();