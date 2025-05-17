// src/services/courseService.ts
import prisma from '../prisma/client';

const courseService = {
  async getCourseCurriculum(courseId) {
    // This query fetches the nested structure
    const courseWithModules = await prisma.course.findUnique({
      where: { id: courseId },
      select: { // Select only necessary fields for the curriculum view
        id: true,
        title: true,
        modules: {
          orderBy: { order: 'asc' }, // Order modules
          select: {
            id: true,
            title: true,
            order: true,
            lessons: {
              orderBy: { order: 'asc' }, // Order lessons within modules
              select: {
                id: true,
                title: true,
                order: true,
                lessonType: true,
                videoUrl: true,
                caption: true,
                content: true, // Maps to description
                estimatedTime: true,
                freePreview: true,
                attachments: { // Include attachments
                  select: { id: true, name: true, url: true }
                },
                // Assuming 'notes' here represents the instructor's note
                // You might need to filter this if there are multiple user notes
                Note: { // Note relation name in schema is 'Note'
                   where: {
                       // Add condition to filter for the instructor's note
                       // This requires knowing the instructor's userId or having a dedicated note type
                       // For simplicity, let's just return *any* note, or assume the first one
                       // A better approach is needed here based on your Note model's purpose
                   },
                   select: { id: true, content: true },
                   take: 1 // Assuming maybe one key note per lesson
                }
                // ... other relevant fields
              }
            },
          },
        },
      },
    });

    // Flatten the structure slightly to match frontend's 'sections' state if needed,
    // or return it as fetched if frontend can adapt.
    // The frontend expects an array of sections, where section has 'id', 'name', 'lectures'.
    // Map Prisma Modules to Sections, and Prisma Lessons to Lectures.
     if (!courseWithModules) {
         return null; // Course not found
     }

     const formattedCurriculum = courseWithModules.modules.map(module => ({
         id: module.id,
         name: module.title, // Mapping module title to section name
         order: module.order,
         lectures: module.lessons.map(lesson => ({
             id: lesson.id,
             name: lesson.title, // Mapping lesson title to lecture name
             order: lesson.order,
             lessonType: lesson.lessonType,
             contents: { // Mapping lesson fields to frontend 'contents' structure
                 video: lesson.videoUrl ? { url: lesson.videoUrl } : null, // Assuming video is stored as a URL
                 attachment: lesson.attachments && lesson.attachments.length > 0 ? lesson.attachments : null, // Pass attachment array
                 captions: lesson.caption || '',
                 description: lesson.content || '', // Mapping Lesson.content to Description
                 notes: (lesson.Note && lesson.Note.length > 0) ? lesson.Note[0].content : '', // Mapping first Note.content to Notes
             },
             estimatedTime: lesson.estimatedTime,
             freePreview: lesson.freePreview,
             // ... other lesson fields needed by frontend
         })),
     }));


    return formattedCurriculum;
  },
};

export default courseService;