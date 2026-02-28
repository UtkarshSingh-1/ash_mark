import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
    try {
        const session = await auth();

        // Allow basic uploads from users (e.g., return images), but admins naturally have access too.
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get("file") as File;
        let folder = formData.get("folder") as string;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // Default to 'general' if no specific folder is requested
        if (!folder) {
            folder = "general";
        }

        // Validate size (MySQL max_allowed_packet could be an issue if files are too enormous. Let's cap at ~20MB for safety during testing)
        const MAX_FILE_SIZE = 20 * 1024 * 1024;
        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json({ error: "File exceeds 20MB limit." }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Determine MediaKind
        let kind: "IMAGE" | "VIDEO" = "IMAGE";
        if (file.type.startsWith("video/")) {
            kind = "VIDEO";
        }

        // Save to Database
        const mediaRow = await prisma.media.create({
            data: {
                mimeType: file.type || "application/octet-stream",
                size: file.size,
                folder: folder.toLowerCase(),
                kind: kind,
                data: buffer,
            },
        });

        const fileUrl = `/api/media/${mediaRow.folder}/${mediaRow.id}`;

        return NextResponse.json({
            success: true,
            url: fileUrl,
            id: mediaRow.id,
        });

    } catch (error) {
        console.error("Media Upload Error:", error);
        return NextResponse.json(
            { error: "Failed to upload file to database" },
            { status: 500 }
        );
    }
}
