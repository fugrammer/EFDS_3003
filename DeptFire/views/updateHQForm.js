$("#updateHQ").submit(function(e) {
    var url = "/DeptFire/updateHQ"; // the script where you handle the form input.

    $.ajax({
      type: "POST",
      url: url,
      data: $("#updateHQ").serialize(), // serializes the form's elements.
      success: function(data) {
        UIkit.notification({
          message: "Update sent!",
          status: "primary",
          pos: "top-right",
          timeout: 10000
        });
        //alert(JSON.stringify(data)); // show response from the php script.
        $("#updateHQ")[0].reset();
      },
      statusCode: {
        404: function() {
          alert("Incorrect data entered!");
        }
      }
    });
    e.preventDefault(); // avoid to execute the actual submit of the form.
  });
