import { httpService } from "./http-service";

export interface BlogModel {
  id: number;
  title: string;
  added_by: number;
  text?: string;
}

export interface BlogParagraph {
  id: number;
  blog_id: number;
  text: string;
}

export interface BlogPostDetails {
  blog: BlogModel;
  paragraphs: BlogParagraph[];
  likes: {
    user_liked: boolean;
    like_count: number;
  };
}

export interface CommentModel {
  id: number;
  user_id: number;
  blog_id: number;
  text: string;
}

export async function loadBlogPosts(pageNumber: number, pageSize: number): Promise<{ results: BlogModel[], pageCount: number | null }> {
  if (pageSize === 0) {
    return { results: [], pageCount: null };
  }
  const { results, total } = await httpService.get<{ results: BlogModel[], total: number }>(`/posts?page_number=${pageNumber}&page_size=${pageSize}`);
  if (total === 0) {
    return { results: [], pageCount: null };
  }
  const pageCount = Math.ceil(total / pageSize - 1);
  return { results, pageCount };
}

export async function loadDraftPosts(pageNumber: number, pageSize: number): Promise<{ results: BlogModel[], pageCount: number | null }> {
  if (pageSize === 0) {
    return { results: [], pageCount: null };
  }
  const { results, total } = await httpService.get<{ results: BlogModel[], total: number }>(`/drafts?page_number=${pageNumber}&page_size=${pageSize}`);
  if (total === 0) {
    return { results: [], pageCount: null };
  }
  const pageCount = Math.ceil(total / pageSize - 1);
  return { results, pageCount };
}

export async function loadDraftById(id: string): Promise<BlogModel | null> {
  return httpService.get<BlogModel | null>(`/drafts/${id}`);
}

export async function loadPostById(id: string): Promise<BlogPostDetails | null> {
  return httpService.get<BlogPostDetails | null>(`/posts/${id}`);
}

export async function loadCommentsUsingParagraphId(blogId: number, paragraphId: number, pageNumber: number, pageSize: number): Promise<{ results: CommentModel[], pageCount: number | null }> {
  if (pageSize === 0) {
    return { results: [], pageCount: null };
  }
  const { results, total } = await httpService.get<{ results: CommentModel[], total: number }>(`/comments?blog_id=${blogId}&paragraph_id=${paragraphId}&page_number=${pageNumber}&page_size=${pageSize}`);
  if (total === 0) {
    return { results: [], pageCount: null };
  }
  const pageCount = Math.ceil(total / pageSize - 1);
  return { results, pageCount };
}

export async function loadCommentsUsingPostId(blogId: number, pageNumber: number, pageSize: number): Promise<{ results: CommentModel[], pageCount: number | null }> {
  if (pageSize === 0) {
    return { results: [], pageCount: null };
  }
  const { results, total } = await httpService.get<{ results: CommentModel[], total: number }>(`/comments?blog_id=${blogId}&page_number=${pageNumber}&page_size=${pageSize}`);
  if (total === 0) {
    return { results: [], pageCount: null };
  }
  const pageCount = Math.ceil(total / pageSize - 1);
  return { results, pageCount };
}

export async function addComment(blogId: number, commentText: string, paragraphId?: number) {
  if (paragraphId !== undefined) {
    return httpService.post<CommentModel>('/comments', { blog_id: blogId, text: commentText, paragraph_id: paragraphId });
  }
  
  return httpService.post<CommentModel>('/comments', { blog_id: blogId, text: commentText });
}

export async function deleteComment(id: number) {
  return httpService.delete<CommentModel>(`/comments/${id}`)
}

export async function likePost(id: string) {
  return httpService.post(`/posts/${id}/likes`, {});
}

export async function dislikePost(id: string) {
  return httpService.delete(`/posts/${id}/likes`);
}

export async function addDraftBlogPost(title: string, text: string) {
  return httpService.post<BlogModel>('/posts', { title, text });
}

export async function saveDraftBlogPost(id: string, title: string, text: string) {
  return httpService.post<BlogModel>(`/posts/${id}/draft`, { title, text });
}

export async function publishBlogPost(id: string) {
  return httpService.post<BlogModel>(`/posts/${id}`, {});
}

export async function addMoreText(id: number, text: string) {
  return httpService.post(`/posts/${id}/edit`, { text });
}

export async function loadSearchBlogByTitle(title: string, pageNumber: number, pageSize: number): Promise<{ results: BlogModel[], pageCount: number | null }> {
  if (pageSize === 0) {
    return { results: [], pageCount: null };
  }
  const { results, total } = await httpService.get<{ results: BlogModel[], total: number }>(`/posts?title=${title}&page_number=${pageNumber}&page_size=${pageSize}`);
  if (total === 0) {
    return { results: [], pageCount: null };
  }
  const pageCount = Math.ceil(total / pageSize - 1);
  return { results, pageCount };
}
