---
layout: post
title:  "00.00 (year.month) : [insert month] Recap"
date:   2020-00-05 (year-month-day) 06:30:00 +0100    // The date should be the day the devblog is released and becomes part of the link to the post on the site. Also the website will not post with a future date and time.
description: |
    "Description goes here."
image: /assets/img/posts/[insert folder]/Wallpaper.png
image_credit: Image credit - [insert name]
post_credit: Written by - [insert name]
monthly_release: [insert release tag]
---

Cute phrase/quote goes here.

// The devblog is mostly laid out in sections. With the titles of the sections going from large = # (recap section), to medium = ## (content sections), to small = ### (info sections). These are not rules but more like guidelines, take liberty in moving or renaming sections as well as deleting/merging unneeded sections.
// Bold any **names** when referencing someone in a description.
// Use the lines below to include links.

// Linking to internal file:
[Text]({{ site.baseurl }}/[insert folder]/File.format)

// Linking to external file:
[Text](File.Link)

# [Insert Month] Recap

[Insert Recap Summary]

## Special

// 'Special' is any content from other categories specifically intended to show first.

[Insert Description]

[Insert Media]

// Avoid gifs if possible and ensure reasonable file size if you do.
// Use the lines below to format your media by inserting file paths and names.

// Displaying an image:
{% responsive_image path: assets/img/posts/[insert folder]/image1.png template: _includes/srcset.html %}

// Displaying 2 images horizontally:
<div class='horizontal-2' markdown='1'>
  {% responsive_image path: assets/img/posts/[insert folder]/Image1.png %}
  {% responsive_image path: assets/img/posts/[insert folder]/Image2.png %}
</div>

// Displaying 3 images horizontally:
<div class='horizontal-3' markdown='1'>
  {% responsive_image path: assets/img/posts/[insert folder]/Image1.png %}
  {% responsive_image path: assets/img/posts/[insert folder]/Image2.png %}
  {% responsive_image path: assets/img/posts/[insert folder]/Image3.png %}
</div>

// Displaying a slideshow of images (no more than 6 images (mySlides) per page (myRows)):
<div class="slideshow">
  {% include slideshow.html %}
  <div class="mySlides">
    <div class="slide-number">1 / X</div>
    {% responsive_image path: assets/img/posts/[insert folder]/Image1.png template: _includes/srcset.html %}
    <div id="description" class="slide-description">[insert description or delete this div]</div>
  </div>
  <div class="myRows">
    <div class="row">
      <div class="column">
        <img class="thumbs cursor" src="{{ site.baseurl }}/assets/img/posts/[insert folder]/Image1.png" style="width:100%" alt="Image 1" onclick="currentSlide(1)">
      </div>
    </div>
  </div>
</div>   

// Displaying a gif:
{% responsive_image path: assets/img/posts/[insert folder]/gif1.gif template: _includes/srcset-gif.html %}

// Displaying a video:
<video autoplay="autoplay" muted loop="loop" poster="{{ site.baseurl }}/assets/img/posts/[insert folder]/VideoThumbnail.png">
  <source src="{{ site.baseurl }}/assets/img/posts/[insert folder]/Video.webm" type="video/webm">
  <source src="{{ site.baseurl }}/assets/img/posts/[insert folder]/Video.mp4" type="video/mp4">
</video>

## Core-Systems

// 'Core-Systems' is what it sounds like, but I usually change the section name to the name of the system (interaction, atmospherics, tilemaps, chat, etc).

## Sub-Systems

// 'Sub-Systems' is what it sounds like, but I usually change the section name to the name of the system (specific interactions, surgery, jobs, etc).

## Fixes

## Animations

## VFX

## Textures

## Models

## 2D

// '2D' is logos, graphics, decals, etc.

## SFX

// 'Sounds' is sound effects, music, noises, etc.

## Concepts

// 'Concepts' are concept drawings, animations, systems, etc.

## Artwork

// 'Artwork' is artistic wallpapers, animations, etc. (not meant for in-game use).

## Other

// 'Other' is any assets not fit for another section.

// In the future, when submissions are more abundent, consider adding a 'Upcoming' section below this.

### Updates

// 'Updates' is updates events or changes relating to management, systems, or other logistics.

### Notes

// 'Notes' is miscellaneous info that may be of interest (e.g. )

### Conclusion

// 'Conclusion' is the final wrap-up and goodbye, and include the discord link, as tradition.

Goodbye summary goes here. [Discord link]({{ site.discord_url }}){:target="_blank"}.
