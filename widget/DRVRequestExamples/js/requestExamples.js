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
      listOrganizations: ko.observable(),

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
              widget.listOrganizations(data.items);
            }
          },
          function (error) {
            widget.listOrganizations('');
            notifier.sendError('header', error.message, true);
          }
        );
      },

      getProducts: function (catalogId) {
        // CCConstants.ENDPOINT_PRODUCTS_LIST_PRODUCTS = 'listProducts';

        var widget = this;
        var params = {};

        params[ccConstants.OFFSET] = 0;
        params[ccConstants.LIMIT] = 5;
        params[ccConstants.CATEGORY] = catalogId;
        params[ccConstants.FIELDS_QUERY_PARAM] = 'items.id,items.displayName,items.listPrice';
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
        var params = {};

        params[ccConstants.OFFSET] = 0;
        params[ccConstants.FIELDS_QUERY_PARAM] = 'items.id,items.displayName,items.listPrice,items.route';
        params[ccConstants.Q] = 'displayName sw "ARQ"';

        ccRestClient.request(
          ccConstants.ENDPOINT_PRODUCTS_LIST_PRODUCTS,
          params,
          function (data) {
            if (data && data.items) {
              console.log('getFilteredProducts data\n', data);
            }
          },
          function (error) {
            notifier.sendError('header', error.message, true);
          }
        );
      }
    }
  }
)
