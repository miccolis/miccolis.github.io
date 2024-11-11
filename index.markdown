---
title: miccolis.github.io index
layout: home
---
<ul>
    {% for post in site.posts %}
        <li class="content">
            <div >
                <a class="is-size-5" href="{{ post.url }}">{{post.title}}</a>
            </div>
            <div>
                <span class="is-size-6 has-text-grey">{{ post.date | date: "%Y-%m-%d" }}</span>
                {% for tag in post.tags %}
                <span class="tag">{{ tag }}</span>
                {% endfor %}
            </div>
        </li>
    {% endfor %}
</ul>
