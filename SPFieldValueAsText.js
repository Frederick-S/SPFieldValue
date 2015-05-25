(function (SP, window) {
    'use strict';

    var isString = function (obj) {
        return typeof obj === 'string';
    };

    var isNumber = function (obj) {
        return typeof obj === 'number';
    };

    var isBoolean = function (obj) {
        return typeof obj === 'boolean';
    };

    var isArray = function (obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    };

    var isDate = function (obj) {
        return Object.prototype.toString.call(obj) === '[object Date]';
    };

    var isSPFieldLookupValue = function (obj) {
        return obj instanceof SP.FieldLookupValue;
    };

    var isSPFieldUserValue = function (obj) {
        return obj instanceof SP.FieldUserValue;
    };

    var isSPFieldUrlValue = function (obj) {
        return obj instanceof SP.FieldUrlValue;
    };

    var isSPTaxonomyFieldValue = function (obj) {
        return obj._ObjectType_ === 'SP.Taxonomy.TaxonomyFieldValue';
    };

    var isSPTaxonomyFieldValueCollection = function (obj) {
        return obj._ObjectType_ === 'SP.Taxonomy.TaxonomyFieldValueCollection';
    };

    var SPFieldValueAsText = function (listItem) {
        this.listItem = listItem;
    };

    SPFieldValueAsText.prototype.get = function (fieldName) {
        var fieldValue = this.listItem.get_item(fieldName);

        // Field type: choice (display choices using checkboxes), lookup (allow multiple values), Person or group (allow multiple selections)
        if (isArray(fieldValue)) {
            var values = [];

            for (var i = 0, length = fieldValue.length; i < length; i++) {
                values.push(this.getFieldValueAsText(fieldValue[i]));
            }

            return values.join(', ');
        } else {
            return this.getFieldValueAsText(fieldValue);
        }
    };

    SPFieldValueAsText.prototype.getFieldValueAsText = function (fieldValue) {
        if (fieldValue === null) {
            return '';
        }

        // Field type: single line of text, multiple lines of text, choice (display choices using drop-down menu or radio buttons)
        if (isString(fieldValue)) {
            return fieldValue;
        }

        // Field type: number, currency
        if (isNumber(fieldValue)) {
            return fieldValue + '';
        }

        // Field type: date
        if (isDate(fieldValue)) {
            return fieldValue.toString();
        }

        // Field type: yes/no
        if (isBoolean(fieldValue)) {
            return fieldValue ? 'Yes' : 'No';
        }

        // Field type: lookup
        if (isSPFieldLookupValue(fieldValue)) {
            return fieldValue.get_lookupValue();
        }

        // Field type: person or group
        if (isSPFieldUserValue(fieldValue)) {
            return fieldValue.get_lookupValue();
        }

        // Field type: hyperlink or picture
        if (isSPFieldUrlValue(fieldValue)) {
            return fieldValue.get_url();
        }

        // Field type: managed metadata
        if (isSPTaxonomyFieldValue(fieldValue)) {
            return fieldValue.Label;
        }

        // Field type: managed metadata (allow multiple values)
        if (isSPTaxonomyFieldValueCollection(fieldValue)) {
            var values = [];
            var childItems = fieldValue._Child_Items_;

            for (var i = 0, length = childItems.length; i < length; i++) {
                values.push(childItems[i].Label);
            }

            return values.join(', ');
        }
    };

    window.SPFieldValueAsText = SPFieldValueAsText;
})(SP, window);
