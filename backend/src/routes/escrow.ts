import { Router, Request, Response } from 'express';
import { stellarService } from '../services/stellar.service';

const router = Router();

/**
 * @route   GET /api/v1/escrow
 * @desc    Get all escrows for an address
 * @access  Public
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const { address } = req.query;
    
    if (!address || typeof address !== 'string') {
      return res.status(400).json({ error: 'Address parameter is required' });
    }

    const escrows = await stellarService.getEscrows(address);
    res.json({ escrows });
  } catch (error) {
    console.error('Error fetching escrows:', error);
    res.status(500).json({ error: 'Failed to fetch escrows' });
  }
});

/**
 * @route   GET /api/v1/escrow/:id
 * @desc    Get a specific escrow by ID
 * @access  Public
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id: _id } = req.params;
    
    // In production, this would query the specific escrow from the contract
    res.status(501).json({ error: `Not implemented - would query Soroban contract for escrow ${_id}` });
  } catch (error) {
    console.error('Error fetching escrow:', error);
    res.status(500).json({ error: 'Failed to fetch escrow' });
  }
});

/**
 * @route   POST /api/v1/escrow
 * @desc    Create a new escrow
 * @access  Public
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { buyer, farmer, validator, amount, cropId } = req.body;

    // Validation
    if (!buyer || !farmer || !validator || !amount || !cropId) {
      return res.status(400).json({ 
        error: 'Missing required fields: buyer, farmer, validator, amount, cropId' 
      });
    }

    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ error: 'Amount must be a positive number' });
    }

    // Create escrow (would interact with Soroban contract in production)
    const escrow = await stellarService.createEscrow({
      buyer,
      farmer,
      validator,
      amount,
      cropId,
    });

    res.status(201).json({ escrow });
  } catch (error) {
    console.error('Error creating escrow:', error);
    res.status(500).json({ error: 'Failed to create escrow' });
  }
});

/**
 * @route   POST /api/v1/escrow/:id/release
 * @desc    Release funds from escrow
 * @access  Public
 */
router.post('/:id/release', async (req: Request, res: Response) => {
  try {
    const { id: _id } = req.params;
    const { validator, qualityRating } = req.body;

    if (!validator) {
      return res.status(400).json({ error: 'Validator address is required' });
    }

    if (!qualityRating || typeof qualityRating !== 'number' || qualityRating < 1 || qualityRating > 5) {
      return res.status(400).json({ error: 'Quality rating must be a number between 1 and 5' });
    }

    // Release escrow (would interact with Soroban contract in production)
    const updatedEscrow = await stellarService.releaseEscrow(_id, validator, qualityRating);

    res.json({ escrow: updatedEscrow });
  } catch (error) {
    console.error('Error releasing escrow:', error);
    res.status(500).json({ error: 'Failed to release escrow' });
  }
});

/**
 * @route   GET /api/v1/escrow/:id/status
 * @desc    Get escrow status
 * @access  Public
 */
router.get('/:id/status', async (req: Request, res: Response) => {
  try {
    const { id: _id } = req.params;
    
    // In production, this would query the contract for current status
    res.status(501).json({ error: `Not implemented - would query Soroban contract status for escrow ${_id}` });
  } catch (error) {
    console.error('Error fetching escrow status:', error);
    res.status(500).json({ error: 'Failed to fetch escrow status' });
  }
});

export default router;
