import { prisma } from "../models/index.js";

export const assignmentService = {
 
//     model Assignment {
//   id                   String       @id @default(auto()) @map("_id") @db.ObjectId
//   title                String
//   description          String?
//   dueDate              DateTime
//   moduleId             String       @db.ObjectId
//   module               Module       @relation(fields: [moduleId], references: [id])
//   submissions          Submission[]
//   createdAt            DateTime     @default(now())
//   updatedAt            DateTime     @updatedAt
//   maxPoints            Int?
//   allowLateSubmissions Boolean?     @default(true)
//   deletedAt            DateTime?
//   Course   Course? @relation(fields: [courseId], references: [id])
//   courseId String? @db.ObjectId

//   @@map("assignments")
// }

    // get all assignments
    getAllAssignments: async () => {
        return await prisma.assignment.findMany({
            select: {
                id: true,
                title: true,
                description: true,
                dueDate: true,
                moduleId: true,
                courseId: true,
                maxPoints: true,
                allowLateSubmissions: true,
                createdAt: true,
                updatedAt: true,
                deletedAt: true,
                Course: {
                    select: {
                        id: true,
                        title: true,
                        category: true,
                        description: true,
                        createdAt: true,
                        updatedAt: true,
                        deletedAt: true,
                        
                    },
                }   
            },
        })
    },
    
    // get single assignment
    getSingleAssignment: async (id) => {
        return await prisma.assignment.findUnique({
            where: { id },
            include: {
                Course: {
                    select: {
                       id: true,
                        title: true,
                        category: true,
                        description: true,
                        createdAt: true,
                        updatedAt: true,
                        deletedAt: true,
                    },
                }
            },
        });
    },

    // create assignment
    createAssignment: async (assignmentData) => {
        const { title, description, dueDate, moduleId, courseId, maxPoints, allowLateSubmissions } = assignmentData;
        return await prisma.assignment.create({
            data: {
                title,
                description,
                dueDate,
                moduleId,
                courseId,
                maxPoints,
                allowLateSubmissions,
            },
            select: {
                id: true,
                title: true,
                description: true,
                dueDate: true,
                moduleId: true,
                courseId: true,
                maxPoints: true,
                allowLateSubmissions: true,
                createdAt: true,
                updatedAt: true,
                deletedAt: true,
                Course: {
                    select: {
                        id: true,
                        title: true,
                    },
                }
            },
        });
    },
    // update assignment
    updateAssignmentService: async (id, assignmentData) => {
        const { title, description, dueDate, moduleId, courseId, maxPoints, allowLateSubmissions } = assignmentData;
        return await prisma.assignment.update({
            where: { id },
            data: {
                title,
                description,
                dueDate,
                moduleId,
                courseId,
                maxPoints,
                allowLateSubmissions,
            },
            select: {
                id: true,
                title: true,
                description: true,
                dueDate: true,
                moduleId: true,
                courseId: true,
                maxPoints: true,
                allowLateSubmissions: true,
                createdAt: true,
                updatedAt: true,
                deletedAt: true,
                Course: {
                    select: {
                        id: true,
                        title: true,
                    },
                }
            }
        })
    },    

    // delete assignment
    deleteAssignment: async (id) => {
        const assignmentData = await prisma.assignment.update({
            where: { id },
            data: {
                deletedAt: new Date(),
            },
            select: {
                id: true,
                title: true,
                description: true,
                dueDate: true,
                moduleId: true,
                courseId: true,
                maxPoints: true,
                allowLateSubmissions: true,
                createdAt: true,
                updatedAt: true,
                deletedAt: true,
            },
        });

        return {
            status: 200,
            message: "Assignment deleted successfully",
            data: assignmentData,
        };
    },  

};
