import { BlogPanel } from './blog-panel';
import { listAdminBlogPosts } from '@/app/lib/blogs';

export default async function AdminBlogPage() {
    const posts = await listAdminBlogPosts();
    const initialBlogPosts = posts.map((post) => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        summary: post.summary,
        content: post.content,
        author: post.author,
        image: post.image,
        categories: post.categories,
        published_at: new Date(post.published_at).toISOString(),
        created_at: new Date(post.created_at).toISOString(),
        updated_at: new Date(post.updated_at).toISOString(),
    }));

    return <BlogPanel initialBlogPosts={initialBlogPosts} />;
}
