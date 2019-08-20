---
layout: default
title: Models
permalink: /models/
---
<div class="split-view-models">
  <div>
    # Yay authors:
    <ul>
    {% for author in site.data.models.authors %}
      <li>
        {{ author.name }}
          <ul>
          {% if author.discord %}
            <li>Discord: {{ author.discord }}</li>
          {% endif %}
          </ul>
      </li>
    {% endfor %}
    </ul>

    # Yay models:

    <ul>
    {% for model in site.data.models.files %}
      <li>
        <label><input name="models" type="checkbox" id="{{ model.file }}">{{ model.file }} - By: {% for author in model.authors %} {{ author.name }} {{ author.discord }} {% endfor %}</label>
      </li>
    {% endfor %}
    </ul>
  </div>
  <div>
    <div id="canvas-container" style="width:100%; height:90vh;"></div>
  </div>
</div>
<script type="text/javascript" src="{{ site.baseurl }}/assets/js/main-bundle.js"></script>
