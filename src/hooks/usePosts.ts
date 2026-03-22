import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase/client";
import { uploadPostImage } from "@/lib/supabase/storage";

export const usePosts = () => {
    const { user } = useAuth();
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
    return { createPost };
};
