import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase/client";
import { uploadPostImage } from "@/lib/supabase/storage";
import { useEffect, useState } from "react";

export interface PostUser {
    id: string;
    name: string;
    user_name: string;
    profile_image_url: string;
}

export interface Post {
    id: string;
    created_at: string;
    user_id: string;
    description: string;
    image_url: string;
    expires_at: Date;
    is_active: boolean;
    profile: PostUser;
}

export const usePosts = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        loadPosts();
    }, []);
    const loadPosts = async () => {
        if (!user) {
            return;
        }
        setIsLoading(true);
        try {
            const { data: postsData, error: postsError } = await supabase
                .from("posts")
                .select("*, profiles(*)")
                .eq("is_active", true)
                .gt("expires_at", new Date().toISOString())
                .eq("user_id", user.id)
                .order("created_at", { ascending: false });
            if (postsError) {
                console.error("Error loading posts:", postsError);
                throw postsError;
            }
            if (!postsData || postsData.length === 0) {
                setPosts([]);
                return;
            }
            const postsWithProfiles = postsData.map((post) => ({
                ...post,
                profile: post.profiles || null,
            }));
            setPosts(postsWithProfiles);
        } catch (error) {
            console.error("Error loading posts:", error);
        } finally {
            setIsLoading(false);
        }
    };
    const createPost = async (imageUri: string, description?: string) => {
        if (!user) {
            throw new Error("User is not authenticated.");
        }
        try {
            const now = new Date();
            const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);

            // 1. Insert the record FIRST (without the image URL)
            const { data: newPost, error: insertError } = await supabase
                .from("posts")
                .insert({
                    user_id: user.id,
                    description,
                    expires_at: expiresAt.toISOString(),
                    is_active: true,
                })
                .select()
                .single();

            if (insertError) {
                console.error("Error inserting post:", insertError);
                throw insertError;
            }

            // 2. Use the database-generated ID to upload the image
            const imageUrl = await uploadPostImage(
                user.id,
                newPost.id,
                imageUri,
            );

            // 3. UPDATE the post with the fresh image URL
            const { error: updateError } = await supabase
                .from("posts")
                .update({ image_url: imageUrl })
                .eq("id", newPost.id);
        } catch (error) {
            console.error("Error creating post:", error);
            throw error;
        }
    };
    return { createPost, posts, isLoading };
};
