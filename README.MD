# 3D Pulsar Data

## (a.k.a. _Unknown Pleasures_ generator)

This is a quick (very quick!) page to generate 3D models like [this one](https://www.thingiverse.com/thing:3727917). That one was made in OpenSCAD using `rotate_extrude` on some DXF data provided in an [earlier model](https://www.thingiverse.com/thing:92971). This page uses JSCAD so it can run entirely in your browser.

It's been about two years since I've used React, so I'm quite rusty! Please let me know if my code could be improved! I am using browserify and babel to transpile the React code for the web, and I'm very unfamiliar with both those tools, so the build chain can probably be improved as well.

Live demo on [my website](https://www.settinger.net/etc/pulsar/). You can use [the sample .csv](https://github.com/settinger/pulsar_generator/blob/main/SampleData.csv) from the root of this repo.

TO DO:

- Improve layout
- Provide a better method of inserting your own waveforms
- Add additional parameters (width in x-direction, height of each waveform, add a base below the waveforms and/or a frame around them)
- Provide a 2-d view of the waveforms (maybe SVG export?)
