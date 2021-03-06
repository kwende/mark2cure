Date.now = Date.now || function() { return +new Date; };
(function (d) {
    d.each(["backgroundColor", "borderBottomColor", "borderLeftColor", "borderRightColor", "borderTopColor", "color", "outlineColor"], function (f, e) {
            d.fx.step[e] = function (g) {
                        if (!g.colorInit) {
                                        g.start = c(g.elem, e);
                            g.end = b(g.end);
                            g.colorInit = true
                                        }
                        g.elem.style[e] = "rgb(" + [Math.max(Math.min(parseInt((g.pos * (g.end[0] - g.start[0])) + g.start[0]), 255), 0), Math.max(Math.min(parseInt((g.pos * (g.end[1] - g.start[1])) + g.start[1]), 255), 0), Math.max(Math.min(parseInt((g.pos * (g.end[2] - g.start[2])) + g.start[2]), 255), 0)].join(",") + ")"
                    }
        });

    function b(f) {
            var e;
            if (f && f.constructor == Array && f.length == 3) {
                        return f
                    }
            if (e = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(f)) {
                        return [parseInt(e[1]), parseInt(e[2]), parseInt(e[3])]
                    }
            if (e = /rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(f)) {
                        return [parseFloat(e[1]) * 2.55, parseFloat(e[2]) * 2.55, parseFloat(e[3]) * 2.55]
                    }
            if (e = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(f)) {
                        return [parseInt(e[1], 16), parseInt(e[2], 16), parseInt(e[3], 16)]
                    }
            if (e = /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(f)) {
                        return [parseInt(e[1] + e[1], 16), parseInt(e[2] + e[2], 16), parseInt(e[3] + e[3], 16)]
                    }
            if (e = /rgba\(0, 0, 0, 0\)/.exec(f)) {
                        return a.transparent
                    }
            return a[d.trim(f).toLowerCase()]
        }
    function c(g, e) {
            var f;
            do {
            f = d.css(g, e);
            if (f != "" && f != "transparent" || d.nodeName(g, "body")) {
                            break
                        }
                        e = "backgroundColor"
        } while (g = g.parentNode);
                return b(f)
                    }
    var a = {
            aqua: [0, 255, 255],
            azure: [240, 255, 255],
            beige: [245, 245, 220],
            black: [0, 0, 0],
            blue: [0, 0, 255],
            brown: [165, 42, 42],
            cyan: [0, 255, 255],
            darkblue: [0, 0, 139],
            darkcyan: [0, 139, 139],
            darkgrey: [169, 169, 169],
            darkgreen: [0, 100, 0],
            darkkhaki: [189, 183, 107],
            darkmagenta: [139, 0, 139],
            darkolivegreen: [85, 107, 47],
            darkorange: [255, 140, 0],
            darkorchid: [153, 50, 204],
            darkred: [139, 0, 0],
            darksalmon: [233, 150, 122],
            darkviolet: [148, 0, 211],
            fuchsia: [255, 0, 255],
            gold: [255, 215, 0],
            green: [0, 128, 0],
            indigo: [75, 0, 130],
            khaki: [240, 230, 140],
            lightblue: [173, 216, 230],
            lightcyan: [224, 255, 255],
            lightgreen: [144, 238, 144],
            lightgrey: [211, 211, 211],
            lightpink: [255, 182, 193],
            lightyellow: [255, 255, 224],
            lime: [0, 255, 0],
            magenta: [255, 0, 255],
            maroon: [128, 0, 0],
            navy: [0, 0, 128],
            olive: [128, 128, 0],
            orange: [255, 165, 0],
            pink: [255, 192, 203],
            purple: [128, 0, 128],
            violet: [128, 0, 128],
            red: [255, 0, 0],
            silver: [192, 192, 192],
            white: [255, 255, 255],
            yellow: [255, 255, 0],
            transparent: [255, 255, 255]
        }
})(jQuery);


/*
 *  Models & Collections
 */

NERAnnotationTypeList = Backbone.Collection.extend({
  /* Very simple collection to store the type of
   * Annotations that the application allows
   * for paragraphs */
  model: Backbone.Model.extend({}),

  url: function() { return false; },
  sync: function () { return false; },
});

NERAnnotationTypes = new NERAnnotationTypeList([
  {name: 'Disease', color: '#d1f3ff'},
  {name: 'Gene', color: '#B1FFA8'},
  {name: 'Drug', color: '#ffd1dc'}
]);

