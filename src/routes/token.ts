import { Router, Request, Response } from "express";
import {
  addTokens,
  getAllUnAssignedTokens,
  deleteTokenById,
  assignTokens,
  unblockToken,
  keepAliveUnUsedToken,
} from '../services/tokens';
import { ITokenType } from "../interface";

const router = Router();

router.post('/tokens', async (req: Request, res: Response) => {
  res.status(201).json(await addTokens());
});

router.get('/tokens', async (req: Request, res: Response) => {
  res.status(200).json(await getAllUnAssignedTokens());
});

router.delete('/tokens/:tokenId', async (req: Request, res: Response) => {
  const { tokenId } = req.params;

  res.status(200).json(await deleteTokenById(tokenId));
});

router.post('/tokens/assign', async (req: Request, res: Response) => {
  res.status(200).json(await assignTokens());
});

router.put('/tokens/un-assign/:tokenId', async (req: Request, res: Response) => {
  const { tokenId } = req.params;

  res.status(200).json(await unblockToken(tokenId));
});

router.patch('/tokens/keep-alive/:tokenId', async (req: Request, res: Response) => {
  const { tokenId } = req.params;
  const { tokenType } = req.query as unknown as ITokenType;

  res.status(200).json(await keepAliveUnUsedToken(tokenId, tokenType));
})

export { router as tokenRouter };