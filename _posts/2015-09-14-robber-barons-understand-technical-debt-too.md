---
title: Robber Barons understand technical debt too
layout: post
published: false
---
Like every good blog post about technical debt, I would like to begin by linking to a better blog post about technical debt by Martin Fowler[LINK]. 

--- 

In the best case, technical debt is a deliberate deficiency in your system that you knowingly take on in order to get a feature shipped faster. In the worst case, it is a critical component that you design, write and ship in 4 minutes whilst really super-duper high on a particularly potent brand of Australian glue. In either case, the debt grates away on you and your team and constantly demands "interest" in the form of monkey-patched hotfixes and increased development time. You may one day decide to “pay it off” and refactor away your prudent-tradeoff/hallucinogen-induced-whimsy.

Used correctly this process can be a fantastic tool for making you faster and nimbler. Used incorrectly it can leave you with a depraved, godless mess and a sticky nose.

On a deceivingly related note, between 1880 and 1914, during the era of the Robber Barons[LINK], 160,000 miles of railroad were built in the USA. As the economy boomed and industrialized, people and goods needed and wanted to be transported ever-increasing distances across the ever-expanding country, and for decades the railroad was (figuratively) the only way to travel. 

The American approach to building railways was a textbook strategy of going as fast and cheaply and taking on as much technical debt as physically possible whilst still remaining in business. Christian Wolmar describes it in his wonderful book, “The Great Railroad Revolution”[LINK]: 

“The philosophy was simple - and very different from the approach that prevailed in Europe: get the track laid and the locomotives built, and start running trains as quickly as possible to start generating income, even if that means cutting corners that push up operating costs." 

Furthermore, as Captain Douglas Galton of the Royal Engineers observed at the time, “In a rapidly developing new country, capital is dear”. Early promoters were typically operating on whatever meagre shoestrings they could lay their hands on, and rarely had the luxury of even considering building a high quality railroad. The only thing that mattered was getting to something capable of running trains and producing cash as soon as possible. 

Most directly this meant squeezing every possible mile of cheap track out of every dollar, but it also meant skimping on signaling equipment and level crossing gates on quiet lines through areas of low population. It meant avoiding expensive tunnels like the plague, instead building long and winding routes around the hills. It meant not setting up in-depth server monitoring on fledgling internal tools projects, and building winding and long `JOINS` around the database rather than strategically denormalizing.

This debt played a huge part in allowing the railroad to expand so rapidly, but the interest rate was severe. Ongoing operating costs were sky-high as low-quality rails and equipment quickly wore out, and unacceptable safety shortcuts caused scores of avoidable crashes and passenger deaths. In 1856, an excursion train on the North Pennsylvania Railroad was carrying a thousand Irish Catholic teenagers towards a sunny day out in the park. The excursion train was behind schedule as it sped down a section of single-track, and it smashed head-on into a local service coming in the other direction. The old, rickety stock was already critically overloaded with bodies; fifty-six passengers were killed. This became known as the Picnic Train Disaster.

These one-off excursion trains did not run according to a regular timetable, and signaling and communication equipment was primitive. Drivers rarely knew exactly where other trains around them were. Special cases with limited safeguards are a common source of software technical debt too. You add temporary `skip_important_checks` flags to your method calls so that they will run from the context you want them to, and roll your own, brittle versions of these checks inline instead. Your biggest power user is getting hit by your rate limits, so you hard-code `skip_rate_limits if user == ACE_OF_BASS`. This may, in principle, be fine. Just make sure that your hacks aren't Too Surprising, that you leave your most important invariants and contracts intact, and that you either fix or kill your changes before they become too difficult to remove or cause something Very Bad to happen.

The Picnic Train Disaster and many similar tragedies contributed to the death of the American love affair with the railroads. Forced by regulation and competition, railroads eventually began paying down their most onerous debts, but not before incurring massive reputational and human costs. The most powerful force in the universe is compound interest, especially when running on a steam-powered fork of Wordpress0.0.1(alpha). 

Wisely managed technical debt can help with all kinds of problems, whether you’re moving people, parsnips or push notifications. The idea of cutting corners now in order get to the future faster is very far from unique to software development, and neither is the concept of (often unfairly) resenting your past self and colleagues for doing so.

But be careful. Even when you’re not directly responsible for thousands of 19th century lives, there are some corners that you cannot afford to cut.
