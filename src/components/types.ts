export type PostObject = {
	_id: string;
	title: string;
	content: string;
	date: string;
	imageUrl: string;
	userId: string;
	likes: number;
	dislikes: number;
	usersLiked: string[];
	usersDisliked: string[];
};

export interface PostCallback {
	(message: PostObject): void;
}
