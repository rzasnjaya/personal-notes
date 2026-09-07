import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Helper: Get userId from cookies
function getUserIdFromCookies(request: NextRequest): number | null {
  const userId = request.cookies.get('userId')?.value;
  return userId ? parseInt(userId) : null;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = getUserIdFromCookies(request);

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const noteId = parseInt(id);

    const note = await prisma.note.findUnique({
      where: { id: noteId },
      include: {
        noteTags: {
          include: {
            tag: true,
          },
        },
      },
    });

    if (!note) {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      );
    }

    // Check if note belongs to user
    if (note.userId !== userId) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    return NextResponse.json(note);
  } catch (error) {
    console.error('Error fetching note:', error);
    return NextResponse.json(
      { error: 'Failed to fetch note' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = getUserIdFromCookies(request);

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const noteId = parseInt(id);
    const body = await request.json();
    const { title, content, isFavorite, isArchived, tags } = body;

    // Check if note exists and belongs to user
    const existingNote = await prisma.note.findUnique({
      where: { id: noteId },
    });

    if (!existingNote) {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      );
    }

    if (existingNote.userId !== userId) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const note = await prisma.note.update({
      where: { id: noteId },
      data: {
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
        ...(isFavorite !== undefined && { isFavorite }),
        ...(isArchived !== undefined && { isArchived }),
      },
      include: {
        noteTags: {
          include: {
            tag: true,
          },
        },
      },
    });

    // Handle tags if provided
    if (tags && Array.isArray(tags)) {
      // Delete existing tags for this note
      await prisma.noteTag.deleteMany({
        where: { noteId },
      });

      // Add new tags
      for (const tagName of tags) {
        // Find or create tag
        let tag = await prisma.tag.findFirst({
          where: {
            userId,
            name: tagName,
          },
        });

        if (!tag) {
          tag = await prisma.tag.create({
            data: {
              name: tagName,
              userId,
            },
          });
        }

        // Create NoteTag relation
        await prisma.noteTag.create({
          data: {
            noteId,
            tagId: tag.id,
          },
        });
      }

      // Fetch updated note with tags
      const updatedNote = await prisma.note.findUnique({
        where: { id: noteId },
        include: {
          noteTags: {
            include: {
              tag: true,
            },
          },
        },
      });

      return NextResponse.json(updatedNote);
    }

    return NextResponse.json(note);
  } catch (error) {
    console.error('Error updating note:', error);
    return NextResponse.json(
      { error: 'Failed to update note' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = getUserIdFromCookies(request);

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const noteId = parseInt(id);

    // Check if note exists and belongs to user
    const existingNote = await prisma.note.findUnique({
      where: { id: noteId },
    });

    if (!existingNote) {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      );
    }

    if (existingNote.userId !== userId) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const note = await prisma.note.delete({
      where: { id: noteId },
    });

    return NextResponse.json(note);
  } catch (error) {
    console.error('Error deleting note:', error);
    return NextResponse.json(
      { error: 'Failed to delete note' },
      { status: 500 }
    );
  }
}
