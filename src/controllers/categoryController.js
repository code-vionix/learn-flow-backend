import { categoryService } from "../services/categoryService.js"

// export const getUsers = async (req, res, next) => {
//   try {
//     const users = await userService.getAllUsers()
//     res.json(users)
//   } catch (error) {
//     next(error)
//   }
// }

// model CourseCategory {
//   id            String       @id @default(auto()) @map("_id") @db.ObjectId
//   courseId      String       @db.ObjectId
//   course        Course?       @relation(fields: [courseId], references: [id])
//   categoryId    String       @db.ObjectId
//   category      Category     @relation(fields: [categoryId], references: [id])
//   SubCategory   SubCategory? @relation(fields: [subCategoryId], references: [id])
//   subCategoryId String?      @db.ObjectId

//   @@map("course_categories")
// }

export const createCategory = async (req, res, next) => {
  try {
      const { 
          course,
          category,
          subCategory
     } = req?.body

    const categoryInfo = await categoryService.createCategory({
      course,
      category,
      subCategory
    })

    res.status(201).json(categoryInfo)
  } catch (error) {
    next(error)
  }
}

