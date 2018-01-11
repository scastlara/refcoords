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
    this.height = options.height;
    this.container = options.container;
    this.linerule = "\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAMCAIAAAAs6UAAAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4QIBDRArPRYuwAAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAAbSURBVAjXY/j//z8TAwMDDDP/+PEDmc+AJg8ADMsI+M4NFxAAAAAASUVORK5CYII=\"";
    this.linebreak = "\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAMCAIAAAAs6UAAAAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4QIBDTcpCd39iQAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAAeSURBVAjXY/j//z8TAwMD848fP5gYGBjQMQNUHoYBJBMI+DsxSHoAAAAASUVORK5CYII=\"";
    this.seqline = "\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAMCAIAAAAs6UAAAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4QIBDSc1Vx6zlwAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAAdSURBVAjXY/j//z8TAwMD0613P5gYGBhwYQaoOgAGBQjPJ0hVoAAAAABJRU5ErkJggg==\"";
    var css = document.createElement("style");
    css.type = "text/css";

    css.innerHTML = `
    #pfam-line-table {
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
        padding-left: 1%;
    }
    .pfam-line-tooltip {
        cursor: pointer;
    }
    .pfam-line-tooltip-subtitle {
        font-size: 12px;
        font-style: italic;
    }

    .pfam-line-tooltip:hover {
        cursor: pointer;
        opacity: 0.5;
    }

    .pfam-line-table-td-scale {
        margin-right: 0 !important;
    }

    .pfam-line-table-td-text {
        text-align: center;
        margin-right: 0 !important;
    }
    .pfam-line-table-tr {
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


  drawRule(length, binsize) {
      // This function creates a Reference rule using images. It takes
      // the length of the sequence and the binsize in characters.

      // Basic HTML
      this.reference = "<tr class='pfam-line-table-tr'>";
      this.reference    += "<td class='pfam-line-table-td-name'><strong>Reference</strong></td>";
      this.reference    += "<td class='pfam-line-table-td-line'>";
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
      this.scale = "<tr class='pfam-line-table-tr'>" +
                            "<td class='pfam-line-table-td-name'></td>" +
                            "<td class='pfam-line-table-td-line'>" +
                                "<div class='pfam-line-table-td-text' style='width:" + (bin_width + 1) + "%;" +
                                "margin-left:" + scale_offset + "%;'>" + binsize + " aa</div>" +
                            "</td>" +
                         "</tr>";
      this.scale += "<tr class='pfam-line-table-tr'><td class='pfam-line-table-td-name'></td><td class='pfam-line-table-td-line'>" +
                            "<img class='pfam-line-table-td-scale' src=" + this.linerule + " style ='width:0.5%; height:12px;" + "margin-left:"  + scale_offset + "%;'>" +
                            "<img src=" + this.linerule + " style='width:" + bin_width + "%;height:12px;'>" +
                            "<img src=" + this.linebreak + " style ='width:0.5%; height:12px;'>" +
                            "</td></tr>";
      for (var i = 0; i <num_of_bins; i++) {
          var s_rule = i*binsize + 1;
          var e_rule = (i+1)*binsize;
          percentage += bin_width + 0.5;
          this.reference  += "<img class='pfam-line-tooltip' " +
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
          this.reference    += "<img class='pfam-line-tooltip' " +
                          "src=" + this.linerule +
                          " style='width:" + remaining + "%;height:12px;' "  +
                          "title='<table class=\"domain-table\">" +
                              "<tr><td>From: </td><td>" + num_of_bins * binsize + "</td></tr>" +
                              "<tr><td>To: </td><td>"   + length + "</td></tr></table>'" + ">";
      }

      // Close row
      this.reference    += "</td></tr>";
      return this;
  }

  addSequence(name, start, end, istart, iend) {
      /**
       * name: name of the sequence to add
       * start: start position in reference
       * end: end position in reference
       * istart: start position for sequence
       * iend: end position for sequence
       */
  }
}



function toNewScale(start, end, length) {
    // This function takes twoo coordinates (start and end), and the
    // length of a given sequence and returns the corresponding width
    // percentage of the sequence start->end on a sequence of length
    // "length". It also returns the new "start" coordinate.
    // It basically converts coordinates to percentages.
    var width = Math.round(((end - start) / length) * 10000) /100;
    var newstart = Math.round((start/length)* 10000)/100;
    return {'width': width, 'newstart': newstart}
  };
