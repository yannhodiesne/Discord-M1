document.body.addEventListener("contextmenu", e => {
    // If the message text is right clicked, the grandparent element will be the message element,
    // and if the message background is clicked, the parent element will be the message element.
    let isMessage = false;
    let isImageWrapper = false;
    let message;
    for (let i = 0; i < 6; i++) {
        message = i == 0 ? e.target : message.parentElement;

        if (elementHasClassPrefix(message, "message")) {
            isMessage = true;
            break;
        } else if (elementHasClassPrefix(message, "modal") && e.target.tagName == "IMG") {
            isImageWrapper = true;
            break;
        }
    }

    // Only show the context menu if the message was clicked,
    // and the clicked thing doesn't have its own context menu.
    if (!isMessage && !isImageWrapper
        || elementHasClassPrefix(e.target, "username")
        || elementHasClassPrefix(e.target, "repliedTextPreview")
        || elementHasClassPrefix(e.target, "avatar")) {
        return;
    }

    const moreButton = isImageWrapper
        ? document.querySelector("[aria-label='More']")
        : message.querySelector("[aria-label='More']");
    moreButton.click();
    const menu = document.getElementById("message-actions").firstChild;
    const focusedClassName = getFocusClassNameUsingMenuItem(menu.firstChild);

    menu.firstChild.addEventListener("mouseover", e => e.target.classList.add(focusedClassName));
    menu.lastChild.addEventListener("mouseover", e => e.target.classList.add(focusedClassName));

    if (e.target.tagName == "A" || e.target.tagName == "IMG" || e.target.tagName == "VIDEO") {
        const items = [];
        if (e.target.tagName == "IMG") {
            menu.appendChild(createSeparator());
            const imageLink = e.target.src.split("?")[0];

            // Copy Image
            if (!imageLink.endsWith(".gif")) {
                const copyImageItem = createMenuItem(menu, "Copy Image")
                items.push(copyImageItem);
                menu.appendChild(copyImageItem);
                copyImageItem.addEventListener("click", () => {
                    copyImage(imageLink)
                    menu.remove();
                });

                // For some reason it keeps being highlighted otherwise.
                copyImageItem.addEventListener("mouseover", () => {
                    copyImageItem.previousSibling.previousSibling.previousSibling.classList.remove(focusedClassName);
                });
            }

            // Save Image (this just opens it in a browser for now,
            // but is here for consistency with regards to the official client)
            const saveImageItem = createMenuItem(menu, "Save Image");
            items.push(saveImageItem);
            menu.appendChild(saveImageItem);
            saveImageItem.addEventListener("click", async () => {
                window.open(imageLink, "_blank");
                menu.remove();
            });

            // For some reason it keeps being highlighted otherwise.
            saveImageItem.addEventListener("mouseover", () => {
                saveImageItem.previousSibling.previousSibling.previousSibling.classList.remove(focusedClassName);
            });

            menu.appendChild(createSeparator());

            // Copy Image Link
            const copyLinkItem = createMenuItem(menu, "Copy Link");
            items.push(copyLinkItem);
            menu.appendChild(copyLinkItem);
            copyLinkItem.addEventListener("click", async () => {
                await navigator.clipboard.writeText(imageLink);
                menu.remove();
            });

            // Open Image Link
            const openLinkItem = createMenuItem(menu, "Open Link");
            items.push(openLinkItem);
            menu.appendChild(openLinkItem);
            openLinkItem.addEventListener("click", async () => {
                window.open(imageLink, "_blank");
                menu.remove();
            });
        } else {
            menu.appendChild(createSeparator());
            const link = e.target.tagName == "A"
                ? e.target.href
                : e.target.src;

            // Copy Link
            const copyLinkItem = createMenuItem(menu, "Copy Link");
            items.push(copyLinkItem);
            menu.appendChild(copyLinkItem);
            copyLinkItem.addEventListener("click", async () => {
                await navigator.clipboard.writeText(link);
                menu.remove();
            });

            // For some reason it keeps being highlighted otherwise.
            copyLinkItem.addEventListener("mouseover", () => {
                copyLinkItem.previousSibling.previousSibling.previousSibling.classList.remove(focusedClassName);
            });

            // Open Link
            const openLinkItem = createMenuItem(menu, "Open Link");
            items.push(openLinkItem);
            menu.appendChild(openLinkItem);
            openLinkItem.addEventListener("click", async () => {
                window.open(link, "_blank");
                menu.remove();
            });
        }

        for (const item of items) {
            item.addEventListener("mouseover", () => item.classList.add(focusedClassName));
            item.addEventListener("mouseleave", () => item.classList.remove(focusedClassName));
            item.addEventListener("focus", () => item.classList.add(focusedClassName));
            item.addEventListener("blur", () => item.classList.remove(focusedClassName));
        }
    }

    if (isImageWrapper) {
        for (const item of Array.from(menu.children)) {
            if (!item.classList.contains("custom")) {
                item.remove();
            }
        }

        if (menu.firstChild.getAttribute("role") == "separator") {
            menu.firstChild.remove();
        }
    } else {
        // Add "add reaction" item to context menu
        const reactButton = message.querySelector("[aria-label='Add Reaction']");
        const reactionItem = createMenuItem(menu, "Add Reaction", reactButton.innerHTML);
        menu.insertBefore(reactionItem, menu.firstChild);

        reactionItem.addEventListener("click", () => {
            reactButton.click()
            menu.remove();
        });
        reactionItem.addEventListener("mouseover", () => {
            reactionItem.classList.add(focusedClassName);
            // For some reason it keeps being highlighted otherwise.
            reactionItem.nextSibling.classList.remove(focusedClassName);
        });
        reactionItem.addEventListener("mouseleave", () => reactionItem.classList.remove(focusedClassName));
        reactionItem.addEventListener("focus", () => reactionItem.classList.add(focusedClassName));
        reactionItem.addEventListener("blur", () => reactionItem.classList.remove(focusedClassName));
    }

    adjustMenuPosition(e, menu.parentElement.parentElement.parentElement);
});

