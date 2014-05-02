---
layout: post
title: Jaccard Similarity and MinHash for winners
---
Suppose you work at Twitter. You want to find celebrities similar to PhilCollins, and decide to do this by comparing his account to a bunch of other accounts and seeing how many followers they share. Since Twitter almost definitely stores all their data in a single MySQL database, you write some SQL:

{% highlight sql %}
    SELECT
         f1.following, COUNT(f1.follower)
    FROM
         follows f1
    INNER JOIN
         follows f2 ON f1.follower = f2.follower
    WHERE
         f1.following IN ('EnriqueIglasias', 'BruceSpringsteen') AND --(etc.)
         f2.following = 'PhilCollins'
    GROUP BY
         f1.following
{% endhighlight %}

Several years later your query finishes JOINing several kajillion rows together and coughs up some data. Even if the query optimizer process the WHERE clause first, these are popular celebrities we are talking about, and still a lot of rows to JOIN. You wish there was a faster way.

You are very happy when you stumble across <a href="http://en.wikipedia.org/wiki/Jaccard_index" target="_blank">Jaccard Similarity</a>.

<h3 style="font-weight: bolder">Jaccard Similarity</h3>

The Jaccard Similarity between two sets A and B is a metric that indicates (unsurprisingly) how similar they are.

{% highlight text %}
    J(A,B) = |A ∩ B| / |A ∪ B|
{% endhighlight %}

`J = 1` if the sets are identical; `J = 0` if they share no members; and clearly `0 <= J <= 1` if they are somewhere in between. It can be expressed literally as “the probability that a random element from the union of two sets is also in their intersection”.

By computing the Jaccard Similarities between the set of PhilCollins's followers (`A`) and the sets of followers of various other celebrities (`B`), you can find the similar celebrities without having to get your hands covered in achingly slow SQL.

However, intersections and unions are still expensive things to calculate. You are therefore even happier when you stumble again across <a href="http://en.wikipedia.org/wiki/MinHash" target="_blank">MinHash</a>, which you think you can use to ultra-efficiently estimate the Jaccard Similarity of your pairs of users.

<h3 style="font-weight: bolder">MinHash</h3>

MinHash uses the magic of hashing to quickly estimate Jaccard Similarities. First, some definitions:

* `h` - a hash function mapping the members of `A` and `B` to distinct integers.
* `hmin(S)` - the member `x` of a set `S` with the minimum value of `h(x)`. To calculate `hmin(S)`, you pass every member of `S` through the hash function `h`, and find the member that gives the lowest result.

We are going to use our literal definition of the Jaccard Similarity in order to estimate it, going via the probability that the `hmins` of two sets are equal.

We calculate `hmin(S)` for the sets `A` and `B`. Suppose it turns out that for our chosen `h`, `hmin(A) = hmin(B)` (call the value `HM`). It clearly must also be true that `HM = hmin(A ∪ B)`, the minimum hash value for the union of the sets. Since `HM` is by definition a member of both sets `A` and `B`, it must therefore also be a member of the intersection of these sets, `A ∩ B`. We therefore have a situation where `hmin(A ∪ B)`, essentially a randomly chosen element from `A ∪ B` due to the random nature of `h`, is also present in `A ∩ B`. This is possible iff `hmin(A) = hmin(B)`, and therefore:

{% highlight text %}
    P[hmin(A) = hmin(B)] = P[hmin(A ∪ B) present in A ∩ B]
{% endhighlight %}

The a priori `P[hmin(A ∪ B) present in A ∩ B]` is simply the ratio of the sizes of these sets:

{% highlight text %}
    |A ∩ B| / |A ∪ B|
{% endhighlight %}
 
Which is of course the Jaccard Similarity. Therefore:

{% highlight text %}
    P[hmin(A) = hmin(B)] = J(A,B)
{% endhighlight %}

If we can estimate this probability, then in doing so we also estimate `J(A,B)`.

<h3 style="font-weight: bolder">Many Hash</h3>

The only restriction on the hash function `h` is that it maps the members of `A` and `B` to distinct integers. Therefore, in Many Hash MinHash, we choose `k` different hash functions, and calculate the `k` values of `hmin` given by these functions for both `A` and `B`. To estimate `P[hmin(A) = hmin(B)]`, and therefore `J(A,B)`, we compare the results. Let y be the number of hash functions for which `hmin(A) = hmin(B)`. We can take `k` as the number of "trials”, `y` as the number of "successes", and so `y/k` as the estimate for the probability and `J(A,B)`.