NERWord = Backbone.RelationalModel.extend({
  /* A Word model represents each tokenized word present
   * in the paragraph YPet is attached to. */
  defaults: {
    text: '',
    start: null,
    latest: null,
    neighbor: false,
  },

  url: function() { return false; },
  sync: function () { return false; }
});

NERWordList = Backbone.Collection.extend({
  /* Common utils to perform on an array of Word
   * models for house keeping and search */
  model: NERWord,

  url: function() { return false; },
  sync: function () { return false; }
});

NERAnnotation = Backbone.RelationalModel.extend({
  /* Each annotation in the paragraph. An Annotation
   * is composed of an array of Words in order to determine
   * the full text and position which are not
   * explicity set */
  defaults: {
    /* An annotation doesn't exist when removed so
     * we can start them all off at 0 and not need to
     * mix in a null type */
    type_id: 0,
    text: '',
    start: null,
    self: true, // To determine if they're the author's or an opponent's
  },

  url: function() { return false; },
  sync: function () { return false; },

  relations: [{
    type: 'HasMany',
    key: 'words',

    relatedModel: NERWord,
    collectionType: NERWordList
  }],

  validate: function(attrs) {
    if(attrs.text == null) {
      return 'We need text!'
    }
  },

  initialize: function() {
    var self = this;
    /* Santize BioC passage or other sources of
     * Annotation information into the Backbone model
     */
    this.set('id', +this.get('@id'));
    this.unset('@id');
    if(this.get('infon')) {
      _.each(this.get('infon'), function(i) {
        if(!isNaN(i['#text'])) {
          self.set(i['@key'], +i['#text'])
        } else {
          self.set(i['@key'], i['#text'])
        }
      });
      this.unset('infon');
    }
    if(this.get('location')) {
      this.set('start', +this.get('location')['@offset']);
      if(!this.get('text')){
        return false;
      }
      if(this.get('text').length != +this.get('location')['@length']) {
        Raven.captureMessage('Text length and reported @length failure', {extra: {'ann_db_pk': this.get('uid')}});
      }
      this.unset('location');
    }

    /* Find the word instances needed from the
     * instances from the paragraph */
    var selected_words = this.get('paragraph').get('words').filter(function(word) {
      return word.get('start') >= self.get('start') && word.get('start') < self.get('start')+self.get('text').length;
    });
    /*
      var ann_start = +annotation.location['@offset'] - passage_offset;
      var ann_length = +annotation.location['@length'];
      var ann_type_id = +_.find(annotation.infon, function(o){return o['@key']=='type_id';})['#text'];

      var start_match = false;
      var selected = words.filter(function(word) {
        // The Annotation found a word which matches start position exactly
        var starts = word.get('start') == ann_start;
        if (starts) { start_match = true; }
        return starts || ( word.get('start') > ann_start && word.get('start') < ann_start+ann_length );
      });

      try {
        ...
        var words_match = selected.length == _.str.words(annotation.text).length;
        if(words_match==false && start_match==false) {
          Raven.captureMessage('Imperfect Pubtator >> YPet Match', {extra: {
            'selected': selected,
            'annotation': annotation,
            'passage': passage
          }});
        }

      } catch(e) { Raven.captureException(e); }


    */

    this.get('words').each(function(word) { word.destroy(); });
    this.get('words').set(selected_words);

    var words_len = this.get('words').length;
    this.get('words').each(function(word, word_index) {
      if(word_index == words_len-1) { word.set('neighbor', true); }
      word.trigger('highlight');
    });
  },

  toggleType: function() {
    /* Removes (if only 1 Annotation type) or changes
     * the Annotation type when clicked after existing */
    if( this.get('type_id') == NERAnnotationTypes.length-1 || this.get('text') == "") {
      this.destroy();
    } else {
      this.set('type_id', this.get('type_id')+1 );
    }
  }
});


