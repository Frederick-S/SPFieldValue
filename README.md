# SPFieldValueAsText
Get SharePoint list item field value as text.

# Usage
```js
var clientContext = SP.ClientContext.get_current();
var web = clientContext.get_web();
var list = web.get_lists().getByTitle('List Title');
var listItem = list.getItemById(1);

clientContext.load(listItem);
clientContext.executeQueryAsync(function (sender, args) {
    // Init the object with listItem
    var fieldValueAsText = new SPFieldValueAsText(listItem);
    
    // Get field value as text by field name
    var fieldValue = fieldValueAsText.get('Field Name');
}, function (sender, args) {
    var message = args.get_message();
});
```

# License
MIT.
