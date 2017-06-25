function restoreOptions() {
    browser.storage.local.get([
        "mode",
        "blacklist",
        "whitelist",
        "notificationPopupEnabled",
        "notificationDuration",
        "lastSkipped",
    ]).then(
        result => {
            document.querySelector("#blacklist").value = result.blacklist.join("\n");
            document.querySelector("#whitelist").value = result.whitelist.join("\n");
            document.querySelector("#mode" + result.mode.charAt(0).toUpperCase() + result.mode.slice(1)).checked = "checked";
            document.querySelector("#notificationPopupEnabled").checked = result.notificationPopupEnabled;
            document.querySelector("#notificationDuration").value = result.notificationDuration;

            let mrs = document.querySelector("#mrs");
            if (result.lastSkipped) {
                mrs.classList.remove("hidden");
                mrs.querySelector("#mrsUrl").textContent = result.lastSkipped.url;
            } else {
                mrs.classList.add("hidden");
            }
        }
    );
}

function enableAutosave() {
    for (let input of document.querySelectorAll("input, textarea")) {
        input.addEventListener("input", saveOptions);
    }
}

function loadTranslations() {
    document.querySelectorAll("[data-i18n]").forEach(
        el => {
            el.innerHTML = browser.i18n.getMessage(el.getAttribute("data-i18n"));
        }
    );
}

function saveOptions(event) {
    event.preventDefault();
    browser.storage.local.set({
        blacklist: document.querySelector("#blacklist").value.split("\n"),
        whitelist: document.querySelector("#whitelist").value.split("\n"),
        mode: document.querySelector("#modeOff").checked && "off"
              ||
              document.querySelector("#modeBlacklist").checked && "blacklist"
              ||
              document.querySelector("#modeWhitelist").checked && "whitelist",
        notificationPopupEnabled: document.querySelector("#notificationPopupEnabled").checked,
        notificationDuration: document.querySelector("#notificationDuration").value,
    });
}

function blacklistAddRecent() {
    browser.storage.local.get([
        "blacklist",
        "lastSkipped",
    ]).then(
        result => {
            const regex = result.lastSkipped.prefix.replace(/[.?*+^$[\]\\(){}|-]/g, "\\$0");
            result.blacklist.push(regex);
            browser.storage.local.set({
                blacklist: result.blacklist,
            })
        }
    )
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.addEventListener("DOMContentLoaded", enableAutosave);
document.addEventListener("DOMContentLoaded", loadTranslations);
document.querySelector("form").addEventListener("submit", saveOptions);
document.querySelector("#blacklistAddRecent").addEventListener("click", blacklistAddRecent);

browser.storage.onChanged.addListener(restoreOptions);
