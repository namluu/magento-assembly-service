define([
    'uiComponent',
    'ko'
], function (
    Component,
    ko
) {
    'use strict';

    return Component.extend({
        defaults: {
            template: 'Lounge_AssemblyService/assembly',
        },

        isDisplayed: ko.observable(true),

        initObservable: function () {
            var self = this._super();
            return this;
        },

        /**
         * @inheritdoc
         */
        initialize: function () {
            var self = this;
            this._super();
        }
    });
});
