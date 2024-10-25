'use client';

import { useEffect, useState } from 'react';
import {
	Card,
	CardHeader,
	CardBody,
	CardFooter,
	Divider,
	Button,
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	useDisclosure,
	Spinner,
} from '@nextui-org/react';

interface Post {
	id: number;
	title: string;
	body: string;
}
// Fetch posts using the native fetch API
const fetchPosts = async (): Promise<Post[]> => {
	try {
		const response = await fetch('https://jsonplaceholder.typicode.com/posts');

		if (!response.ok) {
			throw new Error('Failed to fetch posts');
		}

		return await response.json();
	} catch (error) {
		console.error('Error fetching posts:', error);
		return [];
	}
};

export default function Home() {
	const [posts, setPosts] = useState<Post[]>([]);
	const [selectedPost, setSelectedPost] = useState<Post | null>(null);
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let isMounted = true;

		const loadPosts = async () => {
			setIsLoading(true);
			setError(null);
			const fetchedPosts = await fetchPosts();

			if (isMounted) {
				if (fetchedPosts.length === 0) {
					setError('No posts available.');
				} else {
					setPosts(fetchedPosts);
				}
				setIsLoading(false);
			}
		};

		loadPosts();

		return () => {
			isMounted = false;
		};
	}, []);

	const openModalWithPost = (post: Post) => {
		setSelectedPost(post);
		onOpen();
	};

	return (
		<div className='container p-4'>
			<h1
				style={{
					textAlign: 'center',
					color: '#333',
					marginBottom: '40px',
					fontSize: '42px',
				}}
			>
				Blog Posts
			</h1>

			{/* Show loading state */}
			{isLoading ? (
				<div className='preloader' style={{ textAlign: 'center' }}>
					<Spinner size='lg' />
				</div>
			) : error ? (
				<p className='error-message'>{error}</p>
			) : (
				<div className='flex flex-wrap gap-4 justify-center'>
					{/* Map through all Blog Posts */}
					{posts.map((post) => (
						<Card key={post.id} className='card p-4' style={{ maxWidth: '420px' }}>
							<CardHeader className='text-lg'>
								<h2>{post.title}</h2>
							</CardHeader>

							<Divider />

							<CardBody>
								<p className='text-small text-default-500'>{post.body}</p>
							</CardBody>

							{/* Action button for opening Post Details Modal */}
							<CardFooter className='flex justify-center'>
								<Button color='primary' onPress={() => openModalWithPost(post)}>
									Read More
								</Button>
							</CardFooter>
						</Card>
					))}
				</div>
			)}

			{/* Modal for displaying selected Post Details */}
			<Modal isOpen={isOpen} onOpenChange={onOpenChange} className='p-4'>
				<ModalContent>
					<ModalHeader>
						<h2>{selectedPost?.title || 'Post Title'}</h2>
					</ModalHeader>

					<ModalBody>
						<p>{selectedPost?.body || 'Post body goes here.'}</p>
					</ModalBody>
				</ModalContent>
			</Modal>
		</div>
	);
}
