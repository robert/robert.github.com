---
layout: post
title: "Matrices"
tags: [Programming]
og_image: https://robertheaton.com/images/phone-tradeoff/cover.jpg
published: false
---
I do my best - and stupidest - work on the 11 hour flight from London to SFO. I built [PySkyWiFi](http://robertheaton.com/pyskywifi) ("tunnel your internet traffic through the name field of your airmiles account") while thirty thousand feet above Greenland. I made [MinorMiner](https://robertheaton.com/minor-miner/) ("mine Bitcoin using children's maths homework") while swinging down over central Canada.

But I also have a real job, with "critical requirements" and "massively-overdue deadlines." So on my most recent flight to SF I dug into "[How To Scale Your Model](LINK)," a book by a crew of Google researchers about efficiently training and serving giant ML models using TPUs (Tensor Processing Units).

Chapters 1 and 2 were straightforward enough, but I ran into real trouble with Chapter 3 - "[Sharded Matrices and How to Multiply Them](https://jax-ml.github.io/scaling-book/sharding/)." The chapter began gently, describing matrix sharding with lots of diagrams and examples. But when the chapter got to multiplying those sharded matrices together, the diagrams vanished, replaced by formal notation that I had to keep looking up.

So I drew lots of pictures and worked through lots of examples, and by the end of the flight I'd got it. Now I've turned my pictures and examples into this blog post. The post contains the exact same content as the second half of "[Sharded Matrices and How to Multiply Them](https://jax-ml.github.io/scaling-book/sharding/)," only it goes much slower and has a lot more diagrams.

Let's begin.

---

Our task is to take matrix A and matrix B, and multiply them to produce a third matrix, C. That's it.

![Introduction to matrices A, B, and C](./images/sharded-matrices/intro_matrices_A_B_C.png)

When A and B are small (like in the picture above), multiplying them is easy. We don't need any specialised hardware or techniques. A spreadsheet and a laptop from 2004 would suffice. Or an A5 piece of paper.

In modern AI, however, A and B are usually gigantic. Large Language Models contain matrices with hundreds of millions of parameters each. To efficiently multiply matrices this large, we need to use specialised chips (or *devices*) like GPUs or TPUs, which are optimized for matrix arithmetic. However, some matrices are so large that they don't fit in memory on one of these devices. To work with such jumbo matrices, we need to distribute, or *shard*, them across many devices. Once we've figured out how best to distribute them, we still need to be able to multiply them, despite the fact that they're now spread over hundreds of different chips.

Let's look at how to shard a matrix. After that we'll get on to how to multiply them.

### How to shard a matrix

Sharding a matrix means splitting it up into small chunks and storing each chunk on a different device. Sharding allows us to perform calculations faster and to use matrices larger than what we could fit on a single device.

We can shard a matrix across a mesh of devices in different ways. When describing how a matrix is sharded, we call the matrix dimensions I and J, and the device mesh dimensions X and Y:

![How to scale your model](./images/sharded-matrices/sharding-colored1.png)

*Diagram from [How to scale your model](https://jax-ml.github.io/scaling-book/sharding/)*

We can split the matrix up into pieces that are as tiny as possible, with no replication:

![Maximally sharded matrix with each device having a tiny piece](./images/sharded-matrices/sharding_tiny_shards.png)

Or we can duplicate some parts of the matrix across multiple chips:

![Matrix with partial replication - rows sharded, columns duplicated](./images/sharded-matrices/sharding_some_duplication.png)

Which configuration is optimal for a given use case depends on the precise series of calculations that you need to do. In this post we won't look at how to choose a sharding configuration, just how to perform calculations on a given configuration. [How to scale your model](https://jax-ml.github.io/scaling-book/sharding/#case-3-both-multiplicands-have-sharded-contracting-dimensions) has much more detail on the details and notation of sharding, including this handy picture showing all the different sharding configurations for a 2-D device mesh:

![How to scale your model](./images/sharded-matrices/sharding-colored5.png)

*Diagram from [How to scale your model](https://jax-ml.github.io/scaling-book/sharding/)*

Matrix sharding is a powerful tool, but it makes even a simple operation like multiplication much more complex. In the rest of this post, we'll look at how to multiply two matrices, even when they've been chopped up and parcelled out across hundreds of TPUs.

## How to multiply sharded matrices

Writing a program to multiply two unsharded matrices is trivial. We just have to multiply rows by columns, over and over again. We don't have to worry about how or where we access or store data. All of the elements in the input and output matrices are accessible to us directly.

By contrast, multiplying two sharded matrices requires much more care. We still need to multiply rows by columns, but now a row and a column might be stored on completely different chips. A single row or column might even have been chopped up and split across multiple chips. We have to think carefully about which device has our data, and which device we should store our results on.

When multiplying two sharded matrics, the device-level techniques that we use depend on exactly how the matrices are sharded. Different sharding configurations fall into different cases, and each case requires different techniques.

Fortunately, there are only 4 of them.

### The 4 sharding cases

Our goal is always the same: to multiply A by B to produce C. In each of the sharding cases below, the logical input matrices A and B are always the same. Multiplying them together always produces the same logical output matrix C. The only thing that changes is how the matrices are sharded and the techniques that we use to perform the multiplication.

I'll list the 4 cases, and then I'll explain what they mean and why they're divided up this way:

1. No inputs have a sharded contracting dimension
2. One input has a sharded contracting dimension
3. Both inputs have a sharded contracting dimension, along the same axis
4. Both inputs have a sharded non-contracting dimension, along the same axis

Reading this list, the first question that we need to answer is clearly: what is a contracting dimension, and why is it so important?

### The contracting dimension

Cases 1, 2, and 3 are defined by whether A and/or B have a sharded *contracting dimension*. In a matrix multiplication, the contracting dimension is the dimension that is summed over when one of A's row is multiplied by one of B's columns. A's contracting dimension is its rows; B's is its columns. Because the contracting dimension is summed over, it effectively disappears - or contracts.

![Contracting dimension illustration](./images/sharded-matrices/contracting_dimension_explained.png)

A's contracting dimension is its rows. If A has sharded rows, this means that each of its individual rows are split across multiple devices. If A does not have sharded rows, each of its rows has all of its data on a single device.

![A sharded vs not sharded on contracting dimension](./images/sharded-matrices/A_contracting_sharded_vs_not.png)

Note that whether A's individual rows are sharded is an entirely separate question to whether all of its rows are on the same device. A's rows can be individually unsharded, while still being distributed across different devices.

![A sharded on non-contracting dimension](./images/sharded-matrices/A_noncontracting_sharded.png)

By contrast, B's contracting dimension is its columns. If B has sharded columns, this means that each of its columns are split across multiple devices. If B does not have sharded columns, each of its columns has all of its data on a single device.

![B sharded vs not sharded on contracting dimension](./images/sharded-matrices/B_contracting_sharded_vs_not.png)

Once you know whether A and B have a sharded contracting dimension, you can use the list of cases above to check which techniques you need to use in order to multiply them. But knowing what a sharded dimension is doesn't answer the question: why is the contracting dimension so important?

To see why, let's compare Cases 1 and 2.

### Case 1: neither input has a sharded contracting dimension

Case 1 looks like this:

![Case 1 setup with full rows and columns](./images/sharded-matrices/case1_setup_full_rows_cols.png)

When you perform the matrix multiplication `A . B`, you multiply A's rows by B's columns. In Case 1, this is easy! Neither A nor B has a sharded contracting dimension. This means that each of A's individual rows and B's individual columns are located on single devices. Each device has some of A's rows, and some of B's columns. Each device can easily multiply its rows and columns together, without needing to retrieve any data from any other device.

![Matrix multiplication row times column](./images/sharded-matrices/matmul_row_times_column.png)

As we'll see, in cases 2 and 3, A's rows or B's columns are split across multiple devices (ie. one or both matrices have a sharded contracting dimension). This means that no device has enough information to fully multiply a row by a column without communicating with other devices. We'll see how we handle this shortly.

Case 1 requires neither A nor B to have a sharded contracting dimension. However, they are allowed to have a sharded non-contracting dimensions. This means that each device might only have a fraction of A's rows and B's columns. So what does the output matrix C look like? How is it sharded?

#### How is C sharded?

The simplest case is when both A and B are completely unsharded. In this case, each device has its own copy of both matrices, and so each device can multiply all of their rows and columns and independently produce a full, unsharded copy of C.

![Unsharded multiplication](./images/sharded-matrices/case1_unsharded_multiplication.png)

Each device performs the same calculations and produces the same results. This might feels wasteful. It might feel more efficient to split the calculation up, have each device perform a piece of it, and then combine their partial results. However, shipping data between devices is very slow, whereas performing calculations is very fast. This means that our top priority is to minimise the amount of data that we send between devices, even if this means duplicating some calculations. When given a choice between sending data between devices or duplicating a calculation, we almost always duplicate the calculation.

What if A or B has a sharded non-contracting dimension? In this case, each device multiplies the rows and columns that it has stored on it, without exchanging any data between them. It turns out that this produces a sharded copy of C, with its sharding configuration inherited from that of A and B. So long as we aren't in the pathological Case 4 (see below), combining all of the new shards computed on each device reproduces the full, logical matrix C. In Case 1, multiplying shards of A with shards of B produces shards of C.

![Case 1 local multiplication](./images/sharded-matrices/case1_local_multiplication.png)

C inherits the sharding of A and B's non-contracting dimensions. The general rule for sharding inheritance is:

```
A[Ip, Jq] * B[Jr, Ks] = C[Ip, Ks]
```

Since we are in Case 1, neither A or B has a sharded contracting dimension (which in the above equation is dimension `J`). This means that the general equation above becomes:

```
A[Ip, J] * B[J, Ks] = C[Ip, Ks]
```

We can see that in Case 1, C inherits its column sharding from A, and its row sharding from B.

Case 1 is the simplest case. But what happens if one of A or B has a sharded contracting dimension?

### Case 2: one input has a sharded contracting dimension

In Case 2, one out of A or B has a sharded contracting dimension. For simplicity we'll consider the case where A has a sharded contracting dimension (its rows), but the same logic applies to B and its columns too.

If A's rows are sharded, this means that each of its rows is split across devices. Case 2 looks like this:

![Case 2 A rows sharded](./images/sharded-matrices/case2_A_rows_sharded.png)

Because A's rows are split, no individual device has enough information to fully multiply any of A's rows by any of B's columns.

![Case 2 incomplete row times column](./images/sharded-matrices/case2_incomplete_multiplication.png)

This means that in order to fully multiply one of A's rows by one of B's columns, we need to send data between devices. The most straightforward solution is to perform an `AllGather` operation on A's rows, along whichever axis they are sharded. This operation copies all of the data for a matrix dimension to all devices on a mesh axis. It effectively temporarily "unshards" A's rows. After this `AllGather`, every device contains full, unsplit rows. (see Case 2 in [the TPU book](https://jax-ml.github.io/scaling-book/sharding/#case-2-one-multiplicand-has-a-sharded-contracting-dimension) for a detailed explanation of `AllGather`)

![Case 2 AllGather solution](./images/sharded-matrices/case2_allgather_solution.png)

Now neither matrix is sharded along the contracting dimension. A's contracting dimension has been `AllGather`-ed, and B's contracting dimension was already unsharded. This means that we are back to Case 1! We can proceed as we did in that case. A and B may still have a sharded non-contracting dimension, and C again inherits its column sharding from A and its row sharding from B.

Once we've finished, we can discard the additional elements of A that we `AllGather`-ed, in order to free up memory again and preserve the benefits of sharding.

![Case 2 discard gathered data](./images/sharded-matrices/case2_discard_gathered.png)

#### So why is the contracting dimension so important?

Now we see why our choice of multiplication technique depends on whether A or B have a sharded contracting dimension. The way in which the contracting dimension is sharded dictates whether a single device is able to fully multiply a row of A by a column of B on its own, or whether it needs to exchange data with other devices in the mesh in order to re-assemble complete rows and columns first.

We've seen how to multiply sharded matrices if either A or B have a sharded contracting dimension. But what if they both do?

### Case 3: both inputs have a sharded contracting dimension, along the same axis

In Case 3, both A and B have a sharded contracting dimension. A's rows and B's columns are both split up across devices. This means that no device stores an entire row of A, or an entire column of B. We're faced with the same challenge as in Case 2, only this time our problems are doubled! Case 3 looks like this:

![Case 3 both inputs sharded](./images/sharded-matrices/case3_both_sharded.png)

We solved Case 2 by doing an `AllGather` along the sharded input's contracting dimension. This un-sharded it, which meant that we could multiply full rows and columns on each device, like we did in Case 1.

We could solve Case 3 by applying this `AllGather` strategy twice. We could perform an `AllGather` along A's rows, and then another `AllGather` along B's columns. This would un-shard both matrices on their contracting dimension, which would once again bring us back to Case 1. We could multiply the full rows and columns present on each device, before finally discarding the extra `AllGather`-ed elements of both A and B.

![Case 3 double AllGather solution](./images/sharded-matrices/case3_double_allgather.png)

However, performing two `AllGather`s would be very inefficient. We'd have to exchange nearly the full matrix between our devices. This would take an eternity in TPU time! We therefore prefer a different approach that allows us to send much less data.

First, we have each device multiply all of the partial rows and columns that it has stored locally:

![Case 3 partial products](./images/sharded-matrices/case3_partial_products.png)

Next, we sum up these partial results using an `AllReduce` along the X-axis. An `AllReduce` operation takes inputs from many devices, combines them (often - as we do here - using addition), and stores the final result on all devices (see Case 3 in [the TPU book](https://jax-ml.github.io/scaling-book/sharding/#case-3-both-multiplicands-have-sharded-contracting-dimensions) for more details on `AllReduce`). In our case, the `AllReduce` will sum the partial product matrices from each row of devices, and store a copy of the result on each device. Every device ends up with every partial result summed up, and so every device ends up with a full copy of C.

![Case 3 AllReduce solution](./images/sharded-matrices/case3_allreduce_solution.png)

We can see that this produces the correct output by taking the α element of C as an example:

```
We calculate a1 using simple multiplication of the shards of A and B available on a device:
a1 = A*Q + B*S

Same for a2:
a2 = C*U + D*W

We AllReduce along the x-axis to calculate α:
α  = a1 + a2

Substituting in for a1 and a2 gives us:
α  = A*Q + B*S + C*U + D*W

which is the value we would have got by doing the matrix multiplication directly!
```

Performing partial multiplications and then `AllReduce`-ing the results is more efficient than a double-`AllGather`, because it requires transferring much less data between devices. We no longer have to transfer every element in A and B; instead, we only have to have to transfer the partial results.

We now know how to multiply A and B when 0, 1, or 2 of the matrices have a sharded contracting dimension. However, there's one final, pathological Case that we need to consider, and it's the only one that depends on how A and B's non-contracting dimensions are sharded.

### Case 4: both inputs are sharded on a non-contracting dimension, along the same axis

Case 4 looks like this:

![Case 4 setup](./images/sharded-matrices/case4_setup.png)

In this example, neither A nor B has a sharded contracting dimension. This sounds like Case 1, and so you might think this means that each device can fully multiply the rows and columns that it has on it. This produces a correctly sharded output, with no need for any delicate techniques. Easy! Right?

Wrong! Let's multiply our rows and columns and see what happens:

![Case 4 multiplication result](./images/sharded-matrices/case4_multiplication_result.png)

Look at the shards of C. Imagine combining them all together to produce the full, logical version of C. This reconstituted matix would only have the diagonal shards! The off-diagonal shards would be missing.

![Case 4 missing off-diagonal](./images/sharded-matrices/case4_missing_offdiagonal.png)

This is because, as we saw in Case 1, the result of multiplying two sharded matrices together inherits the sharding of A and B's non-contracting dimensions. Recal that the general equation for sharding inheritance is:

```
A[Ip, Jq] * B[Jr, Ks] = C[Ip, Ks]
```

In Case 4, both A and B are sharded on a non-contracting dimension, on the same axis. This means that both of C's dimensions end up sharded along the same axis:

```
A[Ix, J] * B[J, Kx] = C[Ix, Kx]
```

However, `C[Ix, Kx]` is a forbidden, nonsense sharding configuration, because it always results in the diagonalisation problem that we see here. Directly multiplying `A[Ix, J]` and `B[J, Kx]` always results in this kind of absurd configuration, and so doing so is illegal. Instead, we have to use an `AllGather` to un-shard one of the non-contracting dimensions first. This `AllGather` takes us to either Case 1, Case 2, or Case 3, depending on how A and B's contracting dimensions are sharded. We can then proceed using techniques that we've already learned.

![Case 4 solutions via AllGather](./images/sharded-matrices/case4_solutions.png)

We've dealt with the final, pathological Case, and so now we know how to execute every type of sharded matrix multiplication!

---

We've learned that:

1. Which techniques you use in order to multiply two sharded matrices depends primarily on whether 0, 1, or 2 of your input matrices are sharded on the contracting dimension
1. There's an additional, special case that depends on whether both inputs are sharded on a non-contracting dimension, along the same axis.

If you haven't already, read "[Sharded Matrices and How to Multiply Them](https://jax-ml.github.io/scaling-book/sharding/)." If you have, read it again - there are lots of details and side-notes that I've glossed over here in favour of colourful diagrams, and I bet that those details will make a lot more sense now.

Happy training!