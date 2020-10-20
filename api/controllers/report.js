var express = require('express');
var router = express.Router();
const CardData = require('../models/cardData');
var mongoose = require('mongoose');
let mongoXlsx = require('mongo-xlsx');
const path = require('path');
var Excel = require('exceljs');
var fs = require('fs');
var auth = require('./auth');
var Bank = require('../models/Bank');
const Card = require('../models/Card');
const cardObj = require('../config/reportConfig');

router.get('/downloadReport', auth.checkAuthenticated,(req, res) => {
    var templateFile = path.join(__dirname, "../template/Card_Details.xlsx");
    var generatedFile = path.join(__dirname, "../generated/Card_Details.xlsx");
    fs.copyFileSync(templateFile, generatedFile);

    var borderObj = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
    };

    var fontObj = { name: 'Arial', size: 9};

    getCardList().then(function (doc) {
        if (doc.length) {
            var workbook = new Excel.Workbook();
            workbook.xlsx.readFile(generatedFile)
                .then(function () {
                    var worksheet = workbook.getWorksheet(1);
                    worksheet.views = [
                        { activeCell: 'A4' }
                    ];
                    for (var index = 0; index < doc.length; index++) {
                        var lastRow = worksheet.getRow(4 + index);
                        var resultObj = doc[index];
                        for (var propt in cardObj) {
                            lastRow.getCell(cardObj[propt]).value = resultObj[propt];
                            lastRow.getCell(cardObj[propt]).border = borderObj;
                            lastRow.getCell(cardObj[propt]).font = fontObj;

                            lastRow.getCell('A').value = index + 1;
                            lastRow.getCell('A').font = fontObj;
                            lastRow.getCell('A').border = borderObj;
                            
                            lastRow.getCell('B').value = {
                                text: resultObj.cardName,
                                hyperlink: resultObj.cardUrl
                            };

                            lastRow.getCell('C').value = resultObj.bank.bankName;
                            var sno = index + 1;
                            var imageText = sno + "_" + resultObj.cardName;
                            lastRow.getCell('D').value = {
                                text: imageText,
                                hyperlink: resultObj.cardImageUrl
                            };
                            
                            lastRow.getCell('BG').value =resultObj.perks_conciergeService;
                            lastRow.getCell('BG').border =borderObj;
                            lastRow.getCell('BG').alignment = { vertical: 'bottom', horizontal: 'right' };

                            if(propt == "annualFee" || propt == "latePenalty_amount" || propt == "cashAdvanceFee_min" ||
                               propt == "balanceTransferFee_min" ||  propt == "storePattern_additionalOfferConditions_amount")
                            {
                                var resultDollar = resultObj[propt];
                        
                                if(resultDollar==null){
                                    resultObj[propt]=" "
                                }else if(!isNaN(resultDollar ))
                                {   
                                    // You need to add right validation for this line of code becasue its adding null value in the file 
                                     lastRow.getCell(cardObj[propt]).value = "$"+ resultObj[propt]; 
                                }
                            }
                            
                            if(propt == "apr_introductory" || propt == "apr_varApr_min" || propt == "apr_varApr_max" ||
                                propt == "apr_cashAdvances_min" || propt == "apr_cashAdvances_max" || propt == "latePenalty_lateApr" ||
                                propt == "cashAdvanceFee_percent" || propt == "balanceTransferFee_percent")
                            {
                                var resultValue = resultObj[propt];
                                if(resultDollar==null){
                               lastRow.getCell(cardObj[propt]).value = "";
                               lastRow.getCell(cardObj[propt]).numFmt = '0.00%';
                                }else if(!isNaN(resultValue))
                                {
                                      // You need to add right validation for this line of code also becasue its adding NAN value in the file 
                                     lastRow.getCell(cardObj[propt]).value = (parseFloat(resultObj[propt]))/100;
                                     lastRow.getCell(cardObj[propt]).numFmt = '0.00%';
                                }
                                // If we are adding null or NAN value in file and try to open it then it will show the same error.
                            }
                            
                            if(propt =="apr_introductory" || propt =="apr_freeBillingCycle" || propt =="apr_varApr_min" || propt =="apr_varApr_max" ||
                               propt =="apr_cashAdvances_min" || propt =="apr_cashAdvances_max" || propt =="latePenalty_amount" || propt =="latePenalty_lateApr" ||
                               propt =="cashAdvanceFee_percent" || propt =="cashAdvanceFee_min" || propt =="balanceTransferFee_percent" || propt =="balanceTransferFee_min" ||
                               propt =="rewards_onlineShop" || propt =="rewards_travel" ||propt =="rewards_dining" || propt =="rewards_gas" || propt =="rewards_groceries" || 
                               propt =="rewards_drugStore" || propt =="rewards_homeFurnishing" || propt =="rewards_usSupermarkets" || propt =="rewards_everythingElse" || 
                               propt =="rewards_choiceMultiplier" || propt =="rewards_rotatingMultiplier" || propt =="conditionalRequirements" ||
                               propt =="redemptionStore_inStore" || propt =="redemptionStore_online" || propt =="redemptionCash_check" || propt =="redemptionCash_statementCredit" ||
                               propt =="redemptionCash_depositAccount" || propt =="redemptionCash_holderName" || propt =="redemptionCash_points_amazon" || propt =="redemptionCash_points_apple" ||
                               propt =="redemptionCash_gift" || propt =="redemptionCash_rewardCertificate" || propt =="redemptionCash_merillLynch" || propt =="bonusOffer_rewardAmount" || 
                               propt =="bonusOffer_purchaseAmount" || propt =="bonusOffer_days" || propt =="bonusOfferCondition_newMember" || propt =="bonusOfferCondition_notRecievedBonus" ||
                               propt =="bonusOfferCondition_timePeriod" || propt =="perks_carRent" || propt =="perks_priceProtection" || propt =="perks_extendedWarranty" ||
                               propt =="perks_purchaseProtection" || propt =="perks_travelInsurance" || propt =="perks_travelAssistance" || propt =="perks_conciergeService" ||
                               propt =="perks_roadAssistance" || propt =="perks_bagageDelay" || propt =="perks_loungeAccess" || propt =="storePattern_firstPurchase" || 
                               propt =="storePattern_arriveInMail" || propt =="storePattern_specialOfferPerYear" || propt =="storePattern_additionalOfferPerYear" || 
                               propt =="storePattern_additionalOfferConditions_amount" || propt =="storePattern_additionalOfferConditions_duration" || 
                               propt =="value_payingLateApr" || propt =="value_lateFirstPayment" || propt =="value_overLimitFee" || propt =="value_higherCreditLine" || 
                               propt =="value_duration" || propt =="value_balanceTransfer" || propt =="value_foreignFee" || 
                               propt =="fraudProtection_fraudLiability" || propt =="fraudProtection_virtualCardNumber" )
                            {
                                lastRow.getCell(cardObj[propt]).alignment = { vertical: 'bottom', horizontal: 'right' };
                            }
                            
                            if(propt == "rewards_onlineShop" || propt == "rewards_travel" || propt == "rewards_dining" ||
                               propt == "rewards_gas" || propt == "rewards_groceries" || propt == "rewards_drugStore" ||
                               propt == "rewards_homeFurnishing" || propt == "rewards_usSupermarkets" || propt == "rewards_everythingElse" ||
                               propt == "rewards_choiceMultiplier" || propt == "rewards_rotatingMultiplier" || propt == "conditionalRequirements")   
                                {
                                    if(resultObj.rewards =="P")
                                    {
                                        var percentValue = resultObj[propt];
                                        if(!isNaN(percentValue))
                                        {
                                            lastRow.getCell(cardObj[propt]).value = (parseFloat(resultObj[propt]))/100;
                                            lastRow.getCell(cardObj[propt]).numFmt = '0.00%';
                                        }
                                    }
                                    
                                   else if(resultObj.rewards == "M")
                                    {
                                        var pointValue = resultObj[propt];
                                        if(!isNaN(pointValue))
                                        {
                                            lastRow.getCell(cardObj[propt]).value = resultObj[propt] + "x";
                                        }
                                        
                                    }
                             }

                             if(propt == "bonusOffer_rewardAmount")   
                                {
                                    if(resultObj.rewardAmount =="%")
                                    {
                                        var bonuspercentValue = resultObj[propt];
                                        if(!isNaN(bonuspercentValue))
                                        {
                                            lastRow.getCell(cardObj[propt]).value = (parseFloat(resultObj[propt]))/100;
                                            lastRow.getCell(cardObj[propt]).numFmt = '0.00%';
                                        }
                                    }
                                    
                                   else if(resultObj.rewardAmount == "$")
                                    {
                                        var bonusrewardDollar = resultObj[propt];
                                        if(!isNaN(bonusrewardDollar))
                                        {
                                            lastRow.getCell(cardObj[propt]).value = "$"+ resultObj[propt]; 
                                        }
                                                
                                    }

                                    else if(resultObj.rewardAmount == "Points")
                                    {
                                        var bonuspointValue = resultObj[propt];
                                        if(!isNaN(bonuspointValue))
                                        {
                                            lastRow.getCell(cardObj[propt]).value = resultObj[propt] + "x";
                                        }
                                                
                                    }
                             }

                             if(propt == "storePattern_firstPurchase")   
                             {
                                 if(resultObj.firstPurchaseView =="%")
                                 {
                                     var firstpercentValue = resultObj[propt];
                                     if(!isNaN(firstpercentValue))
                                     {
                                         lastRow.getCell(cardObj[propt]).value = (parseFloat(resultObj[propt]))/100;
                                         lastRow.getCell(cardObj[propt]).numFmt = '0.00%';
                                     }
                                 }

                                 else if(resultObj.firstPurchaseView == "$")
                                 {
                                     var firstrewardDollar = resultObj[propt];
                                     if(!isNaN(firstrewardDollar))
                                     {
                                         lastRow.getCell(cardObj[propt]).value = "$"+ resultObj[propt]; 
                                     }
                                             
                                 }
                            }   
                         
                            if(resultObj.generalNotes){
                            lastRow.getCell('F').note=resultObj.generalNotes;
                                console.log(resultObj.generalNotes);
                            }
                            if(resultObj.feeNotes){
                                lastRow.getCell('J').note=resultObj.feeNotes;
                                    console.log(resultObj.feeNotes);
                            }
                            if(resultObj.rewardNotes){
                                lastRow.getCell('X').note=resultObj.rewardNotes;
                                    console.log(resultObj.rewardNotes);
                            }
                            if(resultObj.redemptionNotes){
                                lastRow.getCell('AJ').note=resultObj.redemptionNotes;
                                    console.log(resultObj.redemptionNotes);
                            }
                            if(resultObj.bonusNotes){
                                lastRow.getCell('AU').note=resultObj.bonusNotes;
                                    console.log(resultObj.bonusNotes);
                            }
                            if(resultObj.perksNotes){
                                lastRow.getCell('BA').note=resultObj.perksNotes;
                                    console.log(resultObj.perksNotes);
                            }
                            if(resultObj.storeCardNotes){
                                lastRow.getCell('BL').note=resultObj.storeCardNotes;
                                    console.log(resultObj.storeCardNotes);
                            }
                            if(resultObj.valueNotes){
                                lastRow.getCell('BR').note=resultObj.valueNotes;
                                    console.log(resultObj.valueNotes);
                            }
                        }
                        lastRow.commit();
                        worksheet.activ
                    }
                    workbook.xlsx.writeFile(generatedFile)
                        .then(function () {
                            res.download(generatedFile);
                        });
                });
        } else
        {
            res.status(200).json({ message: 'No Cards found for Generating Report'});
        }

    });
});

async function getCardList() {
    return await Card.find({}).populate('bank');
}



module.exports = router;