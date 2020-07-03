---
layout: post
title: Programming for Advanced Beginners
---

Specific, actionable ways to make your code cleaner.

[Subscribe to receive PFAB in your inbox every other week, entirely free.](https://advancedbeginners.substack.com/)

<ul>
  {% for post in site.posts %}
    {% for post_tag in post.tags %}
      {% if post_tag == "PFAB" %}
        <li class="mb2">
          <a class="black underline" href="{{ post.url}}">{{ post.title }}</a>
        </li>
      {% endif %}
    {% endfor %}
  {% endfor %}
</ul>
