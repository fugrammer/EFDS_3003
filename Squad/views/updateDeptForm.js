$("#updateDept").submit(function(e) {
 var url = "/Squad/updateDept"; // the script where you handle the form input.

    $.ajax({
      type: "POST",
      url: url,
      data: $("#updateDept").serialize(), // serializes the form's elements.
      success: function(data) {
        UIkit.notification({
          message: "Update sent!",
          status: "primary",
          pos: "top-right",
          timeout: 10000
        });
        //alert(JSON.stringify(data)); // show response from the php script.
        $("#updateDept")[0].reset();
      },
      statusCode: {
        404: function() {
          alert("Incorrect data entered!");
        }
      }
    });
    e.preventDefault(); // avoid to execute the actual submit of the form.
  });
