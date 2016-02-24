$(document).ready(function() {
    $('#myModal').modal('show');

    // on modal close, focus on reddit search box
    $('#myModal').on('hidden.bs.modal', function () {
        $('#search-reddit').focus();
    });
});
