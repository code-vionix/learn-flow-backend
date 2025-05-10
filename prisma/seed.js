import { PrismaClient } from '@prisma/client';
import { ObjectId } from 'mongodb';

const prisma = new PrismaClient();

async function seed() {
  try {
    // Enums (No direct seeding needed as they are types)

    // Models

    // User
    const user1 = await prisma.user.create({
      data: {
        email: 'student1@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        role: 'STUDENT',
        status: 'ACTIVE',
      },
    });

    const user2 = await prisma.user.create({
      data: {
        email: 'teacher1@example.com',
        password: 'securepassword',
        firstName: 'Jane',
        lastName: 'Smith',
        role: 'TEACHER',
        status: 'ACTIVE',
      },
    });

    const user3 = await prisma.user.create({
      data: {
        email: 'admin1@example.com',
        password: 'adminpassword',
        firstName: 'Admin',
        role: 'ADMIN',
        status: 'ACTIVE',
      },
    });

    // IPList
    await prisma.iPList.create({
      data: {
        userId: user1.id,
        ip: '192.168.1.1',
      },
    });

    // Instructor
    const instructor1 = await prisma.instructor.create({
      data: {
        userId: user2.id,
        bio: 'Experienced math teacher',
        about: 'Teaching for 10+ years...',
      },
    });

    // InstructorRating
    await prisma.instructorRating.create({
      data: {
        userId: user1.id,
        instructorId: instructor1.id,
        rating: 4.5,
        comment: 'Great instructor!',
      },
    });

    // Category
    const category1 = await prisma.category.create({
      data: {
        name: 'Mathematics',
      },
    });

    const category2 = await prisma.category.create({
      data: {
        name: 'Science',
      },
    });

    // SubCategory
    const subCategory1 = await prisma.subCategory.create({
      data: {
        name: 'Algebra',
        categoryId: category1.id,
      },
    });

    const subCategory2 = await prisma.subCategory.create({
      data: {
        name: 'Physics',
        categoryId: category2.id,
      },
    });

    // Course
    const course1 = await prisma.course.create({
      data: {
        title: 'Introduction to Algebra',
        teacherId: user2.id,
        categoryId: category1.id,
        subCategoryId: subCategory1.id,
        instructorId: instructor1.id,
        durationUnit: 'weeks',
      },
    });

    const course2 = await prisma.course.create({
      data: {
        title: 'Basic Physics',
        teacherId: user2.id,
        categoryId: category2.id,
        subCategoryId: subCategory2.id,
        instructorId: instructor1.id,
        durationUnit: 'weeks',
      },
    });

    // Learnings
    await prisma.learnings.create({
      data: {
        courseId: course1.id,
        description: 'Learn the basics of algebraic equations.',
      },
    });

    // TargetAudience
    await prisma.targetAudience.create({
      data: {
        courseId: course1.id,
        description: 'Beginners with no prior algebra knowledge.',
      },
    });

    // PreRequirement
    await prisma.preRequirement.create({
      data: {
        courseId: course1.id,
        description: 'Basic arithmetic skills.',
      },
    });

    // Module
    const module1 = await prisma.module.create({
      data: {
        courseId: course1.id,
        title: 'Fundamentals of Algebra',
        order: 1,
      },
    });

    const module2 = await prisma.module.create({
      data: {
        courseId: course1.id,
        title: 'Solving Equations',
        order: 2,
      },
    });

    // Lesson
    const lesson1 = await prisma.lesson.create({
      data: {
        moduleId: module1.id,
        title: 'Introduction to Variables',
        lessonType: 'TEXT',
        order: 1,
      },
    });

    const lesson2 = await prisma.lesson.create({
      data: {
        moduleId: module1.id,
        title: 'Basic Operations',
        lessonType: 'VIDEO',
        videoUrl: 'https://example.com/video1.mp4',
        order: 2,
      },
    });

    // file
    await prisma.file.create({
      data: {
        name: 'sample.pdf',
        url: 'https://example.com/sample.pdf',
        userId: user1.id,
        mimeType: 'application/pdf',
        fileSize: 1024,
        storageLocation: 's3',
      },
    });

    // Attachment
    await prisma.attachment.create({
      data: {
        lessonId: lesson1.id,
        name: 'worksheet.pdf',
        url: 'https://example.com/worksheet.pdf',
      },
    });

    // Note
    await prisma.note.create({
      data: {
        lessonId: lesson1.id,
        userId: user1.id,
        title: 'Key Concepts',
        content: 'Important definitions and examples.',
      },
    });

    // lessonProgress
    await prisma.lessonProgress.create({
      data: {
        lessonId: lesson1.id,
        userId: user1.id,
        completed: true,
        progress: 100,
        quizCompleted: 0,
      },
    });

    // CourseProgress
    await prisma.courseProgress.create({
      data: {
        courseId: course1.id,
        userId: user1.id,
        completed: false,
        quizCompleted: 0,
        quizTotal: 1,
        assignmentCompleted: 0,
        assignmentTotal: 1,
        progress: 50,
      },
    });

    // Enrollment
    await prisma.enrollment.create({
      data: {
        userId: user1.id,
        courseId: course1.id,
      },
    });

    // Assignment
    const assignment1 = await prisma.assignment.create({
      data: {
        moduleId: module2.id,
        courseId: course1.id,
        title: 'Solve Linear Equations',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      },
    });

    // Submission
    await prisma.submission.create({
      data: {
        studentId: user1.id,
        assignmentId: assignment1.id,
        status: 'SUBMITTED',
      },
    });

    // Grade
    await prisma.grade.create({
      data: {
        studentId: user1.id,
        // submissionId: submission1.id, // Assuming submission1 was created
        grade: 85,
        feedback: 'Well done!',
      },
    });

    // Quiz
    const quiz1 = await prisma.quiz.create({
      data: {
        courseId: course1.id,
        lessionId: lesson2.id,
        title: 'Algebra Basics Quiz',
      },
    });

    // Question
    await prisma.question.create({
      data: {
        quizId: quiz1.id,
        questionText: 'What is x + x?',
        options: ['x^2', '2x', '2', '0'],
        correctAnswer: 1,
      },
    });

    // reviews
    await prisma.reviews.create({
      data: {
        userId: user1.id,
        courseId: course1.id,
        rating: 5,
        comment: 'Excellent course!',
      },
    });

    // Comment
    const comment1 = await prisma.comment.create({
      data: {
        userId: user1.id,
        lessonId: lesson1.id,
        comment: 'This was very helpful.',
      },
    });

    // Reply
    await prisma.reply.create({
      data: {
        userId: user2.id,
        commentId: comment1.id,
        reply: 'Glad it helped!',
      },
    });

    // Chat
    await prisma.chat.create({
      data: {
        senderId: user1.id,
        receiverId: user2.id,
        message: 'Hello!',
      },
    });

    // Room
    await prisma.room.create({
      data: {
        roomId: new ObjectId().toHexString(),
        participants: [user1.id, user2.id],
      },
    });

    // PaymentCard
    await prisma.paymentCard.create({
      data: {
        userId: user1.id,
        name: 'John Doe',
        cardNumber: '1234567890123456',
        expiryDate: '12/25',
        cvv: '123',
      },
    });

    // Payment
    const payment1 = await prisma.payment.create({
      data: {
        userId: user1.id,
        amount: 99.99,
        currency: 'USD',
        method: 'Credit Card',
        cardId: (await prisma.paymentCard.findFirst()).id,
        status: 'Success',
        courseId: course1.id,
        enrollmentId: (await prisma.enrollment.findFirst()).id,
      },
    });

    // Refund
    await prisma.refund.create({
      data: {
        paymentId: payment1.id,
        amount: 99.99,
        reason: 'Customer requested refund',
      },
    });

    // Revenue
    await prisma.revenue.create({
      data: {
        courseId: course1.id,
        amount: 99.99,
      },
    });

    // Notification
    await prisma.notification.create({
      data: {
        userId: user1.id,
        message: 'Welcome to the course!',
      },
    });

    // Cupon
    await prisma.cupon.create({
      data: {
        code: 'SUMMER20',
        discount: 0.20,
      },
    });

    // Cart
    await prisma.cart.create({
      data: {
        userId: user1.id,
        courseId: course2.id,
      },
    });

    // Wishlist
    await prisma.wishlist.create({
      data: {
        userId: user1.id,
        courseId: course2.id,
      },
    });

    // SocialProfile
    await prisma.socialProfile.create({
      data: {
        userId: user1.id,
        platform: 'LinkedIn',
        username: 'johndoe123',
      },
    });

    // userSettings
    await prisma.userSettings.create({
      data: {
        userId: user1.id,
        theme: 'dark',
        language: 'en',
      },
    });

    // NotificationSettings
    await prisma.notificationSettings.create({
      data: {
        userId: user1.id,
        email: true,
        push: false,
        sms: false,
      },
    });

    // NotificationList
    await prisma.notificationList.create({
      data: {
        userId: user1.id,
        title: 'Course Update',
      },
    });

    // PlayerSettings
    await prisma.playerSettings.create({
      data: {
        userId: user1.id,
        volume: 80,
        speed: 1,
        quality: 'HD',
      },
    });

    // SubscribedToNewsletter
    await prisma.subscribedToNewsletter.create({
      data: {
        email: 'student1@example.com',
      },
    });

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding the database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();