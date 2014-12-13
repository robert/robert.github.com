---
title: Green Waves on an arbitrary Valencia Street
layout: post
---
The tall, dark, handsome man stood atop Bernal Heights and looked out over San Francisco, the wind gently tousling his perfect bedhead of hair. The man had loads of friends, but tonight he needed solitude. It wasn't that he didn’t have options for other things to do that evening, he had turned down like five different invitations to five really cool parties. He could have easily gone to a bar and scored with a 6, maybe even a 7 if he could be bothered. But sometimes you need the perspective and quietude that only a nighttime panorama can give.

He looked out over the Mission District. Guerrero Street. Valencia Street. Mission Street. South Van Ness Street. Fulsom Street. Harrison Street. The street after Harrison Street. Traffic lights blinked from red to green to orange to red to green, and people obeyed.

He considered the Valencia Street Green Wave, its traffic lights set so that a cyclist traveling at 13mph would hit green lights from start to finish, shielded from all hardship or challenge. Was such a cyclist really even alive?

He meditated on how interesting it was that it was possible to create Green Waves along both directions of the same street at the same time, and how interesting he was for finding this interesting. He thought that he could probably craft a thrilling blog post out of this. He was right.

My friends, that man was me, and this is that blog post.

<h3>The Problem</h3>

As you may have already worked out, it is actually incredibly trivial to create Green Waves along both directions of the same street. But the real, related and very interesting question is:

> How can you create Green Waves along every single road of a completely irregularly spaced grid of roads, where each road has a completely different speed limit?

Using some simple maths, let's find out.

<h3>Definitions</h3>

We define a Green Wave to be a set of rules for deciding traffic light colors and initial bike placement such that:

* Any bike that is moving at t=0 will also always be moving at t>0
* 50% of the road in each direction is covered with bikes
* Each traffic light is green 50% of the time

Before town planners start contacting me with offers of fame and stardom, I should note that we will make several typically mathematical assumptions.

* Roads are 1-D lines
* Bikes and traffic lights are 0-D point particles that can pass straight through each other
* Bikes can stop and start instantaneously, with no acceleration time
* Bikes never turn corners and only travel in straight lines
* And no doubt several others assumptions that I haven’t noticed

We will start simple and work our way up. The real world practicalities of some of our solutions may get a little stupid, but the proofs are elegant as balls, so we elect to not care.

<h3>1. Single road with evenly spaced lights</h3>

<img src="/images/gw/case1demo.jpg" />

