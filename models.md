---
layout: default
title: Models
permalink: /models/
---
# Yay authors:

<ul>
{% for author in site.data.authors %}
  <li>
    {{ author.name }}
  </li>
{% endfor %}
</ul>

# Yay models:

<ul>
{% for model in site.data.models %}
  <li>
    {{ model.file }} - By: {% for author in model.authors %} {{ author.name }} {% endfor %}
  </li>
{% endfor %}
</ul>

<div id="info">
    <a href="http://threejs.org" target="_blank" rel="noopener">three.js</a> - FBXLoader<br />
    Character and animation from <a href="https://www.mixamo.com/" target="_blank" rel="noopener">Mixamo</a>
</div>
<script type="text/javascript" src="{{ site.baseurl }}/assets/js/main-bundle.js"></script>