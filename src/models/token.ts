import { model, Schema, Types } from "mongoose";
import { randomUUID } from "crypto";

const unUsedtokenSchema = new Schema({
  token: { type: String, unique: true, default: () => randomUUID() },
  lastUpdatedAt: {
    type: Date,
    expires: 300, // 300 seconds
    default: Date.now
  }
});

const UnUsedToken = model('UnUsedToken', unUsedtokenSchema);

const usedtokenSchema = new Schema({
  token: { type: String, unique: true, trim: true },
  lastUpdatedAt: {
    type: Date,
    default: Date.now
  }
});

const UsedToken = model('UsedToken', usedtokenSchema);

export { UnUsedToken, UsedToken };
