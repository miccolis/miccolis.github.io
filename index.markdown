---
title: miccolis.github.io index
layout: home
---
<ul>
    {% for post in site.posts %}
        <li class="content">
            <div class="is-size-5">
                <a href="{{ post.url }}">
		    {% if post.fulltitle %}{{ post.fulltitle }}{% else %}{{post.title}}{% endif %}
		</a>
            </div>
            <div class="is-size-6 has-text-grey">{{ post.date | date: "%Y-%m-%d" }}</div>
        </li>
    {% endfor %}
</ul>
