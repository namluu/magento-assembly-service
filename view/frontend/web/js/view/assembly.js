define([
    'uiComponent',
    'ko',
    'Magento_Customer/js/customer-data',
], function (
    Component,
    ko,
    customerData
) {
    'use strict';

    function Item(id, qty, name, image, selected = false) {
        this.id       = ko.observable(id);
        this.qty      = ko.observable(qty);
        this.name     = ko.observable(name);
        this.image    = ko.observable(image);
        this.selected = ko.observable(selected);
    }

    return Component.extend({
        defaults: {
            template: 'Lounge_AssemblyService/assembly',
        },

        isDisplayed: ko.observable(true),
        productList: ko.observableArray([]),

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
            this.renderProducts();
        },

        renderProducts: function () {
            var products = customerData.get('cart')().items,
                self = this;

            if (products.length > 0) {
                products.forEach(function(product) {
                    if (product.product_type != 'virtual') {
                        self.productList.push(
                            new Item(
                                product.product_id,
                                product.qty,
                                product.product_name,
                                product.product_image
                            )
                        );
                    }
                });
            }
        }
    });
});
