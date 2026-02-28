import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ folder: string; id: string }> }
) {
    try {
        const { folder, id } = await params;
        console.log(`[media route] Request for folder: ${folder}, id: ${id}`);

        const media = await prisma.media.findUnique({
            where: { id },
        });

        if (!media) {
            console.log(`[media route] Media not found for id: ${id}`);
            return new NextResponse("Not Found", { status: 404 });
        }

        if (media.folder !== folder) {
            console.log(`[media route] Folder mismatch. Expected: ${folder}, Actual: ${media.folder}`);
            return new NextResponse("Not Found", { status: 404 });
        }

        // Set caching headers so the browser doesn't refetch the blob unnecessarily
        const headers = new Headers();
        headers.set("Content-Type", media.mimeType);
        headers.set("Content-Length", media.size.toString());
        headers.set("Cache-Control", "public, max-age=31536000, immutable");

        return new NextResponse(media.data as unknown as BodyInit, {
            status: 200,
            headers,
        });
    } catch (error) {
        console.error("Error fetching media:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
