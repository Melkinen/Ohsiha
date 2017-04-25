// this is the id of the submit button
function sendRegisteration(){

      var url = "/api/register"; // the script where you handle the form input.

      $.ajax({
             type: "POST",
             url: url,
             data: $("#registerationForm").serialize(), // serializes the form's elements.
             success: function(data)
             {
                if (data.success == true){
                  window.location.href = "/login"
                }
                 alert(JSON.stringify(data)); // show response from the php script.
             }
           });

      return false; // avoid to execute the actual submit of the form.
  };
