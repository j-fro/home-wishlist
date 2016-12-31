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
    $(document).on('click', '.complete', completeItem);
    $(document).on('click', '.claim', claimItem);
    $(document).on('click', '.delete', deleteItem);
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
            $('#nameIn').val('');
        },
        error: function(error) {
            console.log("AJAX error:", error);
        }
    });
}

function completeItem() {
    console.log('completing an item', $(this));
    var itemToSend = {
        id: $(this).parent().data('id'),
        changeType: 'complete',
        changeValue: !($(this).data('value'))
    };
    updateItem(itemToSend);
}

function claimItem() {
    console.log('claiming an item', $(this));
    var itemToSend = {
        id: $(this).parent().data('id'),
        changeType: 'claimed',
        changeValue: !($(this).data('value'))
    };
    updateItem(itemToSend);
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

function deleteItem() {
    var itemToSend = {
        id: $(this).parent().data('id')
    };
    $.ajax({
        url: '/deleteItem',
        type: 'DELETE',
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
    $('.view').find('.wishlist').html('');
    itemArray.forEach(function(item) {
        var s = '<li data-id="' + item.id + '">' + item.name +
        buttonBuilder('claim', item.claimed) +
        buttonBuilder('complete', item.complete) + '</li>';
        $('.view').find('.wishlist').append(s);
        if(item.complete) {
            $('.view').find('.wishlist').children().last().addClass('is-complete');
        } else if (item.claimed) {
            $('.view').find('.wishlist').children().last().addClass('is-claimed');
        }
    });
}

function displayAdmin(itemArray) {
    console.log('displaying the admin:', itemArray);
    $('.admin').find('.wishlist').html('');
    itemArray.forEach(function(item) {
        var s = '<li data-id="' + item.id + '">' + item.name +
        buttonBuilder('delete', '') + '</li>';
        $('.admin').find('.wishlist').append(s);
        if(item.complete) {
            $('.admin').find('.wishlist').children().last().addClass('is-complete');
        } else if (item.claimed) {
            $('.admin').find('.wishlist').children().last().addClass('is-claimed');
        }
    });
}

function buttonBuilder(buttonType, buttonValue) {
    return '<button class="' + buttonType + '" data-value="' + buttonValue + '">' + buttonType + '</button>';
}
