import React, { useEffect } from 'react'
import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { useQuery } from '@tanstack/react-query'
const apiUrl = 'https://tweet-nest-flame.vercel.app'


function Posts({feedType, username, userId}) {
	const getPostEndPoint = ()=>{
		if(feedType == "forYou"){
			return apiUrl+"/api/posts/all";
		}
		else if(feedType == "following"){
			return apiUrl+`/api/posts/following`;
		}
		else if(feedType == "posts"){
			return apiUrl+`/api/posts/user/${username}`;
		}
		else if(feedType == "likes"){
			return apiUrl+`/api/posts/likes/${userId}`;
		}
		else{
			return apiUrl+`/api/posts/all`;
		}
	}
	const POST_ENDPOINT = getPostEndPoint();
	const {data:posts, isLoading, refetch, isRefetching} = useQuery({
		queryKey:["posts"],
		queryFn:async()=>{
			try {
				const res = await fetch(POST_ENDPOINT);
				const data = await res.json();
				if(!res.ok){
					throw new Error(data.error || "Something went wrong")
				}
				return data;
			} catch (error) {
				throw new Error(error)
			}
		}
	});
	useEffect(()=>{
		refetch();
	}, [feedType, refetch, username])

	return (
		<>
			{isLoading || isRefetching && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!isLoading && !isRefetching && posts?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
			{!isLoading && !isRefetching && posts && (
				<div>
					{posts.map((post) => (
						<Post key={post._id} post={post} />
					))}
				</div>
			)}
		</>
	);
}

export default Posts