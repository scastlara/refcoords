/**
 * Simple javascript to create a reference sequence and
 * individual sequences mapped over it
 */
class RefCoords {
  /**
   * Takes arguments:
   *    container: 'id'
   *    height: 'Xpx'
   */

  constructor(options) {
    var defaults = {
      container: 'rule',
      height: '12px',
      binsize: 50

    }
    for (var key in defaults) {
      if (!options.hasOwnProperty(key)) {
        options[key] = defaults[key];
      }
    }
    this.reference  = "";
    this.sequences  = [];
    this.rulelength = 0;
    this.height     = options.height;
    this.container  = options.container;
    this.linerule   = "\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAMCAIAAAAs6UAAAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4QIBDRArPRYuwAAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAAbSURBVAjXY/j//z8TAwMDDDP/+PEDmc+AJg8ADMsI+M4NFxAAAAAASUVORK5CYII=\"";
    this.linebreak  = "\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAMCAIAAAAs6UAAAAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4QIBDTcpCd39iQAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAAeSURBVAjXY/j//z8TAwMD848fP5gYGBjQMQNUHoYBJBMI+DsxSHoAAAAASUVORK5CYII=\"";
    this.seqline    = "\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAMCAIAAAAs6UAAAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4QIBDSc1Vx6zlwAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAAdSURBVAjXY/j//z8TAwMD0613P5gYGBhwYQaoOgAGBQjPJ0hVoAAAAABJRU5ErkJggg==\"";
    this.seqend     = "\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAMCAIAAAAs6UAAAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4QIBDS0BjEWvqAAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAAMSURBVAjXY2AgDQAAADAAAceqhY4AAAAASUVORK5CYII=\""
    this.initCss();
    
  }

  initCss() {
    var css = document.createElement("style");
    css.type = "text/css";

    css.innerHTML = `
    #line-table {
        width: 100%;
        font-size: 12px;
        color: #777777;
    }
    .domain-table {
        font-size: 12px;
        width: 100%;
        color: #777777;
    }
    .domain-table td {
        padding-left;
    }
    .line-tooltip {
        cursor: pointer;
    }
    .line-tooltip-subtitle {
        font-size: 12px;
        font-style: italic;
    }
    .line-tooltip:hover {
        cursor: pointer;
        opacity: 0.5;
    }
    .line-table-td-scale {
        margin-right: 0 !important;
    }
    .line-table-td-line {
        height: 12px;
        width: 80%;
    }
    .line-table-td-name {
        height: 12px;
        width: 20%;
        color: #777777;
    }
    .line-table-td-text {
        text-align: center;
        margin-right: 0 !important;
    }
    .line-table-tr {
        margin-top: 8px;
        height: 20px;
        width: 100%;
    }";.tooltip {
    position: relative;
    display: inline-block;
    border-bottom: 1px dotted black;
  }
`;
    document.body.appendChild(css);
  }

