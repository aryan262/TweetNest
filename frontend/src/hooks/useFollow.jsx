import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
const apiUrl = 'https://tweetnest-t9oh.onrender.com'


function useFollow() {
    const queryClient = useQueryClient();
    const {mutate:follow, isPending} = useMutation({
        mutationFn:async(userId)=>{
            try {
                const res = await fetch(apiUrl+`/api/users/follow/${userId}`, {
                    method:'POST',
                    credentials:'include'
                })
                const data = await res.json();
                if(!res.ok){
                    throw new Error(data.error || 'Something went wrong!')
                }
                return data;
            } catch (error) {
                throw new Error(error.message);
            }
        },
        onSuccess:()=>{
            Promise.all([
                queryClient.invalidateQueries({queryKey:['suggestedUsers']}),
                queryClient.invalidateQueries({queryKey:['authUser']})
            ])
        },
        onError:(error)=>{
            toast.error(error.message)
        }

    });
    return {follow, isPending};
}

export default useFollow