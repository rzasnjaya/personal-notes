import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Helper: Get userId from cookies
function getUserIdFromCookies(request: NextRequest): number | null {
  const userId = request.cookies.get('userId')?.value;
  return userId ? parseInt(userId) : null;
}

export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromCookies(request);

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const isFavorite = searchParams.get('isFavorite') === 'true';
    const isArchived = searchParams.get('isArchived') === 'true';

    // Build where clause
    const where: any = {
      userId,
      isArchived,
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (isFavorite) {
      where.isFavorite = true;
    }

    const notes = await prisma.note.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        noteTags: {
          include: {
            tag: true,
          },
        },
      },
    });

    return NextResponse.json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notes' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = getUserIdFromCookies(request);

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, content, tags } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    const note = await prisma.note.create({
      data: {
        title,
        content,
        userId,
      },
      include: {
        noteTags: {
          include: {
            tag: true,
          },
        },
      },
    });

    // Add tags if provided
    if (tags && Array.isArray(tags) && tags.length > 0) {
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
            noteId: note.id,
            tagId: tag.id,
          },
        });
      }
    }

    // Fetch note with tags
    const noteWithTags = await prisma.note.findUnique({
      where: { id: note.id },
      include: {
        noteTags: {
          include: {
            tag: true,
          },
        },
      },
    });

    return NextResponse.json(noteWithTags, { status: 201 });
  } catch (error) {
    console.error('Error creating note:', error);
    return NextResponse.json(
      { error: 'Failed to create note' },
      { status: 500 }
    );
  }
}
