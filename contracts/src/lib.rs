use soroban_sdk::{contract, contracterror, contractimpl, contracttype, symbol_short, Address, Env, String, Vec, Symbol};

/// Escrow contract for AcreLedger agricultural supply chain finance
/// Handles instant payouts from buyers to farmers with warehouse validation
#[contract]
pub struct AcreLedgerEscrow;

/// Contract state representing an escrow transaction
#[contracttype]
#[derive(Clone)]
pub struct Escrow {
    /// Escrow identifier
    pub id: u64,
    /// Buyer address who locked funds
    pub buyer: Address,
    /// Farmer address who will receive funds
    pub farmer: Address,
    /// Warehouse validator address (quality checker)
    pub validator: Address,
    /// Amount of stablecoin locked in escrow
    pub amount: i128,
    /// Crop identifier/description
    pub crop_id: String,
    /// Whether funds have been released
    pub released: bool,
    /// Timestamp of creation
    pub created_at: u64,
}

impl Escrow {
    /// Create a new escrow instance
    pub fn new(
        id: u64,
        buyer: Address,
        farmer: Address,
        validator: Address,
        amount: i128,
        crop_id: String,
        created_at: u64,
    ) -> Self {
        Escrow {
            id,
            buyer,
            farmer,
            validator,
            amount,
            crop_id,
            released: false,
            created_at,
        }
    }
}

/// Trade record for credit score calculation
#[contracttype]
#[derive(Clone)]
pub struct TradeRecord {
    /// Farmer address
    pub farmer: Address,
    /// Buyer address
    pub buyer: Address,
    /// Amount of transaction
    pub amount: i128,
    /// Timestamp of successful transaction
    pub timestamp: u64,
    /// Quality rating (1-5)
    pub quality_rating: u32,
}

/// Credit score data for farmers
#[contracttype]
#[derive(Clone)]
pub struct CreditScore {
    /// Farmer address
    pub farmer: Address,
    /// Current credit score (0-100)
    pub score: u32,
    /// Total number of successful trades
    pub total_trades: u32,
    /// Total volume traded
    pub total_volume: i128,
}

/// Contract errors
#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum Error {
    /// Unauthorized caller
    Unauthorized = 1,
    /// Escrow already released
    AlreadyReleased = 2,
    /// Invalid amount
    InvalidAmount = 3,
    /// Escrow not found
    EscrowNotFound = 4,
    /// Invalid validator
    InvalidValidator = 5,
}

#[contractimpl]
impl AcreLedgerEscrow {
    /// Storage keys for persistent data
    const ESCROW_KEY: Symbol = symbol_short!("escrow");
    const ESCROW_COUNTER_KEY: Symbol = symbol_short!("esc_ctr");
    const TRADE_RECORDS_KEY: Symbol = symbol_short!("trades");
    const CREDIT_SCORES_KEY: Symbol = symbol_short!("credit");

    /// Initialize a new escrow transaction
    /// 
    /// # Arguments
    /// * `env` - The contract environment
    /// * `buyer` - Address of the buyer locking funds
    /// * `farmer` - Address of the farmer receiving funds
    /// * `validator` - Address of the warehouse validator
    /// * `amount` - Amount of stablecoin to lock
    /// * `crop_id` - Identifier for the crop being traded
    /// 
    /// # Returns
    /// Unique escrow ID
    pub fn initialize(
        env: Env,
        buyer: Address,
        farmer: Address,
        validator: Address,
        amount: i128,
        crop_id: String,
    ) -> u64 {
        buyer.require_auth();
        
        if amount <= 0 {
            panic!("Invalid amount: must be positive");
        }

        let escrow_id = env.storage().instance().get(&Self::ESCROW_COUNTER_KEY).unwrap_or(0u64) + 1;
        
        let escrow = Escrow::new(
            escrow_id,
            buyer.clone(),
            farmer.clone(),
            validator,
            amount,
            crop_id,
            env.ledger().timestamp(),
        );

        let mut escrows: Vec<Escrow> = env.storage().instance().get(&Self::ESCROW_KEY).unwrap_or(Vec::new(&env));
        escrows.push_back(escrow);
        env.storage().instance().set(&Self::ESCROW_KEY, &escrows);
        env.storage().instance().set(&Self::ESCROW_COUNTER_KEY, &escrow_id);

        escrow_id
    }

    /// Release funds from escrow to farmer and cooperative
    /// 
    /// # Arguments
    /// * `env` - The contract environment
    /// * `escrow_id` - ID of the escrow to release
    /// * `validator` - Address of the validator authorizing release
    /// * `quality_rating` - Quality rating for this trade (1-5)
    /// 
    /// # Distribution
    /// * 85% to farmer
    /// * 15% to local cooperative/logistics fees
    pub fn release(
        env: Env,
        escrow_id: u64,
        validator: Address,
        quality_rating: u32,
    ) {
        validator.require_auth();

        let mut escrows: Vec<Escrow> = env.storage().instance().get(&Self::ESCROW_KEY)
            .expect("Escrow not found");

        let escrow_index_usize = escrows.iter().position(|e| e.id == escrow_id)
            .expect("Escrow not found");
        let escrow_index = u32::try_from(escrow_index_usize).unwrap();

        let escrow = escrows.get(escrow_index).unwrap();

        if escrow.released {
            panic!("Escrow already released");
        }

        if escrow.validator != validator {
            panic!("Invalid validator");
        }

        // Calculate distribution
        let _farmer_amount = escrow.amount * 85 / 100;
        let _cooperative_amount = escrow.amount * 15 / 100;

        // In a real implementation, you'd transfer tokens here
        // For now, we just update the state

        // Update escrow status
        let mut updated_escrow = escrow.clone();
        updated_escrow.released = true;
        escrows.set(escrow_index, updated_escrow);
        env.storage().instance().set(&Self::ESCROW_KEY, &escrows);

        // Record trade for credit scoring
        Self::record_trade(
            env.clone(),
            escrow.farmer.clone(),
            escrow.buyer.clone(),
            escrow.amount,
            env.ledger().timestamp(),
            quality_rating,
        );

        // Update credit score
        Self::update_credit_score(env, escrow.farmer);
    }