function copyImage(url) {
    // Dump the image in a canvas, // and then convert the canvas to a blob.
    // This way any non-png image will be turned into a png.
    // This is necessary since the Clipboard API only supports png.
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const image = new Image();
    image.setAttribute("crossorigin", "anonymous");
    image.src = url;
    image.addEventListener("load", () => {
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        context.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight);
        canvas.toBlob(async blob => {
            await navigator.clipboard.write([new ClipboardItem({
                "image/png": blob
            })]);
        });
    });
}

function createMenuItem(referenceMenu, title, icon) {
    const item = referenceMenu.firstChild.cloneNode(true);
    item.id = "";
    item.classList.add("custom");
    item.children[0].innerHTML = title;
    if (icon) item.children[1].innerHTML = icon;
    else item.children[1].remove();

    return item;
}

function createSeparator() {
    const separator = document.createElement("div");
    separator.setAttribute("role", "separator");
    separator.classList.add("custom");
    separator.style.boxSizing = "border-box";
    separator.style.margin = "4px";
    separator.style.borderBottom = "1px solid var(--background-modifier-accent)";

    return separator;
}

function elementHasClassPrefix(element, classPrefix) {
    return Array.from(element.classList).some(x => x.startsWith(classPrefix + "-"));
}

function getFocusClassNameUsingMenuItem(menuItem) {
    // Focus the reference item so that it gets the "focused-???" class,
    // then find this class (we only know it starts with focused-),
    // and get the full name. Then use it with the self-made events.
    menuItem.focus();
    const focusedClassName = Array.from(menuItem.classList).find(x => x.startsWith("focused-"));
    menuItem.classList.remove(focusedClassName);
    menuItem.blur();

    return focusedClassName;
}

function adjustMenuPosition(e, menu) {
    const margin = 20;
    const overflowX = e.clientX + menu.offsetWidth - document.documentElement.clientWidth;
    const overflowY = e.clientY + menu.offsetHeight - document.documentElement.clientHeight;
    menu.style.position = "fixed";
    menu.style.top = overflowY <= 0
        ? e.clientY + "px"
        : (e.clientY - overflowY - margin) + "px";
    menu.style.left = overflowX <= 0
        ? e.clientX + "px"
        : (e.clientX - menu.offsetWidth) + "px";
    menu.style.right = "";
}