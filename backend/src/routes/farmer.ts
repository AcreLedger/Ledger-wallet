import { Router, Request, Response } from 'express';
import { stellarService } from '../services/stellar.service';

const router = Router();

/**
 * @route   GET /api/v1/farmer/credit-score
 * @desc    Get credit score for a farmer
 * @access  Public
 */
router.get('/credit-score', async (req: Request, res: Response) => {
  try {
    const { address } = req.query;
    
    if (!address || typeof address !== 'string') {
      return res.status(400).json({ error: 'Address parameter is required' });
    }

    const creditData = await stellarService.getCreditScore(address);
    
    if (!creditData) {
      return res.status(404).json({ error: 'Credit score not found for this address' });
    }

    res.json(creditData);
  } catch (error) {
    console.error('Error fetching credit score:', error);
    res.status(500).json({ error: 'Failed to fetch credit score' });
  }
});

/**
 * @route   GET /api/v1/farmer/trade-history
 * @desc    Get trade history for a farmer
 * @access  Public
 */
router.get('/trade-history', async (req: Request, res: Response) => {
  try {
    const { address } = req.query;
    
    if (!address || typeof address !== 'string') {
      return res.status(400).json({ error: 'Address parameter is required' });
    }

    const tradeHistory = await stellarService.getTradeHistory(address);
    res.json({ tradeHistory });
  } catch (error) {
    console.error('Error fetching trade history:', error);
    res.status(500).json({ error: 'Failed to fetch trade history' });
  }
});

/**
 * @route   GET /api/v1/farmer/profile
 * @desc    Get farmer profile information
 * @access  Public
 */
router.get('/profile', async (req: Request, res: Response) => {
  try {
    const { address } = req.query;
    
    if (!address || typeof address !== 'string') {
      return res.status(400).json({ error: 'Address parameter is required' });
    }

    // Get account information from Stellar
    const account = await stellarService.getAccount(address);
    const usdcBalance = await stellarService.getUSDCBalance(address);
    const creditData = await stellarService.getCreditScore(address);

    const profile = {
      address,
      usdcBalance,
      creditScore: creditData?.score || 0,
      totalTrades: creditData?.totalTrades || 0,
      totalVolume: creditData?.totalVolume || 0,
      accountSequence: account.sequence,
    };

    res.json(profile);
  } catch (error) {
    console.error('Error fetching farmer profile:', error);
    res.status(500).json({ error: 'Failed to fetch farmer profile' });
  }
});

/**
 * @route   GET /api/v1/farmer/eligibility
 * @desc    Check loan eligibility for a farmer
 * @access  Public
 */
router.get('/eligibility', async (req: Request, res: Response) => {
  try {
    const { address } = req.query;
    const { loanAmount } = req.query;
    
    if (!address || typeof address !== 'string') {
      return res.status(400).json({ error: 'Address parameter is required' });
    }

    const creditData = await stellarService.getCreditScore(address);
    
    if (!creditData) {
      return res.json({ 
        eligible: false, 
        reason: 'No credit history found' 
      });
    }

    // Simple eligibility logic (can be enhanced)
    const minScore = 60;
    const requestedAmount = loanAmount ? parseFloat(loanAmount as string) : 0;
    const maxLoanAmount = creditData.totalVolume * 0.5; // Can borrow up to 50% of historical volume

    const isEligible = creditData.score >= minScore && 
                      (!requestedAmount || requestedAmount <= maxLoanAmount);

    res.json({
      eligible: isEligible,
      creditScore: creditData.score,
      maxLoanAmount,
      reason: isEligible ? 'Eligible for micro-loan' : creditData.score < minScore 
        ? 'Credit score too low' 
        : 'Requested amount exceeds maximum based on credit history'
    });
  } catch (error) {
    console.error('Error checking loan eligibility:', error);
    res.status(500).json({ error: 'Failed to check loan eligibility' });
  }
});

export default router;