NERAnnotationList = Backbone.Collection.extend({
  /* Utils for the Paragraph Annotations lists
   * collectively */
  model: NERAnnotation,

  url: function() { return false; },
  sync: function () { return false; },

  sanitizeAnnotation : function(full_str, start) {
    /* Return the cleaned string and the (potentially) new start position */
    var str = _.str.clean(full_str).replace(/^[^a-z\d]*|[^a-z\d]*$/gi, '');
    return {'text':str, 'start': start+full_str.indexOf(str)};
  },

  initialize: function(options) {
    this.listenTo(this, 'add', function(annotation) {
      var ann = this.sanitizeAnnotation(annotation.get('words').pluck('text').join(' '), annotation.get('words').first().get('start'));
      annotation.set('text', ann.text);
      annotation.set('start', ann.start);
      this.drawAnnotation(annotation);
    });
    this.listenTo(this, 'change:type_id', function(annotation) {
      this.drawAnnotation(annotation);
    });
    this.listenTo(this, 'remove', function(annotation, collection) {
      /* Must iterate b/c annotation var "words" attribute is
       * empty at this point */
      collection.parentDocument.get('words').each(function(word) {
        word.trigger('highlight', {'color': '#fff'});
        word.set('neighbor', false);
      });

      collection.each(function(annotation) {
        console.log('coll drawing');
        collection.drawAnnotation(annotation);
      });
    });
  },

  drawAnnotation: function(annotation) {
    /* this = NERAnnotationList collection */
    var annotation_type = NERAnnotationTypes.at(annotation.get('type_id'));
    // var parent_document = this.parentDocument || this._parentDocument; // undefined

    /* Draw all the basic background or underlines */
    annotation.get('words').each(function(word, word_index) {
      // if(annotation.get('opponent')) {
        // word.trigger('underline', {'color': annotation_type.get('color')});
      // } else {
      word.trigger('highlight', {'color': annotation_type.get('color')});
      // }
    });

    if(annotation.get('opponent')) {
      var words = annotation.get('words')
      var author_annotations = parent_document.get('annotations');

      var anns = []
      author_annotations.each(function(main_ann) {
        if(main_ann.get('words').contains(words.first()) || main_ann.get('words').contains(words.last())) {
          anns.push(main_ann.cid);
        }
      });

      if(_.uniq(anns).length > 1) {
        /* 2 Different Parent Annotations */
        words.each(function(word) {
          if(word == words.last()) {
            word.trigger('underline-space', {'color': '#fff', 'last_word': true});
          } else {
            word.trigger('underline-space', {'color': annotation_type.get('color'), 'last_word': false});
          }
        });
      }
    }
  }

  /*
    var user_ids = this.model.get('annotations').pluck('user_id');
    //-- Why would these annotations contain multiple user_ids?
    if(user_ids.length >= 1) { console.log('throw error'); }
    var user_id = +user_ids[0];
  */

});


NERParagraph = Backbone.RelationalModel.extend({
  /* Foundational model for tracking everything going
   * on within a Paragraph like Words and Annotations */
  defaults: {
    text: '',
    offset: 0,
  },

  url: function() { return false; },
  sync: function () { return false; },

  relations: [{
    /* Many Words */
    type: 'HasMany',
    key: 'words',

    relatedModel: NERWord,
    collectionType: NERWordList,

    reverseRelation : {
      key : 'paragraph',
      includeInJSON: false,
    }
  }, {
    /* Many Annotations */
    type: 'HasMany',
    key: 'annotations',

    relatedModel: NERAnnotation,
    collectionType: NERAnnotationList,

    reverseRelation : {
      key : 'paragraph',
      includeInJSON: false,
    }
  }],

  initialize : function() {
    /* Extract (tokenize) the individual words */
    var self = this;
    var step = 0,
        space_padding,
        word_obj,
        text = this.get('text'),
        words = _.map(_.str.words( text ), function(word) {
          word_obj = {
            'text': word,
            'start': step
          }
          space_padding = (text.substring(step).match(/\s+/g) || [""])[0].length;
          step = step + word.length + space_padding;
          return word_obj;
        });
    this.set('words', new NERWordList(words));

    // Normalize BioC values
    this.set('offset', +this.get('offset'));
    if(this.get('infon')) {
      _.each(this.get('infon'), function(i) {
        if(!isNaN(i['#text'])) {
          self.set(i['@key'], +i['#text'])
        } else {
          self.set(i['@key'], i['#text'])
        }
      });
      this.unset('infon');
    }

    /* Set the Annotations correctly for this paragraph */
    _.each(this.get('annotation'), function(obj) { obj.paragraph = self; });
    _.each(this.get('annotations'), function(obj) { obj.paragraph = self; });
    if(this.get('annotation') && Array.isArray(this.get('annotation'))) {
      this.set('annotations', new NERAnnotationList(this.get('annotation')));
      this.unset('annotation');
    }

  },
});

NERParagraphList = Backbone.Collection.extend({
  model: NERParagraph,

  url: function() { return false; },
  sync: function () { return false; },
})