<h3 style="font-weight: bolder">Single Hash</h3>

Many Hash MinHash requires us to compute the results of multiple hash functions for every member of every set we wish to compare. We then choose a single result to compare per set, per hash function. This is somewhat wasteful, and likely to be computationally expensive. In Single Hash MinHash, we instead compute the result of a single hash function for each member of each set, and compare multiple results from this function.

Again, let `h` be a hash function as above. Define `h(k)(S)` as the subset of the `k` members of `S` with the smallest values of `h`. We define the <i>signature</i> of `S` as `h(k)(S)`, and estimate the similarity of two sets by comparing their signatures. We are again going to use the expression of the Jaccard Similarity as “the probability that a random element from the union of two sets is also in their intersection”.

Let `X = h(k)(h(k)(A) ∪ h(k)(B))`. In English, `X` is the set found by:

1. Finding the `k` members of `A` that give the smallest values of `h`, and then the same for `B`. We have defined these as the signatures of `A` and `B`
2. Taking the union of these two signatures, and finding the `k` members of this set that give the smallest values of `h`

It is relatively straightforward to see that `X` must therefore also be equal to `h(k)(A ∪ B)`, as the `k` smallest values from `A ∪ B` must be drawn from the `k` smallest values from `A` and from `B`, and no other values. Since `h` is a random function, `X` is a random subset (or <a target="_blank" href="http://en.wikipedia.org/wiki/Simple_random_sample">Simple Random Sample</a>) of `k` elements of `A ∪ B`.

Now `Y = X ∩ h(k)(A) ∩ h(k)(B)` is the set of members of `X` that also belong to `A ∩ B`. Returning to simple probability terminology, we have taken a random sample of `k` members of `A ∪ B` (`k` "trials"). `|Y|` of these members also belong to `A ∩ B` (`|Y|` successes). Therefore:

{% highlight text %}
    |Y|/k =~ P[random element from A ∪ B is also in A ∩ B] = |A ∩ B|/|A ∪ B| = J(A,B)
{% endhighlight %}

To recap, to estimate Jaccard Simlarity between 2 sets `A` and `B` by Single Hash MinHash:

1. Choose a hash function `h` and fixed integer `k`
2. Find the signature `h(k)(S)` for each set, where `h(k)(S)` is the subset of the `k` members of `S` with the smallest values of `h`
3. Find `X = h(k)(h(k)(A) ∪ h(k)(B))`
4. Find `Y = X ∩ h(k)(A) ∩ h(k)(B)`
5. `J(A,B) =~ |Y|/k`

It can be shown using <a href="http://en.wikipedia.org/wiki/Chernoff_bound" target="_blank">Chernoff Bounds</a> that both the Single and Many Hash algorithms have expected error `O(1/sqrt(k))`. You would therefore require `k=400` to estimate `J(A,B)` with expected error <= 0.05.

<h3 style="font-weight: bolder">Back to Twitter</h3>

You are excited. But this seems complicated. Is it even any better for finding your similar celebrities than a big SQL join?

It absolutely is. Given the signatures of `A` and `B` (each with `k` elements), `|Y|/k` can be calculated in `O(k)` time. The signatures themselves can be calculated in `O(|A|)` and `O(|B|)` time by simply passing each element in turn through `h`, which is a potentially enormous saving on the `O(|A|*|B|)` pairwise comparisons that would otherwise have to be made. Also note that in our use case, we don’t just have sets `A` and `B`, but also `C`, `D`, `E` and `F`. We only have to calculate each set's signature once, and can then use this signature to rapidly compare it to all other sets we are interested in.

It may now be obvious that the MinHash estimate for Jaccard similarity is essentially a very precise way of sampling subsets of data from our large sets A and B, and comparing the similarities of those much smaller subsets. It can save your databases from grinding to a screeching halt when you want a metric for the similarities between sets, however, the downsampling and abstraction involved mean that it will not help you if you need to actually generate a list of the specific intersections between sets. As with so many things, that is a story for another day.
