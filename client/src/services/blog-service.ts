import { httpService } from "./http-service";

export interface BlogModel {
  id: number;
  title: string;
  text?: string;
}

export interface BlogParagraph {
  id: number;
  blog_id: number;
  order: number;
  text: string;
}

export interface BlogPostDetails extends BlogModel {
  // likes: {
  //   user_liked: boolean;
  //   like_count: number;
  // };
  pargraphs: BlogParagraph[];
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

// export async function loadCommentsUsingParagraphId(paragraphId: number, pageNumber: number, pageSize: number): Promise<{ results: CommentModel[], pageCount: number | null }> {
//   if (pageSize === 0) {
//     return { results: [], pageCount: null };
//   }
//   const { results, total } = await httpService.get<{ results: CommentModel[], total: number }>(`/comments?paragraphId=${paragraphId}&pageNumber=${pageNumber}&pageSize=${pageSize}`);
//   if (total === 0) {
//     return { results: [], pageCount: null };
//   }
//   const pageCount = Math.ceil(total / pageSize - 1);
//   return { results, pageCount };
// }

// export async function loadCommentsUsingPostId(blogId: number, pageNumber: number, pageSize: number): Promise<{ results: CommentModel[], pageCount: number | null }> {
//   if (pageSize === 0) {
//     return { results: [], pageCount: null };
//   }
//   const { results, total } = await httpService.get<{ results: CommentModel[], total: number }>(`/comments?blogId=${blogId}&pageNumber=${pageNumber}&pageSize=${pageSize}`);
//   if (total === 0) {
//     return { results: [], pageCount: null };
//   }
//   const pageCount = Math.ceil(total / pageSize - 1);
//   return { results, pageCount };
// }

// export async function addComment(blogId: number, commentText: string, pargraphId: number | null) {
//   return httpService.post<CommentModel>('/comments', { blogId, commentText, pargraphId });
// }

// export async function deleteComment(id: number) {
//   return httpService.delete<CommentModel>(`/comments/${id}`)
// }

export async function addDraftBlogPost(title: string, text: string) {
  return httpService.post<BlogModel>('/posts', { title, text });
}

export async function saveDraftBlogPost(id: string, title: string, text: string) {
  return httpService.post<BlogModel>(`/posts/${id}/draft`, { title, text });
}

export async function publishBlogPost(id: string) {
  return httpService.post<BlogModel>(`/posts/${id}`, {});
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