/*
 * Views
 */

NERWordView = Backbone.Marionette.View.extend({
  /* View for all direct actions on a word
  * - Model = NERWord
  * - Collection = None
  */
  template: _.template('<% if(neighbor) { %><%= text %><% } else { %><%= text %> <% } %>'),
  tagName: 'span',

  modelEvents: {
    'change:neighbor': function() { this.render(); },
    'change:disabled': 'actOnChangeDisabled',
    'change:latest': 'actOnChangeLatest',
    'change:masked': 'actOnChangeMasked',

    'unclick': 'actOnUnClick',
    'highlight': 'actOnHighlight',
    'underline': 'actOnUnderline',
    'underline-space': 'actOnUnderlineSpace'
  },

  actOnChangeLatest: function(model, value, options) {
    if(this.model.get('latest')) {
      this.model.trigger('highlight', {'color': '#D1F3FF'});
    }
    if(options.force) {
      this.model.trigger('highlight', {'color': '#fff'});
    }
  },

  actOnChangeDisabled: function() {
    if(this.model.get('disabled')) {
      this.$el.css('cursor', 'not-allowed');
    }
  },

  actOnHighlight: function(options) {
    console.log('NERWordView model event: highlight');
    this.$el.css({'backgroundColor': options.color});
  },

  actOnUnClick: function() {
    var $el = this.$el;
    $el.animate({backgroundColor: '#fff'}, 750, function() {
      $el.trigger('mousedown').trigger('mouseup');
    });
  },

  actOnChangeMasked: function() {
    if(this.model.get('masked')) {
      this.$el.css({'color': '#000', 'cursor': 'default', 'opacity': '.5'});
    }
  },

  actOnUnderline: function() {
    var $container = this.$el.parent(),
        pos = this.$el.position(),
        split_end = this.$el.height() >= 30; /* (TODO) Compare to reference single height unit */

    var yaxis = pos.top + this.$el.height() + 2;
    var width = this.$el.width() + 1;

    if (split_end) {
      /* The first part of the word that wraps to the second line */
      var absolute_left = $container.find('span').first().position().left;
      var split_left = $prev.position().left + $prev.width();
      var $prev = this.$el.prev(),
          $next = this.$el.next();

      $container.append('<div class="underline" style=" \
        position: absolute; \
        height: 4px; \
        width: '+ (Math.abs( pos.left+width - split_left)) +'px; \
        top: '+ (pos.top+(this.$el.height()/2)-5)  +'px; \
        left: '+ split_left +'px; \
        background-color: '+ d3.rgb(options.color).darker(.5) +';"></div>');

      /* The reminder on the line below */
      /* (TODO) sometimes it'll split and there will be no next word */
      $container.append('<div class="underline" style=" \
        position: absolute; \
        height: 4px; \
        width: '+ ($next.position().left - absolute_left) +'px; \
        top: '+ yaxis +'px; \
        left: '+ absolute_left +'px; \
        background-color: '+ d3.rgb(options.color).darker(.5) +';"></div>');

    } else {
      $container.append('<div class="underline" style=" \
        position: absolute; \
        height: 4px; \
        width: '+ width +'px; \
        top: '+ yaxis +'px; \
        left: '+ pos.left +'px; \
        background-color: '+ d3.rgb(options.color).darker(.5) +';"></div>');
    }
  },

  actOnUnderlineSpace: function() {
    var $container = this.$el.parent(),
    pos = this.$el.position(),
    color = d3.rgb(options.color).darker(2);

    var yaxis = pos.top + this.$el.height() + 2;
    var width = this.$el.width();
    if(options.last_word) {
      width = width - 5;
      color = '#fff';
    }

    $container.append('<div class="underline-space" style=" \
      position: absolute; \
      height: 4px; \
      width: 5px; \
      top: '+ yaxis +'px; \
      left: '+ (pos.left+width) +'px; \
      background-color: '+ color +';"></div>');
  },

  /* Triggers the proper class assignment
   * when the word <span> is redrawn */
  onRender : function() {
    this.$el.css(this.model.get('neighbor') ?
      {'margin-right': '5px', 'padding-right': '0'} :
      {'margin-right': '0px', 'padding-right': '5px'});

  },

  /* These events are only triggered when over
   * a span in the paragraph */
  events : {
    'mousedown' : 'mousedown',
    'mouseover' : 'mouseover',
    'mouseup'   : 'mouseup',
  },

  mousedown : function(evt) {
    /* Upon first clicking down, flag that entry
     * word as the start of the annotation */
    evt.stopPropagation();
    if(this.model.get('disabled')) { return; };
    this.model.set({'latest': 1});
  },

  mouseover : function(evt) {
    /* When selecting the annotation is ongoing
     * This is likely during dragging over words
     * to make a span selection */
    evt.stopPropagation();
    if(this.model.get('disabled')) {
      this.$el.css({'color': '#000'});
      return;
    };
    var word = this.model,
        words = word.collection;

    /* You're dragging if another word has a latest timestamp */
    if(_.compact(words.pluck('latest')).length) {
      if(_.isNull(word.get('latest'))) { word.set({'latest': Date.now()}); }

      /* If the hover doesn't proceed in ordered fashion
       * we need to "fill in the blanks" between the words */
      var current_word_idx = words.indexOf(word);
      var first_word_idx = words.indexOf( words.find(function(word) { return word.get('latest') == 1; }) );

      /* Select everything from the starting to the end without
       * updating the timestamp on the first_word */
      var starting_positions = first_word_idx <= current_word_idx ? [first_word_idx, current_word_idx+1] : [first_word_idx+1, current_word_idx];
      var selection_indexes = _.range(_.min(starting_positions), _.max(starting_positions));
      _.each(_.without(selection_indexes, first_word_idx), function(idx) { words.at(idx).set('latest', Date.now()); });

      /* If there are extra word selections up or downstream
       * from the current selection, remove those */
      var last_selection_indexes = _.map(words.reject(function(word) { return _.isNull(word.get('latest')); }), function(word) { return words.indexOf(word); });
      var remove_indexes = _.difference(last_selection_indexes, selection_indexes);

      var word, ann;
      _.each(remove_indexes, function(idx) {
        word = words.at(idx);
        word.set('latest', null, {'force': true});
        // (TODO) What is going on here?
        ann = word.get('parentAnnotation');
        if(ann) { ann.collection.drawAnnotation(ann); }
      });
    }
  },

  mouseup : function(evt) {
    /* When selecting the annotation has stopped
     * This could be after a click, drag, or any other
     * event suggesting the selection is over. */
    evt.stopPropagation();
    if(this.model.get('disabled')) { return; };
    var word = this.model,
        words = word.collection;

    var selected = words.filter(function(word) { return word.get('latest') });
    if(selected.length == 1 && word.get('parentAnnotation') ) {
      word.get('parentAnnotation').toggleType();
    } else {
      /* if selection includes an annotation, delete that one */
      _.each(selected, function(w) {
        if(w.get('parentAnnotation')) {
          w.get('parentAnnotation').destroy();
        }
      });
      /* Take the selected words as a whole and make a new Annotation with them */
      console.log(word);
      word.get('parentDocument').get('annotations').create({words: selected});
    };

    words.each(function(word) { word.set('latest', null); });
  }

});