    /// Record a successful trade for credit scoring
    fn record_trade(
        env: Env,
        farmer: Address,
        buyer: Address,
        amount: i128,
        timestamp: u64,
        quality_rating: u32,
    ) {
        let trade = TradeRecord {
            farmer: farmer.clone(),
            buyer,
            amount,
            timestamp,
            quality_rating,
        };

        let mut trades: Vec<TradeRecord> = env.storage().instance()
            .get(&Self::TRADE_RECORDS_KEY)
            .unwrap_or(Vec::new(&env));
        
        trades.push_back(trade);
        env.storage().instance().set(&Self::TRADE_RECORDS_KEY, &trades);
    }

    /// Update credit score for a farmer based on trade history
    fn update_credit_score(env: Env, farmer: Address) {
        let trades: Vec<TradeRecord> = env.storage().instance()
            .get(&Self::TRADE_RECORDS_KEY)
            .unwrap_or(Vec::new(&env));

        // Filter trades for this farmer
        let mut farmer_trades = Vec::new(&env);
        for trade in trades.iter() {
            if trade.farmer == farmer {
                farmer_trades.push_back(trade);
            }
        }

        if farmer_trades.is_empty() {
            return;
        }

        // Calculate score based on:
        // - Number of successful trades
        // - Volume traded
        // - Quality ratings
        let total_trades = farmer_trades.len() as u32;
        let total_volume: i128 = farmer_trades.iter().map(|t| t.amount).sum();
        let avg_quality: u32 = farmer_trades.iter().map(|t| t.quality_rating).sum::<u32>() / total_trades;

        // Simple scoring algorithm (can be enhanced)
        let mut score = 50u32; // Base score
        score += (total_trades * 2).min(30); // Up to 30 points for trade count
        score += if total_volume > 10000 { 10 } else { (total_volume / 1000) as u32 }.min(10); // Up to 10 points for volume
        score += (avg_quality * 4).min(10); // Up to 10 points for quality
        score = score.min(100); // Cap at 100

        let credit_score = CreditScore {
            farmer: farmer.clone(),
            score,
            total_trades,
            total_volume,
        };

        let mut scores: Vec<CreditScore> = env.storage().instance()
            .get(&Self::CREDIT_SCORES_KEY)
            .unwrap_or(Vec::new(&env));

        // Update existing or add new score
        if let Some(index_usize) = scores.iter().position(|s| s.farmer == farmer) {
            let index = u32::try_from(index_usize).unwrap();
            scores.set(index, credit_score);
        } else {
            scores.push_back(credit_score);
        }

        env.storage().instance().set(&Self::CREDIT_SCORES_KEY, &scores);
    }

    /// Get credit score for a farmer
    pub fn get_credit_score(env: Env, farmer: Address) -> Option<CreditScore> {
        let scores: Vec<CreditScore> = env.storage().instance()
            .get(&Self::CREDIT_SCORES_KEY)
            .unwrap_or(Vec::new(&env));

        let mut result: Option<CreditScore> = None;
        for score in scores.iter() {
            if score.farmer == farmer {
                result = Some(score.clone());
                break;
            }
        }
        result
    }

    /// Get all escrows for a specific address (buyer or farmer)
    pub fn get_escrows(env: Env, address: Address) -> Vec<Escrow> {
        let escrows: Vec<Escrow> = env.storage().instance()
            .get(&Self::ESCROW_KEY)
            .unwrap_or(Vec::new(&env));

        let mut matched = Vec::new(&env);
        for escrow in escrows.iter() {
            if escrow.buyer == address || escrow.farmer == address {
                matched.push_back(escrow);
            }
        }
        matched
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::testutils::Address as _;

    #[test]
    fn test_escrow_initialization() {
        let env = Env::default();
        env.mock_all_auths();
        let contract_id = env.register_contract(None, AcreLedgerEscrow);
        let client = AcreLedgerEscrowClient::new(&env, &contract_id);

        let buyer = Address::generate(&env);
        let farmer = Address::generate(&env);
        let validator = Address::generate(&env);
        let amount = 1000i128;
        let crop_id = String::from_str(&env, "WHEAT-001");

        let escrow_id = client.initialize(
            &buyer,
            &farmer,
            &validator,
            &amount,
            &crop_id,
        );

        assert!(escrow_id > 0);
    }

    #[test]
    fn test_escrow_release() {
        let env = Env::default();
        env.mock_all_auths();
        let contract_id = env.register_contract(None, AcreLedgerEscrow);
        let client = AcreLedgerEscrowClient::new(&env, &contract_id);

        let buyer = Address::generate(&env);
        let farmer = Address::generate(&env);
        let validator = Address::generate(&env);
        let amount = 1000i128;
        let crop_id = String::from_str(&env, "WHEAT-001");

        let escrow_id = client.initialize(
            &buyer,
            &farmer,
            &validator,
            &amount,
            &crop_id,
        );

        client.release(&escrow_id, &validator, &5u32);

        let credit_score = client.get_credit_score(&farmer);
        assert!(credit_score.is_some());
    }
}
