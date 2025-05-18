import { AppError } from "../middleware/errorHandler.js";
import { ContactService } from "../services/contactService.js";

export const createContact = async (req, res, next) => {
  try {
    const { firstName, lastName, email, message, subject } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !subject || !message) {
      return next(
        new AppError(
          "First name, last name, email, subject, and message are required",
          400
        )
      );
    }

    const contact = await ContactService.createContact({
      firstName,
      lastName,
      email,
      subject,
      message,
    });

    return res.status(201).json({
      msg: "Contact created successfully",
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await ContactService.getAllContacts();
    return res.status(200).json({
      msg: "All contacts fetched successfully",
      data: contacts,
    });
  } catch (error) {
    next(error);
  }
};

export const getContactById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await ContactService.getContactById(id);

    if (!contact) {
      return next(new AppError("Contact not found", 404));
    }

    return res.status(200).json({
      msg: "Contact fetched successfully",
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await ContactService.deleteContact(id);

    return res.status(200).json({
      msg: "Contact deleted successfully",
      data: deleted,
    });
  } catch (error) {
    next(error);
  }
};