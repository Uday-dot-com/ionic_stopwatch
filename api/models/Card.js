const mongoose = require('mongoose');
const bank = require('../models/Bank');
const SaveTemplateSchema = mongoose.Schema({
    cardName: {
        type: String,
        required: true,
    },
    bank: {
        type: mongoose.Schema.Types.ObjectId,
        ref: bank
    },

    cardUrl: { type: String }, cardImageUrl: { type: String }, cardNetwork: { type: String }, cardDescription: { type: String },generalNotes: { type: String }, cardCategory: { type: String }, storeCard: { type: String }, rewardUnit: { type: String }, annualFee: { type: String },
    apr_introductory: { type: String }, apr_freeBillingCycle: { type: String },
    apr_varApr_min: { type: String }, apr_varApr_max: { type: String },
    apr_cashAdvances_min: { type: String }, apr_cashAdvances_max: { type: String },
    latePenalty_amount: { type: String }, latePenalty_lateApr: { type: String },
    cashAdvanceFee_percent: { type: String }, cashAdvanceFee_min: { type: String },
    balanceTransferFee_percent: { type: String }, balanceTransferFee_min: { type: String },feeNotes:{type:String},rewards:{type:String},
    rewards_onlineShop: { type: String }, rewards_travel: { type: String }, rewards_dining: { type: String }, rewards_gas: { type: String }, rewards_groceries: { type: String }, rewards_drugStore: { type: String }, rewards_homeFurnishing: { type: String }, rewards_usSupermarkets: { type: String }, rewards_everythingElse: { type: String }, rewards_choiceMultiplier: { type: String }, rewards_rotatingMultiplier: { type: String },
    conditionalRequirements: { type: String },rewardNotes:{type:String},
    redemptionStore_inStore: { type: String }, redemptionStore_online: { type: String },
    redemptionCash_check: { type: String }, redemptionCash_statementCredit: { type: String }, redemptionCash_depositAccount: { type: String }, redemptionCash_holderName: { type: String }, redemptionCash_points_amazon: { type: String }, redemptionCash_points_apple: { type: String }, redemptionCash_gift: { type: String }, redemptionCash_rewardCertificate: { type: String }, redemptionCash_merillLynch: { type: String },redemptionNotes:{type:String},
    rewardAmount:{ type:String }, bonusOffer_rewardAmount: { type: String }, bonusOffer_purchaseAmount: { type: String }, bonusOffer_days: { type: String },
    bonusOfferCondition_newMember: { type: String }, bonusOfferCondition_notRecievedBonus: { type: String }, bonusOfferCondition_timePeriod: { type: String },bonusNotes:{type:String},
    perks_carRent: { type: String }, perks_priceProtection: { type: String }, perks_extendedWarranty: { type: String }, perks_purchaseProtection: { type: String }, perks_travelInsurance: { type: String }, perks_travelAssistance: { type: String }, perks_roadAssistance: { type: String }, perks_bagageDelay: { type: String }, perks_conciergeService: { type: String }, perks_loungeAccess: { type: String },perksNotes:{type:String},
    firstPurchaseView: {type:String},storePattern_firstPurchase: { type: String }, storePattern_arriveInMail: { type: String }, storePattern_specialOfferPerYear: { type: String }, storePattern_additionalOfferPerYear: { type: String }, storePattern_additionalOfferConditions_amount: { type: String }, storePattern_additionalOfferConditions_duration: { type: String },storecardNotes:{type:String},
    value_payingLateApr: { type: String }, value_lateFirstPayment: { type: String }, value_overLimitFee: { type: String }, value_higherCreditLine: { type: String }, value_duration: { type: String }, value_balanceTransfer: { type: String }, value_foreignFee: { type: String },valueNotes:{type:String},
    fraudProtection_fraudLiability: { type: String }, fraudProtection_virtualCardNumber: { type: String },

    modifiedBy: {
        type: String,
        required: true,
    },
    modifiedDate: {
        type: String,
        required: true,
    },
});

const saveTemplate = module.exports = mongoose.model('cardModel', SaveTemplateSchema)