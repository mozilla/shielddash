function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    var id_token = googleUser.getAuthResponse().id_token;
    var targetNode = document.getElementById("api-data");
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail());
    window.fetch(
        "/studies/?start=20160101&end=20160201",
        {method: "GET",
         headers: {'Authorization': 'JWT ' + id_token}}
    ).then(
        res => res.text()).then(
        txt => targetNode.innerHTML = "hello " + txt);
}
