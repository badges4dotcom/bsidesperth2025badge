async function configureWiFi() {
        displayMessageScreen(
            "Person",
            "Benny",
            "This feature is unavailable on the virtual badge.",
            true,
            true,
            true);

        await blockForKeyPress();
}