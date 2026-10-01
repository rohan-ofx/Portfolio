import APiError from "../utils/ApiErrors.js";
import ApiResponse from "../utils/ApiResponse.js";
import { Message } from "../models/message.model.js";
import asyncHandler from "../utils/asynchandler.js";

const createMessage = asyncHandler(async(req,res)=>{
    const {
        name,
        email,
        subject,
        message
    } = req.body;

    if(!name || !email ||!message){
        throw new APiError(
            400,
            "All field are required"
        );
    }

    const newMessage = await Message.create({
        name,
        email,
        subject,
        message 
    });
    return res.status(201).json(
    new ApiResponse(
      201,
      newMessage,
      "Message sent successfully"
    )
  );
});


// GET ALL MESSAGES
const getAllMessages = asyncHandler(async (req, res) => {
  const messages = await Message.find().sort({
    createdAt: -1
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      messages,
      "Messages fetched successfully"
    )
  );
});


// GET MESSAGE BY ID
const getMessageById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const message = await Message.findById(id);

  if (!message) {
    throw new APiError(
      404,
      "Message not found"
    );
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      message,
      "Message fetched successfully"
    )
  );
});


// UPDATE MESSAGE READ STATUS
const updateMessageReadStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { isRead } = req.body;

  if (typeof isRead !== "boolean") {
    throw new APiError(
      400,
      "isRead must be true or false"
    );
  }

  const updatedMessage = await Message.findByIdAndUpdate(
    id,
    {
      isRead
    },
    {
      new: true,
      runValidators: true
    }
  );

  if (!updatedMessage) {
    throw new APiError(
      404,
      "Message not found"
    );
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      updatedMessage,
      "Message read status updated successfully"
    )
  );
});


// DELETE MESSAGE
const deleteMessage = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const deletedMessage = await Message.findByIdAndDelete(id);

  if (!deletedMessage) {
    throw new APiError(
      404,
      "Message not found"
    );
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      deletedMessage,
      "Message deleted successfully"
    )
  );
});


export {
  createMessage,
  getAllMessages,
  getMessageById,
  updateMessageReadStatus,
  deleteMessage
};
