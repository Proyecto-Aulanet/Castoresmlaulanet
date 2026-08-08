function togglePassword(inputId, iconId) {

    const password =
        document.getElementById(inputId);

    const icon =
        document.getElementById(iconId);

    if (password.type === "password") {

        password.type = "text";

        icon.classList.remove("bi-eye-fill");
        icon.classList.add("bi-eye-slash-fill");

    } else {

        password.type = "password";

        icon.classList.remove("bi-eye-slash-fill");
        icon.classList.add("bi-eye-fill");

    }
}