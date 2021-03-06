var Marionette = require('backbone.marionette');

module.exports = Marionette.ItemView.extend({

    template: require('../templates/filters.jade'),

    ui: {
        placeInput: '.js-place-input',
        fromInput: '.js-from-input',
        toInput: '.js-to-input',
        featureFilter: '.js-feature-filter',
        filtersExpand: '.js-filters-expand',
        secondaryFilters: '.js-secondary-filters'
    },

    events: {
        'change @ui.featureFilter': 'onFeatureFilterChange',
        'click @ui.filtersExpand': 'toggleFeatures',
        'change @ui.fromInput': 'onDateFilterChange',
        'change @ui.toInput': 'onDateFilterChange'
    },

    initialize: function (options) {
        this.vent = options.vent;
        this.collection = options.collection;
        this.listenTo(this.collection, 'change', this.updateFeatureFilters);
    },

    onRender: function () {
        var vent = this.vent;
        $(this.ui.placeInput).geocomplete({
            location: window.exposed.place
        }).bind('geocode:result', function (event, result) {
            vent.trigger('filters:location', result);
        });
        this.fromPicker = new Pikaday({
            field: this.ui.fromInput[0],
            format: 'DD/MM/YYYY'
        });
        this.toPicker = new Pikaday({
            field: this.ui.toInput[0],
            format: 'DD/MM/YYYY'
        });

        this.fromPicker.setMoment(moment(window.exposed.from, 'DD/MM/YYYY'));
        this.fromPicker.setMaxDate(moment(window.exposed.to, 'DD/MM/YYYY').subtract(1, 'days'));
        this.toPicker.setMoment(moment(window.exposed.to, 'DD/MM/YYYY'));
        this.toPicker.setMinDate(moment(window.exposed.from, 'DD/MM/YYYY').add(1, 'days'));
    },

    onFeatureFilterChange: function (event) {
        var features = this.model.get('secondaryFilters');
        features[$(event.target).data('feature')] = event.target.checked;
        this.model.set('secondaryFilters', features);
        this.model.trigger('change');
        this.vent.trigger('filters:features');
    },

    toggleFeatures: function () {
        this.ui.secondaryFilters.slideToggle(400);
    },

    updateFeatureFilters: function () {
        var secondaryFilters = this.collection.models.reduce(function (memo, result) {
            _.each(result.get('features'), function (feature) {
                if (!_.has(memo, feature)) {
                    memo[feature] = false;
                }
            });
            return memo;
        }, {});
        this.model.set('secondaryFilters', secondaryFilters);
        this.render();
    },

    onDateFilterChange: function (event) {
        var from = this.ui.fromInput.val(),
            to = this.ui.toInput.val()
        this.model.set({
            from: from,
            to: to
        });
        this.fromPicker.setMaxDate(moment(to, 'DD/MM/YYYY').subtract(1, 'days'));
        this.toPicker.setMinDate(moment(from, 'DD/MM/YYYY').add(1, 'days'));
        this.vent.trigger('filters:dates');
    }

});
