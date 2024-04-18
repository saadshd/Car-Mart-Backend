import mongoose, { ClientSession } from "mongoose";

const withMongoSession = async (
  callback: (session: ClientSession) => Promise<any>
) => {
  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      await callback(session);
    });
  } finally {
    session.endSession();
  }
};

export default withMongoSession;
