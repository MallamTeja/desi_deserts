import { supabase } from "@/integrations/supabase/client";

export const updateDessertsData = async () => {
    console.log("Starting database update...");

    // 1. Delete all existing desserts
    const { error: deleteError } = await supabase
        .from("desserts")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000"); // Hack to delete all rows since we need a filter

    if (deleteError) {
        console.error("Error deleting old data:", deleteError);
        return;
    }
    console.log("Old data deleted.");

    // 2. Insert correct desserts
    const { error: insertError } = await supabase
        .from("desserts")
        .insert([
            {
                name: "Basundi",
                description: "Rich, creamy, sweetened milk simmered to perfection with nuts and saffron.",
                price: 39,
                image_url: "basundi"
            },
            {
                name: "Double ka Meetha",
                description: "A Hyderabadi classic made with fried bread slices soaked in saffron milk and cardamom syrup.",
                price: 59,
                image_url: "double-ka-meetha"
            },
            {
                name: "Kaddu ka Kheer",
                description: "A delightful pudding made with grated pumpkin, milk, and aromatic spices.",
                price: 69,
                image_url: "kaddu-ki-kheer"
            }
        ]);

    if (insertError) {
        console.error("Error inserting new data:", insertError);
    } else {
        console.log("Database updated successfully with correct desserts!");
    }
};
