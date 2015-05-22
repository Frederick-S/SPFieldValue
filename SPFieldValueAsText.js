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

    var SPFieldValueAsText = function (listItem) {
        this.listItem = listItem;
    };

    SPFieldValueAsText.prototype.get = function (fieldName) {
        var fieldValue = this.listItem.get_item(fieldName);

        // Field type: choice (display choices using checkboxes), lookup (allow multiple values)
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
    };

    window.SPFieldValueAsText = SPFieldValueAsText;
})(SP, window);
