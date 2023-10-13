---
layout: post
title: "Hello Deep Learning"
tags: [Programming]
og_image: https://robertheaton.com/images/hello-deep-learning-cover.png
---
Introductions to deep learning are too complicated and spend too much time trying to thrill you with details and real-world applications.

This makes them a frustrating place to start. You already know that deep learning is amazing and that it actually works on real problems. You know that most of the hard work in industry is in the data cleaning. You don't want to set up a new environment, or play with parameters, or get dirty in the data.

<img src="/images/hello-deep-learning-cover.png" />

The actual first thing you want to do is to train a model, as soon as possible, and it doesn't matter how simple it is. Once you've trained your own model you'd be more than happy to learn about overfitting, data cleaning, and splitting strategies as well. But first you just want to create something yourself and see it work.

[*Hello Deep Learning*](https://github.com/robert/hello-deep-learning/) is the missing introduction to deep learning. It's a series of challenges, each of which gives you a task and a perfect, synthetic dataset and asks you to train and play with a trivial model. The challenges cover image generation, text classification, and tabular data, and each one:

- Runs on your laptop
- Trains in a few seconds
- Uses perfect, noiseless, synthetic data that takes seconds to generate
- Has absolutely no sidebars

[*Hello Deep Learning*](https://github.com/robert/hello-deep-learning/) allows you to rapidly experiment with simple models and take your first steps in a calm, kindhearted environment. It gets you ready to leap into the detail and chaos of the real-world.

You can get the challenges, data generation scripts, and setup instructions [on GitHub](https://github.com/robert/hello-deep-learning/). Let me know how you get on; if they're useful then I'll make more!

## The challenges

### 1. Image classification

#### Challenge

Train a classifier that distinguishes between red squares and yellow circles. Your program should be able to:

1. Train a model that can distinguish between squares and circles
2. Use it to run a few individual predictions on specific images
3. Display the confusion matrix

#### Data generation

The repo includes a [script](https://github.com/robert/hello-deep-learning/blob/master/src/generators/shape_images.py) that generates 200 images of circles and 200 of rectangles and saves them in the `data/shapes/` directory.

#### Tips

- I did this using a fastai `vision_learner` based on the `resnet18` pretrained model.
- I mostly copied and stitched together code snippets from [chapter 2 of the fastai book](https://github.com/fastai/fastbook/blob/master/02_production.ipynb)

### 2. Text classification

#### Challenge

Train a classifier that distinguishes between text inputs of positive and negative words, for example `"happy chirpy awesome"` and `"awful terrible heinous"`. Your program should be able to:

1. Train a model that can distinguish between this type of positive and negative input
2. Use it to run a few individual predictions on specific inputs

#### Data generation

The repo includes [a script](https://github.com/robert/hello-deep-learning/blob/master/src/generators/sentiment_text.py) that generates 1000 text files containing positive words and 1000 containing negative words and saves them in the `data/sentiment_text/` directory.

#### Tips

- I did this using a fastai `language_model_learner` based on the `AWD_LSTM` pretrained model, and a fastai `text_classifier_learner`.
- I copied and stitched together code snippets from [chapter 10 of the fastai book](https://github.com/fastai/fastbook/blob/master/10_nlp.ipynb)

### 3. Decision trees

#### Challenge

Train decision trees that reverse-engineer the rules from [src/generators/random_tabular.py](https://github.com/robert/hello-deep-learning/blob/master/src/generators/random_tabular.py) that were used to randomly generate a tabular dataset. Your program should be able to

1. Train a decision tree that reverse-engineers the rules
2. Train a random forest that reverse-engineers the rules
3. Uses these models it to run a few individual predictions on specific inputs
4. Calculates the RMS error on a validation set
5. Visualises the decision tree, using (for example) the [`dtreeviz`](https://github.com/parrt/dtreeviz) library

#### Data generation

The repo contains [a script](https://github.com/robert/hello-deep-learning/blob/master/src/generators/random_tabular.py) that generates 1 JSON file containing 10,000 data points and saves it in the `data/random_tabular/data.json` file.. Each data point contains:

- 6 features: `a`, `b`, `c`, `d`, `e`, and `f`. Each of these is a random integer between 0 and 100.
- 1 label: `y`. This label is derived deterministically from the features using simple rules contained in  [src/generators/random_tabular.py](https://github.com/robert/hello-deep-learning/blob/master/src/generators/random_tabular.py) .

#### Tips

- I did this using an sklearn `DecisionTreeRegressor` and `RandomForestRegressor`.
- I copied and stitched together code snippets from [chapter 9 of the fastai book](https://github.com/fastai/fastbook/blob/master/09_tabular.ipynb)

## My solutions

My solutions are in [`src/examples/`](https://github.com/robert/hello-deep-learning/blob/master/src/examples/) in the repo, although they're not the only way to solve the challenges, and they're almost certainly not the best way to solve them either.

Get the challenges, data generation scripts, and setup instructions [on GitHub](https://github.com/robert/hello-deep-learning/). Let me know how you get on; if they're useful then I'll make more!
