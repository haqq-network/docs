---
sidebar_position: 12
title: Haqq Wallet
---

# Haqq Wallet - DApps developer's guide 

This page is dedicated to HAQQ Wallet functionality aimed at integrating external DApps, it will be of interest to all developers planning to interact with HAQQ Wallet. 

## Dynamic Link

Dynamic Link are designed to perform specific actions in an application, such as displaying a new banner on the main screen after clicking on a link. 
Dynamic Link allow you to transfer a user to an HAQQ Wallet with a target action if it is installed, and to install an HAQQ Wallet if it is not already installed on the user. If HAQQ Wallet has not been installed on the user, the target action will be performed after installation and creation (or restoration) of the wallet.

:::info Wallet signature
Please note that wallet signature of transactions on external sites on HAQQ Mainnet for user security is available only by WhiteList. For testing use HAQQ Testedge network.

To add your DApp to the WhiteList, please contact the HAQQ team.

The functionality to add DApp to WhiteList via onChain voting on HAQQ network will be implemented soon, stay tuned for updates. 
:::

Format: https://haqq.page.link/?link=ENCODED_LINK&apn=APN_ID&isi=ISI_ID&ibi=IBI_ID

:::info Current HAQQ Wallet ID
APN_ID - app package name for Android, ISI_ID - app ID in App Store for iOS, IBI_ID - app package name for iOS
* APN_ID = **com.haqq.wallet**
* ISI_ID = **6443843352**
* IBI_ID = **com.haqq.wallet**
:::

ENCODED_LINK is an encoded URL with the required query parameters (web3_browser, browser, distinct_id) that are processed within the application.

The basic structure of Dynamic Link for Firebase in HAQQ Wallet application looks like this:
`https://haqq.page.link/?link=ENCODED_LINK&apn=com.haqq.wallet&isi=6443843352&ibi=com.haqq.wallet`

### ENCODED_LINK

Current actions supported by HAQQ Wallet via Dynamic Link passed to ENCODED_LINK
* browser - page opening in Web2 browser
* web3_browser - page opening in Web3 browser
* distinct_id - transfer of external client identifier: **for Analytics** 
* 
:::info Applications
For most applications it is sufficient to use only **web3_browser**
:::

ENCODED_LINK should use only escaped characters, you can get such a link with `encodeURIComponent`.

#### Format 

`ENCODED_LINK = encodeURIComponent(https://haqq.network?{ACTION}=${PARAMETR})`

* ACTION - required action one of browser, web3_browser, distinct_id
* PARAMETR - passed parameter e.g. page/DApp link or ID

example:
* https://haqq.network?browser=siteLink
* https://haqq.network?web3_browser=dAppLink
* https://haqq.network?distinct_id=dID

:::danger ENCODE
Be sure to use encodeURIComponent or similar to escape special characters for Dynamic Link to work correctly
Before encode: `https://haqq.network?browser=siteLink`
After encode: `https%3A%2F%2Fhaqq.network%3Fbrowser%3DsiteLink`
:::

#### Code example

JS code example
```JS
const siteLink = 'https://alpha.islm.ai';
const distinctId = '123456';

const browserLink = encodeURIComponent(`https://haqq.network?browser=${siteLink}`);
const wer3BrowserLink = encodeURIComponent(`https://haqq.network?web3_browser=${siteLink}`);
const distinctIdLink = encodeURIComponent(`https://haqq.network?distinct_id=${distinctId}`);

const query = '&apn=com.haqq.wallet&isi=6443843352&ibi=com.haqq.wallet';

const dynamicLinkForBrowser = `https://haqq.page.link/?link=${browserLink}${query}`;
const dynamicLinkForWeb3Browser = `https://haqq.page.link/?link=${wer3BrowserLink}${query}`;
const dynamicLinkForDistinctId = `https://haqq.page.link/?link=${distinctIdLink}${query}`;

console.log('browser', dynamicLinkForBrowser);
console.log('web3_browser', dynamicLinkForWeb3Browser);
console.log('distinctId', dynamicLinkForDistinctId);
```

Log example 
```
[Log] browser 
"https://haqq.page.link/?link=https%3A%2F%2Fhaqq.network%3Fbrowser%3Dhttps%3A%2F%2Falpha.islm.ai&apn=com.haqq.wallet&isi=6443843352&ibi=com.haqq.wallet"
[Log] web3_browser 
"https://haqq.page.link/?link=https%3A%2F%2Fhaqq.network%3Fweb3_browser%3Dhttps%3A%2F%2Falpha.islm.ai&apn=com.haqq.wallet&isi=6443843352&ibi=com.haqq.wallet"
[Log] distinctId 
"https://haqq.page.link/?link=https%3A%2F%2Fhaqq.network%3Fdistinct_id%3D123456&apn=com.haqq.wallet&isi=6443843352&ibi=com.haqq.wallet" 
```

#### React example 
Create a hook
```JS
import { useMemo } from 'react';

export function useDeeplink() {
  const siteUrl = useMemo(() => {
    //Use the address of your DApp 
    return encodeURIComponent(window.location.origin);
  }, []);

  const web3BrowserLink = encodeURIComponent(
    `https://haqq.network/wallet?web3_browser=${siteUrl}`,
  );

  const query = '&apn=com.haqq.wallet&isi=6443843352&ibi=com.haqq.wallet';

  const dynamicLinkForWeb3Browser = `https://haqq.page.link/?link=${web3BrowserLink}${query}`;

  return dynamicLinkForWeb3Browser;
}
```

Add into components
```JS
const deeplink = useDeepLink()

<Button
    onClick={() => {
        window.location.href = deeplink;
    }}>
    Open in HAQQ Wallet
</Button>
}
```