# No Coin
No coin is a tiny browser extension aiming to block coin miners such as Coinhive.

![v0.4 demo](https://ker.af/content/images/2017/09/nocoin-v0.4.gif)

You can grab the extension from: 

[![Chrome Web Store](https://developer.chrome.com/webstore/images/ChromeWebStore_BadgeWBorder_v2_206x58.png)](https://chrome.google.com/webstore/detail/no-coin/gojamcfopckidlocpkbelmpjcgmbgjcl) [![FireFox Add-on](https://addons.cdn.mozilla.net/static/img/addons-buttons/AMO-button_1.png)](https://addons.mozilla.org/en-GB/firefox/addon/no-coin/) [<img alt="Opera Add-ons" src="https://dev.opera.com/extensions/branding-guidelines/addons_206x58_en@2x.png" height="58" width="206">](https://addons.opera.com/en-gb/extensions/details/no-coin/)

Related article: https://ker.af/stop-coin-mining-in-the-browser-with-no-coin/

*Made by Rafael Keramidas (keraf [at] protonmail [dot] com - [@iamkeraf](https://www.twitter.com/iamkeraf) - [ker.af](https://ker.af/)).*

### Why?
Even though I think using coin mining in browser to monetize content is a great idea, abusing it is not. Some websites are running it during the entire browsing session which results in high consumption of your computers resources. I do believe that using it occasionally such as for the proof of work of a captcha is OK. But for an entire browsing session, the user should have the choice to opt-in which is the aim of this extension.

### Why not just block the URLs in an adblocker?
The idea was to keep it separate from adblocking. Coin mining in the browser is a different issue. Where ads are tracking you and visually interfering with your browsing experience, coin mining, if abused, is eating your computer resources resulting in slow downs (from high CPU usage) and excessive power consumption. You might be OK with that and not with ads, or vice versa. Or you might just want to keep ads blocked entirely and just enable the coin mining script for a minute to pass a Captcha. That's why I believe having a separate extension is useful.

### How does it work?
The extension is simply blocking a list of blacklisted domains in *blacklist.txt*. Clicking on the icon will display you a button to pause/unpause No Coin. If you are aware of any scripts or services that provide coin mining the browser, please submit a PR.

## Docs
There is a wiki with some useful information, make sure to give it a read if you're interested in any of those subjects:
* [Found a bug?](https://github.com/keraf/NoCoin/wiki/Bugs)
* [Contributions](https://github.com/keraf/NoCoin/wiki/Contributions)
* [Feature/Change Requests](https://github.com/keraf/NoCoin/wiki/Requests)

## Supporting the project
[![Tips](https://i.imgur.com/W5nargR.png)](https://digitaltipjar.com/keraf) [![PayPal](https://i.imgur.com/PsO0orP.png)](https://paypal.me/keraf) 

Click one of the buttons above to use either Digital Tip Jar or PayPal to tip me! Most open source projects have costs and I do currently cover them myself. Those include developer fees, domains, servers and software licenses. Donating would allow me to cover those costs and support further development. It is also a great way to show your appreciation for the project. 

## In the press
No Coin was mentionned a couple of times in the press, read more about it here: 
- [Motherboard / Vice News](https://motherboard.vice.com/en_us/article/d3yp9a/someone-made-an-ad-blocker-but-for-cryptocurrency-mining)
- [WIRED](https://www.wired.com/story/cryptojacking-cryptocurrency-mining-browser)
- [Gizmodo](https://gizmodo.com/how-to-stop-pirate-bay-and-other-sites-from-hijacking-y-1818549856)
- [The Next Web](https://thenextweb.com/apps/2017/09/19/cpu-cryptocurrency-miner-blocker/)
- [LifeHacker](https://lifehacker.com/how-to-stop-sites-from-harvesting-cryptocurrency-from-y-1819712943)
