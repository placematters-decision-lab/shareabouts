var Shareabouts = Shareabouts || {};

(function(S, $, console){
  S.SurveyView = Backbone.View.extend({
    events: {
      'submit form': 'onSubmit',
      'click .reply-link': 'onReplyClick'
    },
    initialize: function() {
      S.TemplateHelpers.insertInputTypeFlags(this.options.surveyConfig.items);

      this.collection.on('reset', this.onChange, this);
      this.collection.on('add', this.onChange, this);
    },

    render: function() {
      var self = this,
          responses = [];

      // I don't understand why we need to redelegate the event here, but they
      // are definitely unbound after the first render.
      this.delegateEvents();

      // Responses should be an array of objects with submitter_name,
      // pretty_created_datetime, and items (name, label, and prompt)
      this.collection.each(function(model, i) {
        var items = S.TemplateHelpers.getItemsFromModel(self.options.surveyConfig.items, model, ['submitter_name']);

        responses.push({
          submitter_name: model.get('submitter_name') || self.options.surveyConfig.anonymous_name,
          pretty_created_datetime: S.Util.getPrettyDateTime(model.get('created_datetime'),
            self.options.surveyConfig.pretty_datetime_format),
          items: items
        });
      });

      this.$el.html(ich['place-detail-survey']({
        responses: responses,
        has_single_response: (responses.length === 1),
        survey_config: this.options.surveyConfig
      }));

      return this;
    },

    remove: function() {
      this.unbind();
      this.$el.remove();
    },

    onChange: function() {
      this.render();
    },

    onSubmit: function(evt) {
      evt.preventDefault();
      var $form = this.$('form'),
          attrs = S.Util.getAttrs($form);

      // Create a model with the attributes from the form
      this.collection.create(attrs);

      // Clear the form
      $form.get(0).reset();
    },

    onReplyClick: function(evt) {
      evt.preventDefault();
      this.$('textarea, input').not('[type="hidden"]').first().focus();
    }

  });

})(Shareabouts, jQuery, Shareabouts.Util.console);
