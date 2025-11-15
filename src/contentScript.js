// Guard against multiple injections
if (!window.__passgenContentScriptLoaded) {
  window.__passgenContentScriptLoaded = true;

  // Track last input field that received contextmenu
  let lastTargetField = null;

  // Helper to detect if an element has a specific event handler
  function hasEventHandler(element, eventName) {
    return (
      element["on" + eventName] ||
      element.getAttribute("on" + eventName) ||
      element.hasAttribute("v-on:" + eventName) ||
      element.hasAttribute("@" + eventName)
    );
  }

  // Helper to check and trigger event if handler exists
  function triggerIfHandlerExists(
    element,
    eventName,
    eventConstructor,
    options
  ) {
    if (hasEventHandler(element, eventName)) {
      element.dispatchEvent(new eventConstructor(eventName, options));
      return true;
    }
    return false;
  }

  // Fill password into target field with proper event triggering
  function fillPasswordField(field, password) {
    // Set focus first
    field.focus();

    // Use native setter to bypass framework tracking
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      "value"
    ).set;
    const nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLTextAreaElement.prototype,
      "value"
    ).set;

    if (field instanceof HTMLInputElement) {
      nativeInputValueSetter.call(field, password);
    } else if (field instanceof HTMLTextAreaElement) {
      nativeTextAreaValueSetter.call(field, password);
    }

    // Trigger events
    triggerFieldEvents(field);
  }

  // Trigger appropriate events based on detected handlers
  function triggerFieldEvents(field) {
    const keyboardOpts = {
      bubbles: true,
      cancelable: true,
      key: "Unidentified",
    };
    const eventOpts = { bubbles: true, cancelable: true };

    const hasKeydownHandler = triggerIfHandlerExists(
      field,
      "keydown",
      KeyboardEvent,
      keyboardOpts
    );
    const hasKeypressHandler = triggerIfHandlerExists(
      field,
      "keypress",
      KeyboardEvent,
      keyboardOpts
    );
    const hasKeyupHandler = triggerIfHandlerExists(
      field,
      "keyup",
      KeyboardEvent,
      keyboardOpts
    );
    const hasChangeHandler = triggerIfHandlerExists(
      field,
      "change",
      Event,
      eventOpts
    );
    const hasBlurHandler = triggerIfHandlerExists(field, "blur", Event, {
      bubbles: true,
    });

    const hasInputHandler = triggerIfHandlerExists(
      field,
      "input",
      Event,
      eventOpts
    );
    if (hasInputHandler) {
      // Also dispatch InputEvent for better framework compatibility
      field.dispatchEvent(new InputEvent("input", eventOpts));
    }

    // Fallback: if no handlers detected, trigger common ones anyway (for framework listeners)
    if (!hasInputHandler && !hasChangeHandler && !hasKeyupHandler) {
      field.dispatchEvent(new Event("input", eventOpts));
      field.dispatchEvent(new Event("change", eventOpts));
    }
  }

  document.addEventListener("contextmenu", (e) => {
    const target = e.target;
    if (
      (target instanceof HTMLInputElement &&
        (target.type === "password" || target.type === "text")) ||
      target instanceof HTMLTextAreaElement
    ) {
      lastTargetField = target;
    } else {
      lastTargetField = null;
    }
  });

  chrome.runtime.onMessage.addListener((msg) => {
    if (
      msg &&
      msg.action === "fillPassword" &&
      typeof msg.password === "string"
    ) {
      if (lastTargetField) {
        fillPasswordField(lastTargetField, msg.password);
        lastTargetField = null;
      }
    }
  });
}
