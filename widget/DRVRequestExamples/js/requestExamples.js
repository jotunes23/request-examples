define(
  //-------------------------------------------------------------------
  // DEPENDENCIES
  //-------------------------------------------------------------------
  ['jquery', 'knockout', 'CCi18n', 'ccConstants', 'notifier', 'ccRestClient'],

  //-------------------------------------------------------------------
  // MODULE DEFINITION
  //-------------------------------------------------------------------
  function ($, ko, CCi18n, ccConstants, notifier, ccRestClient) {
    'use strict';

    return {
      showLists: ko.observable(false),
      organizationList: ko.observableArray([]),
      productList: ko.observableArray([]),

      onLoad: function (widget) {
        var self = this;

        widget.getOrganizations();
        widget.getProducts('revenda-amostras-004');
        widget.getFilteredProducts();
      },

      beforeAppear: function (page) {
        var widget = this;
      },

      getOrganizations: function () {
        // ENDPOINT_B2B_ADMINISTRATION_LIST_ORGANIZATIONS = 'listOrganizations'
        var widget = this;
        var params = {};

        params[ccConstants.OFFSET] = 0;
        params[ccConstants.LIMIT] = 5;

        ccRestClient.request(
          ccConstants.ENDPOINT_B2B_ADMINISTRATION_LIST_ORGANIZATIONS,
          params,
          function (data) {
            if (data && data.items) {
              console.log('listOrganizations data\n', data);
              widget.organizationList(data.items);
            }
          },
          function (error) {
            widget.organizationList('');
            notifier.sendError('header', error.message, true);
          }
        );
      },

      getProducts: function (catalogId) {
        // CCConstants.ENDPOINT_PRODUCTS_LIST_PRODUCTS = 'listProducts';
        var params = {};

        params[ccConstants.OFFSET] = 0;
        params[ccConstants.LIMIT] = 5;
        params[ccConstants.CATEGORY] = catalogId;
        params[ccConstants.FIELDS_QUERY_PARAM] = 'items.id,items.displayName,items.listPrice,item.creationDate,item.route';
        params[ccConstants.SORTS] = 'listPrice,displayName';

        ccRestClient.request(
          ccConstants.ENDPOINT_PRODUCTS_LIST_PRODUCTS,
          params,
          function (data) {
            if (data && data.items) {
              console.log('getProducts data\n', data);
            }
          },
          function (error) {
            notifier.sendError('header', error.message, true);
          }
        );
      },

      getFilteredProducts: function () {
        // CCConstants.ENDPOINT_PRODUCTS_LIST_PRODUCTS = 'listProducts';

        var widget = this;
        var params = {};

        params[ccConstants.OFFSET] = 0;
        params[ccConstants.LIMIT] = 4;
        params[ccConstants.FIELDS_QUERY_PARAM] = 'items.id,items.displayName,items.listPrice,items.primarySourceImageURL,items.primaryImageAltText';
        params[ccConstants.Q] = 'displayName sw "ARQ"';

        ccRestClient.request(
          ccConstants.ENDPOINT_PRODUCTS_LIST_PRODUCTS,
          params,
          function (data) {
            if (data && data.items) {
              console.log('getFilteredProducts data\n', data);
              widget.productList(data.items);
            }
          },
          function (error) {
            notifier.sendError('header', error.message, true);
          }
        );
      },

      handleShowLists: function (event, element) {
        var widget = this;

        console.log('this\n', this);
        console.log('event\n', event);
        console.log('element\n', element);

        widget.showLists(true);

        $(element).hide();
      }
    }
  }
)
