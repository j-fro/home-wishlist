$(document).ready(function() {
    // Add event handlers
    getItems();
    enable();
});

function enable() {
    // Set up event handlers
    $('.to-admin').on('click', showAdmin);
    $('.to-wishlist').on('click', showWishlist);
    $('#newItemButton').on('click', addItem);
}

function showAdmin() {
    console.log('showing admin');
    $('.view').hide();
    $('.admin').show();
}

function showWishlist() {
    console.log('showing wishlist');
    $('.admin').hide();
    $('.view').show();
}

// GET from server
function getItems() {
    $.ajax({
        url: '/getItems',
        type: 'GET',
        success: function(response) {
            console.log('wishlist:', response);
            displayView(response);
            displayAdmin(response);
        },
        error: function(error) {
            console.log("AJAX error:", error);
        }
    });
}

// POST to server
function addItem() {
    // Build new object
    var objectToSend = {
        name: $('#nameIn').val()
    };
    // POST object
    $.ajax({
        url: '/addItem',
        type: 'POST',
        data: objectToSend,
        success: function(response) {
            console.log('Response from server:', response);
            getItems();
        },
        error: function(error) {
            console.log("AJAX error:", error);
        }
    });
}

function completeItem() {
    console.log('completing an item', $(this));
}

function claimItem() {
    console.log('claiming an item', $(this));
}

function updateItem(itemToSend) {
    $.ajax({
        url: '/updateItem',
        type: 'PUT',
        data: itemToSend,
        success: function(response) {
            console.log('Response from server:', response);
            getItems();
        },
        error: function(error) {
            console.log("AJAX error:", error);
        }
    });
}

function displayView(itemArray) {
    console.log('displaying the view:', itemArray);
    itemArray.forEach(function(item) {
        var s = '<li data-id="' + item.id + '">' + item.name +
        buttonBuilder('claim') + buttonBuilder('complete') + '</li>';
        $('.view').find('.wishlist').append(s);
    });
}

function displayAdmin(itemArray) {
    console.log('displaying the admin:', itemArray);
    itemArray.forEach(function(item) {
        var s = '<li data-id="' + item.id + '">' + item.name +
        buttonBuilder('delete') + '</li>';
        $('.admin').find('.wishlist').append(s);
    });
}

function buttonBuilder(buttonType) {
    return '<button class="' + buttonType + '">' + buttonType + '</button>';
}