NERWordsView = Backbone.Marionette.CollectionView.extend({
  /* Parent list for REChoices */
  tagName: 'p',
  className: 'paragraph',
  childView: NERWordView,
  childViewEventPrefix: 'word'
});

NERParagraphView = Backbone.Marionette.View.extend({
  /* Initial HTML before a REExtractionList is available
  * - Model = NERParagraph
  * - Collection = None
  */
  template: _.template('<div class="paragraph-box m-t-1"></div>'),
  className: 'paragraphs',

  regions: {
    'words': '.paragraph-box'
  },

  onRender : function() {
    console.log('onRender Para:', this.model.get('annotations'));
    this.showChildView('words', new NERWordsView({'collection': this.model.get('words')}));

    var has_opponent =  _.contains(this.model.get('annotations').pluck('self'), false);
    if (has_opponent) {
      /* Warning: this allows paragraph specific disabiling */
      this.triggerMethod('view:only');
    }
  },

  onViewOnly: function() {
    /* If you're showing a partner's results, disallow highlighting */
    this.$el.css({'color': '#000', 'cursor': 'default'});;
    this.model.get('words').each(function(w) {
      w.set('disabled', true);
    });
    this.$el.css('cursor', 'not-allowed');
  },

  events: {
    // 'mousedown': 'startCapture',
    // 'mousemove': 'startHoverCapture',
    // 'mouseup': 'captureAnnotation',
    // 'mouseleave': 'captureAnnotation',
  },

  // outsideBox: function(evt) {
  //   var x = evt.pageX,
  //       y = evt.pageY;
  //
  //   var obj;
  //   var spaces = _.compact(this.children.map(function(view) {
  //     obj = view.$el.offset();
  //     if(obj.top && obj.left) {
  //       obj.bottom = obj.top + view.$el.height();
  //       obj.right = obj.left + view.$el.width();
  //       return obj;
  //     }
  //   }));
  //   return (_.first(spaces).left > x || x > _.max(_.pluck(spaces, 'right'))) || (_.first(spaces).top > y || y > _.last(spaces).bottom);
  // },
  //
  // leftBox: function(evt) {
  //   return evt.pageX <= this.children.first().$el.offset().left;
  // },
  //
  // startCapture: function(evt) {
  //   if(YPet['convoChannel']) {
  //     YPet['convoChannel'].trigger('mouse-down', evt);
  //   }
  //   var closest_view = this.getClosestWord(evt);
  //   if(closest_view) { closest_view.$el.trigger('mousedown'); }
  // },
  //
  // timedHover: _.throttle(function(evt) {
  //   if(this.outsideBox(evt)) {
  //     var closest_view = this.getClosestWord(evt);
  //     if(closest_view) { closest_view.$el.trigger('mouseover'); }
  //   }
  // }, 100),
  //
  // startHoverCapture: function(evt) { this.timedHover(evt); },
  //
  // captureAnnotation: function(evt) {
  //   var selection = this.collection.reject(function(word) { return _.isNull(word.get('latest')); });
  //   if(selection.length) {
  //     #<{(| Doesn't actually matter which one |)}>#
  //     var model = selection[0];
  //     this.children.find(function(view, idx) { return model.get('start') == view.model.get('start'); }).$el.trigger('mouseup');
  //   }
  // },
  //
  // getClosestWord: function(evt) {
  //   var x = evt.pageX,
  //       y = evt.pageY,
  //       closest_view = null,
  //       word_offset,
  //       dx, dy,
  //       distance, minDistance,
  //       left, top, right, bottom,
  //       leftBox = this.leftBox(evt);
  //
  //   this.children.each(function(view, idx) {
  //     word_offset = view.$el.offset();
  //     left = word_offset.left;
  //     top = word_offset.top;
  //     right = left + view.$el.width();
  //     bottom = top + view.$el.height();
  //
  //     if(leftBox) {
  //       dx = Math.abs(left - x);
  //     } else {
  //       dx = Math.abs((left+right)/2 - x);
  //     }
  //     dy = Math.abs((top+bottom)/2 - y);
  //     distance = Math.sqrt((dx*dx) + (dy*dy));
  //
  //     if (minDistance === undefined || distance < minDistance) {
  //       minDistance = distance;
  //       closest_view = view;
  //     }
  //
  //   });
  //   return closest_view;
  // },
});

