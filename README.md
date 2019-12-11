# RE:SS3D Website

Release: [![Build Status](https://travis-ci.org/RE-SS3D/Website.svg?branch=release)](https://travis-ci.org/RE-SS3D/Website)
Develop: [![Build Status](https://travis-ci.org/RE-SS3D/Website.svg?branch=develop)](https://travis-ci.org/RE-SS3D/Website)

## Requirements

- [jekyll](https://jekyllrb.com/docs/installation/)

        gem install jekyll bundler
- [rmagick](https://github.com/rmagick/rmagick)
## Setting up website for local testing (on linux)

    git clone https://github.com/RE-SS3D/Website
    cd Website
    bundle

## Running local website
    bundle exec jekyll serve --watch --host 0.0.0.0
- `--watch` for automatically rebuilding site for any changes
- `--host 0.0.0.0` to make server listen on all IPs, to allow for mobile testing

Website should be accessible at http://localhost:4000/