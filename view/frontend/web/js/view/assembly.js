define([
    'uiComponent',
    'ko',
    'Magento_Customer/js/customer-data',
    'Magento_Catalog/js/price-utils',
    'Magento_Checkout/js/model/quote',
    'Magento_Checkout/js/model/full-screen-loader'
], function (
    Component,
    ko,
    customerData,
    priceUtils,
    quote,
    fullScreenLoader
) {
    'use strict';

    var pricePerProduct = 30;
    var maxPriceDelivery = 90;

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
        productSaved: ko.observableArray([]),
        totalPrice: ko.observable(0),
        statusAction: ko.observable('before_select'),

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
            this.totalPrice = ko.computed(self.computedTotalPrice , this);
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
        },

        productSelected: function() {
            return this.productList().filter(function (prod) {
                return prod.selected();
            });
        },

        computedTotalPrice: function () {
            var total = 0,
                dataList = [],
                self = this;

            if (self.statusAction() == 'selected') {
                dataList = self.productSelected();
            } else if (self.statusAction() == 'saved') {
                dataList = self.productSaved();
            }

            dataList.forEach(function(item) {
                total += item.qty() * pricePerProduct;
                if (total > maxPriceDelivery) {
                    total = maxPriceDelivery;
                }
            });

            return self.getFormattedPrice(total);
        },

        getFormattedPrice: function (price) {
            return priceUtils.formatPrice(price, quote.getPriceFormat());
        },

        triggerAction: function (action, data, event) {
            var self = this;
            fullScreenLoader.startLoader();

            switch (action) {
                case 'save':
                    self.saveAction();
                    break;
                case 'cancel':
                    self.cancelAction();
                    break;
                default:
                    self.selectAction();
                    break;
            }
            fullScreenLoader.stopLoader();
        },

        selectAction: function () {
            var self = this;
            self.statusAction('selected');
            self.productList().map((item) => {
                if (item.selected()) item.selected(false);
            });
        },

        saveAction: function () {
            var self = this;
            self.statusAction('saved');
        },

        cancelAction: function () {
            var self = this;
            if (self.productSaved().length) {
                self.statusAction('saved');
            } else {
                self.statusAction('before_select');
            }
        }
    });
});
