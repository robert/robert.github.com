---
permalink: /2015/11/02/how-to-value-your-startup-stock-options/
title: How to value your startup stock options
layout: post
custom_meta: You have an offer letter from a Silicon Valley-style startup. Well done! It details your salary, health insurance, gym membership and beard trimming benefits. It also says that you will be granted 100,000 stock options. You are unclear if this is good; you’ve never really had 100,000 of anything before.
tags: [Work]
---
# Your situation

You have an offer letter from a Silicon Valley-style startup. Well done! It details your salary, health insurance, gym membership and beard trimming benefits. It also says that you will be granted 100,000 stock options. You are unclear if this is good; you’ve never really had 100,000 of anything before. You also have a second offer letter from another Silicon Valley-style startup. Extremely well done! This one details your salary, complimentary artisan tea subscription, laundry provisions and sexual partner location services. This time the salary is somewhat lower, but the letter says that you will be granted 125,000 stock options. You are very unclear if this is better.

This post will help you understand your stock options and the myriad of ways in which they are probably a lot less valuable than you might hope. Please remember that whilst I am smart, cool, attractive, athletic, personable, humble and a gentle lover, I am most emphatically not a lawyer.

# The basic mechanics of an option grant

A lot hinges on whether you are being granted stock options or Restricted Stock Units ([RSUs]( https://blog.wealthfront.com/stock-options-versus-rsu/)). Options are much more common in small companies, but for various reasons companies often make the switch to RSUs as they grow. In this post, we will only consider stock options.

Stock options are not stock. If you were given stock outright, you would have to pay tax on its value immediately. This would require you to have a large mattress containing a lot of cash that you didn’t mind spending, risking and probably losing. Instead, stock options represent the right to purchase stock from the company at a fixed price (the “strike price” - see below), regardless of its market value. If the company is sold for $10/share, you can buy your stock at $1/share (or whatever your strike price is), sell it immediately and trouser the difference. All being well.

When you are granted a chunk of options, they will probably come with a 1 year cliff, 4 year vest.  This means that the entirety of the grant will “vest” (or “become yours”) over a 4 year period, with a quarter vesting after the first year “cliff”, and an additional forty-eighth vesting each month after that. If you leave within the first year, before reaching the cliff, you forfeit the entire grant. If you leave before the 4 years are up, you do so with a proportional fraction of your options. You should note that if you leave before the company is sold, you will probably have about 3 months to purchase your options before they vanish forever. This can be prohibitively expensive. More details below.

# The TechCrunch Value of your options

The quick way of calculating the value of your options is to take the value of the company as given by the TechCrunch announcement of its latest funding round, divide by the number of outstanding shares and multiply by the number of options you have.

`(tech_crunch_valuation/num_outstanding_shares) * num_options_granted`

You should enjoy looking at that number, because things go downhill from here.

# The Common Stock Discount

In an illiquid market (and markets don’t come much more illiquid than those for shares in a private startup), “the value of the company” is a very flighty, intangible number. The aforementioned large TechCrunch number is a reasonable place to start. But it would be a mistake to conflate this with “the value of the company”. More accurately, it represents “the amount per share, of whatever class of stock was issued, that the VCs were willing to pay, multiplied by the number of outstanding shares of all classes of stock”.

As an employee, you own options to buy good old-fashioned common stock. This affords you no privileges whatsoever. On the other hand, a VC will almost always be purchasing some form of preferred stock. This affords them various voting rights that I don’t really understand or know how to value, but crucially it also usually comes with some level of “liquidation preference”. If they invest $100k at a 2x liquidation preference (not uncommon), on a sale of the company, they receive double their $100k back before anyone else receives anything. If there is nothing left after this then you will cordially be invited to eat shit. The TechCrunch valuation is calculated by assuming that your common stock is worth just as much as of the VCs' preferred stock. This is almost never the case, but it does make for some large numbers.

# The Strike Price Discount

As already mentioned, when you own options, what you actually own is the right to purchase shares at a set “strike price”. The strike price is set by a [409a valuation report](http://www.svb.com/svbanalytics/409A-Valuations/) that determines the “Fair Market Value” when the options are granted. Suppose your options have a strike price of $1/share, and the company eventually IPOs for $10/share. Your actual payoff per share is the $10 you sell it for, minus the $1 that you have to pay to actually buy it in the first place.

This might not sound so bad, but suppose instead that the company goes nowhere fast, and is talent-acquired for $1/share a year after you join. In this case you make off with a handsome $1 - $1 = $0/share. This seems to happen a lot. In the event of a squillion dollar exit, the strike price may be negligible and liquidation preferences may be irrelevant. But a smaller sale could easily send you home with nothing.

A simple way to take the Strike Price Discount into account is to adjust your formula to:

`((tech_crunch_valuation/num_outstanding_shares) - strike_price) * num_options_granted`

since this is the amount you would stand to make if you were able to sell your stock right now on the secondary market.

# The Mobility Discount

When you are paid in actual real-person cash, that is the end of the transaction. If you decide to leave tomorrow then you can hand in your notice, leave something heinous on your boss’s desk after everyone has gone home, and never think of it again. However, options complicate things. You will usually have an *exercise window* of 3 months from your leaving date in which to purchase your vested options at their strike price. If you do not purchase them within this time, you lose them. Depending on the specifics of your situation, the cost can easily run into the tens or hundreds of thousands of dollars, not to mention the tax burden at the end of the year (see below). This makes it very hard to leave a company where you have vested a significant amount of potentially valuable options. This is obviously a nice problem to have, but the loss of flexibility is a definite cost, and is another reason to decrease your valuation of your options.

[I've written more about exercise windows here.](/2019/08/06/peeking-through-stock-option-exercise-windows/)

# The Tax Discount

In the words of Wall Street Journal Spiderman “with great power comes [a lot of taxes](http://www.payne.org/index.php/Startup_Equity_For_Employees)". Investor and founder stock tends to qualify for very favorable long-term capital gains tax treatment. On the other hand, when you exercise your options, the spread between your strike price and the current fair market value immediately shows up as a huge chunk of extremely taxable ordinary income. If the company is being sold, you can instantly sell your shares and pay your tax bill using a portion of the proceeds. However, if you exercise whilst the company is still private, you still owe the IRS a lot of money at the end of the tax year. You may have to come up with a lot of ready cash from somewhere, and this tax bill is often the majority cost of early exercising. This is believed to be why so many software engineers become pirates.

Of course, the TechCrunch valuation is set by investors who pay a fraction of the tax rate that you pay. Knock the real value of your options down another peg or two.

# The Risk Discount

Let’s say we come up with some completely correct way of accounting for the above factors, and it turns out that the options that you thought were worth $1 each are actually only worth $0.80. We are far from finished devaluing them. As my grandfather always used to say, “$0.60 per share in the hand is usually worth $0.80 per share in the bush, especially when you are under-diversified and your exposure is large compared to your net worth”.

When a VC buys shares in your company, they are also buying shares in tens of other companies. Assuming they are neither morons nor terminally unlucky, this diversification reduces their relative risk. Of course they are also investing money that doesn’t belong to them and getting paid [fee-plus-carry](http://cdixon.org/2009/08/26/the-other-problem-with-venture-capital-management-fees/), so their personal risk is already zero, but that is another story. As a wholly undiversified lottery ticket holder, you are extremely vulnerable to the whims of variance. If your company goes bust then your entire “portfolio” is wiped out. Unless you are a financial adrenaline junky, you would much, much rather just have some actual cash that will definitely still be there tomorrow. If you have options with an expected but extremely risky value of $200,000, but you would actually sell them for $50,000 just to get some certainty in your life, then they are only worth $50,000 to you and you should value them as such when calculating your total compensation. The delta between these two figures is the risk discount.

# The Liquidity Discount

A ten dollar bill is extremely liquid, meaning that it can easily be exchanged for many things, including but not limited to:

* A second-hand DVD of Wrestlemania XVII
* 100 rolls of dangerously low-quality toilet paper
* Many different types of novelty hat

On the other hand, stock options in a private company are extremely illiquid, and can be exchanged for almost exactly nothing. You can’t use them to buy a car, or for the deposit on a house. You can’t use them to pay unexpected medical bills, and you can’t use them to hire Beyonce to sing at your grandmother’s birthday. Totally liquid and easily tradable commodities are "worth” their face value, and on the other end of the spectrum, completely illiquid commodities are “worth” zero, regardless of their theoretical face value. Your options are somewhere in between. The only thing that gives them any value at all is the hope that one day they will become liquid, through a private sale or IPO. If their total face value is small compared to your overall net worth, then this is not a huge deal for you. If it is not, then this imaginary money just became a whole lot more imaginary, and you should treat it as such.

# The I Quit Appreciation

Perversely, the thing that actually increases the value of your options is the fact that you can leave the company if it dies or looks like it is about to.
Let’s say you are granted $200k of options, vesting over 4 years. This valuation factors in the probability that your Snapchat for badgers app takes off and the company decatuples in value. It also factors in the probability that a competitor builds a much better product than you, corners the market in ephemeral badger photos, and crushes your company into the dust. Now, when a VC exchanges her $200k in cold, hard, other people’s cash for stock in your company, that other people’s cash is gone. If the company tanks after a year, she can’t decide that actually she didn’t want that stock anyway and ask for a refund.

<p style="text-align:center">
<img src="https://cloud.githubusercontent.com/assets/1565857/10838008/b17a440c-7e7d-11e5-8630-d5b5f307cb3c.jpg" alt="Snapchat for Badgers" />
</p>

However, you can simply quit. You have only paid the company one year of your time, and are peaceing out without having to pay the other 3 years. It’s unfortunate that your stock is now worthless, but this risk was factored in to the headline valuation and all’s fair in love and war and badger software. Your downside is mitigated in a way that the VC’s is not.

Consider an alternative arrangement. You sign a contract saying that you will work for 4 years in exchange for $200k worth of options, and even if the company dies within the first 6 months you will continue to work on new projects, now essentially for free, until these 4 years are up. In this case, we can intuitively say that the option grant has an expected value of exactly $200k. Since the way your options actually work is clearly much better than this, your option grant must be worth more.

An alternative way to think about it is that part of what your grant actually affords you is a job right now where each day you receive 100 options that are worth (say) $1 each. But it also affords you the right to a job in 3 years time where each day you receive the same 100 options as before which, after the inevitable tenexxing of the company’s value, are now worth much much more. This right is potentially extremely valuable.

The higher the short-term variance of your company, the larger the I Quit Appreciation. If you can quickly see whether it is going to be huge or a total flop, you can quickly decide whether to move on and try again somewhere else, or to stay and continue to vest your now much more valuable options. Conversely, if you have to stay for a long time before the company’s probable fate becomes apparent, you run the risk of being the proud owner of hundreds of thousands of shares in a smoldering hole in the ground.

# What you should do

When you receive your offer, you should make sure that you also understand:

* The vesting schedule of your options
* Their likely strike price (this will not be definite until your first day of work)
* The total number of outstanding shares
* The TechCrunch value of the company at its most recent round of funding

You can then work of the TechCrunch value of your options and consider the 5 discounts and 1 appreciation:

### The Common Stock Discount
The TechCrunch valuation assumes all preferred stock, but you only have common stock

Significant if: the company has or probably will take a lot of VC money, relative to their current valuation<br/>
Less significant if: the company is and is likely to remain mostly bootstrapped

### The Strike Price Discount
You have to actually buy your shares before you can sell them

Significant if: the company is relatively late stage<br/>
Less significant if: the company is very young

### The Mobility Discount
Leaving this job will be very expensive if you don’t want to lose all your options

Significant if: you don’t have piles of spare money you would like to spend on buying your options years before you can sell them<br/>
Less significant if: you do

### The Tax Discount
You pay a much higher rate of tax than investors do

Significant if: taxes are always significant<br/>
Less significant: you have the money, guts and ability to exercise early whilst the spread between strike price and FMV is low

### The Risk Discount
Your options might end up being worth nothing

Significant if: you are risk averse or the company is still very young and uncertain<br/>
Less significant if: you are comfortable with very high risk, or the company is established and the only real question is when and how much it will IPO for

### The Liquidity Discount
You can’t pay your rent with options

Significant if: you would ideally like to spend the theoretical value of your options in the immediate future<br/>
Less significant if: you already have all the money you could conceivably need right now

### The I Quit Appreciation
If things go badly then you can just leave

Significant if: the company is likely to either go bust or get much more valuable in the near future<br/>
Less significant if: it will take many years to see if the company will succeed or fail

There’s no such thing as the right to buy a free lunch at a fixed price, and I’ve heard smart people suggest that individuals should value options at as little as 20% of their TechCrunch valuation. This feels a little on the low side to me, but I don’t think it’s too far off. Options are just another type of financial asset, and are great to have as long as you value them correctly. However, companies are incentivized to help you wildly over-value them, and so you should think long and hard before accepting any salary cut that is justified by options.

*Thanks to Carrie Bentley for reading drafts of this*

### Further reading:

* [Wealthfront series on stock options](https://blog.wealthfront.com/improving-tax-results-stock-options-restricted-stock-grants/)
* [Startup Equity for Employees](http://www.payne.org/index.php/Startup_Equity_For_Employees)
* [An angry but on-point rant by Michael O’Church](https://michaelochurch.wordpress.com/2012/07/08/dont-waste-your-time-in-crappy-startup-jobs/)
