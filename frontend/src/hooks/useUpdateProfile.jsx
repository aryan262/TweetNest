import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
const apiUrl = ''


const useUpdateProfile = ()=>{
    const queryClient = useQueryClient()
    const {mutateAsync:updateProfile, isPending:isupdatingProfile} = useMutation({
        mutationFn:async(formData)=>{
            try{
                const res = await fetch(apiUrl+`/api/users/update`,{
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json',
                        },
                        body:JSON.stringify(formData),
                    credentials:'include'
                    });
                    const data = await res.json();
                    if(!res.ok){
                        throw new Error(data.error || 'Something went wrong')
                    }
                    return data;
                }
                catch(error){
                    throw new Error(error.message);
                }
            },   
        onSuccess:()=>{
            toast.success("Profile updated successfully");
            Promise.all([
                queryClient.invalidateQueries({queryKey:["authUser"]}),
                queryClient.invalidateQueries({queryKey:["userProfile"]})
            ])
        },
        onError:(error)=>{
            toast.error(error.message)
        }
    })
    return {updateProfile, isupdatingProfile};
}

export default useUpdateProfile