$.ajax("data.json?cacheBust="+new Date, {


  success: function (data) {
    var slugify = function (text) {
      return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
    }

    var slugCounter = {};
    for (var itemId in data) {
      var item = data[itemId];
      item.slug = slugify(item.title)
      if (undefined === slugCounter[item.slug]) {
        slugCounter[item.slug] = 0
      }
      slugCounter[item.slug]++
      item.slugNo = slugCounter[item.slug];
      data[itemId] = item;
    }
    for (var itemId in data) {
      var item = data[itemId];

      item.origTtitle = item.title;
      if (slugCounter[item.slug] !== 1) {
        item.title = item.title + " (" + item.slugNo + "/" + slugCounter[item.slug] + ")"
      }
      item.slug = slugify(item.origTtitle + " " + item.slugNo)
      data[itemId] = item;
    }
    console.log(slugCounter)

    for (var item of data) {


      var block = $("<div class=\"regex\"/>");

      block.append($("<h2/>").html(item.title).attr("id", item.slug).click(function () {
        window.location.hash = $(this).attr("id");
      }))

      item.desc = item.desc instanceof Array ? item.desc : [item.desc];
      for (var desc of item.desc) {
        block.append($("<p/>").html(desc))
      }


      block.append($("<pre/>").html(item.regex))
      var regex = new RegExp(item.regex);
      for (var sample of item.samples) {
        var sampleEl = $("<textarea disabled/>").val(sample);
        if (sample.match(regex)) {
          sampleEl.addClass("matching");
        } else {
          sampleEl.addClass("notMatching");
        }
        block.append(sampleEl);
      }


      block.appendTo($("#blocks"))

      /*
      <div class="regex">
        <h2>title</h2>
        <p>desc</p>
        <pre>regex</pre>
        <input type="text" value="/regex/">
      </div>
       */

    }
    var hash = window.location.hash;
    window.location.hash = "";
    window.setTimeout(function () {
      window.location.hash = hash;
    }, 100);
  }


})
