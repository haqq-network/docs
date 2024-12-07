---
sidebar_position: 3
---

# Evergreen DAO

Evergreen DAO is introduced to fund projects benefiting the global Muslim community, grants to ecosystem maintainers,
bug bounties, marketing activities and other initiatives which the community decides are helpful
for the Haqq Network and/or the Muslim community.

:::tip
Learn more about Evergreen DAO in the section 7 of the Islamic Coin [Whitepaper](https://islamiccoin.net/whitepaper).
:::

## Governance

### The Haqq Community and Haqq Shariah Board govern Evergreen DAO

Evergreen DAO governance is similar to a default Cosmos Governance with three differences:

1. The Haqq Shariah Board can approves every spending proposal
2. Users are financially incentivized to submit high-quality proposals which benefit
   the Muslim Community
3. Deposits never burn – they get transferred to the Evergreen DAO in the event of
   Voting Period or Deposit Period failure.

### Evergreen DAO will be based on the Cosmos Community Pool

Spending initiatives can be submitted by any ISLM staker and go through a governance process which consists
of the following periods:

1. Deposit Period
2. Voting Period
3. Shariah Approval Period

If and when the proposal has passed the Voting Period, the proposal enters the Shariah Approval Period.
During this period Haqq Association Shariah Board reviews a proposal and decides if it complies with Shariah Law.
If the Shariah Board approves a proposal, it gets executed and coins are transferred to the destination defined in a proposal.
If the Shariah Board rejects the proposal, coins stay in Evergreen DAO.
If the Shariah Board doesn’t submit a decision in 21 days, a proposal gets automatically rejected, coins stay in Evergreen DAO.

### Deposit refund and seizure

When a proposal finalized, the coins from the deposit are either refunded or go to Evergreen DAO
(on the contrary to the default cosmos governance where coins are burned), according to the final tally of the proposal:

- If the proposal is approved or if it's rejected but not vetoed during Voting Period, deposit will automatically
  be refunded to their respective depositor (transferred from the governance ModuleAccount) regardless
  of the Shariah Approval Period outcome.
- If the proposal is vetoed by a supermajority during the Voting Period, deposit is transferred
  to the Evergreen DAO (Community Pool Module).
- If the proposal closes during the Deposit Period (didn’t reach MinDeposit during MaxDepositPeriod),
  deposit is transferred to the Evergreen DAO