This is the trivial base case upon which all else depends. The lights are spaced a distance `d` apart, and the Green Wave speed limit is `v.

The solution, which can be shown to be correct by simple inspection, is:

At `t=0`:

* Consecutive lights start alternately red and green
* Lines of bikes of length `d` stretch backwards from each green light to the previous red light

<img src="/images/gw/case1zero.jpg" />

Then every `T = d/v`, all traffic lights switch colour.

<img src="/images/gw/case1positive.jpg" />

At `t=T`, the first bike in each line will have just reached the next light, which will be turning green, and the last bike in each line will have just passed their first light, which will be turning red. This works in both directions, and we have our first Green Wave.

<h3>2. Single road with irregularly spaced lights</h3>

<img src="/images/gw/case2demo.jpg" />

At first glance, this case appears much less straightforward. But it is no match for our desire to promote alternative forms of transport.

Notice that, regardless of the arrangement, it will always be possible to add additional imaginary lights until we have a regularly spaced line. These real and imaginary lights will be separated by a distance `d_eff`, equal to the <a href="http://en.wikipedia.org/wiki/Greatest_common_divisor" target="_blank">Highest Common Factor</a> (HCF) of all of the distances between consecutive real lights.

For example, say we have lights at positions `{0, 4, 6, 12}`, giving us distances between lights of `{4, 2, 6}`. The HCF of these distances is 2, so we add imaginary lights at `{2, 8, 10}`, and now have a road of equally spaced lights, separated by a distance `d_eff` of 2.

<img src="/images/gw/case2imaginary.jpg" />

We know that this has a Green Wave solution as outlined in case 1. But notice that this new configuration is strictly more constrained than the configuration that we started with. This means that any solution for the new, regular configuration will also give us a solution for the initial, irregular configuration that we are solving for. The solution for the new configuration is, per case 1:

At `t=0`:

* Lights at 0, 4, 8, 12 set to green, lights at 2, 6, 10 set to red
* Lines of bikes of length 2 stretch backwards from each green light to the previous red light

Then every `T = d_eff/v = 2/v`, all traffic lights invert color.

To solve for the irregular, real case, we simply set the real lights to be whatever they are required to be in the regular, imaginary case, and throw away the imaginary lights that we added.

<img src="/images/gw/case2real.jpg" />

In our example, this means:

At `t=0`:

* Lights at 0, 4, 12 set to green, light at 6 set to red
* Lines of bikes of length 2 arranged as above, even though there are no lights next to some of these lines

and once again all traffic light invert color after every `T = 2/v`.

<h3>3. Regular grid with a single speed limit</h3>

<p style='text-align: center'>
<img src="/images/gw/case3demo.jpg" />
</p>

We have solved for an arbitrary single road. Now let’s start combining these roads into a good old-fashioned American city grid. We will start with a regular grid, again with a distance `d` between lights and a universal target speed of `v`. Instead of referring to a light as "green" or "red", we will now refer to it as either "vertical" or "horizontal", depending on which direction it is allowing traffic through.

This basic grid has the solution, again easily verifiable by inspection:

At `t=0`:

* Lights alternate vertical and horizontal across the grid in a checkerboard pattern
* Lines of bikes of length `d` stretch backwards from each green light to the previous red light along the direction of travel

<p style='text-align: center'>
<img src="/images/gw/case3zero.jpg" />
</p>

Then every `T = d/v`, all traffic lights switch direction.

<p style='text-align: center'>
<img src="/images/gw/case3positive.jpg" />
</p>

Each individual road is clearly a case 1 Green Wave, and thus the entire grid is also a Green Wave.

<h3>4. Irregular grid with a single speed limit</h3>

<p style='text-align: center'>
<img src="/images/gw/case4demo.jpg" />
</p>

As you might guess, the solution and proof is very similar to that for an irregular single road. We can add imaginary roads to create a regularly spaced grid, and since we know that this imaginary grid has a solution (given by case 3) and that our actual configuration is less restrictive than this, this solution also works for it. The imaginary roads should be added at spacing `d_eff` equal to the HCF of all of the distances between consecutive lights on all roads.

<p style='text-align: center'>
<img src="/images/gw/case4imaginary.jpg" />
</p>

Detailed example left as an exercise for the reader.

<h3>5. Irregular grid with multiple speed limits</h3>

Finally, the holy grail. We now take an irregular grid, as in case 4, but remove the restriction of a single universal Green Wave speed. Some streets may want to cater for Lance Armstrong, others for Lance Armstrong not tripping his face off. The solution is surprisingly simple, although unsurprisingly kind of stupid.

Notice that a Green Wave that allows bikes to continuously travel at a constant speed `v` also allows them to travel at `v/2`, `v/3`, `v/4` and so on. Conceptually these "harmonics" arise because by the time a bike traveling at `v/4` has travelled from green light to green light, exactly 4 whole inversion cycles have occurred in front of it. It is therefore exactly lined up to take advantage of the 5th cycle, and continue on its steady way.

Therefore, for a <u>regular</u> grid with varying speed limits, we simply need to oscillate a checkerboard pattern (as in case 3) at a frequency that caters for a speed `v_eff` that has all of the different speed limits on the grid as harmonics. This speed is the <a href="http://en.wikipedia.org/wiki/Least_common_multiple" target="_blank">Lowest Common Multiple</a> (LCM) of all of the individual Green Wave speeds. Since `v_eff` is an integer multiple of all individual `v`, all `v` must be harmonics of `v_eff` and therefore able to travel along a Green Wave set for `v_eff`. The entire grid is therefore covered in Green Waves.

For example, say we have Green Wave speeds of `{10, 20, 50, 80}`. The LCM, or `v_eff` of these is `400`, and so we invert the direction of all lights every `T = d/v_eff = d/400`. The initial bike arrangement is different to that for a regular grid, since it has to cater for an effective speed of `400`. The lights will invert every `d/400`, and so the lengths of each group of bikes on each street should be the maximum length that can pass through a green light in this time, given `v_street`, the Green Wave speed for that street. This length is `v_street * T = v_street * d/v_eff`. In the case where all speeds are the same and `v_eff = v_street` (case 3), this reduces to `d`, as expected.

We now generalise this solution to an irregular grid, in exactly the same way as in case 4. We add imaginary roads at a spacing of `d_eff`, where `d_eff` is the HCF of all of the distances between consecutive lights on all roads. We then calculate `v_eff` as above - the LCM of all speeds on the grid. This gives us a `T = d_eff/v_eff`, and bikes arranged in alternating lines of length `v_street*deff/v_eff`. As always, we use our imaginary checkerboard to assign initial light colours and bike placements, and then oscillate directions accordingly. We sit back and admire our handiwork.

<h3>Conclusion</h3>

Some sample numbers:

For a grid with Green Wave speeds of `{10, 13, 15, 20, 35}` mph, the LCM `v_eff = 5640`
And with blocks of length `{30, 22, 20, 15, 14}` hundredths of a mile, the HCF `d_eff = 1 hundredth of a mile`

So the lights must be oscillated every `T = d_eff/v_eff = 0.01/5640 = 0.0000017 hours`, or `0.006 seconds`

And taking the 20mph street as an example, bikes must be arranged in lines of length `v_street*d_eff/v_eff = 20*0.01/5640 = 0.000036miles`, or `5cm`.

Assuming your city is made up of bikes and people of no more than 5cm in length, has lights capable of switching between green and red a thousand times per second, and has pedestrians capable of navigating this terrifying combination, you may want me to design your traffic system. My rates are unreasonably expensive, especially given the appalling results, and my <a href="https://twitter.com/robjheaton">Twitter handle</a> can be found below.

<hr>

<i>Thanks to <a href="https://twitter.com/sidd">Sidd</a> and <a href="https://twitter.com/kiranb">Kiran</a> for their help with this puzzle.</i>
