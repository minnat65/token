import { UsedToken, UnUsedToken } from "../models/token";
import { assignedTokenQueue } from "../config/queue";
import { TOKENTYPE } from "../interface";
import { NotFoundError } from "../middleware/errors/not-found-error";

const addTokens = async () => {
  const token = new UnUsedToken({});
  await token.save();

  return token;
};

const assignTokens = async () => {
  const unAssignedToken = await UnUsedToken.findOneAndDelete({}).lean(); // returns first element and delete it

  if(!unAssignedToken) {
    throw new NotFoundError();
  }

  const usedToken = await UsedToken.create({
    token: unAssignedToken.token,
  });

  // push it into queue with delay time of 60 seconds
  assignedTokenQueue.add('token-assigned', { tokenId: usedToken._id }, { delay: Number(process.env.DELAY_TIME) });

  return usedToken;
};

const unblockToken = async (tokenId: string) => {
  const usedToken = await UsedToken.findByIdAndDelete(tokenId).lean();

  if(!usedToken) {
    throw new NotFoundError();
  }

  // Making it available for others
  const unUsedToken = await UnUsedToken.create({
    token: usedToken.token,
  });

  return unUsedToken;
};

const getAllUnAssignedTokens = async () => {
  const unassignedtokens = await UnUsedToken.find({}).lean();

  return unassignedtokens;
};

const deleteTokenById = async (tokenId: string) => {
  const token = await UnUsedToken.findByIdAndDelete(tokenId);

  return token;
};

// Tokek can be of two types in-used or NOT in-used
const keepAliveUnUsedToken = async (tokenId: string, tokenType: TOKENTYPE) => {
  let token;
  if (tokenType === TOKENTYPE.ASSIGNED) {
    token = await UsedToken.findByIdAndUpdate(
      tokenId,
      {
        $set: {
          lastUpdatedAt: Date.now()
        }
      },
      { new: true },
    );

    assignedTokenQueue.add('token-assigned', { tokenId }, { delay: Number(process.env.DELAY_TIME) });
  }
  
  if(tokenType === TOKENTYPE.NOTASSIGNED) {
    token = await UnUsedToken.findByIdAndUpdate(
      tokenId,
      { $set: {
          lastUpdatedAt: Date.now(),
        }
      },
      { new: true },
    );
  }

  return token;
};

export {
  addTokens,
  assignTokens,
  getAllUnAssignedTokens,
  deleteTokenById,
  unblockToken,
  keepAliveUnUsedToken,
}