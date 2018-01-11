# Refcoords.js

No-nonsense javascript to map sequence or domains or whatever coordinates onto a reference using tables and static images.

## Usage


```html
<html>
  <head>
    <title>MyExample</title>
  </head>

  <body>
    <!-- Div with the thing -->
    <div id="cont"></div>

    <!-- Load it -->
    <script src="refcoords.js"></script>

    <!-- Do it -->
    <script>
      var theCoords = new RefCoords({'container':'cont'});
      // Add reference coordinates (length, binsize)
      theCoords.addReference(90, 3);

      // Add sequences
      // (name, reference-start, reference-end, sequence-start, sequence-end, sequence-length)
      theCoords.addSequence('myseq1', 20, 50, 1, 30, 50);
      theCoords.addSequence('myseq2', 40, 63, 2, 25, 25);

      // Draw the thing
      theCoords.draw();
    </script>
  </body>

</html>

```

<img src="https://raw.githubusercontent.com/scastlara/refcoords/master/static/screenshot.png"  width=800/>


## License
[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by/4.0/)