  addReference(length, binsize) {
      // This function creates a Reference rule using images. It takes
      // the length of the sequence and the binsize in characters.

      // Basic HTML
      this.rulelength = length;
      this.reference = "<tr class='line-table-tr'>";
      this.reference    += "<td class='line-table-td-name'><strong>Reference</strong></td>";
      this.reference    += "<td class='line-table-td-line'>";
      if (length <= binsize) {
          this.reference  += '<img style="width:100%;height:"' + this.height + "px" + ';"' + ' src='  +  this.linerule + '>';
      }
      // Get 50 nucleotides in rule scale as percentage
       // We add 1 to have binsize characters from 1 to binsize
      var rule_bins   = toNewScale(1, binsize +1, length);
      var num_of_bins = Math.floor(100 / rule_bins['width']);
      var bin_width   = rule_bins['width'] - 0.5; // The breaks will be 0.5% wide.
      var percentage = 0; // Percentage of the sequence already drawn.

      // Draw scale for the rule
      var scale_offset = 100 - bin_width - 1; // -1 because we remove the two breaks
      this.scale = "<tr class='line-table-tr'>" +
                            "<td class='line-table-td-name'></td>" +
                            "<td class='line-table-td-line'>" +
                                "<div class='line-table-td-text' style='width:" + (bin_width + 1) + "%;" +
                                "margin-left:" + scale_offset + "%;'>" + binsize + " aa</div>" +
                            "</td>" +
                         "</tr>";
      this.scale += "<tr class='line-table-tr'><td class='line-table-td-name'></td><td class='line-table-td-line'>" +
                            "<img class='line-table-td-scale' src=" + this.linerule + " style ='width:0.5%; height:12px;" + "margin-left:"  + scale_offset + "%;'>" +
                            "<img src=" + this.linerule + " style='width:" + bin_width + "%;height:12px;'>" +
                            "<img src=" + this.linebreak + " style ='width:0.5%; height:12px;'>" +
                            "</td></tr>";
      for (var i = 0; i <num_of_bins; i++) {
          var s_rule = i*binsize + 1;
          var e_rule = (i+1)*binsize;
          percentage += bin_width + 0.5;
          this.reference  += "<img class='line-tooltip' " +
                              "src=" + this.linerule  +
                              " style='width:" + bin_width + "%;height:12px;' " +
                              "title='" +
                              "From: " + s_rule + " "+
                              "To: "   + e_rule + "' >";

          this.reference  += "<img src=" + this.linebreak + "style ='width:0.5%; height:12px;'>";
      }
      // Draw the last bin, which could be less than binsize characters
      var remaining = 100 - percentage;
      if (percentage != 0) {
          var s_rule = (num_of_bins * binsize + 1);
          var e_rule = length;
          if (s_rule < e_rule) {
            this.reference += "<img class='line-tooltip' " +
                           "src=" + this.linerule +
                           " style='width:" + remaining + "%;height:12px;' "  +
                           "title='" +
                              "From: " + (num_of_bins * binsize + 1) + " " +
                              "To: "   + length + " '>";
          }
      }

      // Close row
      this.reference    += "</td></tr>";
      return this;
  }

  draw() {
    /**
     * Draws the table on the specified div "this.container"
     */

     var container = document.getElementById(this.container);
     var htmltoadd = "<table class='domain-table'>" + this.reference;
     for (var i = 0; i <this.sequences.length; i++) {
       console.log("KPASA");
       console.log(this.sequences[i]);
       htmltoadd += this.sequences[i];
     }
     container.innerHTML = htmltoadd + "</table>";

  }

  addSequence(name, start, end, istart, iend, seqlen) {
      /**
       * name: name of the sequence to add
       * start: start position in reference
       * end: end position in reference
       * istart: start position for sequence
       * iend: end position for sequence
       */
       var newcoords = toNewScale(start, end, this.rulelength);
       newcoords['width']    -= 0.4;   // We remove 2x0.2% from the width to have start/ending imgs
       newcoords['newstart'] += 0.2; // We add 0.2% from newstart/offset to allow space for the start img
       var starting = "";
       var ending   = "";
       if (istart == 1) {
           starting = this.seqend;
       } else {
           starting = this.seqline;
       }

       if (iend == seqlen) {
           ending = this.seqend;
       } else {
           ending = this.seqline;
       }

       this.sequences.push([
           "<tr class='line-table-tr'>",
               "<td class='line-table-td-name'>",
                   name,
               "</td>",
               "<td class='line-table-td-line line-tooltip' ",
                   "title='", name, " from: ", start, " to: ", end, " length: ", seqlen, "'>",
                   "<img src=", starting, " style='width: 0.2%; height:12px; margin-left:", newcoords['newstart'], "%; '/>",
                   "<img src=", this.seqline,
                        " style='width:", newcoords['width'], "%; height:12px;'",
                   "/>",
                   "<img src=", ending, " style='height:12px; width:0.2%;'/>",
               "</td>",
           "</tr>"
       ].join(''));

  }
}


function toNewScale(start, end, length) {
    // This function takes two coordinates (start and end), and the
    // length of a given sequence and returns the corresponding width
    // percentage of the sequence start->end on a sequence of length
    // "length". It also returns the new "start" coordinate.
    // It basically converts coordinates to percentages.
    var width = Math.round(((end - start) / length) * 10000) /100;
    var newstart = (Math.round((start/length)* 10000)/100) - 1;
    return {'width': width, 'newstart': newstart}
  };