NERParagraphsView = Backbone.Marionette.CollectionView.extend({
  /* Parent list for NERParagraphs */
  childView: NERParagraphView,
  childViewEventPrefix: 'paragraph'
});

NERLoadingView = Backbone.Marionette.View.extend({
  /* Initial HTML before a REExtractionList is available
  * - Model = None
  * - Collection = None
  */
  template: '<p>Text Loading...</p>'
});

YPet = Backbone.Marionette.View.extend({
  /* The top level view for all interactions on text
   * this.model = ?
   * this.collection = NERParagraphList
   */
  template: '#ypet-template',

  regions: {
    'text': '#ypet-text',
    'footer': '#ypet-footer'
  },

  initialize: function() {
    var self = this;

    if(!self.options.training && !self.collection) {
      $.getJSON('/document/pubtator/'+self.options.document_pmid+'.json', function( data ) {
        /* The Annotation information has been returned from the server at this point
           it is now safe to start YPET */
        self.collection = new NERParagraphList(data.collection.document.passage);
        self.render();
      });
    }
  },

  onRender: function() {
    if(this.collection && this.model) {
      this.options['collection'] = this.collection;
      this.showChildView('text', new NERParagraphsView(this.options));
      if(this.options.mode == 'ner') {
        this.showChildView('footer', new RelationTextView(this.options));
      } else if (this.options.mode == 're') {
        // var concept_uids = [this.options.concepts['c1'].id, this.options.concepts['c2'].id];
      }
    } else {
      this.showChildView('text', new NERLoadingView());
    };
  }
});

