$(".join").on("click", function () {
    if ($("#usernameinput").val() === "admin" && $("#passwordinput").val() === "1234") {
        console.log("salam")
        $(".alertdang").attr("id", "danger")
        $(".alertsuc").attr("id", "")
        window.location.replace(".//adminpanel.html")
        
    } else {
        console.log("sagol")
        $(".alertdang").attr("id", "")
        
    }
})