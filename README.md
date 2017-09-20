# No Coin
No coin is a tiny browser extension aiming to block coin miners such as Coinhive.

![v0.3 demo](https://ker.af/content/images/2017/09/nocoin-v0.3.gif)

You can grab the extension from: 
* [Chrome Web Store](https://chrome.google.com/webstore/detail/no-coin/gojamcfopckidlocpkbelmpjcgmbgjcl)
* FireFox Add-on (coming soon)

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